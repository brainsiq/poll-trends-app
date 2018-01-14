module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.isJoi) {
      ctx.status = 400;
      ctx.body = { message: err.details[0].message };
    } else {
      ctx.status = 500;
      ctx.body = err.message;
    }

    ctx.app.emit('error', err, ctx);
  }
};
