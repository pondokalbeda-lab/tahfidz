import React, { useState } from 'react';
import {
  Award,
  Download,
  BookOpen,
  UserCheck,
  TrendingUp,
  Share2,
  Printer
} from 'lucide-react';
import { Santri, Halaqah, AbsensiRecord, MutabaahRecord } from '../types';

interface RekapTabProps {
  santriList: Santri[];
  halaqahList: Halaqah[];
  absensiRecords: AbsensiRecord[];
  mutabaahRecords: MutabaahRecord[];
  selectedDate: string;
}

export const RekapTab: React.FC<RekapTabProps> = ({
  santriList,
  halaqahList,
  absensiRecords,
  mutabaahRecords,
  selectedDate
}) => {
  const [filterHalaqah, setFilterHalaqah] = useState<string>('ALL');
  const [filterPeriode, setFilterPeriode] = useState<'SEMUA' | 'HARIAN' | 'MINGGUAN' | 'BULANAN' | 'KUSTOM'>('SEMUA');
  const [customStartDate, setCustomStartDate] = useState<string>(selectedDate);
  const [customEndDate, setCustomEndDate] = useState<string>(selectedDate);

  const filteredSantri = santriList.filter(
    (s) => filterHalaqah === 'ALL' || s.halaqahId === filterHalaqah
  );

  const santriIds = new Set(filteredSantri.map((s) => s.id));

  const isDateInRange = (dateStr: string) => {
    if (filterPeriode === 'SEMUA') return true;
    
    const d = new Date(dateStr);
    const sel = new Date(selectedDate);
    
    if (filterPeriode === 'HARIAN') {
      return dateStr === selectedDate;
    } else if (filterPeriode === 'MINGGUAN') {
      const pastWeek = new Date(sel);
      pastWeek.setDate(sel.getDate() - 7);
      return d >= pastWeek && d <= sel;
    } else if (filterPeriode === 'BULANAN') {
      const pastMonth = new Date(sel);
      pastMonth.setMonth(sel.getMonth() - 1);
      return d >= pastMonth && d <= sel;
    } else if (filterPeriode === 'KUSTOM') {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      return d >= start && d <= end;
    }
    return true;
  };

  const relevantMutabaah = mutabaahRecords.filter((m) => santriIds.has(m.santriId) && isDateInRange(m.tanggal));
  const relevantAbsensi = absensiRecords.filter((a) => santriIds.has(a.santriId) && isDateInRange(a.tanggal));

  const totalZiyadah = relevantMutabaah.filter((m) => m.jenis === 'ZIYADAH').length;
  const totalMurajaah = relevantMutabaah.filter((m) => m.jenis === 'MURAJAAH').length;
  const totalTasmi = relevantMutabaah.filter((m) => m.jenis === 'TASMI').length;

  const totalAbsensi = relevantAbsensi.length;
  const hadirCount = relevantAbsensi.filter((a) => a.status === 'HADIR').length;
  const attendancePercent = totalAbsensi > 0 ? Math.round((hadirCount / totalAbsensi) * 100) : 100;

  const santriRankings = filteredSantri.map((s) => {
    const sMutabaah = mutabaahRecords.filter((m) => m.santriId === s.id && isDateInRange(m.tanggal));
    const sAbsensi = absensiRecords.filter((a) => a.santriId === s.id && isDateInRange(a.tanggal));

    const sHadir = sAbsensi.filter((a) => a.status === 'HADIR').length;
    const sAbsTotal = sAbsensi.length;
    const sAttendanceRate = sAbsTotal > 0 ? Math.round((sHadir / sAbsTotal) * 100) : 100;

    const avgScore =
      sMutabaah.length > 0
        ? Math.round(sMutabaah.reduce((sum, r) => sum + (r.nilaiNum || 80), 0) / sMutabaah.length)
        : 0;

    return {
      santri: s,
      setoranCount: sMutabaah.length,
      currentJuz: s.currentJuz || 0,
      avgScore,
      attendanceRate: sAttendanceRate
    };
  });

  santriRankings.sort((a, b) => {
    if (b.currentJuz !== a.currentJuz) return b.currentJuz - a.currentJuz;
    return b.setoranCount - a.setoranCount;
  });

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'NIS,Nama Santri,Halaqah,Capaian Juz,Target Juz,Total Setoran,Kehadiran (%)\n';

    filteredSantri.forEach((s) => {
      const hlq = halaqahList.find((h) => h.id === s.halaqahId);
      const sMutabaah = mutabaahRecords.filter((m) => m.santriId === s.id && isDateInRange(m.tanggal));
      const sAbs = absensiRecords.filter((a) => a.santriId === s.id && isDateInRange(a.tanggal));
      const sHadir = sAbs.filter((a) => a.status === 'HADIR').length;
      const attRate = sAbs.length > 0 ? Math.round((sHadir / sAbs.length) * 100) : 100;

      csvContent += `"${s.nis}","${s.nama}","${hlq?.nama || ''}",${s.currentJuz || 0},${s.targetJuz || 30},${sMutabaah.length},${attRate}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Tahfidz_Al_Furqon_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportWA = () => {
    const attRate = totalAbsensi > 0 ? Math.round((hadirCount / totalAbsensi) * 100) : 100;
    let text = `*Laporan Tahfidz Al-Furqon*\nPeriode: ${filterPeriode} (${selectedDate})\n\n`;
    text += `*Statistik Global:*\n`;
    text += `- Ziyadah: ${totalZiyadah} setoran\n`;
    text += `- Muraja'ah: ${totalMurajaah} setoran\n`;
    text += `- Tingkat Kehadiran: ${attRate}%\n\n`;
    
    text += `*Top 5 Santri Ter-Mutqin:*\n`;
    santriRankings.slice(0, 5).forEach((item, idx) => {
      text += `${idx + 1}. ${item.santri.nama} (${item.currentJuz} Juz, ${item.setoranCount} Setoran)\n`;
    });
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Rekapitulasi & Ranking Santri
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Statistik agregat capaian hafalan Qur'an dan kedisiplinan presensi santri
            </p>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 w-full lg:w-auto">
            {/* Periode and Halaqah selects */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
              <select
                value={filterPeriode}
                onChange={(e) => setFilterPeriode(e.target.value as any)}
                className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-200 cursor-pointer w-full focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="SEMUA">Semua Waktu</option>
                <option value="HARIAN">Harian (Hari Ini)</option>
                <option value="MINGGUAN">Mingguan (7 Hari)</option>
                <option value="BULANAN">Bulanan (30 Hari)</option>
                <option value="KUSTOM">Rentang Kustom</option>
              </select>

              <select
                value={filterHalaqah}
                onChange={(e) => setFilterHalaqah(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-200 cursor-pointer w-full focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
              >
                <option value="ALL">Semua Halaqah</option>
                {halaqahList.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nama}
                  </option>
                ))}
              </select>
            </div>

            {filterPeriode === 'KUSTOM' && (
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 flex-1 sm:flex-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-400">-</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 flex-1 sm:flex-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Export Action Buttons */}
            <div className="flex items-center justify-between sm:justify-start gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
              <button
                onClick={handleExportCSV}
                title="Ekspor ke CSV / Excel"
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 py-1.5 px-3 rounded-lg transition text-xs font-semibold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px]">CSV</span>
              </button>
              <button
                onClick={() => window.print()}
                title="Cetak Laporan / Simpan PDF"
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 py-1.5 px-3 rounded-lg transition text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px]">Cetak</span>
              </button>
              <button
                onClick={handleExportWA}
                title="Kirim Ringkasan ke WhatsApp"
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 py-1.5 px-3 rounded-lg transition text-xs font-semibold cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px]">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Aggregated Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Ziyadah</p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{totalZiyadah} <span className="text-xs font-normal text-slate-400">Setoran</span></h3>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Muraja'ah</p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{totalMurajaah} <span className="text-xs font-normal text-slate-400">Setoran</span></h3>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Ujian Tasmi'</p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{totalTasmi} <span className="text-xs font-normal text-slate-400">Kali</span></h3>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Presensi</p>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{attendancePercent}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard & Ranking Santri */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Peringkat Santri Mutqin Berdasarkan Capaian Hafalan
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="p-3 text-center w-14">Rank</th>
                <th className="p-3">Nama Santri</th>
                <th className="p-3">Halaqah</th>
                <th className="p-3 text-center">Capaian Juz</th>
                <th className="p-3 text-center">Total Setoran</th>
                <th className="p-3 text-center">Rata-rata Nilai</th>
                <th className="p-3 text-center">Presensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {santriRankings.map((item, index) => {
                const hlq = halaqahList.find((h) => h.id === item.santri.halaqahId);
                return (
                  <tr key={item.santri.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 text-center font-bold">
                      {index === 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full font-bold text-xs">
                          1
                        </span>
                      ) : index === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full font-bold text-xs">
                          2
                        </span>
                      ) : index === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-800/10 dark:bg-amber-900/30 text-amber-900 dark:text-amber-400 rounded-full font-bold text-xs">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-400">{index + 1}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <strong className="text-slate-900 dark:text-white font-bold block">{item.santri.nama}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">NIS {item.santri.nis}</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{hlq?.nama || '—'}</td>
                    <td className="p-3 text-center">
                      <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-xs">
                        Juz {item.currentJuz} / {item.santri.targetJuz || 30}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700 dark:text-slate-300">{item.setoranCount} Kali</td>
                    <td className="p-3 text-center">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">
                        {item.avgScore > 0 ? `${item.avgScore} Pts` : '—'}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-700 dark:text-emerald-400">{item.attendanceRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
