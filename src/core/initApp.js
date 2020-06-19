const Router = require('koa-router')
const helmet = require('koa-helmet')
const cors = require('koa2-cors')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const requireDirectory = require('require-directory')
const { koaValidator } = require('koa-better-validator')

const catchException = require('@middleware/exception')
const { success, json } = require('@extensions/http')
const { multer } = require('@extensions/multer')
const auth = require('@middleware/auth')
const { sequelize } = require('./db')
const customValidators = require('@extensions/customValidators')
const handleLogger = require('./logs').handleLogger

class InitManager {
  static init (app) {
    InitManager.app = app
    InitManager.initConfig(app)
    InitManager.initMiddleWare()
    InitManager.initExtend()
    InitManager.initRouter()
  }

  // 往global挂载应用全局属性
  static initConfig (app) {
    global.app = app
    global.config = require(`${process.cwd()}/src/config`)
    global.Ex = require('../core/httpResponse')
    global.auth = auth
    global.sequelize = sequelize
  }

  // 往koa上下文ctx挂载公用方法
  static initExtend () {
    const { app } = InitManager
    success(app)
    json(app)
    app.context.multer = multer
  }

  static initMiddleWare () {
    const { app } = InitManager
    app.use(cors())
      .use(handleLogger)
      .use(catchException)
      .use(helmet())
      .use(koaStatic(`${process.cwd()}/static`))
      .use(
        koaBody({
          multipart: false
        })
      )
      .use(
        koaValidator({
          customValidators: {
            ...customValidators
          }
        })
      )
  }

  static initRouter () {
    const apiDir = `${process.cwd()}/src/api`
    requireDirectory(module, apiDir, {
      visit: whenLoadModule
    })
    function whenLoadModule (obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes())
      }
    }
  }
}

module.exports = InitManager
