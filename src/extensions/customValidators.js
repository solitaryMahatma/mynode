// 自定义校验器
// 验证通过则返回原始参数 验证失败则返回false
// 异步操作的校验，返回promise   resolve reject
const customValidators = {
  isString (param) {
    return Object.prototype.toString.call(param) === '[object String]' ? param : false
  }
}

module.exports = customValidators