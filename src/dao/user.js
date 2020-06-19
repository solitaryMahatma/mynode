const bcrypt = require('bcryptjs')
const { UserModel } = require('../models/user')
const {sign} = require('../token/index')

class UserDao extends UserModel {
  static async signUp (userInfo) {
    const user = await this.findOne({ where: { phoneNumber: userInfo.phoneNumber } })
    if (user) {
      throw new global.Ex.AuthFail({
        errMsg: '手机号已存在',
        errCode: 20100
      })
    }
    await this.create(userInfo)
  }

  static async signIn (accoutPwd) {
    const user = await this.findOne({ where: { phoneNumber: accoutPwd.phoneNumber } })
    if (!user) {
      throw new global.Ex.AuthFail({
        errMsg: '手机号不存在啊',
        errCode: 20000
      })
    };
    const corrPwd = bcrypt.compareSync(accoutPwd.password, user.password)
    if (!corrPwd) {
      throw new global.Ex.AuthFail({
        errMsg: '密码不正确',
        errCode: 202000
      })
    }
    
    const {id, nickName,phoneNumber, email,avatar,name} = user
    return sign({id, nickName,phoneNumber, email,avatar,name})
  }

}

module.exports = UserDao