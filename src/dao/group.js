const GroupModels = require('../models/group')

class GroupDao extends GroupModels{
  static  async add(group) {
    await this.create(group)
  }
}

module.exports = GroupDao