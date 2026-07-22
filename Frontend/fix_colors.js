import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directoryPath = path.join(__dirname, 'src', 'pages');

const replacements = [
    { regex: /(bgcolor|backgroundColor|background):\s*['"](#f4f6f8|#f0f2f5|#f5f7fa|#fafafa|#e2e8f0)['"]/g, replacement: '$1: "background.default"' },
    { regex: /(bgcolor|backgroundColor|background):\s*['"](#ffffff|#fff)['"]/g, replacement: '$1: "background.paper"' },
    { regex: /color:\s*['"](#333|#555|#1e293b|#333333|#000000|#000)['"]/g, replacement: 'color: "text.primary"' },
    { regex: /color:\s*['"](#777|#999|#64748b|#475569|#94a3b8)['"]/g, replacement: 'color: "text.secondary"' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
            processDirectory(filePath);
        } else if (filePath.endsWith('.jsx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let modified = false;
            
            replacements.forEach(({ regex, replacement }) => {
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    modified = true;
                }
            });
            
            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated: ${filePath}`);
            }
        }
    });
}

processDirectory(directoryPath);
console.log('Done!');
