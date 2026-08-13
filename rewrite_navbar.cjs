const fs = require('fs');

let code = `import React, { useState } from 'react';
import { PesantrenInfo } from '../types';
import { 
  Building2, 
  Calendar, 
  LayoutDashboard, 
  UserCheck, 
  BookOpen, 
  Users, 
  Settings, 
  Menu, 
  X,
  BarChart3,
  RefreshCw,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  pesantrenInfo: PesantrenInfo;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  totalSantri: number;
  todaySetoranCount: number;
  todayAttendancePercent: number;
  onRefreshData: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  pesantrenInfo,
  activeTab,
  setActiveTab,
  selectedDate,
  setSelectedDate,
  onRefreshData,
  darkMode,
  toggleDarkMode
}) => {
  const [isTabsVisible, setIsTabsVisible] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 transition-colors dark:bg-slate-900 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center dark:bg-emerald-900/30 dark:border-emerald-800">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">AF</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight truncate max-w-[200px] sm:max-w-md">
                {pesantrenInfo.nama || 'Al-Furqon'}
              </h1>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate max-w-[200px] sm:max-w-md">
                TA {pesantrenInfo.tahunAjaran} ({pesantrenInfo.semester})
              </span>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Date Picker */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={onRefreshData}
              title="Refresh Data"
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <button
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Menu Toggle */}
            <button
              onClick={() => setIsTabsVisible(true)}
              className="p-2 bg-slate-900 text-white dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 rounded-lg transition-colors flex items-center"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Mobile Date Picker (visible only on small screens) */}
        <div className="sm:hidden flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tanggal Mutaba'ah:</span>
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
            <Calendar className="w-3 h-3 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Navigation Drawer */}
      {isTabsVisible && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsTabsVisible(false)}
          />
          <div className="relative w-64 max-w-[80vw] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Menu Navigasi</span>
              <button 
                onClick={() => setIsTabsVisible(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { id: 'absensi', icon: UserCheck, label: 'Absensi Santri' },
                { id: 'mutabaah', icon: BookOpen, label: 'Mutaba\\'ah Setoran' },
                { id: 'santri', icon: Users, label: 'Data Santri & Raport' },
                { id: 'rekap', icon: BarChart3, label: 'Rekapitulasi' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full \${
                    activeTab === item.id
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }\`}
                >
                  <item.icon className={\`w-4 h-4 \${activeTab === item.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}\`} />
                  <span>{item.label}</span>
                </button>
              ))}
              
              <div className="my-4 border-t border-slate-100 dark:border-slate-800"></div>
              
              <button
                onClick={() => { setActiveTab('kelola'); setIsTabsVisible(false); }}
                className={\`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all w-full \${
                  activeTab === 'kelola'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                }\`}
              >
                <Settings className={\`w-4 h-4 \${activeTab === 'kelola' ? 'text-white dark:text-slate-900' : 'text-slate-500'}\`} />
                <span>Kelola Data & Sync</span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
`;

fs.writeFileSync('src/components/Navbar.tsx', code);
