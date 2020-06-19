const config = {
  app: {
    domain: 'http://localhost:3000',
    port: 3001,
    staticPath: `${process.cwd()}/static`
  },
  token:{
    salt: "dhjjjjjjjjjjsssssgewygdgfsdhjrehry",
    limitTime: {
      expiresIn: 60 * 60
    }
  },
  security: {
    secretKey: 'abcabcabc',
    expiresIn: 60 * 60 * 2
  },
  dataBase: {
    dbName: 'daigou',
    host: '122.51.67.38',
    port: 3306,
    user: 'root',
    password: 'Zwb123123@'
  },
  file: {
    storeDir: `${process.cwd()}/static`,
    singleLimit: 1024 * 1024 * 2,
    totalLimit: 1024 * 1024 * 20,
    nums: 10,
    // exclude: ['jpeg']
    include: ['jpeg1', 'png']
  },
  logs: {
    baseLogPath: `${process.cwd()}/logs`,
    detail: true // 是否在控制台显示请求详情
  }
}

module.exports = config
