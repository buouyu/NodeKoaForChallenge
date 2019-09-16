const Koa = require("koa");
const Router = require("koa-router");
import Users from './users';
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();


router.post('/users', Users.postUsers);

router.get('/*', async (ctx) => {
    ctx.body = "Hi Word";
});

app.use(bodyParser());
app.use(router.routes());

app.listen(3000);

console.log("Server running on port 3000");