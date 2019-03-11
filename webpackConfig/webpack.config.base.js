const path = require('path') // 根路径
const VueLoaderPlugin = require('vue-loader/lib/plugin');


const config = {
    mode: process.env.NODE_ENV || "production", // webpack4 只接收两个参数
    target: 'web', // target是浏览器端
    entry: path.join(__dirname, '../src/index.js'), // 入口文件
    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, '../dist') // 打包后的输出路径
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
        new VueLoaderPlugin()
    ]
}

module.exports = config