const log4js = require('log4js')
const { baseLogPath, detail } = require('../config').logs
const errPath = `${baseLogPath}/error/error.log`

log4js.configure({
  appenders: {
    out: { type: 'stderr' },
    error: {
      type: 'dateFile',
      filename: errPath,
      alwaysIncludePattern: true,
      keepFileExt: true,
      daysToKeep: 30
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    error: { appenders: ['error'], level: 'error' }
  }
})

const handle = log4js.getLogger('out')
const errLogger = log4js.getLogger('error')

const formatText = {
  handle: function (ctx) {
    const req = ctx.request
    const res = req.response
    const body = ctx.body
    let logText = ''
    logText += '\n' + 'url: ' + req.url + '\n'
    logText += 'method: ' + req.method + '\n'
    logText += 'response status: ' + res.status + '\n'
    if (detail) {
      // TODO
      // 后续添加获取请求

      logText += 'response body: ' + body + '\n'
    }
    return logText
  }
}

const handleLogger = async (ctx, next) => {
  await next()
  handle.info((formatText.handle(ctx)))
}

exports = module.exports = { handleLogger, errLogger }