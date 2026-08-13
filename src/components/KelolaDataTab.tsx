import React, { useState } from 'react';
import {
  Settings,
  Building2,
  Users,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  CloudUpload,
  CloudDownload,
  Loader2
} from 'lucide-react';
import { PesantrenInfo, Halaqah, Santri } from '../types';
import {
  exportDataAsJSON,
  importDataFromJSON,
  resetAllDataToDefault
} from '../utils/storage';
import { syncToCloud, fetchFromCloud } from '../utils/api';

interface KelolaDataTabProps {
  pesantrenInfo: PesantrenInfo;
  onSavePesantrenInfo: (info: PesantrenInfo) => void;
  halaqahList: Halaqah[];
  onSaveHalaqahList: (list: Halaqah[]) => void;
  santriList: Santri[];
  onSaveSantriList: (list: Santri[]) => void;
  onRefreshData: () => void;
}

export const KelolaDataTab: React.FC<KelolaDataTabProps> = ({
  pesantrenInfo,
  onSavePesantrenInfo,
  halaqahList,
  onSaveHalaqahList,
  santriList,
  onSaveSantriList,
  onRefreshData
}) => {
  // Pesantren Form State
  const [pesantrenForm, setPesantrenForm] = useState<PesantrenInfo>(pesantrenInfo);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<{text: string, type: 'success'|'error'|''} >({text: '', type: ''});

  // Halaqah Modal State
  const [showHalaqahModal, setShowHalaqahModal] = useState(false);
  const [editingHalaqah, setEditingHalaqah] = useState<Halaqah | null>(null);
  const [halaqahForm, setHalaqahForm] = useState({
    nama: '',
    musyrif: '',
    keterangan: ''
  });
  const [selectedSantris, setSelectedSantris] = useState<string[]>([]);

  const handlePesantrenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePesantrenInfo(pesantrenForm);
    setSuccessMsg('Informasi Pesantren berhasil disimpan!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleOpenAddHalaqah = () => {
    setEditingHalaqah(null);
    setHalaqahForm({ nama: '', musyrif: '', keterangan: '' });
    setSelectedSantris([]);
    setShowHalaqahModal(true);
  };

  const handleOpenEditHalaqah = (h: Halaqah) => {
    setEditingHalaqah(h);
    setHalaqahForm({ nama: h.nama, musyrif: h.musyrif, keterangan: h.keterangan || '' });
    setSelectedSantris(santriList.filter(s => s.halaqahId === h.id).map(s => s.id));
    setShowHalaqahModal(true);
  };

  const handleHalaqahSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!halaqahForm.nama) return;

    let halaqahId = '';
    if (editingHalaqah) {
      halaqahId = editingHalaqah.id;
      const updated = halaqahList.map((h) =>
        h.id === editingHalaqah.id ? { ...h, ...halaqahForm } : h
      );
      onSaveHalaqahList(updated);
    } else {
      halaqahId = `hlq-${Date.now()}`;
      const newHalaqah: Halaqah = {
        id: halaqahId,
        ...halaqahForm
      };
      onSaveHalaqahList([...halaqahList, newHalaqah]);
    }

    // Update santri list based on selectedSantris
    const updatedSantriList = santriList.map(s => {
      if (selectedSantris.includes(s.id)) {
        return { ...s, halaqahId };
      } else if (s.halaqahId === halaqahId && !selectedSantris.includes(s.id)) {
        return { ...s, halaqahId: 'UNASSIGNED' };
      }
      return s;
    });
    onSaveSantriList(updatedSantriList);

    setShowHalaqahModal(false);
  };

  const handleDeleteHalaqah = (id: string) => {
    if (confirm('Yakin ingin menghapus halaqah ini?')) {
      onSaveHalaqahList(halaqahList.filter((h) => h.id !== id));
    }
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    setSyncMsg({ text: 'Menyinkronkan data ke Cloud...', type: '' });
    const success = await syncToCloud();
    if (success) {
      setSyncMsg({ text: 'Data berhasil disinkronkan ke Cloud!', type: 'success' });
    } else {
      setSyncMsg({ text: 'Gagal menyinkronkan data ke Cloud.', type: 'error' });
    }
    setIsSyncing(false);
    setTimeout(() => setSyncMsg({ text: '', type: '' }), 4000);
  };

  const handleFetchFromCloud = async () => {
    if (!confirm('Peringatan: Mengambil data dari Cloud akan menimpa semua data lokal saat ini. Lanjutkan?')) return;
    
    setIsSyncing(true);
    setSyncMsg({ text: 'Mengambil data dari Cloud...', type: '' });
    const success = await fetchFromCloud();
    if (success) {
      setSyncMsg({ text: 'Data berhasil diambil dan diterapkan!', type: 'success' });
      onRefreshData();
    } else {
      setSyncMsg({ text: 'Gagal mengambil data dari Cloud.', type: 'error' });
    }
    setIsSyncing(false);
    setTimeout(() => setSyncMsg({ text: '', type: '' }), 4000);
  };

  // Export JSON
  const handleExportBackup = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_Tahfidz_Al_Furqon_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  // Import JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importDataFromJSON(content)) {
        alert('Data berhasil di-restore!');
        onRefreshData();
      } else {
        alert('Gagal restore data. File JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  // Reset Data
  const handleReset = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan semua data ke contoh awal Pesantren Al-Furqon?')) {
      resetAllDataToDefault();
      onRefreshData();
      alert('Data telah direset ke setelan awal!');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3.5 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pesantren Information Settings */}
      <form
        onSubmit={handlePesantrenSubmit}
        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4"
      >
        <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
          <Building2 className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-800">Profil & Identitas Pesantren</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Pesantren</label>
            <input
              type="text"
              value={pesantrenForm.nama}
              onChange={(e) => setPesantrenForm({ ...pesantrenForm, nama: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Yayasan / Lembaga</label>
            <input
              type="text"
              value={pesantrenForm.lembaga}
              onChange={(e) => setPesantrenForm({ ...pesantrenForm, lembaga: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Alamat Pesantren</label>
            <input
              type="text"
              value={pesantrenForm.alamat}
              onChange={(e) => setPesantrenForm({ ...pesantrenForm, alamat: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pimpinan / Pengasuh Tahfidz</label>
            <input
              type="text"
              value={pesantrenForm.pimpinanTahfidz}
              onChange={(e) => setPesantrenForm({ ...pesantrenForm, pimpinanTahfidz: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
              <input
                type="text"
                value={pesantrenForm.tahunAjaran}
                onChange={(e) => setPesantrenForm({ ...pesantrenForm, tahunAjaran: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester</label>
              <select
                value={pesantrenForm.semester}
                onChange={(e) => setPesantrenForm({ ...pesantrenForm, semester: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Informasi Pesantren</span>
          </button>
        </div>
      </form>

      {/* Manage Halaqah List */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-800">Daftar Halaqah & Ustaz Musyrif</h2>
          </div>
          <button type="button"
            onClick={handleOpenAddHalaqah}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Halaqah</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {halaqahList.map((h) => (
            <div key={h.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-sm">{h.nama}</h3>
                <div className="flex space-x-1">
                  <button type="button"
                    onClick={() => handleOpenEditHalaqah(h)}
                    className="p-1 text-slate-400 hover:text-emerald-700"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button type="button"
                    onClick={() => handleDeleteHalaqah(h.id)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-slate-600">Musyrif: <strong className="text-slate-900">{h.musyrif}</strong></p>
              {h.keterangan && <p className="text-slate-400 italic">{h.keterangan}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Cloud Sync Section */}
      <div className="bg-emerald-50 rounded-2xl p-6 shadow-sm border border-emerald-200 space-y-4">
        <div className="pb-3 border-b border-emerald-100">
          <h2 className="text-lg font-bold text-emerald-900">Sinkronisasi Cloud (Google Sheets)</h2>
          <p className="text-xs text-emerald-700">Simpan dan ambil data dari Spreadsheet yang Anda siapkan</p>
        </div>

        {syncMsg.text && (
          <div className={`p-3 rounded-lg text-sm flex items-center space-x-2 ${
            syncMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800' :
            syncMsg.type === 'error' ? 'bg-rose-100 text-rose-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : 
             syncMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> :
             <CheckCircle2 className="w-4 h-4" />
            }
            <span>{syncMsg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button type="button"
            onClick={handleSyncToCloud}
            disabled={isSyncing}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white p-4 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center space-y-2 border border-emerald-700"
          >
            <CloudUpload className="w-6 h-6 text-emerald-200" />
            <span>Simpan Data ke Cloud</span>
          </button>

          <button type="button"
            onClick={handleFetchFromCloud}
            disabled={isSyncing}
            className="bg-white hover:bg-emerald-50 disabled:opacity-50 text-emerald-800 border border-emerald-300 p-4 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center space-y-2"
          >
            <CloudDownload className="w-6 h-6 text-emerald-600" />
            <span>Ambil Data dari Cloud</span>
          </button>
        </div>
      </div>

      {/* Backup & Restore & Reset Data */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/60 space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Penyimpanan & Cadangan Data</h2>
          <p className="text-xs text-slate-500">Ekspor, impor, atau atur ulang database lokal pesantren</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button type="button"
            onClick={handleExportBackup}
            className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center space-y-2 border border-slate-800"
          >
            <Download className="w-6 h-6 text-emerald-400" />
            <span>Unduh Cadangan JSON</span>
          </button>

          <label className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-4 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center space-y-2 border border-slate-300 cursor-pointer">
            <Upload className="w-6 h-6 text-slate-700" />
            <span>Unggah / Restore JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button type="button"
            onClick={handleReset}
            className="bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 p-4 rounded-2xl text-xs font-bold transition flex flex-col items-center justify-center space-y-2"
          >
            <RotateCcw className="w-6 h-6 text-rose-600" />
            <span>Reset Data Sample</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Halaqah Modal */}
      {showHalaqahModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">
              {editingHalaqah ? 'Edit Halaqah' : 'Tambah Halaqah Baru'}
            </h3>

            <form onSubmit={handleHalaqahSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Halaqah</label>
                <input
                  type="text"
                  value={halaqahForm.nama}
                  onChange={(e) => setHalaqahForm({ ...halaqahForm, nama: e.target.value })}
                  placeholder="e.g. Halaqah Abu Bakar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Musyrif / Pembimbing</label>
                <input
                  type="text"
                  value={halaqahForm.musyrif}
                  onChange={(e) => setHalaqahForm({ ...halaqahForm, musyrif: e.target.value })}
                  placeholder="e.g. Ust. Ahmad Al-Hafidz"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan (Opsional)</label>
                <input
                  type="text"
                  value={halaqahForm.keterangan}
                  onChange={(e) => setHalaqahForm({ ...halaqahForm, keterangan: e.target.value })}
                  placeholder="e.g. Tingkat Ziyadah Juz 1-10"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2 mt-2">Pilih Anggota Santri</label>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50 p-2 space-y-1">
                  {santriList.length === 0 ? (
                    <p className="text-slate-500 italic p-2 text-center text-[10px]">Belum ada santri terdaftar.</p>
                  ) : (
                    santriList.map((santri) => (
                      <label key={santri.id} className="flex items-center space-x-2 p-2 hover:bg-slate-100 rounded cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedSantris.includes(santri.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSantris([...selectedSantris, santri.id]);
                            } else {
                              setSelectedSantris(selectedSantris.filter(id => id !== santri.id));
                            }
                          }}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800 leading-tight">{santri.nama}</span>
                          <span className="text-[10px] text-slate-500">
                            {santri.halaqahId !== 'UNASSIGNED' && editingHalaqah?.id !== santri.halaqahId 
                              ? `(Saat ini: ${halaqahList.find(h => h.id === santri.halaqahId)?.nama || 'Halaqah lain'})` 
                              : ''}
                          </span>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowHalaqahModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
