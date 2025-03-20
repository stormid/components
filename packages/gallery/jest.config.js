const base = require('../../tools/jest/config.base.js');
const pack = require('./package');

module.exports = {
    ...base,
    transform: {
        '^.+\\.js$': '../../tools/jest/babel-jest-wrapper.js'
    },
    displayName: pack.name,
    name: pack.name
};