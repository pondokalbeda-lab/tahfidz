import React, { useState } from 'react';
import { PesantrenInfo } from '../types';
import { 
  Calendar, 
  LayoutDashboard, 
  UserCheck, 
  BookOpen, 
  Users, 
  Menu, 
  X, 
  BarChart3, 
  RefreshCw, 
  Sun, 
  Moon, 
  Sliders, 
  Settings, 
  Cloud,
  Loader2
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
  cloudStatus?: 'synced' | 'syncing' | 'offline' | 'error';
  lastSyncTime?: string;
  onSyncCloud?: () => void;
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
  cloudStatus = 'synced',
  lastSyncTime = '',
  onSyncCloud
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const mainNavItems = [
    { id: 'absensi', icon: UserCheck, label: 'Presensi' },
    { id: 'mutabaah', icon: BookOpen, label: "Mutaba'ah" },
    { id: 'rekap', icon: BarChart3, label: 'Rekapitulasi' },
    { id: 'santri', icon: Users, label: 'Santri & Raport' },
    { id: 'pengaturan', icon: Sliders, label: 'Pengaturan' },
    { id: 'kelola', icon: Cloud, label: 'Cloud & Backup' }
  ];

  const handleRefreshClick = () => {
    setIsSpinning(true);
    onRefreshData();
    setTimeout(() => setIsSpinning(false), 900);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Left: Institution Logo & Name */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group py-1 min-w-0 flex-1 mr-2" 
            onClick={() => setActiveTab('absensi')}
            title="Pesantren Tahfidz Al-Furqon"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-emerald-500/30 dark:border-emerald-500/40 flex-shrink-0 bg-white shadow-2xs p-0.5">
              <img 
                src="/assets/aistudio/WhatsApp_Image_2026-10-29_at_08.20.28_3984ba02.jpeg" 
                alt="Logo Pesantren Tahfidz Al-Furqon" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center space-x-1.5 min-w-0">
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight truncate">
                  {pesantrenInfo.nama || 'Pesantren Tahfidz Al-Furqon'}
                </h1>
                <span className="hidden md:inline-block text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded shrink-0">
                  Tahfidz
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                TA {pesantrenInfo.tahunAjaran || '2024/2025'} · {pesantrenInfo.semester || 'Ganjil'}
              </p>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar (Large screens only) */}
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
            {mainNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  type="button"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Controls & Widgets (Collision-Proof on all mobile viewports, never cut off) */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            
            {/* Integrated Date Widget (Hidden on narrow mobile to prevent clipping, available inside each tab & menu) */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-[10px] sm:text-xs text-slate-800 dark:text-slate-200 font-semibold focus:outline-none cursor-pointer w-[86px] sm:w-[115px] p-0"
                title="Pilih Tanggal Mutaba'ah & Presensi"
              />
            </div>

            {/* Cloud Database Interactive Status Button */}
            <button 
              onClick={onSyncCloud || handleRefreshClick}
              type="button"
              className={`flex items-center space-x-1 p-2 sm:px-2.5 sm:py-1.5 rounded-xl border text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer ${
                cloudStatus === 'syncing'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                  : cloudStatus === 'synced'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300/80 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 hover:bg-rose-100'
              }`}
              title={
                cloudStatus === 'syncing'
                  ? 'Sedang menyinkronkan data dengan Google Spreadsheet...'
                  : cloudStatus === 'synced'
                  ? `Terhubung ke Spreadsheet${lastSyncTime ? ` (${lastSyncTime})` : ''}. Klik untuk tarik data.`
                  : 'Koneksi terputus. Klik untuk coba lagi.'
              }
            >
              {cloudStatus === 'syncing' ? (
                <Loader2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin shrink-0" />
              ) : (
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cloudStatus === 'synced' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              )}
              <Cloud className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">
                {cloudStatus === 'syncing' 
                  ? 'Sinkron' 
                  : cloudStatus === 'synced' 
                  ? (lastSyncTime ? `${lastSyncTime}` : 'Cloud DB') 
                  : 'Offline'}
              </span>
            </button>

            {/* Quick Refresh Button (Hidden on ultra-narrow, accessible inside dropdown menu too) */}
            <button
              onClick={handleRefreshClick}
              type="button"
              title="Tarik Data Terbaru dari Database Google Sheets"
              className="hidden sm:flex p-1.5 sm:p-2 text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg sm:rounded-xl transition-all cursor-pointer border border-slate-200/60 dark:border-slate-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSpinning || cloudStatus === 'syncing' ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
            
            {/* Dark Mode Toggle (Hidden on mobile, accessible inside dropdown menu too) */}
            <button
              onClick={toggleDarkMode}
              type="button"
              title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              className="hidden sm:flex p-1.5 sm:p-2 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg sm:rounded-xl transition-all cursor-pointer border border-slate-200/60 dark:border-slate-800"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Mobile & Tablet Dedicated Hamburger Menu Button (Selalu utuh, tidak pernah terpotong) */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              type="button"
              className={`flex items-center justify-center p-2 sm:px-3 sm:py-1.5 rounded-xl shadow-xs transition-all cursor-pointer font-bold text-xs shrink-0 ${
                isDrawerOpen
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-400'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white border border-emerald-500'
              }`}
              title={isDrawerOpen ? 'Tutup Menu Tab' : 'Buka Pilihan Tab Menu'}
              aria-label="Pilihan Tab"
              aria-expanded={isDrawerOpen}
            >
              {isDrawerOpen ? (
                <X className="w-4 h-4 shrink-0" />
              ) : (
                <Menu className="w-4 h-4 shrink-0" />
              )}
              <span className="hidden sm:inline ml-1.5 text-xs font-bold">
                {isDrawerOpen ? 'Tutup Tab' : 'Pilihan Tab'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Downward Menu Dropdown (Panjang ke Bawah, Menu Beneran) */}
      {isDrawerOpen && (
        <div className="xl:hidden border-t border-slate-200/90 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 max-h-[82vh] overflow-y-auto scrollbar-thin">
            
            {/* Menu Header with App Info */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Pilihan Menu Navigasi
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                {totalSantri} Santri Terdaftar
              </span>
            </div>

            {/* Downward Stacked Navigation Tab Buttons */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mainNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                
                const meta = {
                  absensi: { desc: 'Presensi 4 sesi harian santri', badge: `${todayAttendancePercent}% Hadir` },
                  mutabaah: { desc: 'Input ziyadah, muraja\'ah & tasmi\'', badge: `${todaySetoranCount} Setoran` },
                  santri: { desc: 'Pencapaian setoran & raport', badge: `${totalSantri} Santri` },
                  rekap: { desc: 'Peringkat santri berdasar jumlah setoran', badge: 'Ranking' },
                  pengaturan: { desc: 'Kelola halaqah & ustadz pengampu', badge: 'Kelola' },
                  kelola: { desc: 'Sinkronisasi database Google Sheets', badge: 'Database' }
                }[item.id as keyof typeof meta] || { desc: '', badge: '' };

                return (
                  <button
                    key={item.id}
                    onClick={() => { 
                      setActiveTab(item.id); 
                      setIsDrawerOpen(false); 
                    }}
                    type="button"
                    className={`flex items-center justify-between p-3 rounded-2xl text-left transition-all w-full cursor-pointer border ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/25 ring-2 ring-emerald-400/40'
                        : 'bg-slate-50/80 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200/80 dark:border-slate-700/60 hover:bg-emerald-50/60 dark:hover:bg-slate-800 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        <Icon className="w-4 h-4 shrink-0" />
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs font-bold block truncate ${isActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {item.label}
                        </span>
                        <span className={`text-[10px] block truncate ${isActive ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                          {meta.desc}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ml-2 ${
                      isActive 
                        ? 'bg-white/25 text-white' 
                        : 'bg-white dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-600'
                    }`}>
                      {meta.badge}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions & Utility Tools (Panjang ke bawah dengan rapi) */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {/* Mobile Date Selector */}
              <div className="flex sm:hidden items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-xs">
                <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Tanggal:</span>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-white dark:bg-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Dark Mode in Dropdown Menu */}
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition cursor-pointer"
                >
                  {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-500" />}
                  <span className="text-[11px]">{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                </button>

                {/* Refresh in Dropdown Menu */}
                <button
                  type="button"
                  onClick={() => {
                    handleRefreshClick();
                    setIsDrawerOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-750 transition cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span className="text-[11px]">Tarik Data DB</span>
                </button>
              </div>

              {/* Status and Direct Sync link */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700/70 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${cloudStatus === 'synced' ? 'bg-emerald-500 animate-pulse' : cloudStatus === 'syncing' ? 'bg-amber-500 animate-spin' : 'bg-rose-500'}`} />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Status Database:</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onSyncCloud) onSyncCloud();
                    else onRefreshData();
                    setIsDrawerOpen(false);
                  }}
                  className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer flex items-center space-x-1"
                >
                  <span>{cloudStatus === 'syncing' ? 'Menyinkronkan...' : cloudStatus === 'synced' ? (lastSyncTime ? `Tersinkron (${lastSyncTime})` : 'Tersinkron Online') : 'Klik Hubungkan'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
