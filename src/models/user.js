const bcrypt = require('bcryptjs')
const { Sequelize, Model } = require('sequelize')

class UserModel extends Model {};

UserModel.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nickName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  },
  test: Sequelize.STRING,
  name: Sequelize.STRING,
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    set (val) { // setter getter    https://demopark.github.io/sequelize-docs-Zh-CN/core-concepts/getters-setters-virtuals.html
      const salt = bcrypt.genSaltSync(10)
      const password = bcrypt.hashSync(val, salt)
      this.setDataValue('password', password)
    }
    
  }
}, {
  sequelize: global.sequelize,
  paranoid: true,
  tableName: 'user'
})

UserModel.sync({ alter: true })

module.exports = {
  UserModel
}
