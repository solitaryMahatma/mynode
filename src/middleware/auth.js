const jwt = require('jsonwebtoken')

const auth = async (ctx, next) => {
  const token = ctx.get('token')
  if (!token) {
    throw global.Ex.Params({
      errMsg: 'token不能为空'
    })
  }

  const { salt } = global.config.token
  jwt.verify(token, salt, (err, res) => {
    if (err) {
      throw new global.Ex.AuthFail({
        errMsg: '无效的token'
      })
    }
    ctx.user = res
  })

  await next()
}

module.exports = auth