const Koa = require('koa');
const routes = require('./routes');
const errorHandler = require('./errorHandler');

const app = new Koa();

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

app.use(errorHandler);
app.use(routes);

module.exports = app;
