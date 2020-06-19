// 中间件异常处理
/*
 * return code errMsg     code.md
 */
const { KoaValidatorException } = require('koa-better-validator')
const errLogger = require('../core/logs').errLogger

const catchException = async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    process.env.NODE_ENV === 'dev' && console.log(e)
    errLogger.error(e)
    ctx.status = e.statusCode || 400

    if (e instanceof KoaValidatorException) {
      ctx.body = {
        errCode: 401,
        errMsg: e.errMsg || 'This is koa-better-validator catch errors'
      }
      return
    }

    ctx.body = {
      errCode: e.errCode || 999,
      errMsg: e.errMsg || '服务器挂啦'
    }
  }
}

module.exports = catchException
