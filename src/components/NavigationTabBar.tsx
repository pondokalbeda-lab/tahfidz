import React from 'react';
import { 
  LayoutDashboard, 
  UserCheck, 
  BookOpen, 
  Users, 
  BarChart3, 
  Sliders
} from 'lucide-react';

interface NavigationTabBarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export const NavigationTabBar: React.FC<NavigationTabBarProps> = ({
  activeTab,
  setActiveTab
}) => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'absensi', icon: UserCheck, label: 'Presensi' },
    { id: 'mutabaah', icon: BookOpen, label: "Mutaba'ah" },
    { id: 'santri', icon: Users, label: 'Santri & Raport' },
    { id: 'rekap', icon: BarChart3, label: 'Rekapitulasi' },
    { id: 'pengaturan', icon: Sliders, label: 'Pengaturan' }
  ];

  return (
    <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-15 sm:top-16 z-30 transition-colors shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
        {/* Horizontal scrollable tab list with clean smooth pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`flex items-center space-x-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs scale-[1.01]'
                    : 'bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
