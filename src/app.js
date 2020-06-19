const Koa = require('koa')
const app = new Koa()
require('module-alias/register')
const consola = require('consola')
const { port } = require('@config').app

const InitManager = require('@core/initApp')

InitManager.init(app)

app.listen(port, () => {
  consola.ready(`Server Running! Port at ${port}`)
})
