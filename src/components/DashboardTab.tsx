import React from 'react';
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  BookmarkCheck
} from 'lucide-react';
import { PesantrenInfo, Halaqah, Santri, MutabaahRecord, AbsensiRecord } from '../types';

interface DashboardTabProps {
  pesantrenInfo: PesantrenInfo;
  totalSantri: number;
  todaySetoranCount: number;
  todayAttendancePercent: number;
  selectedDate: string;
  halaqahList?: Halaqah[];
  santriList?: Santri[];
  mutabaahRecords?: MutabaahRecord[];
  absensiRecords?: AbsensiRecord[];
  onNavigate?: (tab: string) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  pesantrenInfo,
  totalSantri,
  todaySetoranCount,
  todayAttendancePercent,
  selectedDate,
  halaqahList = [],
  santriList = [],
  mutabaahRecords = [],
  absensiRecords = [],
  onNavigate
}) => {
  // Current date formatting
  const formattedDate = new Date(selectedDate).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Calculate current active session based on real clock
  const currentHour = new Date().getHours();
  let currentSessionName = 'Subuh';
  let currentSessionDescription = 'Ziyadah (Hafalan Baru)';
  if (currentHour >= 15 && currentHour < 18) {
    currentSessionName = 'Ashar';
    currentSessionDescription = "Muraja'ah Kubra";
  } else if (currentHour >= 18 && currentHour < 21) {
    currentSessionName = 'Maghrib';
    currentSessionDescription = "Tasmi' & Mandiri";
  } else if (currentHour >= 21 || currentHour < 4) {
    currentSessionName = 'Malam';
    currentSessionDescription = 'Persiapan Sesi Subuh';
  }

  // Today's mutabaah breakdown
  const todayRecords = mutabaahRecords.filter(m => m.tanggal === selectedDate);
  const ziyadahCount = todayRecords.filter(m => m.jenis === 'ZIYADAH').length;
  const murajaahCount = todayRecords.filter(m => m.jenis === 'MURAJAAH').length;
  const tasmiCount = todayRecords.filter(m => m.jenis === 'TASMI').length;

  // Today's attendance breakdown
  const todayAbsensi = absensiRecords.filter(a => a.tanggal === selectedDate);
  const hadirCount = todayAbsensi.filter(a => a.status === 'HADIR').length;
  const izinCount = todayAbsensi.filter(a => a.status === 'IZIN').length;
  const sakitCount = todayAbsensi.filter(a => a.status === 'SAKIT').length;
  const alpaCount = todayAbsensi.filter(a => a.status === 'ALPA').length;

  // Average mutabaah score today
  const avgScore = todayRecords.length > 0
    ? Math.round(todayRecords.reduce((acc, r) => acc + (r.nilaiNum || 85), 0) / todayRecords.length)
    : 0;

  // Highest memorizer santri
  const topSantri = [...santriList].sort((a, b) => (b.currentJuz || 0) - (a.currentJuz || 0)).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Section: Tab Choices & Session Overview */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        {/* Pilihan Tab Navigasi Langsung (Ganti tulisan Dashboard jadi pilihan tab) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Pilihan Menu & Navigasi
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sesi {currentSessionName}</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard', active: true, icon: '📊' },
              { id: 'absensi', label: 'Presensi', active: false, icon: '✅' },
              { id: 'mutabaah', label: "Mutaba'ah", active: false, icon: '📖' },
              { id: 'santri', label: 'Santri & Raport', active: false, icon: '👥' },
              { id: 'rekap', label: 'Rekapitulasi', active: false, icon: '📈' },
              { id: 'pengaturan', label: 'Pengaturan', active: false, icon: '⚙️' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => onNavigate && onNavigate(t.id)}
                type="button"
                className={`flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  t.active
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span>{t.icon}</span>
                <span className="truncate">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info & Quick Actions Bar */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white shrink-0 p-0.5">
              <img 
                src="/assets/aistudio/WhatsApp_Image_2026-10-29_at_08.20.28_3984ba02.jpeg" 
                alt="Logo Pesantren" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {pesantrenInfo.nama || 'Pesantren Tahfidz Al-Furqon'}
              </p>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>{formattedDate}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{currentSessionDescription}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons for Mobile/Tablet/Desktop */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigate && onNavigate('mutabaah')}
              type="button"
              className="inline-flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>Input Setoran</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('absensi')}
              type="button"
              className="inline-flex items-center justify-center space-x-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer border border-slate-200/80 dark:border-slate-700/80"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Presensi Santri</span>
            </button>
          </div>
        </div>

      </div>

      {/* Primary Key Metric Cards (Balanced 2-col on mobile & tablet, 4-col on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Card 1: Total Santri */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Santri
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {totalSantri}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {halaqahList.length} kelompok halaqah
            </p>
          </div>
        </div>

        {/* Card 2: Mutaba'ah Setoran */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Setoran Hari Ini
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {todaySetoranCount}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1.5 truncate">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{ziyadahCount} Ziyadah</span>
              <span>·</span>
              <span>{murajaahCount} Muraja'ah</span>
            </div>
          </div>
        </div>

        {/* Card 3: Tingkat Presensi */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
              Presensi Hari Ini
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-400">
              <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {todayAttendancePercent}%
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {hadirCount} Hadir {izinCount > 0 ? `· ${izinCount} Izin` : ''}
            </p>
          </div>
        </div>

        {/* Card 4: Kualitas Setoran */}
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Kualitas Nilai
            </span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-100 dark:border-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div className="mt-2.5 sm:mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {avgScore > 0 ? avgScore : '—'}
            </div>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {avgScore >= 90 ? 'Mumtaz (Istimewa)' : avgScore >= 80 ? 'Jayyid Jiddan' : 'Rata-rata Harian'}
            </p>
          </div>
        </div>

      </div>

      {/* Middle Grid: Halaqah Overview & Santri Capaian Tertinggi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Halaqah Activity Status (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Monitoring Kelompok Halaqah
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pengampu dan anggota santri terdistribusi
              </p>
            </div>
            <button
              onClick={() => onNavigate && onNavigate('pengaturan')}
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <span>Atur Halaqah</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {halaqahList.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
                Belum ada data halaqah. Silakan tambahkan pada tab Pengaturan.
              </div>
            ) : (
              halaqahList.map((hlq) => {
                const members = santriList.filter(s => s.halaqahId === hlq.id);
                const hlqSetoranCount = todayRecords.filter(r => members.some(m => m.id === r.santriId)).length;
                return (
                  <div
                    key={hlq.id}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {hlq.nama}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {members.length} Santri
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium truncate">
                        Musyrif: {hlq.musyrif || 'Ust. Pengampu'}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Setoran Hari Ini:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{hlqSetoranCount} Selesai</strong>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Top Progress Santri (1 Col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Pencapaian Juz Santri
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Progres hafalan tertinggi santri
                </p>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('santri')}
                className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline font-semibold flex items-center space-x-1 cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {topSantri.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada data santri
                </div>
              ) : (
                topSantri.map((s, idx) => {
                  const percent = Math.min(100, Math.round(((s.currentJuz || 0) / (s.targetJuz || 30)) * 100));
                  return (
                    <div key={s.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-5 text-center text-xs font-bold text-slate-400">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {s.nama}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Target {s.targetJuz || 30} Juz
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
                          Juz {s.currentJuz || 0}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div 
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-800 dark:text-slate-200">Target Kurikulum:</span> 30 Juz Mutqin dengan tajwid dan tartil sesuai capaian santri.
          </div>
        </div>

      </div>

      {/* Sesi Harian Guide Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
          Struktur Sesi Halaqah Harian
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">1. Sesi Subuh</span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">05:00 - 06:30</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Fokus Ziyadah (Setoran Hafalan Baru minimal 1 halaman) & Isti'dad.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">2. Sesi Ashar</span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">16:00 - 17:30</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Fokus Muraja'ah Kubra (Penguatan hafalan juz lampau, minimal 1/4 juz).
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">3. Sesi Maghrib / Isya</span>
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">18:30 - 20:00</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Tasmi' antar santri & setoran hafalan ujian kenaikan juz.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
