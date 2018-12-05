const path = require('path');
const fse = require('fs-extra');
const doctype = require('../src/doctype.js');
const content = require('../src');
fse.outputFile(
    path.resolve(__dirname,`../../../docs/index.html`),
    doctype(content()),
    'utf8',
    err => {
        if(err) return console.log(err);
        console.log('Docs rendered.');
    }
);