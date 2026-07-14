const baseConfig = require('./rspack.config');

module.exports = {
    ...baseConfig,
    //spread the base devServer so the mock /api/countries route (setupMiddlewares)
    //is available under Playwright too, not just `npm run dev`
    devServer: {
        ...baseConfig.devServer,
        port: 8095
    }
};
