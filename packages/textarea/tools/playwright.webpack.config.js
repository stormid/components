const baseConfig = require('./webpack.config');

module.exports = {
    ...baseConfig,
    devServer: {
        port: 8083
    }
};
