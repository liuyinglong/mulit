const webpack = require("webpack")
const express = require("express")
const webpackDevConfigMap = require("./dispersed.dev.confing")
const app = express()

for (let entryName in webpackDevConfigMap) {

    let HMRPath = '/__webpack_hmr_' + entryName
    let webpackDevConfig = webpackDevConfigMap[entryName]

    // dev middleware
    const clientCompiler = webpack(webpackDevConfig)
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
        publicPath: webpackDevConfig.output.publicPath,
        noInfo: true,
        logLevel: "warn",
    })

    app.use(devMiddleware)
    clientCompiler.plugin('done', stats => {
        stats = stats.toJson()
        stats.errors.forEach(err => console.error(err))
        stats.warnings.forEach(err => console.warn(err))
    })

    // hot middleware
    app.use(require('webpack-hot-middleware')(clientCompiler, {
        heartbeat: 5000,
        path: HMRPath
    }))
}

app.listen(3000, function () {
    console.log("成功启动：localhost:" + 3000)
})