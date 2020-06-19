const Router = require('koa-router')
const router = new Router({
  prefix: '/api/user'
})

const UserDao= require('../../dao/user')

router.post('/signup', async ctx => {
  ctx.verify('nickName', '昵称是长度必须在6-10之间的字符串').isLength({ min: 6, max: 10 })
  ctx.verify('phoneNumber', 'phoneNumber不合法').isMobilePhone(['zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'])
  ctx.verify('email', '邮箱格式不对啊').optional().isEmail()
  ctx.verify('password', '只支持长度为6-18的数字、字母、下划线组合').matches(/^(\w){6,18}$/)
  const { nickName, phoneNumber, email, password } = await ctx.valid()

  await UserDao.signUp({ nickName, phoneNumber, email, password })

  ctx.success({ errMsg: '注册成功!' })
})

router.post('/signin', async ctx => {
  ctx.verify('phoneNumber', 'phoneNumber不合法').isMobilePhone(['zh-CN', 'zh-HK', 'zh-MO', 'zh-TW'])
  ctx.verify('password', '只支持长度为6-18的数字、字母、下划线组合').matches(/^(\w){6,18}$/)
  const { phoneNumber, password } = await ctx.valid()
  const token = await UserDao.signIn({ phoneNumber, password })
  console.log(token);
  ctx.json({
    errMsg: '登录成功!',
    token
  })
})

router.get('/userinfo', global.auth, async ctx =>{
  console.log(ctx.user, '0000');
  
  ctx.body = {
    ok: true,
    code: 0
  }
})


module.exports = router
