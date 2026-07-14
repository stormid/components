const path = require('path');
const rspack = require('@rspack/core');
const pkg = require('../package.json');

module.exports = {
    entry: './example/src/js/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, './build'),
        clean: true
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 8081
    },
    plugins: [
        new rspack.HtmlRspackPlugin({
            title: pkg.name,
            template: './example/src/index.html',
            filename: 'index.html'
        }),
        new rspack.HtmlRspackPlugin({
            title: pkg.name,
            template: './example/src/start-open.html',
            filename: 'start-open.html'
        }),
        new rspack.HtmlRspackPlugin({
            title: pkg.name,
            template: './example/src/attribute.html',
            filename: 'attribute.html'
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'builtin:swc-loader',
            options: {
                jsc: {
                    parser: {
                        syntax: 'ecmascript'
                    }
                }
            }
        },
        {
            test: /\.(ico)$/,
            type: 'asset/resource'
        }]
    }
};
