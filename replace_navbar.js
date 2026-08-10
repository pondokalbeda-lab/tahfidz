const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

code = code.replace(/import \{([^}]+)\} from 'lucide-react';/s, (match, p1) => {
  return `import {${p1},\n  Menu,\n  X\n} from 'lucide-react';`;
});

// We want to remove the old "Sembunyikan Tab" button and just show the tabs if isTabsVisible is true, but we'll add the hamburger menu at the top right of the main header area.
// Let's rewrite the JSX part entirely using string replacement.
