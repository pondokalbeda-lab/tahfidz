const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace the Main Header Content and Navigation Tabs
const newMainContent = `      {/* Main Header Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex justify-between items-center w-full md:w-auto">
            {/* Logo & Title */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-white p-0.5 shadow-sm flex items-center justify-center">
                <div className="w-full h-full bg-slate-50 rounded-[10px] flex items-center justify-center">
                  <span className="text-emerald-800 font-bold text-xl">AF</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
                    Al-Furqon Tahfidz Center
                  </h1>
                </div>
                <p className="text-xs text-emerald-100 opacity-80 font-medium mt-0.5">
                  Sistem Monitoring Mutaba'ah & Absensi
                </p>
              </div>
            </div>
            {/* Hamburger Button (Mobile & Desktop) */}
            <button
              onClick={() => setIsTabsVisible(!isTabsVisible)}
              className="p-2 bg-emerald-900/50 hover:bg-emerald-700 text-emerald-100 rounded-lg border border-emerald-600/50 transition-colors md:hidden"
            >
              {isTabsVisible ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-emerald-900/40 p-2 rounded-xl border border-emerald-700/50 flex-grow md:max-w-md">
            <div className="px-3 py-1.5 text-center border-r border-emerald-700/50">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200/80 font-bold block">Total Santri</span>
              <span className="text-base sm:text-lg font-bold text-white">{totalSantri}</span>
            </div>
            <div className="px-3 py-1.5 text-center border-r border-emerald-700/50">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200/80 font-bold block">Setoran</span>
              <span className="text-base sm:text-lg font-bold text-white">{todaySetoranCount}</span>
            </div>
            <div className="px-3 py-1.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200/80 font-bold block">Kehadiran</span>
              <span className="text-base sm:text-lg font-bold text-white">{todayAttendancePercent}%</span>
            </div>
          </div>
          
          {/* Hamburger Button Desktop */}
          <button
            onClick={() => setIsTabsVisible(!isTabsVisible)}
            className="hidden md:flex p-2 bg-emerald-900/50 hover:bg-emerald-700 text-emerald-100 rounded-lg border border-emerald-600/50 transition-colors items-center space-x-2 ml-2"
          >
            {isTabsVisible ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-sm font-medium">{isTabsVisible ? 'Tutup Menu' : 'Menu'}</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        {isTabsVisible && (
          <div className="mt-5 pt-4 border-t border-emerald-700/50 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col sm:flex-row flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('absensi')}
                className={\`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none justify-center sm:justify-start \${
                  activeTab === 'absensi'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                }\`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Absensi Santri</span>
              </button>
              <button
                onClick={() => setActiveTab('mutabaah')}
                className={\`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none justify-center sm:justify-start \${
                  activeTab === 'mutabaah'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                }\`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Mutaba'ah Setoran</span>
              </button>
              <button
                onClick={() => setActiveTab('santri')}
                className={\`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none justify-center sm:justify-start \${
                  activeTab === 'santri'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                }\`}
              >
                <Users className="w-4 h-4" />
                <span>Data Santri & Raport</span>
              </button>
              <button
                onClick={() => setActiveTab('rekap')}
                className={\`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none justify-center sm:justify-start \${
                  activeTab === 'rekap'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                }\`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Rekapitulasi</span>
              </button>
              <button
                onClick={() => setActiveTab('kelola')}
                className={\`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex-1 sm:flex-none justify-center sm:justify-start \${
                  activeTab === 'kelola'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400 ring-offset-2 ring-offset-emerald-800'
                    : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-700 hover:text-white border border-emerald-700/50'
                }\`}
              >
                <Settings className="w-4 h-4" />
                <span>Kelola Data</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
`;

const matchStart = "{/* Main Header Content */}";
const startIndex = code.indexOf(matchStart);
if (startIndex !== -1) {
  const newCode = code.substring(0, startIndex) + newMainContent;
  fs.writeFileSync('src/components/Navbar.tsx', newCode);
  console.log("Success");
} else {
  console.log("Could not find start index");
}
