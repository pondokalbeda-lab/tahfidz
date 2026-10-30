import React, { useState } from 'react';
import {
  Download,
  BookOpen,
  UserCheck,
  TrendingUp,
  Share2,
  Printer,
  Layers,
  Sparkles
} from 'lucide-react';
import { Santri, Halaqah, AbsensiRecord, MutabaahRecord, PesantrenInfo } from '../types';

interface RekapTabProps {
  santriList: Santri[];
  halaqahList: Halaqah[];
  absensiRecords: AbsensiRecord[];
  mutabaahRecords: MutabaahRecord[];
  selectedDate: string;
  pesantrenInfo?: PesantrenInfo;
}

type PeriodeFilter =
  | 'SEMUA'
  | 'SEMESTER_INI'
  | 'TENGAH_SEMESTER_INI'
  | 'SEMESTER_GANJIL'
  | 'TENGAH_GANJIL'
  | 'SEMESTER_GENAP'
  | 'TENGAH_GENAP'
  | 'HARIAN'
  | 'MINGGUAN'
  | 'BULANAN'
  | 'KUSTOM';

type SortOption = 'SETORAN' | 'NAMA' | 'JUZ' | 'PRESENSI';

export const RekapTab: React.FC<RekapTabProps> = ({
  santriList,
  halaqahList,
  absensiRecords,
  mutabaahRecords,
  selectedDate,
  pesantrenInfo
}) => {
  const [filterHalaqah, setFilterHalaqah] = useState<string>('ALL');
  const [filterPeriode, setFilterPeriode] = useState<PeriodeFilter>('SEMUA');
  const [sortBy, setSortBy] = useState<SortOption>('SETORAN');
  const [customStartDate, setCustomStartDate] = useState<string>(selectedDate);
  const [customEndDate, setCustomEndDate] = useState<string>(selectedDate);

  // Compute Academic Year and Semester boundaries based on selected date
  const refDate = selectedDate ? new Date(selectedDate) : new Date();
  const currentYear = isNaN(refDate.getFullYear()) ? new Date().getFullYear() : refDate.getFullYear();
  const currentMonth = isNaN(refDate.getMonth()) ? new Date().getMonth() : refDate.getMonth(); // 0-11

  // In Indonesia, Islamic/academic calendar:
  // July - Dec (month >= 6) -> Semester Ganjil, school year starts currentYear
  // Jan - June (month < 6)  -> Semester Genap, school year started currentYear - 1
  const isMonthGanjil = currentMonth >= 6;
  const ayStartYear = isMonthGanjil ? currentYear : currentYear - 1;
  const ayEndYear = ayStartYear + 1;

  const dateRanges = {
    semesterGanjil: {
      start: `${ayStartYear}-07-01`,
      end: `${ayStartYear}-12-31`,
      label: `Semester Ganjil (1 Juli - 31 Des ${ayStartYear})`
    },
    tengahGanjil: {
      start: `${ayStartYear}-07-01`,
      end: `${ayStartYear}-09-30`,
      label: `Tengah Semester Ganjil / PTS 1 (1 Juli - 30 Sep ${ayStartYear})`
    },
    semesterGenap: {
      start: `${ayEndYear}-01-01`,
      end: `${ayEndYear}-06-30`,
      label: `Semester Genap (1 Jan - 30 Juni ${ayEndYear})`
    },
    tengahGenap: {
      start: `${ayEndYear}-01-01`,
      end: `${ayEndYear}-03-31`,
      label: `Tengah Semester Genap / PTS 2 (1 Jan - 31 Mar ${ayEndYear})`
    }
  };

  const activeSemesterIsGanjil = pesantrenInfo?.semester
    ? pesantrenInfo.semester.toLowerCase().includes('ganjil') || pesantrenInfo.semester === '1'
    : isMonthGanjil;

  const activeSemesterRange = activeSemesterIsGanjil ? dateRanges.semesterGanjil : dateRanges.semesterGenap;
  const activeTengahRange = activeSemesterIsGanjil ? dateRanges.tengahGanjil : dateRanges.tengahGenap;

  const getPeriodLabel = (): string => {
    switch (filterPeriode) {
      case 'SEMUA':
        return 'Semua Waktu (Seluruh Catatan)';
      case 'SEMESTER_INI':
        return `Semester ${activeSemesterIsGanjil ? 'Ganjil' : 'Genap'} (${activeSemesterRange.start} s/d ${activeSemesterRange.end})`;
      case 'TENGAH_SEMESTER_INI':
        return `Tengah Semester ${activeSemesterIsGanjil ? 'Ganjil' : 'Genap'} / PTS (${activeTengahRange.start} s/d ${activeTengahRange.end})`;
      case 'SEMESTER_GANJIL':
        return dateRanges.semesterGanjil.label;
      case 'TENGAH_GANJIL':
        return dateRanges.tengahGanjil.label;
      case 'SEMESTER_GENAP':
        return dateRanges.semesterGenap.label;
      case 'TENGAH_GENAP':
        return dateRanges.tengahGenap.label;
      case 'HARIAN':
        return `Harian (${selectedDate})`;
      case 'MINGGUAN':
        return `7 Hari Terakhir hingga ${selectedDate}`;
      case 'BULANAN':
        return `30 Hari Terakhir hingga ${selectedDate}`;
      case 'KUSTOM':
        return `${customStartDate} s/d ${customEndDate}`;
      default:
        return 'Semua Waktu';
    }
  };

  const isDateInRange = (dateStr: string) => {
    if (filterPeriode === 'SEMUA') return true;
    if (filterPeriode === 'SEMESTER_INI') {
      return dateStr >= activeSemesterRange.start && dateStr <= activeSemesterRange.end;
    }
    if (filterPeriode === 'TENGAH_SEMESTER_INI') {
      return dateStr >= activeTengahRange.start && dateStr <= activeTengahRange.end;
    }
    if (filterPeriode === 'SEMESTER_GANJIL') {
      return dateStr >= dateRanges.semesterGanjil.start && dateStr <= dateRanges.semesterGanjil.end;
    }
    if (filterPeriode === 'TENGAH_GANJIL') {
      return dateStr >= dateRanges.tengahGanjil.start && dateStr <= dateRanges.tengahGanjil.end;
    }
    if (filterPeriode === 'SEMESTER_GENAP') {
      return dateStr >= dateRanges.semesterGenap.start && dateStr <= dateRanges.semesterGenap.end;
    }
    if (filterPeriode === 'TENGAH_GENAP') {
      return dateStr >= dateRanges.tengahGenap.start && dateStr <= dateRanges.tengahGenap.end;
    }

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
      return dateStr >= customStartDate && dateStr <= customEndDate;
    }
    return true;
  };

  const filteredSantri = santriList.filter(
    (s) => filterHalaqah === 'ALL' || s.halaqahId === filterHalaqah
  );

  const santriIds = new Set(filteredSantri.map((s) => s.id));

  const relevantMutabaah = mutabaahRecords.filter((m) => santriIds.has(m.santriId) && isDateInRange(m.tanggal));
  const relevantAbsensi = absensiRecords.filter((a) => santriIds.has(a.santriId) && isDateInRange(a.tanggal));

  const totalZiyadah = relevantMutabaah.filter((m) => m.jenis === 'ZIYADAH').length;
  const totalMurajaah = relevantMutabaah.filter((m) => m.jenis === 'MURAJAAH').length;
  const totalTasmi = relevantMutabaah.filter((m) => m.jenis === 'TASMI').length;

  const totalAbsensi = relevantAbsensi.length;
  const hadirCount = relevantAbsensi.filter((a) => a.status === 'HADIR').length;
  const attendancePercent = totalAbsensi > 0 ? Math.round((hadirCount / totalAbsensi) * 100) : 100;

  // Santri summary focused strictly on "Jumlah Hafalan" (without ranking/medals)
  const santriRekapList = filteredSantri.map((s) => {
    const sMutabaah = mutabaahRecords.filter((m) => m.santriId === s.id && isDateInRange(m.tanggal));
    const sAbsensi = absensiRecords.filter((a) => a.santriId === s.id && isDateInRange(a.tanggal));

    const ziyadahCount = sMutabaah.filter((m) => m.jenis === 'ZIYADAH').length;
    const murajaahCount = sMutabaah.filter((m) => m.jenis === 'MURAJAAH').length;
    const tasmiCount = sMutabaah.filter((m) => m.jenis === 'TASMI').length;

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
      ziyadahCount,
      murajaahCount,
      tasmiCount,
      currentJuz: s.currentJuz || 0,
      targetJuz: s.targetJuz || 30,
      avgScore,
      attendanceRate: sAttendanceRate
    };
  });

  // Sort based on user selection (default: Jumlah Setoran terbanyak)
  santriRekapList.sort((a, b) => {
    if (sortBy === 'SETORAN') {
      if (b.setoranCount !== a.setoranCount) return b.setoranCount - a.setoranCount;
      return a.santri.nama.localeCompare(b.santri.nama);
    }
    if (sortBy === 'NAMA') {
      return a.santri.nama.localeCompare(b.santri.nama);
    }
    if (sortBy === 'JUZ') {
      if (b.currentJuz !== a.currentJuz) return b.currentJuz - a.currentJuz;
      return b.setoranCount - a.setoranCount;
    }
    if (sortBy === 'PRESENSI') {
      if (b.attendanceRate !== a.attendanceRate) return b.attendanceRate - a.attendanceRate;
      return b.setoranCount - a.setoranCount;
    }
    return 0;
  });

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'No,NIS,Nama Santri,Halaqah,Total Setoran,Ziyadah,Murajaah,Tasmi,Capaian Juz,Target Juz,Rata-rata Nilai,Kehadiran (%)\n';

    santriRekapList.forEach((item, idx) => {
      const s = item.santri;
      const hlq = halaqahList.find((h) => h.id === s.halaqahId);
      csvContent += `${idx + 1},"${s.nis}","${s.nama}","${hlq?.nama || ''}",${item.setoranCount},${item.ziyadahCount},${item.murajaahCount},${item.tasmiCount},${item.currentJuz},${item.targetJuz},${item.avgScore},${item.attendanceRate}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Hafalan_Tahfidz_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportWA = () => {
    const attRate = totalAbsensi > 0 ? Math.round((hadirCount / totalAbsensi) * 100) : 100;
    let text = `*Laporan Rekapitulasi Hafalan Tahfidz*\n`;
    text += `Periode: ${getPeriodLabel()}\n\n`;
    text += `*Ringkasan Statistik:*\n`;
    text += `- Total Setoran: ${relevantMutabaah.length} kali\n`;
    text += `- Ziyadah: ${totalZiyadah} | Muraja'ah: ${totalMurajaah} | Tasmi': ${totalTasmi}\n`;
    text += `- Rata-rata Presensi: ${attRate}%\n\n`;

    text += `*Rekap Jumlah Setoran Santri (${santriRekapList.length} Santri):*\n`;
    santriRekapList.slice(0, 15).forEach((item, idx) => {
      text += `${idx + 1}. ${item.santri.nama} — ${item.setoranCount}x Setoran (Juz ${item.currentJuz})\n`;
    });
    if (santriRekapList.length > 15) {
      text += `...dan ${santriRekapList.length - 15} santri lainnya.\n`;
    }

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        {/* Header row with Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Rekapitulasi Hafalan Santri
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rekap jumlah hafalan, setoran ziyadah & muraja'ah, dan presensi santri
            </p>
          </div>

          {/* Action Buttons: CSV, Print, WhatsApp */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <button
              onClick={handleExportCSV}
              title="Ekspor ke CSV / Excel"
              className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 py-1.5 px-3 rounded-xl transition text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              title="Cetak Laporan / Simpan PDF"
              className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 py-1.5 px-3 rounded-xl transition text-xs font-semibold cursor-pointer border border-slate-200 dark:border-slate-700"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>Cetak</span>
            </button>
            <button
              onClick={handleExportWA}
              title="Kirim Ringkasan ke WhatsApp"
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded-xl transition text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdown: Pilihan Periode Lengkap, Halaqah & Urutan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Pilihan Periode Lengkap
            </label>
            <select
              value={filterPeriode}
              onChange={(e) => setFilterPeriode(e.target.value as PeriodeFilter)}
              className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-200 cursor-pointer w-full focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
            >
              <option value="SEMUA">Semua Waktu (Seluruh Catatan)</option>
              <option value="SEMESTER_INI">Semester Berjalan (Penuh)</option>
              <option value="TENGAH_SEMESTER_INI">Tengah Semester Berjalan (PTS)</option>
              <option value="SEMESTER_GANJIL">Semester Ganjil (1 Jul - 31 Des)</option>
              <option value="TENGAH_GANJIL">Tengah Semester Ganjil (1 Jul - 30 Sep)</option>
              <option value="SEMESTER_GENAP">Semester Genap (1 Jan - 30 Jun)</option>
              <option value="TENGAH_GENAP">Tengah Semester Genap (1 Jan - 31 Mar)</option>
              <option value="BULANAN">Bulanan (30 Hari Terakhir)</option>
              <option value="MINGGUAN">Mingguan (7 Hari Terakhir)</option>
              <option value="HARIAN">Harian (Hari Ini)</option>
              <option value="KUSTOM">Rentang Tanggal Kustom</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Kelompok Halaqah
            </label>
            <select
              value={filterHalaqah}
              onChange={(e) => setFilterHalaqah(e.target.value)}
              className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-200 cursor-pointer w-full focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
            >
              <option value="ALL">Semua Halaqah ({santriList.length} Santri)</option>
              {halaqahList.map((h) => {
                const count = santriList.filter((s) => s.halaqahId === h.id).length;
                return (
                  <option key={h.id} value={h.id}>
                    {h.nama} ({count} Santri)
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Urutan Tampilan
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-200 cursor-pointer w-full focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
            >
              <option value="SETORAN">Jumlah Setoran (Terbanyak)</option>
              <option value="NAMA">Nama Santri (A - Z)</option>
              <option value="JUZ">Posisi Capaian Juz (Tertinggi)</option>
              <option value="PRESENSI">Kehadiran Presensi (%)</option>
            </select>
          </div>
        </div>

        {/* Custom date range inputs if selected */}
        {filterPeriode === 'KUSTOM' && (
          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
              Rentang Tanggal:
            </span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-400 font-bold">s/d</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        )}

        {/* Informative Active Period Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl px-3.5 py-2 text-emerald-950 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              Periode Aktif: <strong>{getPeriodLabel()}</strong>
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
            {relevantMutabaah.length} Setoran Tercatat
          </span>
        </div>

        {/* Aggregated Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-xl shrink-0">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider truncate">
                Ziyadah Baru
              </p>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                {totalZiyadah} <span className="text-xs font-normal text-slate-400">Setoran</span>
              </h3>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-xl shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider truncate">
                Muraja'ah
              </p>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                {totalMurajaah} <span className="text-xs font-normal text-slate-400">Setoran</span>
              </h3>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 rounded-xl shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider truncate">
                Ujian Tasmi'
              </p>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                {totalTasmi} <span className="text-xs font-normal text-slate-400">Kali</span>
              </h3>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center space-x-3">
            <div className="p-2 sm:p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 rounded-xl shrink-0">
              <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider truncate">
                Rata Kehadiran
              </p>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight truncate">
                {attendancePercent}%
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Data Rekap Hafalan Santri (Fokus pada Jumlah Hafalan & Setoran) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-600 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Data Rekap & Jumlah Setoran Hafalan Santri
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Total {santriRekapList.length} Santri
            </span>
          </div>
        </div>

        {/* Mobile View: Dedicated Card List (md:hidden) */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {santriRekapList.map((item, index) => {
            const hlq = halaqahList.find((h) => h.id === item.santri.halaqahId);
            const targetJuz = item.targetJuz || 30;
            const progressJuz = Math.min(100, Math.round((item.currentJuz / targetJuz) * 100));

            return (
              <div key={item.santri.id} className="py-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    {/* Neutral Clean Number Indicator (No ranking/medals) */}
                    <div className="shrink-0">
                      <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-bold text-xs font-mono">
                        {index + 1}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                        {item.santri.nama}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                        NIS {item.santri.nis} · {hlq?.nama || 'Tanpa Halaqah'}
                      </p>
                    </div>
                  </div>

                  {/* Prominent Jumlah Setoran Badge */}
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg shrink-0">
                    {item.setoranCount}x Setoran
                  </span>
                </div>

                {/* Progress bar towards Target Juz */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>Posisi Capaian Juz</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      Juz {item.currentJuz} dari {targetJuz} Juz ({progressJuz}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressJuz}%` }}
                    />
                  </div>
                </div>

                {/* 3 Metric Detail Pills */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Rincian Setoran</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold text-[10px]">
                      {item.ziyadahCount}Z · {item.murajaahCount}M
                    </strong>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Rata Nilai</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                      {item.avgScore > 0 ? `${item.avgScore} Pts` : '—'}
                    </strong>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9px]">Presensi</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                      {item.attendanceRate}%
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Clean Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px] text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="p-3 text-center w-12 text-slate-400">No</th>
                <th className="p-3">Nama Santri & NIS</th>
                <th className="p-3">Kelompok Halaqah</th>
                <th className="p-3 text-center">Jumlah Setoran</th>
                <th className="p-3 text-center">Rincian Setoran</th>
                <th className="p-3 text-center">Posisi Juz Saat Ini</th>
                <th className="p-3 text-center">Rata-rata Nilai</th>
                <th className="p-3 text-center">Presensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {santriRekapList.map((item, index) => {
                const hlq = halaqahList.find((h) => h.id === item.santri.halaqahId);
                const targetJuz = item.targetJuz || 30;

                return (
                  <tr key={item.santri.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3 text-center font-mono text-slate-400 font-medium">
                      {index + 1}
                    </td>
                    <td className="p-3">
                      <strong className="text-slate-900 dark:text-white font-bold block">{item.santri.nama}</strong>
                      <span className="text-[10px] text-slate-400 font-mono">NIS {item.santri.nis}</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">{hlq?.nama || '—'}</td>
                    <td className="p-3 text-center">
                      <span className="text-emerald-700 dark:text-emerald-300 font-black text-xs bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/70 px-3 py-1 rounded-lg">
                        {item.setoranCount} Kali Setoran
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-600 dark:text-slate-400 font-medium text-[11px]">
                      <span className="text-emerald-600 font-semibold">{item.ziyadahCount} Ziyadah</span>
                      <span className="mx-1 text-slate-300">·</span>
                      <span className="text-blue-600 font-semibold">{item.murajaahCount} Muraja'ah</span>
                      {item.tasmiCount > 0 && (
                        <>
                          <span className="mx-1 text-slate-300">·</span>
                          <span className="text-purple-600 font-semibold">{item.tasmiCount} Tasmi'</span>
                        </>
                      )}
                    </td>
                    <td className="p-3 text-center text-slate-700 dark:text-slate-300 font-medium">
                      Juz {item.currentJuz} <span className="text-slate-400 text-[10px]">/ {targetJuz} Juz</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">
                        {item.avgScore > 0 ? `${item.avgScore} Pts` : '—'}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-emerald-700 dark:text-emerald-400">
                      {item.attendanceRate}%
                    </td>
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
