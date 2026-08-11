const fs = require('fs');

const navbarCode = `import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  UserCheck,
  Users,
  BarChart3,
  Settings,
  Calendar,
  Building2,
  Moon,
  Sun,
  RefreshCw,
  Menu,
  LayoutDashboard,
  X
} from 'lucide-react';
import { PesantrenInfo } from '../types';

interface NavbarProps {
  pesantrenInfo: PesantrenInfo;
  activeTab: 'dashboard' | 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola';
  setActiveTab: (tab: 'dashboard' | 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
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
  toggleDarkMode,
}) => {
  const [isTabsVisible, setIsTabsVisible] = useState(false);

  // Close sidebar if window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsTabsVisible(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="w-7 h-7 rounded bg-white p-0.5 shadow-sm flex items-center justify-center hidden sm:flex">
              <div className="w-full h-full bg-slate-50 rounded-[3px] flex items-center justify-center">
                <span className="text-emerald-800 font-bold text-xs">AF</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white leading-tight flex items-center gap-1 max-w-[180px] sm:max-w-md">
                <Building2 className="w-3.5 h-3.5 text-emerald-300 sm:hidden flex-shrink-0" />
                <span className="truncate">{pesantrenInfo.nama || 'Al-Furqon Tahfidz'}</span>
              </h1>
            </div>
          </div>

          {/* Right: Controls & Menu */}
          <div className="flex items-center space-x-0.5 sm:space-x-2">
            
            <button
              onClick={onRefreshData}
              title="Refresh Data"
              className="p-1.5 hover:bg-emerald-700 rounded transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-emerald-100" />
            </button>
            
            <button
              onClick={toggleDarkMode}
              title="Toggle Dark Mode"
              className="p-1.5 hover:bg-emerald-700 rounded transition-colors"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-emerald-100" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-100" />
              )}
            </button>

            {/* Hamburger Button - Pushed to the corner */}
            <button
              onClick={() => setIsTabsVisible(true)}
              className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded transition-colors flex items-center justify-center ml-0.5"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Secondary Info Row (Date & TA) */}
        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-emerald-700/50">
           <span className="text-[10px] sm:text-xs text-emerald-200 font-medium">TA {pesantrenInfo.tahunAjaran} ({pesantrenInfo.semester})</span>
           <div className="flex items-center space-x-1 bg-emerald-900/50 px-1.5 py-0.5 rounded border border-emerald-700/50 text-emerald-100">
              <Calendar className="w-3 h-3" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-[10px] sm:text-xs text-white focus:outline-none cursor-pointer max-w-[100px]"
              />
            </div>
        </div>
      </div>

      {/* Navigation Drawer (Sidebar) */}
      {isTabsVisible && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsTabsVisible(false)}
          ></div>
          
          {/* Sidebar Content */}
          <div className="relative w-64 max-w-[80vw] h-full bg-white border-l border-slate-200 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col text-slate-800">
            <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <span className="font-bold text-slate-800 text-sm">Menu Navigasi</span>
              <button 
                onClick={() => setIsTabsVisible(false)}
                className="p-1.5 bg-slate-200 hover:bg-slate-300 rounded-md text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => { setActiveTab('dashboard'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all w-full \${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }\`}
                >
                  <LayoutDashboard className={\`w-4 h-4 \${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}\`} />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => { setActiveTab('absensi'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all w-full \${
                    activeTab === 'absensi'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }\`}
                >
                  <UserCheck className={\`w-4 h-4 \${activeTab === 'absensi' ? 'text-emerald-600' : 'text-slate-400'}\`} />
                  <span>Absensi Santri</span>
                </button>
                <button
                  onClick={() => { setActiveTab('mutabaah'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all w-full \${
                    activeTab === 'mutabaah'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }\`}
                >
                  <BookOpen className={\`w-4 h-4 \${activeTab === 'mutabaah' ? 'text-emerald-600' : 'text-slate-400'}\`} />
                  <span>Mutaba'ah Setoran</span>
                </button>
                <button
                  onClick={() => { setActiveTab('santri'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all w-full \${
                    activeTab === 'santri'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }\`}
                >
                  <Users className={\`w-4 h-4 \${activeTab === 'santri' ? 'text-emerald-600' : 'text-slate-400'}\`} />
                  <span>Data Santri & Raport</span>
                </button>
                <button
                  onClick={() => { setActiveTab('rekap'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all w-full \${
                    activeTab === 'rekap'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }\`}
                >
                  <BarChart3 className={\`w-4 h-4 \${activeTab === 'rekap' ? 'text-emerald-600' : 'text-slate-400'}\`} />
                  <span>Rekapitulasi</span>
                </button>
                
                <div className="my-1 border-t border-slate-100"></div>
                
                <button
                  onClick={() => { setActiveTab('kelola'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all w-full \${
                    activeTab === 'kelola'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }\`}
                >
                  <Settings className={\`w-4 h-4 \${activeTab === 'kelola' ? 'text-white' : 'text-slate-500'}\`} />
                  <span>Kelola Data & Sync</span>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
`;

fs.writeFileSync('src/components/Navbar.tsx', navbarCode);
