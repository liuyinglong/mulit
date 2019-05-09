const merge = require("webpack-merge")
const webpackBaseConfig = require("./webpack.base.config")
const path = require("path")

//错误提示
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const entryAndOutPutConfig = require("./entryAndOutput")

const devServerPort = 8080
console.log(`开发端口：${devServerPort}`)

//生产环境配置文件
let webpackDevConfig = {
    mode: "development",
    plugins: [
        new FriendlyErrorsPlugin(),                 //错误提示产检
    ],
    devServer: {
        contentBase: path.join(__dirname, '../dist'),
        compress: true,
        port: devServerPort,
        hot: true,
        noInfo: true,
        host: "0.0.0.0",
        historyApiFallback: {
            rewrites: [
                {from: "/view/home", to: '/view/home/index.html'}
            ]
        }
    }
}

let webpackConfig = merge({}, entryAndOutPutConfig, webpackBaseConfig, webpackDevConfig)
module.exports = webpackConfig
