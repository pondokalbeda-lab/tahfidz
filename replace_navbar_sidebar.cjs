const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// The new sidebar code
const sidebarCode = `
      {/* Navigation Drawer (Sidebar) */}
      {isTabsVisible && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsTabsVisible(false)}
          ></div>
          
          {/* Sidebar Content */}
          <div className="relative w-72 max-w-[80vw] h-full bg-emerald-800 border-l border-emerald-700 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-4 border-b border-emerald-700 flex justify-between items-center bg-emerald-900/50">
              <span className="font-bold text-white">Menu Navigasi</span>
              <button 
                onClick={() => setIsTabsVisible(false)}
                className="p-2 bg-emerald-800 hover:bg-emerald-700 rounded-lg text-emerald-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => { setActiveTab('dashboard'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full \${
                    activeTab === 'dashboard'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }\`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => { setActiveTab('absensi'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full \${
                    activeTab === 'absensi'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }\`}
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Absensi Santri</span>
                </button>
                <button
                  onClick={() => { setActiveTab('mutabaah'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full \${
                    activeTab === 'mutabaah'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }\`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Mutaba'ah Setoran</span>
                </button>
                <button
                  onClick={() => { setActiveTab('santri'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full \${
                    activeTab === 'santri'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }\`}
                >
                  <Users className="w-5 h-5" />
                  <span>Data Santri & Raport</span>
                </button>
                <button
                  onClick={() => { setActiveTab('rekap'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full \${
                    activeTab === 'rekap'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }\`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Rekapitulasi</span>
                </button>
                <div className="my-2 border-t border-emerald-700/50"></div>
                <button
                  onClick={() => { setActiveTab('kelola'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full \${
                    activeTab === 'kelola'
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                      : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-700 hover:text-white border border-emerald-700/50'
                  }\`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Kelola Data</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
`;

const startIndex = code.indexOf('{/* Navigation Tabs */}');
if (startIndex !== -1) {
  const newCode = code.substring(0, startIndex) + sidebarCode + "\n  );\n};\n";
  fs.writeFileSync('src/components/Navbar.tsx', newCode);
  console.log("Success");
} else {
  console.log("Could not find start index");
}
