const fs = require('fs');
const path = require('path');

const findPackages = (dir = '../../../packages') => {
    return fs.readdirSync(path.resolve(__dirname, dir)).reduce((list, file) => {
        fs.statSync(path.resolve(__dirname, path.join(dir, file))).isDirectory() && list.push(file);
        return list;
    }, []);
};

module.exports = { findPackages };