const { Sequelize } = require('sequelize')
const { dbName, host, port, user, password } = require('../config').dataBase

const sequelize = new Sequelize(dbName, user, password, {
  dialect: 'mysql',
  host,
  port,
  logging: false,
  timezone: '+08:00',
  define: {
    timestamps: true, // 自动添加时间
    paranoid: true, // 启用软删除
    underscored: false, // 取消下划线名称
    freezeTableName: true // 不修改表名
  }
})

sequelize.sync({ force: false })

module.exports = { sequelize }
