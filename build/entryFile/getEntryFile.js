let fs = require("fs")
let path = require("path")
let glob = require('glob')

/**
 * 返回文件夹列表
 * @param dirPath
 * @returns {Array}
 */
function getDirList(dirPath) {
    let fileList = fs.readdirSync(dirPath)
    let dirList = {}
    for (let i = 0; i < fileList.length; i++) {
        let stats = fs.statSync(dirPath + fileList[i])
        if (stats.isDirectory()) {
            dirList[fileList[i]] = path.resolve(dirPath, fileList[i])
        }
    }
    return dirList
}

/**
 * 判断该目录下是否存在该类型文件
 * @param path
 * @param suffix
 * @returns {Array}
 */
function suffix(path, suffix) {
    let fileList = fs.readdirSync(path)
    let fileAry = []
    let reg = new RegExp(suffix + "$", "i")
    for (let i = 0; i < fileList.length; i++) {
        let stats = fs.statSync(path + fileList[i])
        if (stats.isFile() && reg.test(fileList[i])) {
            fileAry.push(fileList[i])
        }
    }
    return fileAry
}

/**
 * @param globPath
 * @returns {{}}
 */
function getPath(globPath) {
    let entries = {}
    glob.sync(globPath).forEach(function (filePath) {
        let pathname = filePath.split("/").slice(-2).join("/")
        pathname = pathname.split(".")
        pathname.pop()
        pathname = pathname.join("")
        entries[pathname] = filePath
    })
    return entries
}

let getEntryFile = function (dir) {
    let dirList = getPath(dir)
    let page = {}, entry = {}
    Object.keys(dirList).forEach(pathName => {
        let name = pathName.split("/")[0]
        page[name] = {
            pathName: pathName,
            path: dirList[pathName]
        }
        entry[pathName] = dirList[pathName]
    })

    return {
        page,
        entry
    }
}

module.exports = getEntryFile


