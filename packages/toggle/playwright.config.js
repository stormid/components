
const { defineConfig } = require('@playwright/test');
const baseConfig = require('../../tools/playwright/config.base.js');
const server = require('./tools/playwright.webpack.config.js');

module.exports = defineConfig({
    ...baseConfig,
    use: {
        ...baseConfig.use,
        baseURL: `http://localhost:${server.devServer.port}/`,
    },
    webServer: {
        ...baseConfig.webServer,
        url: `http://localhost:${server.devServer.port}/`,
    },
});