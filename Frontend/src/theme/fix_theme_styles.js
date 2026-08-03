import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Since this script is now in src/theme, the pages directory is one level up
const directoryPath = path.join(__dirname, '..', 'pages');

const replacements = [
    // --- From fix_colors.js ---
    { regex: /(bgcolor|backgroundColor|background):\s*['"](#f4f6f8|#f0f2f5|#f5f7fa|#fafafa|#e2e8f0)['"]/g, replacement: '$1: "background.default"' },
    { regex: /(bgcolor|backgroundColor|background):\s*['"](#ffffff|#fff)['"]/g, replacement: '$1: "background.paper"' },
    { regex: /color:\s*['"](#333|#555|#1e293b|#333333|#000000|#000)['"]/g, replacement: 'color: "text.primary"' },
    { regex: /color:\s*['"](#777|#999|#64748b|#475569|#94a3b8)['"]/g, replacement: 'color: "text.secondary"' },

    // --- From fix_leftovers.js ---
    // AssignedMentor.jsx
    { regex: /color:\s*['"]#37474f['"]/g, replacement: 'color: "text.primary"' },
    // StudentReportSubmit.jsx
    { regex: /bgcolor:\s*selectedFile \? ".*" : "#ffffff"/g, replacement: 'bgcolor: selectedFile ? "action.hover" : "background.paper"' },
    { regex: /"&:hover":\s*{\s*borderColor:\s*".*",\s*bgcolor:\s*".*"\s*}/g, replacement: '"&:hover": { borderColor: "primary.main", bgcolor: "action.selected" }' },
    // InternshipAssignmentsManagement.jsx
    { regex: /bgcolor:\s*['"]#f8fafc['"]/g, replacement: 'bgcolor: "background.default"' },
    { regex: /color:\s*['"]#0f172a['"]/g, replacement: 'color: "text.primary"' },
    // EvaluationCriteriaManagement.jsx
    { regex: /color:\s*['"]#004d40['"]/g, replacement: 'color: "primary.light"' },
    { regex: /color:\s*['"]#ff6f00['"]/g, replacement: 'color: "warning.light"' },

    // --- From fix_neomorphism.js ---
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
console.log('Done fixing theme styles!');
