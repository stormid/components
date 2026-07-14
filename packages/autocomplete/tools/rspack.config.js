const path = require('path');
const rspack = require('@rspack/core');
const pkg = require('../package.json');

//mock data for the remote-search example; note the { code, name } shape so the
//example's search() has to map it to the { value, label } the component expects
const COUNTRIES = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'FR', name: 'France' },
    { code: 'DE', name: 'Germany' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'IE', name: 'Ireland' }
];

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
        //mock remote endpoint for the async fetch example; the same dev server
        //backs both `npm run dev` and the Playwright run, so this one route
        //serves the example page and the e2e test
        setupMiddlewares: (middlewares, devServer) => {
            devServer.app.get('/api/countries', (req, res) => {
                const q = String(req.query.q || '').toLowerCase();
                res.json(COUNTRIES.filter(country => country.name.toLowerCase().includes(q)));
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
