const path = require('node:path');
const webpack = require('webpack');
// const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('../package.json');

module.exports = {
    entry: './sandbox/src/js/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, './build')
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 8081
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new CleanWebpackPlugin(['./build']),
        new HtmlWebpackPlugin({
            title: pkg.name,
            template: './sandbox/src/full/index.html',
            filename: 'index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            },
            // {
            //     test: /\.(ico)$/,
            //     use: {
            //         loader: 'file-loader'
            //     }
            // }
        ]
    }
};
