const { Sequelize, Model } = require('sequelize')

class File extends Model {
  static async saveFileRecord (fileInfo) {
    const saveResult = await File.create(fileInfo)
    return saveResult
  };
};

File.init({
  name: Sequelize.STRING,
  ext: Sequelize.STRING,
  path: Sequelize.STRING,
  size: Sequelize.BIGINT,
  md5: Sequelize.STRING
}, {
  sequelize: global.sequelize,
  tableName: 'file',
  timesTamps: false
})

module.exports = File