const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

//子进程监听消息处理函数
var workerListener = function (msg) {
    if (msg.access)
        console.log('user access %s, worker [%d]',
            msg.access, msg.workerid);
};
//fork新的子进程函数
var forkWorker = function (listener) {
    var worker = cluster.fork();
    console.log('worker [%d] created',
        worker.process.pid);
    worker.on('message', listener);
    return worker;
};

if (cluster.isMaster) {
    console.log(`Master  ${process.pid} is running`);

    // 衍生工作进程。
    for (let i = 0; i < numCPUs; i++) {
        forkWorker(workerListener);
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        forkWorker(workerListener);
    });
} else {
    require("./index.js");

    console.log(`worker ${process.pid} started`);
}
