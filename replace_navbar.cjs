const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(/import \{([^}]+)\} from 'lucide-react';/s, (match, p1) => {
  return `import {${p1},\n  Menu,\n  X\n} from 'lucide-react';`;
});

fs.writeFileSync('src/components/Navbar.tsx', code);
