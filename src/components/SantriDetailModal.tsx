import React from 'react';
import {
  X,
  BookOpen,
  UserCheck,
  Award,
  Phone,
  Calendar,
  FileText,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  HelpCircle,
  Sparkles
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
  const totalZiyadah = mutabaahRecords.filter((m) => m.jenis === 'ZIYADAH').length;
  const totalMurajaah = mutabaahRecords.filter((m) => m.jenis === 'MURAJAAH').length;
  const totalTasmi = mutabaahRecords.filter((m) => m.jenis === 'TASMI').length;

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-lg shadow-emerald-800/20">
              {santri.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{santri.nama}</h2>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  NIS: {santri.nis}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {halaqahObj?.nama} • Musyrif: <strong>{halaqahObj?.musyrif}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenRaport}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md shadow-emerald-700/20 flex items-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Raport Tahfidz</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Capaian Hafalan</span>
            <span className="text-lg font-bold text-emerald-700 mt-0.5 block">
              {santri.currentJuz} / {santri.targetJuz} Juz
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Rata-Rata Nilai</span>
            <span className="text-lg font-bold text-amber-700 mt-0.5 block">
              {avgScore || '-'} Pts
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Kehadiran Halaqah</span>
            <span className="text-lg font-bold text-teal-700 mt-0.5 block">
              {rateHadir}%
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block font-medium">Total Setoran</span>
            <span className="text-lg font-bold text-slate-800 mt-0.5 block">
              {mutabaahRecords.length} Kali
            </span>
          </div>
        </div>

        {/* Wali & Contact Info */}
        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 text-xs flex flex-wrap justify-between items-center gap-3">
          <div>
            <span className="text-slate-500 font-medium">Nama Orang Tua / Wali:</span>
            <strong className="text-slate-900 ml-1.5 font-bold">{santri.waliNama || '-'}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Kontak Wali:</span>
            <strong className="text-emerald-800 ml-1.5 font-bold font-mono">{santri.waliTelepon || '-'}</strong>
          </div>
          <div>
            <span className="text-slate-500 font-medium">Tanggal Masuk:</span>
            <strong className="text-slate-900 ml-1.5 font-bold">{formatTanggalIndo(santri.tanggalMasuk)}</strong>
          </div>
        </div>

        {/* Attendance Breakdown */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Rekap Kehadiran Presensi</span>
          </h3>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
              <span className="text-emerald-700 font-semibold block">Hadir</span>
              <strong className="text-base text-emerald-900">{hadirCount}</strong>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100">
              <span className="text-amber-700 font-semibold block">Izin</span>
              <strong className="text-base text-amber-900">{izinCount}</strong>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100">
              <span className="text-blue-700 font-semibold block">Sakit</span>
              <strong className="text-base text-blue-900">{sakitCount}</strong>
            </div>
            <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100">
              <span className="text-rose-700 font-semibold block">Alpa</span>
              <strong className="text-base text-rose-900">{alpaCount}</strong>
            </div>
          </div>
        </div>

        {/* Setoran Timeline */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-1.5">
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
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">
                          QS. {r.surahNama} (Ayat {r.ayatMulai}-{r.ayatSelesai})
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px]">
                          Juz {r.juz}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-500 font-medium">
                          {r.jenis === 'ZIYADAH' ? 'Ziyadah' : r.jenis === 'MURAJAAH' ? 'Muraja\'ah' : 'Tasmi\''}
                        </span>
                      </div>
                      {r.catatanTajwid && (
                        <p className="text-slate-600 italic mt-1 text-[11px]">"{r.catatanTajwid}"</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${q.bg}`}>
                        {q.label}
                      </span>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
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
