const Koa = require('koa');
const app = new Koa();
var _ = require('koa-route');

var db = {
    tobi: { name: 'tobi', species: 'ferret' },
    loki: { name: 'loki', species: 'ferret' },
    jane: { name: 'jane', species: 'ferret' }
};

var pets = {
    list: async (ctx) => {
        var names = Object.keys(db);
        ctx.body = 'pets: ' + names.join(', ');
    },

    show: async (ctx, name) => {
        var pet = db[name];
        if (!pet) return ctx.throw('cannot find that pet', 404);
        ctx.body = pet.name + ' is a ' + pet.species;
    }
};

app.use(_.get('/ready', async ctx => {
    ctx.body = "Ok";
}));
app.use(_.get('/pets', pets.list));
app.use(_.get('/pets/:name', pets.show))

app.use(async ctx => {
    ctx.body = 'Hello World';
});


app.listen(3000);
console.log('listening on port 3000');