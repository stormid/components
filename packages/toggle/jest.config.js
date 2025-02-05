const base = require('../../tools/jest/config.base.js');
const pkg = require('./package');

module.exports = {
    ...base,
    transform: {
        '^.+\\.js$': '../../tools/jest/babel-jest-wrapper.js'
    },
    displayName: pkg.name,
    testEnvironment: 'jsdom'
};