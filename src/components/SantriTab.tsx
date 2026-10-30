import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Award,
  Phone,
  FileText,
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Santri, Halaqah, AbsensiRecord, MutabaahRecord } from '../types';
import { SantriDetailModal } from './SantriDetailModal';
import { RaportModal } from './RaportModal';

interface SantriTabProps {
  santriList: Santri[];
  halaqahList: Halaqah[];
  absensiRecords: AbsensiRecord[];
  mutabaahRecords: MutabaahRecord[];
  onAddSantri: (santri: Santri) => void;
  onEditSantri: (santri: Santri) => void;
  onDeleteSantri: (id: string) => void;
}

export const SantriTab: React.FC<SantriTabProps> = ({
  santriList,
  halaqahList,
  absensiRecords,
  mutabaahRecords,
  onAddSantri,
  onEditSantri,
  onDeleteSantri
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHalaqahId, setFilterHalaqahId] = useState('ALL');
  
  // Modal states
  const [selectedSantriForDetail, setSelectedSantriForDetail] = useState<Santri | null>(null);
  const [selectedSantriForRaport, setSelectedSantriForRaport] = useState<Santri | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    nis: '',
    nama: '',
    halaqahId: halaqahList[0]?.id || '',
    tanggalMasuk: new Date().toISOString().split('T')[0],
    targetJuz: 30,
    currentJuz: 0,
    waliNama: '',
    waliTelepon: ''
  });

  const handleOpenAddModal = () => {
    setEditingSantri(null);
    setFormData({
      nis: `2024${Math.floor(1000 + Math.random() * 9000)}`,
      nama: '',
      halaqahId: halaqahList[0]?.id || '',
      tanggalMasuk: new Date().toISOString().split('T')[0],
      targetJuz: 30,
      currentJuz: 0,
      waliNama: '',
      waliTelepon: ''
    });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (santri: Santri) => {
    setEditingSantri(santri);
    setFormData({
      nis: santri.nis,
      nama: santri.nama,
      halaqahId: santri.halaqahId,
      tanggalMasuk: santri.tanggalMasuk,
      targetJuz: santri.targetJuz,
      currentJuz: santri.currentJuz,
      waliNama: santri.waliNama || '',
      waliTelepon: santri.waliTelepon || ''
    });
    setShowFormModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) return;

    if (editingSantri) {
      onEditSantri({
        ...editingSantri,
        ...formData,
        targetJuz: Number(formData.targetJuz),
        currentJuz: Number(formData.currentJuz)
      });
    } else {
      onAddSantri({
        id: `san-${Date.now()}`,
        ...formData,
        targetJuz: Number(formData.targetJuz),
        currentJuz: Number(formData.currentJuz)
      });
    }

    setShowFormModal(false);
  };

  // Filter logic
  const filteredSantri = santriList.filter((s) => {
    const matchHalaqah = filterHalaqahId === 'ALL' || s.halaqahId === filterHalaqahId;
    const matchSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery);
    return matchHalaqah && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner & Action Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Direktori Santri & Raport
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Pantau progres hafalan 30 Juz, histori mutaba'ah, dan cetak raport berkala
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-emerald-700/20 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Santri Baru</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama santri atau NIS..."
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <select
              value={filterHalaqahId}
              onChange={(e) => setFilterHalaqahId(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="ALL">Semua Halaqah ({santriList.length} Santri)</option>
              {halaqahList.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nama} ({santriList.filter((s) => s.halaqahId === h.id).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Santri Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSantri.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-12 text-center text-slate-500 border border-slate-200 dark:border-slate-800">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Santri tidak ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Gunakan tombol 'Tambah Santri Baru' atau ubah kata kunci pencarian</p>
          </div>
        ) : (
          filteredSantri.map((santri) => {
            const halaqahObj = halaqahList.find((h) => h.id === santri.halaqahId);
            const studentMutabaah = mutabaahRecords.filter((m) => m.santriId === santri.id);
            const totalSetoran = studentMutabaah.length;
            const ziyadahCount = studentMutabaah.filter((m) => m.jenis === 'ZIYADAH').length;
            const murajaahCount = studentMutabaah.filter((m) => m.jenis === 'MURAJAAH').length;
            const tasmiCount = studentMutabaah.filter((m) => m.jenis === 'TASMI').length;

            // Pencapaian santri dihitung dari jumlah setoran (target milestone 30 setoran)
            const targetSetoranMilestone = 30;
            const percentProgress = Math.min(
              100,
              Math.round((totalSetoran / targetSetoranMilestone) * 100)
            );

            const studentAbsensi = absensiRecords.filter((a) => a.santriId === santri.id);
            const hadirCount = studentAbsensi.filter((a) => a.status === 'HADIR').length;
            const absensiTotal = studentAbsensi.length;
            const presenceRate = absensiTotal > 0 ? Math.round((hadirCount / absensiTotal) * 100) : 100;

            return (
              <div
                key={santri.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-amber-300 font-serif font-black text-base flex items-center justify-center border border-emerald-800/80 shadow-xs shrink-0">
                        {santri.nama.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight truncate">
                          {santri.nama}
                        </h3>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5 truncate">
                          {halaqahObj?.nama || 'Belum Ada Halaqah'} · <span className="text-slate-500 dark:text-slate-400 font-normal">Juz {santri.currentJuz || 0}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                          NIS: {santri.nis}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleOpenEditModal(santri)}
                        className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Edit Data Santri"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSantri(santri.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                        title="Hapus Santri"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar Pencapaian Santri (Dihitung dari Jumlah yang Mereka Setoran) */}
                  <div className="mt-4 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-600 dark:text-slate-400 text-[11px]">
                        Pencapaian Setoran
                      </span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-[11px]">
                        {totalSetoran} Kali Setoran ({percentProgress}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentProgress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                      <span>Rincian: {ziyadahCount} Ziyadah · {murajaahCount} Muraja'ah</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{tasmiCount > 0 ? `${tasmiCount} Tasmi'` : '0 Tasmi\''}</span>
                    </div>
                  </div>

                  {/* Mini Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="bg-slate-50/70 dark:bg-slate-900/40 p-2.5 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Total Setoran</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400">{totalSetoran} Selesai</span>
                    </div>
                    <div className="bg-slate-50/70 dark:bg-slate-900/40 p-2.5 rounded-xl text-center border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">Presensi</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{presenceRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedSantriForDetail(santri)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold py-2 px-3 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Detail Setoran</span>
                  </button>

                  <button
                    onClick={() => setSelectedSantriForRaport(santri)}
                    className="flex-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                    <span>Cetak Raport</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              {editingSantri ? 'Edit Data Santri' : 'Tambah Santri Baru'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Induk Santri (NIS)
                </label>
                <input
                  type="text"
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap Santri
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Muhammad Ali"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Halaqah
                </label>
                <select
                  value={formData.halaqahId}
                  onChange={(e) => setFormData({ ...formData, halaqahId: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <option value="">-- Pilih Halaqah --</option>
                  {halaqahList.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Capaian Juz
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="30"
                    value={formData.currentJuz}
                    onChange={(e) => setFormData({ ...formData, currentJuz: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Juz
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.targetJuz}
                    onChange={(e) => setFormData({ ...formData, targetJuz: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={formData.waliNama}
                  onChange={(e) => setFormData({ ...formData, waliNama: e.target.value })}
                  placeholder="Nama orang tua santri"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor HP / WhatsApp Wali
                </label>
                <input
                  type="text"
                  value={formData.waliTelepon}
                  onChange={(e) => setFormData({ ...formData, waliTelepon: e.target.value })}
                  placeholder="0812xxxxxxxx"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  Simpan Santri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Santri Detail Modal */}
      {selectedSantriForDetail && (
        <SantriDetailModal
          santri={selectedSantriForDetail}
          halaqahList={halaqahList}
          absensiRecords={absensiRecords.filter((a) => a.santriId === selectedSantriForDetail.id)}
          mutabaahRecords={mutabaahRecords.filter((m) => m.santriId === selectedSantriForDetail.id)}
          onClose={() => setSelectedSantriForDetail(null)}
          onOpenRaport={() => {
            const s = selectedSantriForDetail;
            setSelectedSantriForDetail(null);
            setSelectedSantriForRaport(s);
          }}
        />
      )}

      {/* Raport Printable Modal */}
      {selectedSantriForRaport && (
        <RaportModal
          santri={selectedSantriForRaport}
          halaqah={halaqahList.find((h) => h.id === selectedSantriForRaport.halaqahId)}
          absensiRecords={absensiRecords.filter((a) => a.santriId === selectedSantriForRaport.id)}
          mutabaahRecords={mutabaahRecords.filter((m) => m.santriId === selectedSantriForRaport.id)}
          onClose={() => setSelectedSantriForRaport(null)}
        />
      )}
    </div>
  );
};
