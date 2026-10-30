import React from 'react';
import {
  X,
  BookOpen,
  UserCheck,
  Printer
} from 'lucide-react';
import { Santri, Halaqah, AbsensiRecord, MutabaahRecord } from '../types';
import { formatTanggalIndo, formatKualitasSetoran } from '../utils/storage';

interface SantriDetailModalProps {
  santri: Santri;
  halaqahList: Halaqah[];
  absensiRecords: AbsensiRecord[];
  mutabaahRecords: MutabaahRecord[];
  onClose: () => void;
  onOpenRaport: () => void;
}

export const SantriDetailModal: React.FC<SantriDetailModalProps> = ({
  santri,
  halaqahList,
  absensiRecords,
  mutabaahRecords,
  onClose,
  onOpenRaport
}) => {
  const halaqahObj = halaqahList.find((h) => h.id === santri.halaqahId);

  // Stats calculation
  const hadirCount = absensiRecords.filter((a) => a.status === 'HADIR').length;
  const izinCount = absensiRecords.filter((a) => a.status === 'IZIN').length;
  const sakitCount = absensiRecords.filter((a) => a.status === 'SAKIT').length;
  const alpaCount = absensiRecords.filter((a) => a.status === 'ALPA').length;
  const totalAbsensi = absensiRecords.length;
  const rateHadir = totalAbsensi > 0 ? Math.round((hadirCount / totalAbsensi) * 100) : 100;

  // Average Score
  const avgScore =
    mutabaahRecords.length > 0
      ? Math.round(
          mutabaahRecords.reduce((sum, r) => sum + r.nilaiNum, 0) / mutabaahRecords.length
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-950 text-amber-300 font-serif font-black text-lg sm:text-xl flex items-center justify-center border border-emerald-800 shadow-sm shrink-0">
              {santri.nama.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">{santri.nama}</h2>
                <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-md shrink-0">
                  NIS: {santri.nis}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                {halaqahObj?.nama || 'Belum Ada Halaqah'} • Musyrif: <strong>{halaqahObj?.musyrif || '-'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-2 w-full sm:w-auto">
            <button
              onClick={onOpenRaport}
              className="flex-1 sm:flex-none bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-emerald-700/20 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span>Cetak Raport Tahfidz</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overview Cards (Pencapaian Berdasarkan Jumlah Setoran) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60">
            <span className="text-emerald-800 dark:text-emerald-300 block font-bold">Pencapaian Setoran</span>
            <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5 block">
              {mutabaahRecords.length} Kali Setoran
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Rata-Rata Nilai</span>
            <span className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-0.5 block">
              {avgScore || '-'} Pts
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Kehadiran Halaqah</span>
            <span className="text-lg font-bold text-teal-700 dark:text-teal-400 mt-0.5 block">
              {rateHadir}%
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Posisi Hafalan</span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">
              Juz {santri.currentJuz || 0} / {santri.targetJuz || 30}
            </span>
          </div>
        </div>

        {/* Wali & Contact Info */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/30 p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50 text-xs flex flex-wrap justify-between items-center gap-3">
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Nama Orang Tua / Wali:</span>
            <strong className="text-slate-900 dark:text-white ml-1.5 font-bold">{santri.waliNama || '-'}</strong>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Kontak Wali:</span>
            <strong className="text-emerald-800 dark:text-emerald-300 ml-1.5 font-bold font-mono">{santri.waliTelepon || '-'}</strong>
          </div>
          <div>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Tanggal Masuk:</span>
            <strong className="text-slate-900 dark:text-white ml-1.5 font-bold">{formatTanggalIndo(santri.tanggalMasuk)}</strong>
          </div>
        </div>

        {/* Attendance Breakdown */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Rekap Kehadiran Presensi</span>
          </h3>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="text-emerald-700 dark:text-emerald-300 font-semibold block text-[11px]">Hadir</span>
              <strong className="text-base text-emerald-900 dark:text-emerald-200">{hadirCount}</strong>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800">
              <span className="text-amber-700 dark:text-amber-300 font-semibold block text-[11px]">Izin</span>
              <strong className="text-base text-amber-900 dark:text-amber-200">{izinCount}</strong>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-800">
              <span className="text-blue-700 dark:text-blue-300 font-semibold block text-[11px]">Sakit</span>
              <strong className="text-base text-blue-900 dark:text-blue-200">{sakitCount}</strong>
            </div>
            <div className="bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800">
              <span className="text-rose-700 dark:text-rose-300 font-semibold block text-[11px]">Alpa</span>
              <strong className="text-base text-rose-900 dark:text-rose-200">{alpaCount}</strong>
            </div>
          </div>
        </div>

        {/* Setoran Timeline */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Riwayat Setoran Ziyadah & Muraja'ah Terbaru</span>
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {mutabaahRecords.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-4">Belum ada setoran tercatat</p>
            ) : (
              mutabaahRecords.map((r) => {
                const q = formatKualitasSetoran(r.kualitas);
                return (
                  <div
                    key={r.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          QS. {r.surahNama} (Ayat {r.ayatMulai}-{r.ayatSelesai})
                        </span>
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                          Juz {r.juz}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          {r.jenis === 'ZIYADAH' ? 'Ziyadah' : r.jenis === 'MURAJAAH' ? 'Muraja\'ah' : 'Tasmi\''}
                        </span>
                      </div>
                      {r.catatanTajwid && (
                        <p className="text-slate-600 dark:text-slate-400 italic mt-1 text-[11px]">"{r.catatanTajwid}"</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${q.bg}`}>
                        {q.label}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {r.nilaiNum} Pts
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatTanggalIndo(r.tanggal)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
