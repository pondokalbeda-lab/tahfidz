import React from 'react';
import { X, Printer, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { Santri, Halaqah, AbsensiRecord, MutabaahRecord } from '../types';
import { loadPesantrenInfo, formatTanggalIndo } from '../utils/storage';

interface RaportModalProps {
  santri: Santri;
  halaqah?: Halaqah;
  absensiRecords: AbsensiRecord[];
  mutabaahRecords: MutabaahRecord[];
  onClose: () => void;
}

export const RaportModal: React.FC<RaportModalProps> = ({
  santri,
  halaqah,
  absensiRecords,
  mutabaahRecords,
  onClose
}) => {
  const pesantrenInfo = loadPesantrenInfo();

  // Statistics
  const totalZiyadah = mutabaahRecords.filter((m) => m.jenis === 'ZIYADAH');
  const totalMurajaah = mutabaahRecords.filter((m) => m.jenis === 'MURAJAAH');
  const totalTasmi = mutabaahRecords.filter((m) => m.jenis === 'TASMI');

  const hadirCount = absensiRecords.filter((a) => a.status === 'HADIR').length;
  const izinCount = absensiRecords.filter((a) => a.status === 'IZIN').length;
  const sakitCount = absensiRecords.filter((a) => a.status === 'SAKIT').length;
  const alpaCount = absensiRecords.filter((a) => a.status === 'ALPA').length;
  const totalAbsensi = absensiRecords.length;
  const percentAttendance = totalAbsensi > 0 ? Math.round((hadirCount / totalAbsensi) * 100) : 100;

  const avgScore =
    mutabaahRecords.length > 0
      ? Math.round(
          mutabaahRecords.reduce((sum, r) => sum + r.nilaiNum, 0) / mutabaahRecords.length
        )
      : 85;

  let predikat = 'MUMTAZ (Sangat Baik)';
  if (avgScore < 75) predikat = 'MAQBUL (Cukup)';
  else if (avgScore < 85) predikat = 'JAYYID (Baik)';
  else if (avgScore < 92) predikat = 'JAYYID JIDDAN (Sangat Baik)';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto print:max-h-none print:shadow-none print:p-0 print:m-0 print:w-full print:rounded-none">
        {/* Action Bar (Hidden on Print) */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-800">
              Raport & Kartu Mutaba'ah Tahfidz
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-emerald-700/20"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RAPORT CONTENT */}
        <div className="p-6 border-2 border-emerald-800 rounded-2xl bg-white space-y-6 print:border-none print:p-0">
          {/* KOP SURAT PESANTREN */}
          <div className="text-center pb-4 border-b-2 border-emerald-800/80 space-y-1">
            <h1 className="text-2xl font-serif font-bold text-emerald-950 uppercase tracking-wide">
              {pesantrenInfo.nama}
            </h1>
            <p className="text-xs font-semibold text-slate-700">{pesantrenInfo.lembaga}</p>
            <p className="text-[11px] text-slate-500 font-serif italic">{pesantrenInfo.alamat}</p>
            <div className="inline-block bg-emerald-800 text-white font-bold text-xs px-4 py-1 rounded-full uppercase tracking-widest mt-2">
              RAPORT CAPAIAN TAHFIDZ AL-QUR'AN
            </div>
          </div>

          {/* SANTRI IDENTITY TABLE */}
          <div className="grid grid-cols-2 gap-4 text-xs font-serif bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Nama Santri:</span>
                <strong className="text-slate-900 font-bold">{santri.nama}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor Induk Santri (NIS):</span>
                <strong className="text-slate-900 font-mono font-bold">{santri.nis}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Halaqah:</span>
                <strong className="text-emerald-800 font-bold">{halaqah?.nama || '-'}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Tahun Ajaran / Semester:</span>
                <strong className="text-slate-900 font-bold">
                  {pesantrenInfo.tahunAjaran} ({pesantrenInfo.semester})
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Musyrif Pembimbing:</span>
                <strong className="text-slate-900 font-bold">{halaqah?.musyrif || '-'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tanggal Cetak:</span>
                <strong className="text-slate-900 font-bold">{formatTanggalIndo(new Date().toISOString().split('T')[0])}</strong>
              </div>
            </div>
          </div>

          {/* CAPAIAN MUTABA'AH TABLE */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-serif uppercase tracking-wider text-emerald-900 border-b border-emerald-300 pb-1">
              I. REKAPITULASI SETORAN MUTABA'AH HAFALAN
            </h3>

            <table className="w-full text-xs text-left border-collapse border border-slate-300 font-serif">
              <thead>
                <tr className="bg-emerald-800 text-white font-bold">
                  <th className="p-2 border border-slate-300">Kategori Evaluasi</th>
                  <th className="p-2 border border-slate-300 text-center">Jumlah Setoran</th>
                  <th className="p-2 border border-slate-300 text-center">Nilai Rata-Rata</th>
                  <th className="p-2 border border-slate-300">Keterangan / Predikat</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border border-slate-300 font-bold text-slate-800">Ziyadah (Hafalan Baru)</td>
                  <td className="p-2 border border-slate-300 text-center font-bold">{totalZiyadah.length} Kali</td>
                  <td className="p-2 border border-slate-300 text-center font-bold">{avgScore} Pts</td>
                  <td className="p-2 border border-slate-300">{predikat}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2 border border-slate-300 font-bold text-slate-800">Muraja'ah (Mengulang)</td>
                  <td className="p-2 border border-slate-300 text-center font-bold">{totalMurajaah.length} Kali</td>
                  <td className="p-2 border border-slate-300 text-center font-bold">{avgScore} Pts</td>
                  <td className="p-2 border border-slate-300">Kategori Kelancaran Baik</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-300 font-bold text-slate-800">Tasmi' Ujian Sekali Duduk</td>
                  <td className="p-2 border border-slate-300 text-center font-bold">{totalTasmi.length} Kali</td>
                  <td className="p-2 border border-slate-300 text-center font-bold">{avgScore} Pts</td>
                  <td className="p-2 border border-slate-300">Lulus Ujian Sesuai Target</td>
                </tr>
                <tr className="bg-emerald-50 font-bold">
                  <td className="p-2 border border-slate-300 text-emerald-950">TOTAL CAPAIAN HAFALAN</td>
                  <td className="p-2 border border-slate-300 text-center text-emerald-950" colSpan={2}>
                    {santri.currentJuz} Juz dari Target {santri.targetJuz} Juz
                  </td>
                  <td className="p-2 border border-slate-300 text-emerald-950">
                    Prosentase: {Math.round((santri.currentJuz / (santri.targetJuz || 30)) * 100)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* PRESENSI KEHADIRAN TABLE */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold font-serif uppercase tracking-wider text-emerald-900 border-b border-emerald-300 pb-1">
              II. REKAPITULASI PRESENSI KEHADIRAN HALAQAH
            </h3>

            <div className="grid grid-cols-5 gap-2 text-center text-xs font-serif">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-emerald-800 block font-medium">Hadir</span>
                <strong className="text-sm font-bold text-emerald-900">{hadirCount} Sesi</strong>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-800 block font-medium">Izin</span>
                <strong className="text-sm font-bold text-amber-900">{izinCount} Sesi</strong>
              </div>
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-blue-800 block font-medium">Sakit</span>
                <strong className="text-sm font-bold text-blue-900">{sakitCount} Sesi</strong>
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                <span className="text-rose-800 block font-medium">Alpa</span>
                <strong className="text-sm font-bold text-rose-900">{alpaCount} Sesi</strong>
              </div>
              <div className="p-2.5 bg-slate-900 text-white rounded-lg">
                <span className="text-slate-300 block font-medium">Kehadiran</span>
                <strong className="text-sm font-bold text-emerald-400">{percentAttendance}%</strong>
              </div>
            </div>
          </div>

          {/* CATATAN MUSYRIF */}
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl font-serif text-xs space-y-1">
            <strong className="text-slate-900 block font-bold">Catatan & Pesan Musyrif Tahfidz:</strong>
            <p className="text-slate-700 leading-relaxed italic">
              "Alhamdulillah santri an. {santri.nama} memiliki semangat tajwid dan hafalan yang baik. Tingkatkan kontinuitas muraja'ah di rumah dan pertahankan ketertiban shalat jama'ah."
            </p>
          </div>

          {/* SIGNATURE BLOCK */}
          <div className="grid grid-cols-2 gap-8 text-center text-xs font-serif pt-8 border-t border-slate-200">
            <div className="space-y-12">
              <p>Musyrif Halaqah Pembimbing,</p>
              <div className="font-bold underline text-slate-900">
                {halaqah?.musyrif || 'Ustaz Musyrif'}
              </div>
            </div>

            <div className="space-y-12">
              <p>Pimpinan Tahfidz Al-Furqon,</p>
              <div className="font-bold underline text-slate-900">
                {pesantrenInfo.pimpinanTahfidz}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
