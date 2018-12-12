const base = require('./tools/jest/config.base.js');

module.exports = {
    ...base,
    transform: {
        '^.+\\.js$': './tools/jest/babel-jest-wrapper.js'
    },
    projects: ["<rootDir>", "<rootDir>/packages/*"]
};