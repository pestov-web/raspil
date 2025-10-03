const fs = require('fs');
const path = require('path');

const base64Path = path.join(__dirname, 'roboto-base64.txt');
const outPath = path.join(__dirname, '..', 'src', 'shared', 'lib', 'pdf-fonts.ts');

const base64 = fs.readFileSync(base64Path, 'utf8').trim();
const content = `const ROBOTO_REGULAR_BASE64 = '${base64}';\n\nlet isRobotoFontRegistered = false;\n\nexport const ensureRobotoFont = (doc) => {\n    if (isRobotoFontRegistered) {\n        doc.setFont('Roboto-Regular', 'normal');\n        return;\n    }\n\n    doc.addFileToVFS('Roboto-Regular.ttf', ROBOTO_REGULAR_BASE64);\n    doc.addFont('Roboto-Regular.ttf', 'Roboto-Regular', 'normal', 'Identity-H');\n    isRobotoFontRegistered = true;\n    doc.setFont('Roboto-Regular', 'normal');\n};\n`;
fs.writeFileSync(outPath, content);
console.log('Font module created at', outPath);
