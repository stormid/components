const { defineConfig } = require('@playwright/test');
const baseConfig = require('../../tools/playwright/config.base.js');

module.exports = defineConfig({
    ...baseConfig
})