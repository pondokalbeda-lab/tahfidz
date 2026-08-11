const fs = require('fs');

const navbarCode = `import React, { useState } from 'react';
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
  totalSantri: number;
  todaySetoranCount: number;
  todayAttendancePercent: number;
  onRefreshData: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onQuickPrintRaport?: () => void;
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

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          
          {/* Left: Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white p-0.5 shadow-sm flex items-center justify-center hidden sm:flex">
              <div className="w-full h-full bg-slate-50 rounded-md flex items-center justify-center">
                <span className="text-emerald-800 font-bold text-lg">AF</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-tight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-300 sm:hidden" />
                {pesantrenInfo.nama || 'Al-Furqon Tahfidz'}
              </h1>
              <p className="text-xs text-emerald-100 opacity-80 font-medium mt-0.5 hidden sm:block">
                Sistem Monitoring Mutaba'ah & Absensi
              </p>
            </div>
          </div>

          {/* Right: Controls & Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Date Picker */}
            <div className="flex items-center space-x-1.5 bg-emerald-900/50 px-2 py-1.5 rounded-lg border border-emerald-700/50 text-emerald-100 hidden sm:flex">
              <Calendar className="w-4 h-4" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
              />
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center space-x-1">
              <button
                onClick={onRefreshData}
                title="Refresh Data"
                className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-emerald-100" />
              </button>
              
              <button
                onClick={toggleDarkMode}
                title="Toggle Dark Mode"
                className="p-2 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-emerald-100" />
                ) : (
                  <Moon className="w-4 h-4 text-emerald-100" />
                )}
              </button>
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsTabsVisible(true)}
              className="p-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg border border-emerald-500/50 transition-colors flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Mobile Date Picker (shows below on small screens) */}
        <div className="flex sm:hidden items-center justify-between mt-3 pt-3 border-t border-emerald-700/50">
           <span className="text-xs text-emerald-200">TA {pesantrenInfo.tahunAjaran} ({pesantrenInfo.semester})</span>
           <div className="flex items-center space-x-1.5 bg-emerald-900/50 px-2 py-1 rounded-lg border border-emerald-700/50 text-emerald-100">
              <Calendar className="w-3.5 h-3.5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
              />
            </div>
        </div>
      </div>

      {/* Navigation Drawer (Sidebar) */}
      {isTabsVisible && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setIsTabsVisible(false)}
          ></div>
          
          {/* Sidebar Content */}
          <div className="relative w-72 max-w-[85vw] h-full bg-white border-l border-slate-200 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col text-slate-800">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-md">
              <span className="font-bold text-slate-800">Menu Navigasi</span>
              <button 
                onClick={() => setIsTabsVisible(false)}
                className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => { setActiveTab('dashboard'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all w-full \${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }\`}
                >
                  <LayoutDashboard className={\`w-5 h-5 \${activeTab === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}\`} />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => { setActiveTab('absensi'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all w-full \${
                    activeTab === 'absensi'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }\`}
                >
                  <UserCheck className={\`w-5 h-5 \${activeTab === 'absensi' ? 'text-emerald-600' : 'text-slate-400'}\`} />
                  <span>Absensi Santri</span>
                </button>
                <button
                  onClick={() => { setActiveTab('mutabaah'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all w-full \${
                    activeTab === 'mutabaah'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }\`}
                >
                  <BookOpen className={\`w-5 h-5 \${activeTab === 'mutabaah' ? 'text-emerald-600' : 'text-slate-400'}\`} />
                  <span>Mutaba'ah Setoran</span>
                </button>
                <button
                  onClick={() => { setActiveTab('santri'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all w-full \${
                    activeTab === 'santri'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }\`}
                >
                  <Users className={\`w-5 h-5 \${activeTab === 'santri' ? 'text-emerald-600' : 'text-slate-400'}\`} />
                  <span>Data Santri & Raport</span>
                </button>
                <button
                  onClick={() => { setActiveTab('rekap'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all w-full \${
                    activeTab === 'rekap'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }\`}
                >
                  <BarChart3 className={\`w-5 h-5 \${activeTab === 'rekap' ? 'text-emerald-600' : 'text-slate-400'}\`} />
                  <span>Rekapitulasi</span>
                </button>
                
                <div className="my-3 border-t border-slate-100"></div>
                
                <button
                  onClick={() => { setActiveTab('kelola'); setIsTabsVisible(false); }}
                  className={\`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all w-full \${
                    activeTab === 'kelola'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }\`}
                >
                  <Settings className={\`w-5 h-5 \${activeTab === 'kelola' ? 'text-white' : 'text-slate-500'}\`} />
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
