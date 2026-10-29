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
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'absensi', icon: UserCheck, label: 'Presensi' },
    { id: 'mutabaah', icon: BookOpen, label: "Mutaba'ah" },
    { id: 'santri', icon: Users, label: 'Santri & Raport' },
    { id: 'rekap', icon: BarChart3, label: 'Rekapitulasi' },
    { id: 'pengaturan', icon: Sliders, label: 'Pengaturan' }
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
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group py-1 min-w-0 shrink" 
            onClick={() => setActiveTab('dashboard')}
            title="Kembali ke Dashboard"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-emerald-500/30 dark:border-emerald-500/40 flex-shrink-0 bg-white shadow-2xs p-0.5">
              <img 
                src="/assets/aistudio/WhatsApp_Image_2026-10-29_at_08.20.28_3984ba02.jpeg" 
                alt="Logo Pesantren Tahfidz Al-Furqon" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-tight truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[300px]">
                  {pesantrenInfo.nama || 'Pesantren Tahfidz Al-Furqon'}
                </h1>
                <span className="hidden md:inline-block text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-1.5 py-0.2 rounded shrink-0">
                  Tahfidz
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-[260px]">
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

          {/* Right: Controls & Widgets (Collision-Proof) */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
            
            {/* Integrated Date Widget (Compact & Adaptive) */}
            <div className="flex items-center space-x-1 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 transition-colors">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none text-[11px] sm:text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer w-[100px] sm:w-[115px]"
                title="Pilih Tanggal Mutaba'ah & Absensi"
              />
            </div>

            {/* Cloud Database Interactive Status Button */}
            <button 
              onClick={onSyncCloud || handleRefreshClick}
              type="button"
              className={`flex items-center space-x-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl border text-[11px] font-medium transition-all cursor-pointer ${
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
                  ? `Terhubung ke Google Spreadsheet Database${lastSyncTime ? ` (Sinkron: ${lastSyncTime})` : ''}. Klik untuk tarik data.`
                  : 'Koneksi Spreadsheet terputus. Klik untuk coba lagi.'
              }
            >
              {cloudStatus === 'syncing' ? (
                <Loader2 className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-spin shrink-0" />
              ) : (
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cloudStatus === 'synced' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              )}
              <Cloud className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">
                {cloudStatus === 'syncing' 
                  ? 'Sinkron' 
                  : cloudStatus === 'synced' 
                  ? (lastSyncTime ? `${lastSyncTime}` : 'Cloud DB') 
                  : 'Offline'}
              </span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={handleRefreshClick}
              type="button"
              title="Tarik Data Terbaru dari Database Google Sheets"
              className="p-1.5 sm:p-2 text-slate-600 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg sm:rounded-xl transition-all cursor-pointer border border-slate-200/60 dark:border-slate-800"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isSpinning || cloudStatus === 'syncing' ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              type="button"
              title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              className="p-1.5 sm:p-2 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg sm:rounded-xl transition-all cursor-pointer border border-slate-200/60 dark:border-slate-800"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>

            {/* Mobile / Tablet Drawer Toggle */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              type="button"
              className="xl:hidden p-1.5 sm:p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg sm:rounded-xl transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Buka Menu Lengkap"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end xl:hidden">
          <div 
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 bg-white flex-shrink-0">
                  <img 
                    src="/assets/aistudio/WhatsApp_Image_2026-10-29_at_08.20.28_3984ba02.jpeg" 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">Menu Tahfidz</span>
                  <span className="text-[10px] text-slate-500">Al-Furqon System</span>
                </div>
              </div>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                type="button"
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsDrawerOpen(false); }}
                  type="button"
                  className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              ))}
              
              <div className="my-3 border-t border-slate-100 dark:border-slate-800" />
              
              <button
                onClick={() => { setActiveTab('kelola'); setIsDrawerOpen(false); }}
                type="button"
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left cursor-pointer ${
                  activeTab === 'kelola'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Backup & Sinkronisasi</span>
              </button>
            </nav>

            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 space-y-2">
              <div className="flex items-center justify-between">
                <span>Total Santri Terdaftar:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{totalSantri} Santri</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database Cloud:</span>
                <button
                  onClick={() => {
                    if (onSyncCloud) onSyncCloud();
                    else onRefreshData();
                    setIsDrawerOpen(false);
                  }}
                  type="button"
                  className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1.5 hover:underline cursor-pointer"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cloudStatus === 'synced' ? 'bg-emerald-500' : cloudStatus === 'syncing' ? 'bg-amber-500 animate-spin' : 'bg-rose-500'} inline-block`} />
                  <span>{cloudStatus === 'syncing' ? 'Sinkron...' : cloudStatus === 'synced' ? 'Tersambung (Tarik)' : 'Offline (Klik)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
