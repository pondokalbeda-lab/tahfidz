import React from 'react';
import { 
  UserCheck, 
  BookOpen, 
  Users, 
  BarChart3, 
  Sliders,
  Database
} from 'lucide-react';

interface NavigationTabBarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  totalSantri?: number;
  todaySetoranCount?: number;
  todayAttendancePercent?: number;
}

export const NavigationTabBar: React.FC<NavigationTabBarProps> = ({
  activeTab,
  setActiveTab,
  totalSantri = 0,
  todaySetoranCount = 0,
  todayAttendancePercent = 100
}) => {
  const tabs = [
    { 
      id: 'absensi', 
      icon: UserCheck, 
      label: 'Presensi Santri', 
      desc: 'Kehadiran 4 Sesi Harian',
      badge: `${todayAttendancePercent}% Hadir`
    },
    { 
      id: 'mutabaah', 
      icon: BookOpen, 
      label: "Mutaba'ah", 
      desc: 'Ziyadah & Muraja\'ah',
      badge: `${todaySetoranCount} Setoran`
    },
    { 
      id: 'rekap', 
      icon: BarChart3, 
      label: 'Rekapitulasi', 
      desc: 'Rekap Jumlah Hafalan',
      badge: 'Hafalan'
    },
    { 
      id: 'santri', 
      icon: Users, 
      label: 'Data Santri', 
      desc: 'Pencapaian Setoran & Raport',
      badge: `${totalSantri} Santri`
    },
    { 
      id: 'pengaturan', 
      icon: Sliders, 
      label: 'Pengaturan', 
      desc: 'Halaqah & Pengampu',
      badge: 'Kelola'
    },
    { 
      id: 'kelola', 
      icon: Database, 
      label: 'Cloud & Backup', 
      desc: 'Sinkron Spreadsheet',
      badge: 'Database'
    }
  ];

  return (
    <div className="hidden lg:block w-full bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors py-3 sm:py-4">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Prominent Large Navigation Menu Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`relative flex flex-col justify-between p-3 sm:p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer group shadow-2xs ${
                  isActive
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/15 ring-2 ring-emerald-500/30 dark:ring-emerald-400/20 transform -translate-y-0.5'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/60 hover:shadow-sm'
                }`}
              >
                {/* Top Row: Icon Container and Badge */}
                <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white shadow-inner'
                        : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md truncate max-w-[85px] sm:max-w-none ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </div>

                {/* Bottom Row: Label & Subtext */}
                <div>
                  <h3
                    className={`font-bold text-xs sm:text-sm tracking-tight truncate ${
                      isActive ? 'text-white' : 'text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                    }`}
                  >
                    {tab.label}
                  </h3>
                  <p
                    className={`text-[10px] sm:text-[11px] truncate mt-0.5 ${
                      isActive ? 'text-emerald-100' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {tab.desc}
                  </p>
                </div>

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-white/70 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
