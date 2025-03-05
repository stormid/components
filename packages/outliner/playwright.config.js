const base = require('../../tools/playwright/config.base.js');

module.exports = {
    ...base,
    use: {
        baseURL: 'http://127.0.0.1:8082',
    },
    webServer: {
        url: 'http://127.0.0.1:8082',
    },
}