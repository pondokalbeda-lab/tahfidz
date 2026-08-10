import React, { useState } from 'react';
import {
  BookOpen,
  UserCheck,
  Users,
  BarChart3,
  Settings,
  Calendar,
  Sparkles,
  Download,
  Building2,
  Moon,
  Sun,
  RefreshCw,
  ChevronDown,
  ChevronUp
,
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
  totalSantri,
  todaySetoranCount,
  todayAttendancePercent,
  onRefreshData,
  darkMode,
  toggleDarkMode,
}) => {
  const [isTabsVisible, setIsTabsVisible] = useState(false);

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-30">
      {/* Top Banner / Islamic Aesthetic Accent */}
      <div className="bg-emerald-900/30 px-4 py-2 text-xs text-emerald-100 flex flex-wrap justify-between items-center border-b border-emerald-700/50">
        <div className="flex items-center space-x-2 font-medium">
          <Building2 className="w-4 h-4 text-emerald-300" />
          <span>{pesantrenInfo.nama}</span>
          <span className="opacity-60">•</span>
          <span className="hidden sm:inline opacity-90">{pesantrenInfo.lembaga}</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
          <span className="hidden sm:inline-flex bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold tracking-wide text-emerald-200">
            TA {pesantrenInfo.tahunAjaran} ({pesantrenInfo.semester})
          </span>
          <div className="flex items-center space-x-1.5 bg-slate-900/50 px-2 py-0.5 rounded text-emerald-200">
            <Calendar className="w-3.5 h-3.5" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-xs text-white focus:outline-none cursor-pointer"
            />
          </div>
          
          <button
            onClick={onRefreshData}
            title="Refresh Data"
            className="p-1 hover:bg-emerald-700 rounded-full transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-emerald-200" />
          </button>
          
          <button
            onClick={toggleDarkMode}
            title="Toggle Dark Mode"
            className="p-1 hover:bg-emerald-700 rounded-full transition-colors"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-emerald-200" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-200" />
            )}
          </button>
        </div>
      </div>

            {/* Main Header Content */}
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

          {/* Hamburger Button Desktop */}
          <button
            onClick={() => setIsTabsVisible(!isTabsVisible)}
            className="hidden md:flex p-2 bg-emerald-900/50 hover:bg-emerald-700 text-emerald-100 rounded-lg border border-emerald-600/50 transition-colors items-center space-x-2 ml-2"
          >
            {isTabsVisible ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            <span className="text-sm font-medium">{isTabsVisible ? 'Tutup Menu' : 'Menu'}</span>
          </button>
        </div>

        
      </div>
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
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => { setActiveTab('absensi'); setIsTabsVisible(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full ${
                    activeTab === 'absensi'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Absensi Santri</span>
                </button>
                <button
                  onClick={() => { setActiveTab('mutabaah'); setIsTabsVisible(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full ${
                    activeTab === 'mutabaah'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>Mutaba'ah Setoran</span>
                </button>
                <button
                  onClick={() => { setActiveTab('santri'); setIsTabsVisible(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full ${
                    activeTab === 'santri'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Data Santri & Raport</span>
                </button>
                <button
                  onClick={() => { setActiveTab('rekap'); setIsTabsVisible(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full ${
                    activeTab === 'rekap'
                      ? 'bg-white text-emerald-800 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>Rekapitulasi</span>
                </button>
                <div className="my-2 border-t border-emerald-700/50"></div>
                <button
                  onClick={() => { setActiveTab('kelola'); setIsTabsVisible(false); }}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors w-full ${
                    activeTab === 'kelola'
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                      : 'bg-emerald-900/40 text-emerald-100 hover:bg-emerald-700 hover:text-white border border-emerald-700/50'
                  }`}
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

  );
};
