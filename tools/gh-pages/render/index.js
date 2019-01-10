const path = require('path');
const fse = require('fs-extra');
const doctype = require('../src/doctype.js');
const content = require('../src');
const componentContent = require('../src/component-doc');
const md = require('markdown-it')({
    html: true,
    linkify: true,
    typographer: true
});
const packages = require('../utils').findPackages();
const writeFile = (file, data) => {
    fse.outputFile(
        file,
        data,
        'utf8',
        err => {
            if(err) return console.log(err);
        }
    );
};

for (package of packages) {
    writeFile(
        path.resolve(__dirname,`../../../docs/packages/${package}.html`),
        componentContent(md.render(fse.readFileSync(path.resolve(__dirname,`../../../packages/${package}/README.md`), 'utf8')))
    );
}
writeFile(
    path.resolve(__dirname,`../../../docs/index.html`),
    doctype(content(packages))
);