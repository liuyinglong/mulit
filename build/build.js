const webpack = require("webpack")
const merge = require("webpack-merge")
const webpackBaseConfig = require("./webpack.base.config")
const entryAndOutPutConfig = require("./entryAndOutput")

//生产环境配置文件
let webpackProductionConfig = {
    mode: "production", //在生产模式下，会默认开启代码压缩等

    plugins: [

        //过去 webpack 打包时的一个取舍是将 bundle 中各个模块单独打包成闭包。这些打包函数使你的 JavaScript 在浏览器中处理的更慢。相比之下，一些工具像 Closure Compiler 和 RollupJS 可以提升(hoist)或者预编译所有模块到一个闭包中，提升你的代码在浏览器中的执行速度。
        new webpack.optimize.ModuleConcatenationPlugin(),

        //https://cloud.tencent.com/developer/section/1477567
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]
}

let webpackBuildConfig = merge({}, entryAndOutPutConfig, webpackBaseConfig, webpackProductionConfig)

module.exports = webpackBuildConfig
