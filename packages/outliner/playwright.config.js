
const { defineConfig } = require('@playwright/test');
const baseConfig = require('../../tools/playwright/config.base.js');
const server = require('./tools/playwright.webpack.config.js');

module.exports = defineConfig({
    ...baseConfig,
    use: {
        ...baseConfig.use,
        baseURL: `http://127.0.0.1:${server.devServer.port}/`,
    },
    webServer: {
        ...baseConfig.webServer,
        url: `http://127.0.0.1:${server.devServer.port}/`,
    },
});