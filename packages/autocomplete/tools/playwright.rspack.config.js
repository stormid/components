const baseConfig = require('./rspack.config');

module.exports = {
    ...baseConfig,
    //spread base devServer so mock /api/countries route (setupMiddlewares)
    //is available under Playwright too, not just `npm run dev`
    devServer: {
        ...baseConfig.devServer,
        port: 8095
    }
};
