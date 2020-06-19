
const { Sequelize, Model } = require('sequelize')

class Group extends Model {}

Group.init(
{
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  describe: {
    type: Sequelize.STRING(50),
    allowNull: true
  },
}, 
{
  sequelize: global.sequelize,
  paranoid: true,
  tableName: 'group',
}
)


module.exports = Group