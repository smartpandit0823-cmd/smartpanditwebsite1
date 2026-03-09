const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) {
            walk(p, callback);
        } else if (p.endsWith('.ts') || p.endsWith('.tsx')) {
            callback(p);
        }
    });
}

const mongooseImportRe = /import\s*\{([^}]*)FilterQuery([^}]*)\}\s*from\s*(["'])mongoose\3/;

const fixImports = (file) => {
    let content = fs.readFileSync(file, 'utf8');

    const match = content.match(mongooseImportRe);
    if (!match) return;

    const quote = match[3];

    content = content.replace(
        mongooseImportRe,
        (full, before, after, q) => {
            const cleaned = `import {${before}${after}} from ${q}mongoose${q}`;
            return cleaned;
        }
    );

    content = content
        .replace(/\{\s*,\s*/g, '{ ')
        .replace(/,\s*\}/g, ' }')
        .replace(/,\s*,/g, ',');

    content = content.replace(/import\s*\{\s*\}\s*from\s*["']mongoose["'];?\n?/g, '');

    const firstImportIdx = content.search(/^import /m);
    const typeImport = `import type { FilterQuery } from ${quote}mongoose${quote};\n`;
    if (firstImportIdx >= 0) {
        content = content.slice(0, firstImportIdx) + typeImport + content.slice(firstImportIdx);
    } else {
        content = typeImport + content;
    }

    fs.writeFileSync(file, content);
}

walk('./src', fixImports);
console.log('Fixed imports!');
