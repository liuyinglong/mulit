const merge = require('webpack-merge')
const path = require("path")
const webpack=require("webpack")

const {entry: entryPathMap} = require("../entryFile/getEntryFile")

//单个webpack配置文件
const webpackBaseConfig = require("../webpack.base.config")

// 生成自动引用 js 文件的HTML
let HtmlWebpackPlugin = require('html-webpack-plugin')

//错误提示
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

//配置文件MAP
let webpackDevConfigMap = {}
//遍历所有入口文件，生成配置文件MAP
for (let entryName in entryPathMap) {
    if (!entryPathMap.hasOwnProperty(entryName)) {
        return
    }
    let HMRPath = '/__webpack_hmr_' + entryName

    webpackDevConfigMap[entryName] = merge({}, webpackBaseConfig, {
        //开发入口文件,热更新
        entry: ['webpack-hot-middleware/client?path=' + HMRPath, entryPathMap[entryName]],

        output: {
            filename: `js/${entryName}.js`,
        },

        devtool: "#envl-source-map",

        mode: "development",

        plugins: [
            new FriendlyErrorsPlugin(),                 //错误提示产检

            new webpack.HotModuleReplacementPlugin(),   //热更新插件

            new webpack.NoEmitOnErrorsPlugin(),

            new HtmlWebpackPlugin({
                filename: `${entryName}.html`,
                template: path.resolve(__dirname, "../../src/htmlTemplate/template.html")
            })
        ]
    })
}

module.exports = webpackDevConfigMap