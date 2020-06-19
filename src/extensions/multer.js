const asyncBusboy = require('async-busboy')

// 解析文件数据
async function multer (ctx, options) {
  const contentType = ctx.req.headers['content-type']
  if (!contentType.includes('multipart')) {
    throw new global.Ex.Params({
      errMsg: 'Content-Type必须是 multipart/*'
    })
  }
  const filePromises = []
  await asyncBusboy(ctx.req, {
    onFile: async function (fieldname, file, filename, encoding, mimetype) {
      const filePromise = new Promise((resolve, reject) => {
        const bufs = []
        file
          .on('error', err => {
            file.resume()
            reject(err)
          })
          .on('data', data => {
            bufs.push(data)
          })
          .on('end', () => {
            const buf = Buffer.concat(bufs)
            resolve({
              size: buf.length,
              encoding: encoding,
              fieldname: fieldname,
              filename: filename,
              mimeType: mimetype,
              data: buf
            })
          })
      })
      filePromises.push(filePromise)
    }
  })

  const files = []
  let totalSize = 0
  for (const filePromise of filePromises) {
    const file = await filePromise
    const fileExt = file.filename.split('.').pop()
    // 验证文件类型
    if (!_verifyExt(fileExt, options && options.include, options && options.exclude)) {
      throw new global.Ex.FileAction({
        errMsg: `不支持文件类型为${fileExt}的文件`,
        errCode: 10603
      })
    }

    // 验证单个文件的大小
    const { verid, confSize } = _verifySingleFileSize(file.size, options && options.singleLimit)
    if (!verid) {
      throw new global.Ex.FileAction({
        errMsg: `文件: ${file.filename}大小不能超过${confSize}字节`,
        errCode: 10600
      })
    }

    // 计算总大小
    totalSize += file.size

    files.push(file)
  }

  // 验证文件数量
  const { verid, confNums } = _verifyFileNums(files.length, options && options.nums)
  if (!verid) {
    throw new global.Ex.FileAction({
      errMsg: `上传文件数量不能超过${confNums}`,
      errCode: 10602
    })
  }

  const { verid: verid1, confTotalSize } = _verifyTotalFileSize(totalSize, options && options.totalLimit)
  if (!verid1) {
    throw new global.Ex.FileAction({
      errMsg: `总文件体积不能超过${confTotalSize}字节`,
      errCode: 10601
    })
  }

  return files
}

function _verifyExt (ext, include, exclude) {
  const { include: gInclude, exclude: gExclude } = global.config.file
  const fileInclude = include || gInclude
  const fileExclude = exclude || gExclude
  // 只要有fileInclude，取fileInclude
  if (fileInclude) {
    if (!Array.isArray(fileInclude)) {
      throw new Error('file include必须是array')
    }
    fileInclude.map(item => fileInclude.push(item.toLocaleUpperCase()))
    return fileInclude.includes(ext)
  }

  // 有fileExclude,无fileInclude
  if (!fileInclude && fileExclude) {
    if (!Array.isArray(fileExclude)) {
      throw new Error('file exclude必须是array')
    }
    fileExclude.map(item => fileExclude.push(item.toLocaleUpperCase()))
    return !fileExclude.includes(ext)
  }

  // 都没有
  if (!fileInclude && !fileExclude) return true
};

function _verifySingleFileSize (size, singleLimit) {
  const { singleLimit: gSingLimit } = global.config.file
  const confSize = singleLimit || gSingLimit

  return {
    verid: confSize > size,
    confSize
  }
}

function _verifyFileNums (nums, fileNums) {
  const { nums: gNums = 10 } = global.config.file
  const confNums = fileNums || gNums

  return {
    verid: confNums > nums,
    confNums
  }
}

function _verifyTotalFileSize (size, totalLimit) {
  const { totalLimit: gTotalLimit = 1024 * 1024 * 20 } = global.config.file
  const confTotalSize = totalLimit || gTotalLimit

  return {
    verid: confTotalSize > size,
    confTotalSize
  }
}

module.exports = { multer }
