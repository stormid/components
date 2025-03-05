
const { defineConfig } = require('@playwright/test');
const baseConfig = require('../../tools/playwright/config.base.js');

module.exports = defineConfig({
    ...baseConfig,
    use: {
        ...baseConfig.use,
        baseURL: 'http://127.0.0.1:8082'
    },
    webServer: {
        ...baseConfig.webServer,
        url: 'http://127.0.0.1:8082'
    },
});