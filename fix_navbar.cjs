const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Insert the closing </div> right before the Navigation Drawer
code = code.replace(
  "      {/* Navigation Drawer (Sidebar) */}",
  "      </div>\n      {/* Navigation Drawer (Sidebar) */}"
);

fs.writeFileSync('src/components/Navbar.tsx', code);
