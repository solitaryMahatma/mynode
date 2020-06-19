const crypto = require('crypto')
const path = require('path')
const fs = require('fs')
const uuidv4 = require('uuid/v4')
const dayjs = require('dayjs')
const FileModel = require('../models/file')

// 上传文件到本地
class UploadToLocal {
  // 一个路径
  constructor(storeDir) {
    this.storeDir = this._filerPathName(storeDir)
  }

  async upload (files) {
    const arr = []
    for (const file of files) {
      // md5校验文件是否已存在
      const md5 = this._generateMd5(file)
      const { domain } = global.config.app
      const fileExist = await FileModel.findOne({ where: { md5 } })
      if (fileExist) {
        arr.push({
          id: fileExist.id,
          key: file.filename,
          url: `${domain}/${this.storeDir}/${fileExist.path}`
        })
      } else {
        const { absolutePath, relativePath, fileName } = this._getStorePath(file.filename)
        // console.log(absolutePath);
        // 创建可写流,写入Buff
        try {
          const target = fs.createWriteStream(absolutePath)
          await target.write(file.data)
        } catch (e) {
          throw new Error(`文件存储失败~: ${e}`)
        }
        console.log(fileName)
        const ext = path.extname(fileName)
        let saved
        try {
          saved = await FileModel.saveFileRecord({
            path: relativePath,
            md5,
            ext: ext.slice(1),
            name: fileName,
            size: file.size
          })
        } catch (e) {
          throw new Error(`文件信息写入数据库发生了意外~: ${e}`)
        }

        arr.push({
          id: saved.id,
          key: file.filename,
          url: `${domain}/${this.storeDir}/${relativePath}`
        })
      }
    }
    return arr
  }

  // 过滤传入的路径名,去除开头的'/'
  _filerPathName (pathname) {
    if (!pathname) {
      return ''
    } else {
      if (pathname.startsWith('/')) {
        pathname = pathname.slice(1)
        return this._filerPathName(pathname)
      } else {
        return pathname
      }
    }
  }

  // 生成文件md5
  _generateMd5 (file) {
    const fileBuff = file.data
    const md5 = crypto.createHash('md5')
    return md5.update(fileBuff).digest('hex')
  }

  // 生成文件名称
  _generateFileName (filename) {
    const ext = path.extname(filename)
    return `${uuidv4()}${ext}`
  }

  // 获取保存文件的路径全名
  _getStorePath (filename) {
    const fileName = this._generateFileName(filename)
    const formatDay = this._getFormatDay()
    const dir = this._getExactStoreDir(formatDay)
    const dirExists = fs.existsSync(dir)
    if (!dirExists) {
      this._mkdirs(dir)
    }
    return {
      absolutePath: path.join(dir, fileName),
      relativePath: `${formatDay}/${fileName}`,
      fileName
    }
  }

  // 获取格式化时间
  _getFormatDay () {
    return dayjs().format('YYYY/MM/DD')
  }

  // 获取保存路径
  _getExactStoreDir (formatDay) {
    let { storeDir } = global.config.file
    if (!storeDir) {
      throw new Error('config file storeDir 不能为空')
    }
    this.storeDir && (storeDir += `/${this.storeDir}`)

    // 判断路径类型
    let extrat = ''
    if (path.isAbsolute(storeDir)) {
      extrat = path.join(storeDir, formatDay)
    } else {
      extrat = path.join(process.cwd(), storeDir, formatDay)
    }
    return extrat
  }

  // 当目标文件夹不存在时，创建文件夹
  _mkdirs (dirname) {
    if (fs.existsSync(dirname)) {
      return true
    } else {
      if (this._mkdirs(path.dirname(dirname))) {
        fs.mkdirSync(dirname)
        return true
      }
    }
  }
}

// 上传文件到云端
class UploadToCloud {
}

module.exports = {
  UploadToLocal,
  UploadToCloud
}