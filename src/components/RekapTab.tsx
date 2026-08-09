import React, { useState } from 'react';
import {
  BarChart3,
  Award,
  Download,
  Users,
  BookOpen,
  UserCheck,
  TrendingUp,
  Sparkles,
  Calendar,
  FileSpreadsheet,
  Share2,
  Printer
} from 'lucide-react';
import { Santri, Halaqah, AbsensiRecord, MutabaahRecord } from '../types';
import { formatTanggalIndo } from '../utils/storage';

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

  // Filter records
  const filteredSantri = santriList.filter(
    (s) => filterHalaqah === 'ALL' || s.halaqahId === filterHalaqah
  );

  const santriIds = new Set(filteredSantri.map((s) => s.id));

  // Determine date boundaries
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

  // Metrics
  const totalZiyadah = relevantMutabaah.filter((m) => m.jenis === 'ZIYADAH').length;
  const totalMurajaah = relevantMutabaah.filter((m) => m.jenis === 'MURAJAAH').length;
  const totalTasmi = relevantMutabaah.filter((m) => m.jenis === 'TASMI').length;

  const totalAbsensi = relevantAbsensi.length;
  const hadirCount = relevantAbsensi.filter((a) => a.status === 'HADIR').length;
  const izinCount = relevantAbsensi.filter((a) => a.status === 'IZIN').length;
  const sakitCount = relevantAbsensi.filter((a) => a.status === 'SAKIT').length;
  const alpaCount = relevantAbsensi.filter((a) => a.status === 'ALPA').length;
  const attendancePercent = totalAbsensi > 0 ? Math.round((hadirCount / totalAbsensi) * 100) : 100;

  // Calculate Leaderboard / Ranking Santri Ter-Mutqin
  const santriRankings = filteredSantri.map((s) => {
    const sMutabaah = mutabaahRecords.filter((m) => m.santriId === s.id && isDateInRange(m.tanggal));
    const sAbsensi = absensiRecords.filter((a) => a.santriId === s.id && isDateInRange(a.tanggal));

    const sHadir = sAbsensi.filter((a) => a.status === 'HADIR').length;
    const sAbsTotal = sAbsensi.length;
    const sAttendanceRate = sAbsTotal > 0 ? Math.round((sHadir / sAbsTotal) * 100) : 100;

    const avgScore =
      sMutabaah.length > 0
        ? Math.round(sMutabaah.reduce((sum, r) => sum + r.nilaiNum, 0) / sMutabaah.length)
        : 0;

    return {
      santri: s,
      setoranCount: sMutabaah.length,
      currentJuz: s.currentJuz,
      avgScore,
      attendanceRate: sAttendanceRate
    };
  });

  // Sort by Capaian Juz & Setoran Count
  santriRankings.sort((a, b) => {
    if (b.currentJuz !== a.currentJuz) return b.currentJuz - a.currentJuz;
    return b.setoranCount - a.setoranCount;
  });

  // Function to Export CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'NIS,Nama Santri,Halaqah,Capaian Juz,Target Juz,Total Setoran,Kehadiran (%)\n';

    filteredSantri.forEach((s) => {
      const hlq = halaqahList.find((h) => h.id === s.halaqahId);
      const sMutabaah = mutabaahRecords.filter((m) => m.santriId === s.id && isDateInRange(m.tanggal));
      const sAbs = absensiRecords.filter((a) => a.santriId === s.id && isDateInRange(a.tanggal));
      const sHadir = sAbs.filter((a) => a.status === 'HADIR').length;
      const attRate = sAbs.length > 0 ? Math.round((sHadir / sAbs.length) * 100) : 100;

      csvContent += `"${s.nis}","${s.nama}","${hlq?.nama || ''}",${s.currentJuz},${s.targetJuz},${sMutabaah.length},${attRate}%\n`;
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
    santriRankings.slice(0, 5).forEach((s, idx) => {
      text += `${idx + 1}. ${s.nama} (${s.currentJuz} Juz, ${s.setoranCount} Setoran)\n`;
    });
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Rekapitulasi & Ranking Santri</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statistik agregat capaian hafalan Al-Qur'an dan kedisiplinan presensi santri
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterPeriode}
              onChange={(e) => setFilterPeriode(e.target.value as any)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
            >
              <option value="SEMUA">Semua Waktu</option>
              <option value="HARIAN">Harian (Hari Ini)</option>
              <option value="MINGGUAN">Mingguan (7 Hari)</option>
              <option value="BULANAN">Bulanan (30 Hari)</option>
              <option value="KUSTOM">Kustom</option>
            </select>

            {filterPeriode === 'KUSTOM' && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
                <span className="text-xs text-slate-400">-</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
                />
              </div>
            )}

            <select
              value={filterHalaqah}
              onChange={(e) => setFilterHalaqah(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
            >
              <option value="ALL">Semua Halaqah</option>
              {halaqahList.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nama}
                </option>
              ))}
            </select>

            <div className="flex bg-slate-100 rounded-xl p-1 border border-slate-200">
              <button
                onClick={handleExportCSV}
                title="Export CSV"
                className="hover:bg-white hover:text-emerald-700 text-slate-500 hover:shadow-sm text-xs font-bold p-2 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleExportPDF}
                title="Print / Export PDF"
                className="hover:bg-white hover:text-emerald-700 text-slate-500 hover:shadow-sm text-xs font-bold p-2 rounded-lg transition"
              >
                <Printer className="w-4 h-4" />
              </button>
              <button
                onClick={handleExportWA}
                title="Share to WhatsApp"
                className="hover:bg-white hover:text-emerald-700 text-slate-500 hover:shadow-sm text-xs font-bold p-2 rounded-lg transition"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Aggregated Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 flex items-center space-x-3">
            <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-700/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">Ziyadah Baru</span>
              <h3 className="text-xl font-bold text-emerald-950 mt-0.5">{totalZiyadah} Setoran</h3>
            </div>
          </div>

          <div className="bg-teal-50/70 p-4 rounded-2xl border border-teal-100 flex items-center space-x-3">
            <div className="p-3 bg-teal-600 text-white rounded-xl shadow-md shadow-teal-700/20">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider">Muraja'ah</span>
              <h3 className="text-xl font-bold text-teal-950 mt-0.5">{totalMurajaah} Setoran</h3>
            </div>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 flex items-center space-x-3">
            <div className="p-3 bg-amber-600 text-white rounded-xl shadow-md shadow-amber-700/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Ujian Tasmi'</span>
              <h3 className="text-xl font-bold text-amber-950 mt-0.5">{totalTasmi} Kali</h3>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
            <div className="p-3 bg-emerald-500 text-slate-950 rounded-xl font-bold">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Tingkat Kehadiran</span>
              <h3 className="text-xl font-bold text-white mt-0.5">{attendancePercent}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard & Ranking Santri Ter-Mutqin */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
          <Award className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-800">Ranking Santri Ter-Mutqin (Capaian Hafalan)</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="p-3 text-center w-12">Peringkat</th>
                <th className="p-3">Nama Santri</th>
                <th className="p-3">Halaqah</th>
                <th className="p-3 text-center">Capaian Juz</th>
                <th className="p-3 text-center">Setoran Active</th>
                <th className="p-3 text-center">Nilai Mutaba'ah</th>
                <th className="p-3 text-center">Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {santriRankings.map((item, index) => {
                const hlq = halaqahList.find((h) => h.id === item.santri.halaqahId);
                return (
                  <tr key={item.santri.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 text-center font-bold">
                      {index === 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-800 rounded-full font-extrabold text-xs">
                          🥇
                        </span>
                      ) : index === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-200 text-slate-700 rounded-full font-extrabold text-xs">
                          🥈
                        </span>
                      ) : index === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-900/10 text-amber-900 rounded-full font-extrabold text-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="text-slate-500">{index + 1}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <strong className="text-slate-900 font-bold block">{item.santri.nama}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">NIS: {item.santri.nis}</span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">{hlq?.nama || '-'}</td>
                    <td className="p-3 text-center">
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">
                        {item.currentJuz} / {item.santri.targetJuz} Juz
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700">{item.setoranCount} Kali</td>
                    <td className="p-3 text-center">
                      <span className="bg-slate-900 text-white font-bold px-2 py-0.5 rounded">
                        {item.avgScore || '-'} Pts
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-teal-700">{item.attendanceRate}%</td>
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
