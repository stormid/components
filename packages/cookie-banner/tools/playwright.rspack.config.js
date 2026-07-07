const baseConfig = require('./rspack.config');

module.exports = {
    ...baseConfig,
    devServer: {
        port: 8091
    }
};
