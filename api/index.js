const fs = require('fs')
const path = require('path')
const sourchPath = path.resolve(__dirname, '../')
async function addFilesInfo(files, staticPath) {
  return files.map(function(file) {
    const filePath = path.resolve(staticPath, file)
    stat = fs.statSync(filePath)
    return {
      path: file,
      isDir: stat.isDirectory()
    }
  })
}
async function getFiles(filePath) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
      if (err) {
        reject(err)
        return
      }
      resolve(files)
    })
  })
}
async function isDirectory(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err)
        return
      }
      resolve(stats.isDirectory())
    })
  })
}
async function dealFile(ctx, next) {
  await next()
  const query = ctx.request.query
  const action = query.action
  const filePath = query.filePath
  if (action !== 'getFile') {
    return
  }
  ctx.response.type = 'text/html; charset=utf-8';
  const fail = {
    state: 'fail'
  }
  if (!filePath) {
    fail.msg = 'is not a filePath'
    ctx.response.body = fail
    return
  }
  try {
    const staticPath = path.resolve(__dirname, filePath)
    if (staticPath.indexOf(sourchPath) < 0) {
      fail.msg = 'not auth'
      ctx.response.body = fail
      return
    }
    let isDir = await isDirectory(staticPath)
    if (!isDir) {
      fail.msg = 'is not a directory'
      ctx.response.body = fail
      return
    }
    let files = await getFiles(staticPath)
    let filesObj = await addFilesInfo(files, staticPath)
    const response = {
      state: 'ok'
    }
    response.files = filesObj
    ctx.response.body = response
  } catch (err) {
    fail.msg = err
    ctx.response.body = fail
  }
}
module.exports = dealFile