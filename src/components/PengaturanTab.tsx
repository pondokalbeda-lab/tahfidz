import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  UserCheck,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Search,
  CheckSquare,
  Square,
  AlertCircle,
  Building2,
  Sliders,
  Sparkles,
  ArrowRightLeft,
  GraduationCap,
  Shield,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { Halaqah, Santri, PesantrenInfo } from '../types';

interface PengaturanTabProps {
  halaqahList: Halaqah[];
  onSaveHalaqahList: (list: Halaqah[]) => void;
  santriList: Santri[];
  onSaveSantriList: (list: Santri[]) => void;
  pesantrenInfo: PesantrenInfo;
  onSavePesantrenInfo: (info: PesantrenInfo) => void;
  onRefreshData?: () => void;
}

export const PengaturanTab: React.FC<PengaturanTabProps> = ({
  halaqahList,
  onSaveHalaqahList,
  santriList,
  onSaveSantriList,
  pesantrenInfo,
  onSavePesantrenInfo,
  onRefreshData,
}) => {
  // Sub-tab: 'halaqah' | 'pesantren' (Integrasi Spreadsheet ada di menu khusus Cloud)
  const [subTab, setSubTab] = useState<'halaqah' | 'pesantren'>('halaqah');

  // Selected Halaqah ID for editing
  const [selectedHalaqahId, setSelectedHalaqahId] = useState<string>(() => {
    return halaqahList.length > 0 ? halaqahList[0].id : '';
  });

  // Keep selectedHalaqahId valid if halaqahList changes
  useEffect(() => {
    if (halaqahList.length > 0) {
      if (!halaqahList.some(h => h.id === selectedHalaqahId)) {
        setSelectedHalaqahId(halaqahList[0].id);
      }
    } else {
      setSelectedHalaqahId('');
    }
  }, [halaqahList, selectedHalaqahId]);

  // Active halaqah being edited
  const currentHalaqah = useMemo(() => {
    return halaqahList.find(h => h.id === selectedHalaqahId) || null;
  }, [halaqahList, selectedHalaqahId]);

  // Form states for the currently selected halaqah
  const [namaHalaqah, setNamaHalaqah] = useState('');
  const [musyrifPengampu, setMusyrifPengampu] = useState('');
  const [keterangan, setKeterangan] = useState('');

  // Selected members (Santri IDs) for current halaqah
  const [selectedSantriIds, setSelectedSantriIds] = useState<string[]>([]);

  // Search and filter in the santri list
  const [santriSearch, setSantriSearch] = useState('');
  const [santriFilter, setSantriFilter] = useState<'ALL' | 'SELECTED' | 'UNASSIGNED' | 'OTHER'>('ALL');

  // Success & notification message
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modal for adding a new Halaqah
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHalaqahNama, setNewHalaqahNama] = useState('');
  const [newHalaqahMusyrif, setNewHalaqahMusyrif] = useState('');
  const [newHalaqahKeterangan, setNewHalaqahKeterangan] = useState('');

  // Pesantren form
  const [pesantrenForm, setPesantrenForm] = useState<PesantrenInfo>(pesantrenInfo);

  // Sync state whenever selected halaqah changes
  useEffect(() => {
    if (currentHalaqah) {
      setNamaHalaqah(currentHalaqah.nama);
      setMusyrifPengampu(currentHalaqah.musyrif);
      setKeterangan(currentHalaqah.keterangan || '');

      // Load santri IDs currently assigned to this halaqah
      const assignedIds = santriList
        .filter(s => s.halaqahId === currentHalaqah.id)
        .map(s => s.id);
      setSelectedSantriIds(assignedIds);
    } else {
      setNamaHalaqah('');
      setMusyrifPengampu('');
      setKeterangan('');
      setSelectedSantriIds([]);
    }
  }, [currentHalaqah, santriList]);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Filtered santri list for selection
  const filteredSantriList = useMemo(() => {
    const q = santriSearch.trim().toLowerCase();

    return santriList.filter(santri => {
      // Search query filter
      const matchesSearch =
        !q ||
        santri.nama.toLowerCase().includes(q) ||
        santri.nis.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      const isSelected = selectedSantriIds.includes(santri.id);
      const isUnassigned = !santri.halaqahId || santri.halaqahId === 'UNASSIGNED' || santri.halaqahId === '';
      const isOtherHalaqah = !isSelected && !isUnassigned;

      if (santriFilter === 'SELECTED') return isSelected;
      if (santriFilter === 'UNASSIGNED') return isUnassigned;
      if (santriFilter === 'OTHER') return isOtherHalaqah;
      return true; // 'ALL'
    });
  }, [santriList, santriSearch, santriFilter, selectedSantriIds]);

  // Toggle single santri selection
  const handleToggleSantri = (santriId: string) => {
    setSelectedSantriIds(prev => {
      if (prev.includes(santriId)) {
        return prev.filter(id => id !== santriId);
      } else {
        return [...prev, santriId];
      }
    });
  };

  // Select all filtered santris
  const handleSelectAllFiltered = () => {
    const idsToAdd = filteredSantriList.map(s => s.id);
    setSelectedSantriIds(prev => Array.from(new Set([...prev, ...idsToAdd])));
  };

  // Deselect all filtered santris
  const handleDeselectAllFiltered = () => {
    const idsToRemove = new Set(filteredSantriList.map(s => s.id));
    setSelectedSantriIds(prev => prev.filter(id => !idsToRemove.has(id)));
  };

  // Save changes to current halaqah and its santri members
  const handleSaveCurrentHalaqah = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentHalaqah) return;

    if (!namaHalaqah.trim()) {
      showToast('Nama halaqah tidak boleh kosong', 'error');
      return;
    }

    if (!musyrifPengampu.trim()) {
      showToast('Nama pengampu / musyrif tidak boleh kosong', 'error');
      return;
    }

    // 1. Update Halaqah in halaqahList
    const updatedHalaqahList = halaqahList.map(h => {
      if (h.id === currentHalaqah.id) {
        return {
          ...h,
          nama: namaHalaqah.trim(),
          musyrif: musyrifPengampu.trim(),
          keterangan: keterangan.trim()
        };
      }
      return h;
    });
    onSaveHalaqahList(updatedHalaqahList);

    // 2. Update Santri assignments
    // - Santri in selectedSantriIds -> halaqahId = currentHalaqah.id
    // - Santri previously in currentHalaqah.id but NOT in selectedSantriIds -> halaqahId = 'UNASSIGNED'
    const updatedSantriList = santriList.map(s => {
      const isSelected = selectedSantriIds.includes(s.id);
      const wasInThisHalaqah = s.halaqahId === currentHalaqah.id;

      if (isSelected) {
        return { ...s, halaqahId: currentHalaqah.id };
      } else if (wasInThisHalaqah && !isSelected) {
        return { ...s, halaqahId: 'UNASSIGNED' };
      }
      return s;
    });
    onSaveSantriList(updatedSantriList);

    showToast(
      `Pengampu "${musyrifPengampu}" dan ${selectedSantriIds.length} anggota santri berhasil disimpan untuk "${namaHalaqah}"!`,
      'success'
    );
  };

  // Create new halaqah
  const handleCreateHalaqah = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHalaqahNama.trim()) return;

    const newId = `hlq-${Date.now()}`;
    const newHalaqah: Halaqah = {
      id: newId,
      nama: newHalaqahNama.trim(),
      musyrif: newHalaqahMusyrif.trim() || 'Ust. Pembimbing',
      keterangan: newHalaqahKeterangan.trim()
    };

    const updated = [...halaqahList, newHalaqah];
    onSaveHalaqahList(updated);
    setSelectedHalaqahId(newId);

    setNewHalaqahNama('');
    setNewHalaqahMusyrif('');
    setNewHalaqahKeterangan('');
    setShowAddModal(false);

    showToast(`Halaqah baru "${newHalaqah.nama}" berhasil dibuat. Silakan pilih anggota santrinya.`, 'success');
  };

  // Delete halaqah
  const handleDeleteHalaqah = (id: string, name: string) => {
    const assignedCount = santriList.filter(s => s.halaqahId === id).length;
    const confirmText = assignedCount > 0
      ? `Hapus "${name}"? ${assignedCount} santri anggota di halaqah ini akan menjadi belum memiliki halaqah.`
      : `Hapus "${name}"?`;

    if (window.confirm(confirmText)) {
      const updatedHalaqah = halaqahList.filter(h => h.id !== id);
      onSaveHalaqahList(updatedHalaqah);

      // Reassign santri to UNASSIGNED
      const updatedSantri = santriList.map(s =>
        s.halaqahId === id ? { ...s, halaqahId: 'UNASSIGNED' } : s
      );
      onSaveSantriList(updatedSantri);

      if (updatedHalaqah.length > 0) {
        setSelectedHalaqahId(updatedHalaqah[0].id);
      } else {
        setSelectedHalaqahId('');
      }

      showToast(`Halaqah "${name}" berhasil dihapus.`, 'info');
    }
  };

  // Save Pesantren Info
  const handleSavePesantren = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePesantrenInfo(pesantrenForm);
    showToast('Profil Pesantren berhasil diperbarui!', 'success');
  };

  // Total summary counts
  const totalSantriWithHalaqah = santriList.filter(
    s => s.halaqahId && s.halaqahId !== 'UNASSIGNED'
  ).length;
  const totalSantriUnassigned = santriList.length - totalSantriWithHalaqah;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
            toastMsg.type === 'success'
              ? 'bg-emerald-600 text-white'
              : toastMsg.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-slate-800 text-white'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            {toastMsg.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span>{toastMsg.text}</span>
          </div>
          <button
            onClick={() => setToastMsg(null)}
            className="text-white/80 hover:text-white ml-3 text-xs underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Tab Navigation (Halaqah & Pengampu vs Profil Pesantren) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Pengaturan Sistem
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Atur ustadz pengampu dan tentukan anggota santri untuk setiap kelompok halaqah
            </p>
          </div>
        </div>

        {/* Tab Selector (2 Subtab Bersih: Halaqah & Profil Pesantren) */}
        <div className="w-full sm:w-auto grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setSubTab('halaqah')}
            type="button"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              subTab === 'halaqah'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Pengampu & Halaqah</span>
          </button>
          <button
            onClick={() => setSubTab('pesantren')}
            type="button"
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              subTab === 'pesantren'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Profil Lembaga</span>
          </button>
        </div>
      </div>

      {subTab === 'halaqah' && (
        <div className="space-y-6">

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                  Total Kelompok Halaqah
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {halaqahList.length}
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                  Santri Sudah Punya Halaqah
                </span>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {totalSantriWithHalaqah} <span className="text-xs text-slate-400 font-normal">/ {santriList.length}</span>
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                  Santri Belum Ada Halaqah
                </span>
                <span className={`text-2xl font-bold ${totalSantriUnassigned > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'}`}>
                  {totalSantriUnassigned}
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Halaqah Selector Pills / Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <span>Pilih Halaqah untuk Diatur</span>
                  <span className="text-xs text-slate-400 font-normal">
                    (Klik untuk memilih halaqah yang ingin diubah pengampu atau anggotanya)
                  </span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Halaqah Baru</span>
              </button>
            </div>

            {/* List of Halaqah Cards Grid */}
            {halaqahList.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Belum ada kelompok halaqah
                </p>
                <p className="text-xs text-slate-400">
                  Buat halaqah pertama Anda untuk mengelompokkan santri dan menetapkan ustadz pengampunya.
                </p>
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="mt-2 inline-flex items-center space-x-1 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Halaqah Sekarang</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-2.5">
                {halaqahList.map(h => {
                  const isSelected = h.id === selectedHalaqahId;
                  const memberCount = santriList.filter(s => s.halaqahId === h.id).length;

                  return (
                    <button
                      key={h.id}
                      onClick={() => setSelectedHalaqahId(h.id)}
                      type="button"
                      className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-w-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500/30 dark:ring-emerald-400/20'
                          : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 hover:bg-white dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1.5 min-w-0">
                        <span className={`font-bold text-xs truncate flex-1 min-w-0 ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {h.nama}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold shrink-0 ml-1 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {memberCount}
                        </span>
                      </div>
                      <div
                        className={`text-[10px] truncate block ${
                          isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {h.musyrif || 'Belum ada pengampu'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active Halaqah Editor (Only if there is a selected halaqah) */}
          {currentHalaqah && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Pengampu & Info Halaqah (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-5 h-5 text-emerald-600" />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        Pengampu & Detail
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteHalaqah(currentHalaqah.id, currentHalaqah.nama)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                      title="Hapus halaqah ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCurrentHalaqah} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Nama Halaqah <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={namaHalaqah}
                        onChange={e => setNamaHalaqah(e.target.value)}
                        placeholder="Contoh: Halaqah Abu Bakar Ash-Shiddiq"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ustadz Pengampu / Musyrif <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={musyrifPengampu}
                        onChange={e => setMusyrifPengampu(e.target.value)}
                        placeholder="Contoh: Ustadz Ahmad Hilmi, S.Pd.I"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        required
                      />
                      <p className="text-[10px] text-slate-400 mt-1">
                        Nama ustadz ini akan otomatis tercatat saat absensi & mutaba'ah halaqah ini.
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Keterangan / Tingkatan (Opsional)
                      </label>
                      <input
                        type="text"
                        value={keterangan}
                        onChange={e => setKeterangan(e.target.value)}
                        placeholder="Contoh: Ziyadah Juz 1 - 10 / Tingkat Menengah"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Quick Info Box */}
                    <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700 text-[11px] space-y-1.5">
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>Anggota Dipilih:</span>
                        <strong className="text-emerald-700 dark:text-emerald-400 font-bold">
                          {selectedSantriIds.length} Santri
                        </strong>
                      </div>
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Tersimpan Sebelumnya:</span>
                        <span>{santriList.filter(s => s.halaqahId === currentHalaqah.id).length} Santri</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Pengampu & Anggota</span>
                    </button>
                  </form>
                </div>

                {/* Helpful instructions */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-xl text-xs space-y-2 text-emerald-900 dark:text-emerald-200">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Info className="w-4 h-4 text-emerald-600" />
                    <span>Cara Menetapkan Anggota</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-emerald-800/90 dark:text-emerald-300">
                    Cukup <strong>centang santri</strong> di panel sebelah kanan untuk menjadikannya anggota halaqah ini.
                    Santri yang sebelumnya di halaqah lain akan otomatis dipindahkan ke halaqah ini setelah Anda menekan tombol <strong>Simpan</strong>.
                  </p>
                </div>
              </div>

              {/* Right Column: Member Picker / Santri Checklist (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col space-y-4">
                  {/* Header of Picker */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                        <span>Pilih Anggota Santri untuk</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-extrabold underline decoration-emerald-300">
                          {namaHalaqah || currentHalaqah.nama}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Tinggal centang / klik santri dari daftar di bawah ini
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <span className="text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                        {selectedSantriIds.length} Santri Dipilih
                      </span>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col gap-3 text-xs">
                    {/* Search */}
                    <div className="relative w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={santriSearch}
                        onChange={e => setSantriSearch(e.target.value)}
                        placeholder="Cari nama santri atau NIS..."
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] w-full sm:w-auto self-start">
                      <button
                        type="button"
                        onClick={() => setSantriFilter('ALL')}
                        className={`px-2.5 py-1.5 rounded-lg font-medium transition text-center cursor-pointer ${
                          santriFilter === 'ALL'
                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        Semua ({santriList.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSantriFilter('SELECTED')}
                        className={`px-2.5 py-1.5 rounded-lg font-medium transition text-center cursor-pointer ${
                          santriFilter === 'SELECTED'
                            ? 'bg-emerald-600 text-white font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        Terpilih ({selectedSantriIds.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSantriFilter('UNASSIGNED')}
                        className={`px-2.5 py-1.5 rounded-lg font-medium transition text-center cursor-pointer ${
                          santriFilter === 'UNASSIGNED'
                            ? 'bg-amber-500 text-white font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        Belum Ada ({totalSantriUnassigned})
                      </button>
                    </div>
                  </div>

                  {/* Batch Selection Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Menampilkan <strong>{filteredSantriList.length}</strong> santri
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleSelectAllFiltered}
                        className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
                      >
                        Pilih Semua Tampil
                      </button>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <button
                        type="button"
                        onClick={handleDeselectAllFiltered}
                        className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 hover:underline cursor-pointer"
                      >
                        Kosongkan Pilihan
                      </button>
                    </div>
                  </div>

                  {/* Interactive Santri List Checklist */}
                  {santriList.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <Users className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                        Belum ada santri terdaftar di sistem
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Tambahkan santri terlebih dahulu di menu <strong>Data Santri</strong> atau tarik dari Google Sheets di <strong>Kelola Data & Sync</strong>.
                      </p>
                    </div>
                  ) : filteredSantriList.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      Tidak ada santri yang sesuai dengan filter atau kata kunci pencarian.
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                      {filteredSantriList.map(santri => {
                        const isChecked = selectedSantriIds.includes(santri.id);
                        const isCurrentlyInThisHalaqah = santri.halaqahId === currentHalaqah.id;
                        const currentOtherHalaqah =
                          santri.halaqahId &&
                          santri.halaqahId !== 'UNASSIGNED' &&
                          santri.halaqahId !== currentHalaqah.id
                            ? halaqahList.find(h => h.id === santri.halaqahId)
                            : null;

                        return (
                          <div
                            key={santri.id}
                            onClick={() => handleToggleSantri(santri.id)}
                            className={`p-2.5 sm:p-3 rounded-xl border transition-all cursor-pointer flex flex-col xs:flex-row xs:items-center justify-between gap-2 select-none min-w-0 ${
                              isChecked
                                ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800 shadow-2xs'
                                : 'bg-slate-50/70 border-slate-200/80 dark:bg-slate-800/50 dark:border-slate-700/80 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
                              {/* Custom Checkbox visual */}
                              <div className="flex-shrink-0">
                                {isChecked ? (
                                  <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                    <CheckSquare className="w-4 h-4" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center bg-white dark:bg-slate-900">
                                    <Square className="w-4 h-4 text-transparent" />
                                  </div>
                                )}
                              </div>

                              {/* Student Avatar Initial */}
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                                  isChecked
                                    ? 'bg-emerald-200 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {santri.nama.charAt(0).toUpperCase()}
                              </div>

                              {/* Student Details */}
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-xs font-bold truncate ${
                                    isChecked
                                      ? 'text-emerald-950 dark:text-emerald-100'
                                      : 'text-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  {santri.nama}
                                </p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                                  NIS: {santri.nis || '-'} • Target: {santri.targetJuz || 30} Juz
                                </p>
                              </div>
                            </div>

                            {/* Status Pill on the Right / Below on ultra narrow screens */}
                            <div className="flex-shrink-0 self-start xs:self-center pl-7.5 xs:pl-0">
                              {isChecked ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                                  ✓ Anggota Ini
                                </span>
                              ) : currentOtherHalaqah ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 truncate max-w-[150px] sm:max-w-none">
                                  Di: {currentOtherHalaqah.nama}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                                  Belum Ada Halaqah
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Save Action in bottom */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Pastikan menekan tombol simpan setelah mengubah pilihan anggota.
                    </span>

                    <button
                      type="button"
                      onClick={() => handleSaveCurrentHalaqah()}
                      className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Halaqah</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Distribution Overview Table */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Daftar Lengkap Distribusi Pengampu & Anggota
                </h4>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Ringkasan seluruh halaqah
              </span>
            </div>

            {halaqahList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada halaqah.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {halaqahList.map(h => {
                  const members = santriList.filter(s => s.halaqahId === h.id);

                  return (
                    <div
                      key={h.id}
                      className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">{h.nama}</h5>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
                            Pengampu: <strong className="text-emerald-700 dark:text-emerald-400">{h.musyrif}</strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedHalaqahId(h.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center space-x-0.5 cursor-pointer shrink-0"
                        >
                          <span>Atur</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {h.keterangan && (
                        <p className="text-[11px] text-slate-400 italic break-words">{h.keterangan}</p>
                      )}

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Anggota ({members.length} Santri):
                        </span>
                        {members.length === 0 ? (
                          <span className="text-[11px] text-slate-400 italic">Belum ada anggota dipilih.</span>
                        ) : (
                          <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-0.5 scrollbar-thin">
                            {members.map(m => (
                              <span
                                key={m.id}
                                className="text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-md font-medium text-slate-700 dark:text-slate-300 truncate max-w-full"
                              >
                                {m.nama}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}



      {/* Subtab: Pesantren Profile Settings */}
      {subTab === 'pesantren' && (
        <form
          onSubmit={handleSavePesantren}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4 max-w-4xl"
        >
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Profil & Identitas Pesantren
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Pesantren <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={pesantrenForm.nama}
                onChange={e => setPesantrenForm({ ...pesantrenForm, nama: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Yayasan / Lembaga
              </label>
              <input
                type="text"
                value={pesantrenForm.lembaga}
                onChange={e => setPesantrenForm({ ...pesantrenForm, lembaga: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Pesantren
              </label>
              <input
                type="text"
                value={pesantrenForm.alamat}
                onChange={e => setPesantrenForm({ ...pesantrenForm, alamat: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pimpinan / Pengasuh Tahfidz
              </label>
              <input
                type="text"
                value={pesantrenForm.pimpinanTahfidz}
                onChange={e => setPesantrenForm({ ...pesantrenForm, pimpinanTahfidz: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tahun Ajaran
                </label>
                <input
                  type="text"
                  value={pesantrenForm.tahunAjaran}
                  onChange={e => setPesantrenForm({ ...pesantrenForm, tahunAjaran: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Semester
                </label>
                <select
                  value={pesantrenForm.semester}
                  onChange={e => setPesantrenForm({ ...pesantrenForm, semester: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                >
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Profil Pesantren</span>
            </button>
          </div>
        </form>
      )}

      {/* Modal: Tambah Halaqah Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Tambah Halaqah Baru
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHalaqah} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Halaqah <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newHalaqahNama}
                  onChange={e => setNewHalaqahNama(e.target.value)}
                  placeholder="Contoh: Halaqah Utsman bin Affan"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Pengampu / Musyrif <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newHalaqahMusyrif}
                  onChange={e => setNewHalaqahMusyrif(e.target.value)}
                  placeholder="Contoh: Ustadz Muhammad Yusuf"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={newHalaqahKeterangan}
                  onChange={e => setNewHalaqahKeterangan(e.target.value)}
                  placeholder="Contoh: Kelompok Tahfidz Pagi"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition cursor-pointer"
                >
                  Buat Halaqah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
