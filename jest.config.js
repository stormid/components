const base = require('./tools/jest/config.base.js');

module.exports = {
    ...base,
    projects:
    ["<rootDir>/packages/*/jest.config.js"]
};