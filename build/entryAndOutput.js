let path = require("path")

// 生成自动引用 js 文件的HTML
let HtmlWebpackPlugin = require('html-webpack-plugin')

const getEntryFile = require("./entryFile/getEntryFile")
const {entry: VueProgressEntryPathMap} = getEntryFile(path.resolve(__dirname, "../src/page/*/*.js"))
const {entry: ReactProgressEntryPathMap} = getEntryFile(path.resolve(__dirname, "../src/page/*/*.jsx"))

//构建入口文件
let entry = {}

//Vue程序
Object.keys(VueProgressEntryPathMap).forEach(function (entryName) {
    entry[entryName] = [VueProgressEntryPathMap[entryName]]
})

//React程序
Object.keys(ReactProgressEntryPathMap).forEach(function (entryName) {
    entry[entryName] = [ReactProgressEntryPathMap[entryName]]
})

console.log("-----VUE PROGRESS-----")
console.log(VueProgressEntryPathMap)

console.log("-----REACT PROGRESS-----")
console.log(ReactProgressEntryPathMap)

let outPutPath = path.resolve(__dirname, '../dist')
let publicPath = "/"

console.log("outPutPath:",outPutPath)
console.log("publicPath:",publicPath)

let config = {
    entry: entry,
    output: {
        filename: "static/js/[name].js",
        path: outPutPath,
        publicPath: publicPath
    },
    plugins: []
}

let htmlPlugins = function ({entryName}) {
    config.plugins.push(
        new HtmlWebpackPlugin({
            filename: `view/${entryName}.html`,
            template: path.resolve(__dirname, "./../src/htmlTemplate/template.html"),
            chunks: ["vendors/vendors", entryName],
            hash: true,
            cache: true
        })
    )
}

//Vue项目
Object.keys(VueProgressEntryPathMap).forEach((entryName) => {
    htmlPlugins({entryName, progress: "vue"})
})

//React项目
Object.keys(ReactProgressEntryPathMap).forEach((entryName) => {
    htmlPlugins({entryName, progress: "react"})
})

module.exports = config