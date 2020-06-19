const Router = require('koa-router')
const router = new Router({
  prefix: '/api/group'
})

router.post('/', async ctx =>{
    ctx.body = {
        ok: true,
        code: 0
    }
})

module.exports = router