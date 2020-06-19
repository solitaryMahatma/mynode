// 权限系统
const { User, Group, Auth } = require('../models/admin')

class AdminDao {
  static async getAuthModules () {
    const auths = await Auth.getAuthModules()
    return this._formatAuths(auths)
  }

  static _formatAuths (auths) {
    const res = []
    auths.map(i => {
      if (res.length) {
        let hasModule = false
        res.map(j => {
          if (j.module === i.module) {
            hasModule = true
            j.auth.push(i.auth)
          }
        })
        if (!hasModule) {
          res.push({
            module: i.module,
            auth: [i.auth]
          })
        }
      } else {
        res.push({
          module: i.module,
          auth: [i.auth]
        })
      }
    })
    return res
  }
}

module.exports = AdminDao