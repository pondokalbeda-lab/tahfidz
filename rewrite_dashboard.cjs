const fs = require('fs');

let code = `import React from 'react';
import { Users, BookOpen, UserCheck, Activity } from 'lucide-react';
import { PesantrenInfo } from '../types';

interface DashboardTabProps {
  pesantrenInfo: PesantrenInfo;
  totalSantri: number;
  todaySetoranCount: number;
  todayAttendancePercent: number;
  selectedDate: string;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  pesantrenInfo,
  totalSantri,
  todaySetoranCount,
  todayAttendancePercent,
  selectedDate,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div>
        <h2 className="text-xl font-bold text-slate-900">Ikhtisar Hari Ini</h2>
        <p className="text-sm text-slate-500 mt-1">
          Ringkasan aktivitas untuk {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900">{totalSantri}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Total Santri</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900">{todaySetoranCount}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Setoran Selesai</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-900">{todayAttendancePercent}%</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">Tingkat Kehadiran</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-slate-50 p-2 rounded-lg">
            <Activity className="w-4 h-4 text-slate-500" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Status Sistem & Informasi</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Tahun Ajaran</p>
            <p className="font-semibold text-slate-800">{pesantrenInfo.tahunAjaran || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Semester</p>
            <p className="font-semibold text-slate-800">{pesantrenInfo.semester || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/DashboardTab.tsx', code);
