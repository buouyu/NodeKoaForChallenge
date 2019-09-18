const Koa = require("koa");
const Router = require("koa-router");
import Users from './users';
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();


router.get('/ready', async (ctx) => {
    ctx.body = {
        "data": "ok"
    };
})
router.post('/initialize', async (ctx) => {
    ctx.body = "ok";
})
router.post('/users', Users.postUsers);
router.post('/users/:userId/relations', Users.postRelations);
router.post('/users/:userId/moments', Users.postMoments);
router.delete('/users/:userId/relations/:friendId', Users.deleteRelations);
router.delete('/users/:userId/moments/:momentId', Users.deleteMoments);
router.get('/users/:userId', Users.getUsers);
router.get('/users/:userId/streams', Users.getStreams);

router.get('/*', async (ctx) => {
    ctx.body = "Hi Word";
});

app.use(bodyParser());
app.use(router.routes());

app.listen(3000);

console.log("Server running on port 3000");