const base = require('../../tools/jest/config.base.js');
const pkg = require('./package');

module.exports = {
    ...base,
    name: pkg.name,
    displayName: pkg.name
};