import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directoryPath = path.join(__dirname, 'src', 'pages');

const replacements = [
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
    { regex: /color:\s*['"]#ff6f00['"]/g, replacement: 'color: "warning.light"' }, // Just in case yellow is also hardcoded
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
console.log('Done fixing leftovers!');
