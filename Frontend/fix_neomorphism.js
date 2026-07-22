import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directoryPath = path.join(__dirname, 'src', 'pages');

const replacements = [
    // Remove neomorphism gradients and shadows
    { regex: /background:\s*['"]linear-gradient\(145deg,\s*#ffffff,\s*#[a-f0-9]{6}\)['"],?/g, replacement: '' },
    { regex: /boxShadow:\s*['"]8px 8px 16px #[a-f0-9]{6},\s*-8px -8px 16px #ffffff['"],?/g, replacement: '' },
    { regex: /border:\s*['"]1px solid rgba\(0,0,0,0\.\d+\)['"],?/g, replacement: '' },
    // Replace remaining hardcoded text colors
    { regex: /color:\s*['"]#1a237e['"]/g, replacement: 'color: "primary.light"' },
    { regex: /color:\s*['"]#070707['"]/g, replacement: 'color: "text.primary"' },
    { regex: /color:\s*['"]#1565c0['"]/g, replacement: 'color: "primary.main"' },
    { regex: /color:\s*['"]#0d47a1['"]/g, replacement: 'color: "primary.dark"' },
    // Fix the textfields and search bars
    { regex: /bgcolor:\s*['"]#f8f9fa['"]/g, replacement: 'bgcolor: "background.paper"' },
    { regex: /backgroundColor:\s*['"]#f8f9fa['"]/g, replacement: 'backgroundColor: "background.paper"' },
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
console.log('Done cleaning neomorphism!');
