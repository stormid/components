const path = require('path');
const fse = require('fs-extra');
const doctype = require('../src/doctype.js');
const template = require('../src');
// const componentContent = require('../src/component-doc');
const md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
}).use(require('markdown-it-anchor'));
const packages = require('../utils').findPackages();
const writeFile = (file, data) => {
    fse.outputFile(
        file,
        data,
        'utf8',
        err => {
            if (err) return console.error(err);
        }
    );
};

packages.forEach((component, i) => {
    const content = md.render(fse.readFileSync(path.resolve(__dirname,`../../../packages/${component}/README.md`), 'utf8'));
    const newFileName = i === 0 ? 'index' : component;
    writeFile(
        path.resolve(__dirname,`../../../docs/${newFileName}.html`),
        doctype(template(packages, content, component))
    );
});