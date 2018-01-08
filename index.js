const serve = require('koa-static');
const Koa = require('koa');
const dealFile = require('./api/index.js');
const app = new Koa();

// $ GET /package.json
app.use(dealFile)
app.use(serve('./'));
app.listen(4000);
console.log('listening on port 4001');
// api.listen(4001)
// console.log('listening on port 4000');