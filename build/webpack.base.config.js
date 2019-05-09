const path = require('path')


const {VueLoaderPlugin} = require('vue-loader')

//判断是否为生产环境
const isProduction = process.env.NODE_ENV === 'production'
let V_ConsolePlugin = require('vconsole-webpack-plugin')

const {
    NODE_ENV,
    NODE_API,
} = process.env

let webpackBaseConfig = {
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "../src"),
            'vue$': 'vue/dist/vue.esm.js',
        },
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    compilerOptions: {
                        preserveWhitespace: false
                    }
                }
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env', "@babel/preset-react"]
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'images/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'font/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(ico)$/,
                loader: 'file-loader',
                query: {
                    name: 'images/[name].[ext]'
                }
            },
            {
                test: /\.(json.file)$/,
                exclude: /(node_modules)/,
                loader: 'file-loader',
                query: {
                    name: 'data/json/[name]'
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader",
                    },
                    {
                        loader: "css-loader",
                    },
                ]
            }
        ]
    },

    //这些选项可以控制 webpack 如何通知「资源(asset)和入口起点超过指定文件限制」
    performance: {
        maxEntrypointSize: 1024 * 800,            //入口最大体积
        maxAssetSize: 1024 * 700,                 //生成的单个资源提及
        hints: isProduction ? 'warning' : false   //在开发环境关闭提示
    },

    optimization: {
        splitChunks: {              //提取公共模块
            cacheGroups: {
                vendor: {
                    name: 'vendors/vendors',
                    chunks: 'all',
                    minChunks: 3,    //分割前必须共享模块的最小块数
                    reuseExistingChunk: true
                }
            }
        }
    },

    plugins: [
        new V_ConsolePlugin({
            enable: NODE_API === 'dev' || NODE_API === 'test' //开发和测试环境添加调试工具
        }),
        new VueLoaderPlugin()
    ]
}

//开发环境loader配置
let developmentLoader = [
    {
        test: /\.scss$/,
        use: [
            {
                loader: "style-loader",
                options: {
                    sourceMap: true
                }
            },
            {
                loader: "css-loader",
                options: {
                    sourceMap: true,
                    importLoaders: 1,
                    modules: "global",
                }
            },
            {
                loader: "sass-loader",
                options: {
                    sourceMap: true
                }
            }
        ]
    }
]

//生产环境loader配置
let productionLoader = [
    {
        test: /\.scss$/,
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader",
                options: {
                    importLoaders: 2,
                    modules: "global"
                }
            },
            {
                loader: "postcss-loader",
                options: {
                    plugins: [
                        require('precss')({/* ...options */}),
                        require('autoprefixer')({/* ...options */})
                    ]
                }
            },
            {
                loader: "sass-loader"
            }
        ]
    }
]

if (isProduction) {
    webpackBaseConfig.module.rules = webpackBaseConfig.module.rules.concat(productionLoader)
} else {
    webpackBaseConfig.module.rules = webpackBaseConfig.module.rules.concat(developmentLoader)
}

module.exports = webpackBaseConfig