const path = require('path') // 根路径
const HTMLPlugin = require('html-webpack-plugin') // 编译模板插件
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin') // 抽离css

const isDev = process.env.NODE_ENV === 'development' // 判断环境

const config = {
    target: 'web', // target是浏览器端
    entry: path.join(__dirname, 'src/index.js'), // 入口文件
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist') // 打包后的输出路径
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.jsx$/,
            loader: 'babel-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.(gif|jpg|jpeg|png|svg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name]-aaa.[ext]'
                }
            }]
        }, {
            test:/\.(woff|woff2|ttf|eot)$/,
            use: [{
                loader:'url-loader',
                options: {
                    limit: 100000
                }
            }]
        }]
    },
    plugins: [
        new HTMLPlugin({
            template: path.join(__dirname, 'template.html')
        }), // 使用模板文件
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }) // 定义webpack的全局变量，在vue文件中也能访问到
    ]
}

if (isDev) {
    config.module.rules.push({
        test: /\.(styl|css)/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                }
            },
            'stylus-loader'
        ]
    })
    config.devtool = '#cheap-module-eval-source-map'
    config.devServer = {
        port: 8000,
        host: '0.0.0.0',
        overlay: {
            errors: true,
        },
        hot: true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else { // 正式环境下要抽离css
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue'] // 标明依赖的第三方库
    }
    config.output.filename = '[name].[chunkhash:8].js'
    config.module.rules.push(
        {
            test: /\.(styl|css)/,
            use: ExtractPlugin.extract({
                fallback: 'style-loader',
                use: [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    'stylus-loader'
                ]
            })
        },
    )
    config.plugins.push(
        new ExtractPlugin('styles.[contentHash:8].css'),
        // 打包第三方库
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        })
    )
}

module.exports = config