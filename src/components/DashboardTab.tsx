import React from 'react';
import { Users, BookOpen, UserCheck, Calendar, Activity } from 'lucide-react';
import { PesantrenInfo, Santri, AbsensiRecord, MutabaahRecord } from '../types';

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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Ikhtisar Hari Ini</h2>
        <p className="text-sm text-slate-500 mb-6">
          Ringkasan aktivitas mutaba'ah dan kehadiran santri untuk tanggal {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex items-center space-x-4">
            <div className="bg-emerald-500 p-3 rounded-lg text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-600">Total Santri</p>
              <h3 className="text-2xl font-bold text-emerald-900">{totalSantri}</h3>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 flex items-center space-x-4">
            <div className="bg-blue-500 p-3 rounded-lg text-white">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Setoran Selesai</p>
              <h3 className="text-2xl font-bold text-blue-900">{todaySetoranCount}</h3>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 flex items-center space-x-4">
            <div className="bg-amber-500 p-3 rounded-lg text-white">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600">Tingkat Kehadiran</p>
              <h3 className="text-2xl font-bold text-amber-900">{todayAttendancePercent}%</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
            <Activity className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Status Sistem</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
            <p className="text-sm text-slate-500 mb-1">Tahun Ajaran</p>
            <p className="font-semibold text-slate-800">{pesantrenInfo.tahunAjaran}</p>
          </div>
          <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
            <p className="text-sm text-slate-500 mb-1">Semester</p>
            <p className="font-semibold text-slate-800">{pesantrenInfo.semester}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
