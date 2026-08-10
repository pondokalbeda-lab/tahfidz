const fs = require('fs');

// Modify App.tsx
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
appCode = appCode.replace(
  "import { KelolaDataTab } from './components/KelolaDataTab';",
  "import { KelolaDataTab } from './components/KelolaDataTab';\nimport { DashboardTab } from './components/DashboardTab';"
);

appCode = appCode.replace(
  "const [activeTab, setActiveTab] = useState<'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola'>('absensi');",
  "const [activeTab, setActiveTab] = useState<'dashboard' | 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola'>('dashboard');"
);

const dashboardComponent = `          {activeTab === 'dashboard' && (
            <DashboardTab
              pesantrenInfo={pesantrenInfo}
              totalSantri={santriList.length}
              todaySetoranCount={todaySetoranCount}
              todayAttendancePercent={todayAttendancePercent}
              selectedDate={selectedDate}
            />
          )}`;

appCode = appCode.replace(
  "{/* Tab Content Body */}\n        <main className=\"max-w-7xl mx-auto px-4 sm:px-6 py-6\">\n          {activeTab === 'absensi' && (",
  "{/* Tab Content Body */}\n        <main className=\"max-w-7xl mx-auto px-4 sm:px-6 py-6\">\n" + dashboardComponent + "\n          {activeTab === 'absensi' && ("
);
fs.writeFileSync('src/App.tsx', appCode);

// Modify Navbar.tsx
let navbarCode = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbarCode = navbarCode.replace(
  "activeTab: 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola';",
  "activeTab: 'dashboard' | 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola';"
);
navbarCode = navbarCode.replace(
  "setActiveTab: (tab: 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola') => void;",
  "setActiveTab: (tab: 'dashboard' | 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola') => void;"
);

// Remove metrics from navbar
navbarCode = navbarCode.replace(
  /\{\/\* Quick Metrics Cards \*\/\}.*?\{\/\* Hamburger Button Desktop \*\/\}/s,
  "{/* Hamburger Button Desktop */}"
);

// Add LayoutDashboard icon
if (!navbarCode.includes('LayoutDashboard')) {
  navbarCode = navbarCode.replace(
    "  Menu,",
    "  Menu,\n  LayoutDashboard,"
  );
}

const dashboardTabBtn = `              <button
                onClick={() => setActiveTab('dashboard')}
                className={\`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none justify-center sm:justify-start \${
                  activeTab === 'dashboard'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                }\`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>`;

navbarCode = navbarCode.replace(
  /<nav className="flex flex-col sm:flex-row flex-wrap gap-2">/s,
  `<nav className="flex flex-col sm:flex-row flex-wrap gap-2">\n${dashboardTabBtn}`
);

fs.writeFileSync('src/components/Navbar.tsx', navbarCode);
console.log('Modified App.tsx and Navbar.tsx');
