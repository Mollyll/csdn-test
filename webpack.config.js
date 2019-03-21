const path = require('path') // 根路径
const HTMLPlugin = require('html-webpack-plugin') // 编译模板插件
const webpack = require('webpack')

const miniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

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
            test: /\.jsx$/,
            loader: 'babel-loader'
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /(node_modules|bower_components)/
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
    config.output.filename = '[name].bundle.js'
    config.module.rules.push(
        {
            test: /\.(styl|css)/,
            use: [
                miniCssExtractPlugin.loader,
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                    }
                },
                'stylus-loader'
            ]
        },
    )
    config.optimization =  {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true // set to true if you want JS source maps
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
            splitChunks: {
            chunks: 'all' // 默认将js代码打包到vendor里面
        },
        runtimeChunk: true // 将除了entry里面指定的js的name的时候，其他的js放到runtime里面去
    };
    config.plugins.push(
        new miniCssExtractPlugin({
            filename: "style.[contenthash:8].css",
            chunkFilename: "chunk.[contenthash:8].css"
        })
        // new ExtractPlugin('styles.[contentHash:8].css'),
        // // 打包第三方库
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor'
        // }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'runtime'
        // })
    )
}

module.exports = config