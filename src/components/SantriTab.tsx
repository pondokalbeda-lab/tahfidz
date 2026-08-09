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
  Calendar,
  FileText,
  UserCheck,
  ChevronRight,
  Sparkles,
  Printer
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
        id: `str-${Date.now()}`,
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
    <div className="space-y-6">
      {/* Top Banner & Action Controls */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Direktori & Progress Santri</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola data santri, pantau pencapaian hafalan Al-Qur'an, dan cetak Raport Tahfidz
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md shadow-emerald-700/20 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Santri Baru</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama santri atau NIS..."
              className="w-full text-xs pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={filterHalaqahId}
              onChange={(e) => setFilterHalaqahId(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">Semua Halaqah ({santriList.length})</option>
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
          <div className="col-span-full bg-white rounded-2xl p-10 text-center text-slate-500 border border-slate-200">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Santri tidak ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Gunakan tombol 'Tambah Santri Baru' untuk menambahkan santri</p>
          </div>
        ) : (
          filteredSantri.map((santri) => {
            const halaqahObj = halaqahList.find((h) => h.id === santri.halaqahId);
            const percentProgress = Math.min(
              100,
              Math.round((santri.currentJuz / (santri.targetJuz || 30)) * 100)
            );

            // Calculate student specific stats
            const studentMutabaah = mutabaahRecords.filter((m) => m.santriId === santri.id);
            const studentAbsensi = absensiRecords.filter((a) => a.santriId === santri.id);
            const hadirCount = studentAbsensi.filter((a) => a.status === 'HADIR').length;
            const absensiTotal = studentAbsensi.length;
            const presenceRate = absensiTotal > 0 ? Math.round((hadirCount / absensiTotal) * 100) : 100;

            return (
              <div
                key={santri.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 font-bold text-lg flex items-center justify-center border border-slate-800 shadow-inner">
                        {santri.nama.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{santri.nama}</h3>
                        <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          {halaqahObj?.nama || 'Halaqah'}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">NIS: {santri.nis}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(santri)}
                        className="text-slate-400 hover:text-emerald-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
                        title="Edit Data"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSantri(santri.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="Hapus Santri"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar Hafalan */}
                  <div className="mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-600">Progress Hafalan</span>
                      <span className="font-bold text-emerald-700">
                        {santri.currentJuz} / {santri.targetJuz} Juz ({percentProgress}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Mini Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Total Setoran</span>
                      <span className="font-bold text-slate-800">{studentMutabaah.length} Kali</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg text-center border border-slate-100">
                      <span className="text-[10px] text-slate-400 block font-medium">Kehadiran</span>
                      <span className="font-bold text-emerald-700">{presenceRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedSantriForDetail(santri)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2 px-3 rounded-xl transition flex items-center justify-center space-x-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Detail Setoran</span>
                  </button>

                  <button
                    onClick={() => setSelectedSantriForRaport(santri)}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center space-x-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800 pb-2 border-b border-slate-100">
              {editingSantri ? 'Edit Data Santri' : 'Tambah Santri Baru'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Induk Santri (NIS)
                </label>
                <input
                  type="text"
                  value={formData.nis}
                  onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Lengkap Santri
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="e.g. Ahmad Al-Farisi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pilih Halaqah
                </label>
                <select
                  value={formData.halaqahId}
                  onChange={(e) => setFormData({ ...formData, halaqahId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                >
                  {halaqahList.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Capaian Juz Saat Ini
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="30"
                    value={formData.currentJuz}
                    onChange={(e) => setFormData({ ...formData, currentJuz: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Hafalan (Juz)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.targetJuz}
                    onChange={(e) => setFormData({ ...formData, targetJuz: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Wali Santri
                </label>
                <input
                  type="text"
                  value={formData.waliNama}
                  onChange={(e) => setFormData({ ...formData, waliNama: e.target.value })}
                  placeholder="Orang tua / Wali"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor HP / WhatsApp Wali
                </label>
                <input
                  type="text"
                  value={formData.waliTelepon}
                  onChange={(e) => setFormData({ ...formData, waliTelepon: e.target.value })}
                  placeholder="0812xxxxxxxx"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-md shadow-emerald-700/20"
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
