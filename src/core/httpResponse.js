// Http 返回信息类
/*
* statusCode   http状态码
* errCode  错误代码
* errMsg 错误信息
*/
// 响应基类
class HttpResponse extends Error {
  constructor(ex) {
    super()
    this.statusCode = 500
    this.errMsg = '服务器未知错误'
    this.errCode = 999

    _checkArgs(this, ex)
  }
}

class Fail extends HttpResponse {
  constructor(ex) {
    super()
    this.statusCode = 400
    this.errMsg = '失败'
    this.errCode = 9999

    _checkArgs(this, ex)
  }
}

// 请求参数错误
class Params extends HttpResponse {
  constructor(ex) {
    super()
    this.statusCode = 400
    this.errMsg = '请求参数错误啦'
    this.errCode = 10200

    _checkArgs(this, ex)
  }
}

// 资源不存在
class NotFound extends HttpResponse {
  constructor(ex) {
    super()
    this.statusCode = 404
    this.errMsg = '请求资源不存在'
    this.errCode = 10100

    _checkArgs(this, ex)
  }
}

// 认证失败
class AuthFail extends HttpResponse {
  constructor(ex) {
    super()
    this.statusCode = 401
    this.errMsg = '认证失败啦'
    this.errCode = 10000

    _checkArgs(this, ex)
  }
}

// Token失效或无效
class InvalidToken extends HttpResponse {
  constructor(ex) {
    super()
    this.statusCode = 401
    this.errMsg = 'token失效或无效'
    this.errCode = 10300

    _checkArgs(this, ex)
  }
}

// 方法不允许
class Forbidden extends HttpResponse {
  constructor(ex) {
    super()
    this.statusCode = 405
    this.errMsg = '请求方法不允许'
    this.errCode = 10500

    _checkArgs(this, ex)
  }
}
// 文件操作中错误(不符合文件配置要求或自定义传入的配置中的错误: 包含大小、数量、扩展名、损坏以及存储错误)
class FileAction extends HttpResponse {
  constructor(ex) {
    super()
    this.statusCode = 413
    this.errMsg = '文件体积过大'
    this.errCode = 10600 // 默认单个文件的体积   总体积: 10601

    _checkArgs(this, ex)
  }
}

class Limit extends HttpResponse {
  constructor(ex) {
    super()
    this.statusCode = 401
    this.errMsg = '请求太频繁了噢，请稍后重试'
    this.errCode = 10700

    _checkArgs(this, ex)
  }
}

function _checkArgs (that, ex) {
  if (ex && ex.code) {
    that.statusCode = ex.code
  }

  if (ex && ex.errMsg) {
    that.errMsg = ex.errMsg
  }

  if (ex && ex.errCode) {
    that.errCode = ex.errCode
  }
}

module.exports = {
  HttpResponse,
  Fail,
  Params,
  NotFound,
  AuthFail,
  InvalidToken,
  Forbidden,
  FileAction,
  Limit
}