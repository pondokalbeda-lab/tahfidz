import React from 'react';
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
  RefreshCw
} from 'lucide-react';
import { PesantrenInfo } from '../types';

interface NavbarProps {
  pesantrenInfo: PesantrenInfo;
  activeTab: 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola';
  setActiveTab: (tab: 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola') => void;
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

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-emerald-900/40 p-2 rounded-xl border border-emerald-700/50">
            <div className="px-3 py-1.5 text-center border-r border-emerald-700/50">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200/80 font-bold block">Total Santri</span>
              <span className="text-base sm:text-lg font-bold text-white">{totalSantri}</span>
            </div>
            <div className="px-3 py-1.5 text-center border-r border-emerald-700/50">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200/80 font-bold block">Setoran Hari Ini</span>
              <span className="text-base sm:text-lg font-bold text-white">{todaySetoranCount}</span>
            </div>
            <div className="px-3 py-1.5 text-center">
              <span className="text-[10px] uppercase tracking-wider text-emerald-200/80 font-bold block">Kehadiran</span>
              <span className="text-base sm:text-lg font-bold text-white">{todayAttendancePercent}%</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 mt-5 border-t border-emerald-700 pt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('absensi')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'absensi'
                ? 'bg-slate-50 text-emerald-800 font-bold'
                : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Absensi Santri</span>
          </button>

          <button
            onClick={() => setActiveTab('mutabaah')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'mutabaah'
                ? 'bg-slate-50 text-emerald-800 font-bold'
                : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Mutaba'ah Setoran</span>
          </button>

          <button
            onClick={() => setActiveTab('santri')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'santri'
                ? 'bg-slate-50 text-emerald-800 font-bold'
                : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Data Santri & Raport</span>
          </button>

          <button
            onClick={() => setActiveTab('rekap')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'rekap'
                ? 'bg-slate-50 text-emerald-800 font-bold'
                : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Rekap & Ranking</span>
          </button>

          <button
            onClick={() => setActiveTab('kelola')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'kelola'
                ? 'bg-slate-50 text-emerald-800 font-bold'
                : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan Data</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
