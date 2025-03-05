const { defineConfig } = require('@playwright/test');
const base = require('../../tools/playwright/config.base.js');

module.exports = defineConfig({
    ...base
})