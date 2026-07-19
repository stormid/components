const path = require('path');
const rspack = require('@rspack/core');
const pkg = require('../package.json');
const COUNTRIES = require('./mock-api-data');

module.exports = {
    entry: './example/src/js/index.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, '../build'),
        clean: true
    },
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        port: 8095,
        //mock remote endpoint for async fetch example - same dev server
        //backs both `npm run dev` and the Playwright run, so this one route
        //serves the example page and e2e test
        setupMiddlewares: (middlewares, devServer) => {
            devServer.app.get('/api/countries', (req, res) => {
                const query = String(req.query.q || '').toLowerCase();
                res.json(COUNTRIES.filter(country => country.name.toLowerCase().includes(query)));
            });
            return middlewares;
        }
    },
    plugins: [
        new rspack.HtmlRspackPlugin({
            title: pkg.name,
            template: './example/src/index.html',
            filename: 'index.html'
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
