import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Save,
  Search,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sunrise,
  Sunset,
  Award,
  Sparkles
} from 'lucide-react';
import {
  Santri,
  Halaqah,
  MutabaahRecord,
  JenisSetoran,
  KualitasSetoran,
  SesiHalaqah
} from '../types';
import { QURAN_SURAHS, getSurahByNumber } from '../data/quranData';

interface MutabaahTabProps {
  santriList: Santri[];
  halaqahList: Halaqah[];
  mutabaahRecords: MutabaahRecord[];
  onSaveSetoran: (record: MutabaahRecord, overwrite?: boolean) => void;
  onDeleteSetoran: (id: string) => void;
  onUpdateSantriJuz: (santriId: string, newJuz: number) => void;
  selectedDate: string;
}

interface MutabaahDraft {
  jenis: JenisSetoran;
  surahNumber: number;
  ayatMulai: number | '';
  surahSelesaiNumber: number;
  ayatSelesai: number | '';
  kualitas: KualitasSetoran;
  keterangan: string;
}

export const MutabaahTab: React.FC<MutabaahTabProps> = ({
  santriList,
  halaqahList,
  mutabaahRecords,
  onSaveSetoran,
  onDeleteSetoran,
  onUpdateSantriJuz,
  selectedDate
}) => {
  const [selectedHalaqahId, setSelectedHalaqahId] = useState<string>('ALL');
  const [selectedSesi, setSelectedSesi] = useState<SesiHalaqah>('SUBUH');
  const [musyrifInput, setMusyrifInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [tanggalInput, setTanggalInput] = useState<string>(selectedDate);
  const [isOverwrite, setIsOverwrite] = useState<boolean>(true);

  const [drafts, setDrafts] = useState<Record<string, MutabaahDraft>>({});
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [savedRowId, setSavedRowId] = useState<string | null>(null);

  // Sync tanggalInput with selectedDate if it changes
  useEffect(() => {
    setTanggalInput(selectedDate);
  }, [selectedDate]);

  // Auto set musyrif based on halaqah
  useEffect(() => {
    if (selectedHalaqahId !== 'ALL') {
      const hlq = halaqahList.find((h) => h.id === selectedHalaqahId);
      if (hlq && hlq.musyrif) {
        setMusyrifInput(hlq.musyrif);
      }
    }
  }, [selectedHalaqahId, halaqahList]);

  const filteredSantri = santriList.filter((s) => {
    const matchHalaqah = selectedHalaqahId === 'ALL' || s.halaqahId === selectedHalaqahId;
    const matchSearch =
      !searchQuery ||
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery);
    return matchHalaqah && matchSearch;
  });

  const getKualitasScore = (kualitas: KualitasSetoran): number => {
    switch (kualitas) {
      case 'SANGAT_LANCAR': return 95;
      case 'LANCAR': return 85;
      case 'CUKUP': return 75;
      case 'PERLU_ULANG': return 60;
      default: return 80;
    }
  };

  const handleDraftChange = (santriId: string, field: keyof MutabaahDraft, value: any) => {
    setDrafts(prev => {
      const existing = prev[santriId] || {
        jenis: 'ZIYADAH',
        surahNumber: 1, // default Al-Fatihah or 114
        surahSelesaiNumber: 1,
        ayatMulai: 1,
        ayatSelesai: 7,
        kualitas: 'SANGAT_LANCAR',
        keterangan: ''
      };
      
      const newDraft = { ...existing, [field]: value };
      
      if (field === 'surahNumber') {
        const surah = getSurahByNumber(Number(value));
        newDraft.surahSelesaiNumber = Number(value);
        newDraft.ayatMulai = 1;
        newDraft.ayatSelesai = surah ? Math.min(surah.totalAyat, 10) : '';
      }
      
      return { ...prev, [santriId]: newDraft };
    });
  };

  const saveSingleDraft = (santriId: string) => {
    const draft = drafts[santriId] || {
      jenis: 'ZIYADAH',
      surahNumber: 1,
      surahSelesaiNumber: 1,
      ayatMulai: 1,
      ayatSelesai: 7,
      kualitas: 'SANGAT_LANCAR',
      keterangan: ''
    };

    if (draft.ayatMulai === '' || draft.ayatSelesai === '') {
      alert('Mohon isi Ayat Mulai dan Ayat Selesai terlebih dahulu.');
      return;
    }
    
    const surahInfo = getSurahByNumber(draft.surahNumber);
    const surahSelesaiInfo = getSurahByNumber(draft.surahSelesaiNumber);
    if (!surahInfo || !surahSelesaiInfo) return;

    let finalSurahNama = surahInfo.latinName;
    if (draft.surahNumber !== draft.surahSelesaiNumber) {
      finalSurahNama = `${surahInfo.latinName} - ${surahSelesaiInfo.latinName}`;
    }

    const newRecord: MutabaahRecord = {
      id: `mtb-${Date.now()}-${santriId}`,
      santriId,
      tanggal: tanggalInput,
      sesi: selectedSesi,
      jenis: draft.jenis,
      surahNumber: draft.surahNumber,
      surahMulaiNumber: draft.surahNumber,
      surahSelesaiNumber: draft.surahSelesaiNumber,
      surahNama: finalSurahNama,
      ayatMulai: Number(draft.ayatMulai),
      ayatSelesai: Number(draft.ayatSelesai),
      juz: surahInfo.juzStart,
      kualitas: draft.kualitas,
      nilaiNum: getKualitasScore(draft.kualitas),
      catatanTajwid: draft.keterangan,
      musyrif: musyrifInput || 'Musyrif',
      createdAt: new Date().toISOString()
    };

    onSaveSetoran(newRecord, isOverwrite);
    
    // Auto update juz if ziyadah
    const santriObj = santriList.find((s) => s.id === santriId);
    if (draft.jenis === 'ZIYADAH' && santriObj && surahInfo.juzStart > (santriObj.currentJuz || 0)) {
      onUpdateSantriJuz(santriId, surahInfo.juzStart);
    }

    // Clear draft for this santri
    const newDrafts = { ...drafts };
    delete newDrafts[santriId];
    setDrafts(newDrafts);
    
    setSavedRowId(santriId);
    setTimeout(() => setSavedRowId(null), 2000);
  };

  const handleSaveAll = () => {
    let savedCount = 0;
    const newDrafts = { ...drafts };
    
    Object.keys(drafts).forEach(santriId => {
      const draft = drafts[santriId];
      if (draft && draft.ayatMulai !== '' && draft.ayatSelesai !== '') {
        const surahInfo = getSurahByNumber(draft.surahNumber);
        const surahSelesaiInfo = getSurahByNumber(draft.surahSelesaiNumber);
        if (surahInfo && surahSelesaiInfo) {
          
          let finalSurahNama = surahInfo.latinName;
          if (draft.surahNumber !== draft.surahSelesaiNumber) {
            finalSurahNama = `${surahInfo.latinName} - ${surahSelesaiInfo.latinName}`;
          }

          const newRecord: MutabaahRecord = {
            id: `mtb-${Date.now()}-${santriId}-${Math.random().toString(36).substr(2, 7)}`,
            santriId,
            tanggal: tanggalInput,
            sesi: selectedSesi,
            jenis: draft.jenis,
            surahNumber: draft.surahNumber,
            surahMulaiNumber: draft.surahNumber,
            surahSelesaiNumber: draft.surahSelesaiNumber,
            surahNama: finalSurahNama,
            ayatMulai: Number(draft.ayatMulai),
            ayatSelesai: Number(draft.ayatSelesai),
            juz: surahInfo.juzStart,
            kualitas: draft.kualitas,
            nilaiNum: getKualitasScore(draft.kualitas),
            catatanTajwid: draft.keterangan,
            musyrif: musyrifInput || 'Musyrif',
            createdAt: new Date().toISOString()
          };
          onSaveSetoran(newRecord, isOverwrite);
          savedCount++;
          
          const santriObj = santriList.find((s) => s.id === santriId);
          if (draft.jenis === 'ZIYADAH' && santriObj && surahInfo.juzStart > (santriObj.currentJuz || 0)) {
            onUpdateSantriJuz(santriId, surahInfo.juzStart);
          }
          
          delete newDrafts[santriId];
        }
      }
    });

    if (savedCount > 0) {
      setDrafts(newDrafts);
      setSuccessMsg(`${savedCount} data setoran mutaba'ah berhasil disimpan.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      alert('Tidak ada data setoran yang valid untuk disimpan.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Controls Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Mutaba'ah Setoran Hafalan Qur'an
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Input setoran Ziyadah (Hafalan Baru), Muraja'ah, atau Tasmi' santri
            </p>
          </div>

          {/* Sesi Selector Tabs */}
          <div className="w-full sm:w-auto grid grid-cols-2 sm:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            {[
              { id: 'SUBUH', label: 'Sesi Subuh', icon: Sunrise },
              { id: 'MAGHRIB', label: 'Sesi Maghrib', icon: Sunset },
            ].map((sesi) => {
              const Icon = sesi.icon;
              const isActive = selectedSesi === sesi.id;
              return (
                <button
                  key={sesi.id}
                  onClick={() => setSelectedSesi(sesi.id as SesiHalaqah)}
                  className={`flex items-center justify-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs border border-slate-200/60 dark:border-slate-700 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  <span>{sesi.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Pilih Halaqah
            </label>
            <select
              value={selectedHalaqahId}
              onChange={(e) => setSelectedHalaqahId(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="ALL">Semua Halaqah ({santriList.length} Santri)</option>
              {halaqahList.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Musyrif / Pembimbing
            </label>
            <input
              type="text"
              value={musyrifInput}
              onChange={(e) => setMusyrifInput(e.target.value)}
              placeholder="Nama Ustaz Musyrif"
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Tanggal Setoran
            </label>
            <input
              type="date"
              value={tanggalInput}
              onChange={(e) => setTanggalInput(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none cursor-pointer transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Cari Santri
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari santri..."
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Toolbar & Save All */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isOverwrite}
              onChange={(e) => setIsOverwrite(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Perbarui setoran jika sudah ada pada tanggal & sesi yang sama
            </span>
          </label>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setDrafts({});
                setSuccessMsg('');
              }}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer shrink-0"
              title="Reset Draft"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleSaveAll}
              className="flex-1 sm:flex-none w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition shadow-md shadow-emerald-700/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4 shrink-0" />
              <span>Simpan Semua Draft</span>
            </button>
          </div>
        </div>
        
        {successMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-3 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Santri Mutabaah Input Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Form Setoran Santri ({filteredSantri.length} Santri)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Sesi: <strong className="text-emerald-700 dark:text-emerald-400">{selectedSesi}</strong>
          </span>
        </div>
        
        {filteredSantri.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Tidak ada santri ditemukan</p>
          </div>
        ) : (
          <div>
            {/* Mobile Card List (md:hidden) - Touch friendly, zero button collision */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSantri.map((santri, index) => {
                const draft = drafts[santri.id] || {
                  jenis: 'ZIYADAH',
                  surahNumber: 1,
                  surahSelesaiNumber: 1,
                  ayatMulai: 1,
                  ayatSelesai: 7,
                  kualitas: 'SANGAT_LANCAR',
                  keterangan: ''
                };
                
                const todayRecords = mutabaahRecords.filter(
                  r => r.santriId === santri.id && r.tanggal === tanggalInput && r.sesi === selectedSesi
                );
                const isRecentlySaved = savedRowId === santri.id;

                return (
                  <div 
                    key={santri.id} 
                    className={`p-4 space-y-3 transition-colors ${isRecentlySaved ? 'bg-emerald-50/70 dark:bg-emerald-950/40' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'}`}
                  >
                    {/* Header: Name, NIS, Juz, and Today's History */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 text-[11px] font-bold flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate">
                            {santri.nama}
                          </h4>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            NIS: {santri.nis}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded shrink-0">
                        Juz {santri.currentJuz || 0}
                      </span>
                    </div>

                    {/* Today's setoran chips */}
                    {todayRecords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {todayRecords.map(rec => (
                          <div 
                            key={rec.id} 
                            className="text-[9px] font-semibold px-2 py-1 rounded-lg flex items-center justify-between gap-1.5 bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800"
                          >
                            <span>{rec.jenis}: {rec.surahNama} ({rec.ayatMulai}-{rec.ayatSelesai})</span>
                            <button 
                              onClick={() => onDeleteSetoran(rec.id)} 
                              className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                              title="Hapus setoran"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Input Controls Row 1: Jenis & Surah */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <label className="block text-[10px] text-slate-400 font-medium mb-1">Jenis</label>
                        <select
                          value={draft.jenis}
                          onChange={(e) => handleDraftChange(santri.id, 'jenis', e.target.value)}
                          className={`w-full text-xs font-semibold rounded-xl p-2 border focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                            draft.jenis === 'ZIYADAH' ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 
                            draft.jenis === 'MURAJAAH' ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                            'bg-purple-50/80 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                          }`}
                        >
                          <option value="ZIYADAH">Ziyadah</option>
                          <option value="MURAJAAH">Muraja'ah</option>
                          <option value="TASMI">Tasmi'</option>
                        </select>
                      </div>

                      <div className="col-span-7">
                        <label className="block text-[10px] text-slate-400 font-medium mb-1">Surah</label>
                        <select
                          value={draft.surahNumber}
                          onChange={(e) => handleDraftChange(santri.id, 'surahNumber', Number(e.target.value))}
                          className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          {QURAN_SURAHS.map((surah) => (
                            <option key={surah.number} value={surah.number}>
                              {surah.number}. {surah.latinName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Input Controls Row 2: Ayat Mulai, Ayat Selesai, Kualitas */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <label className="block text-[10px] text-slate-400 font-medium mb-1">Ayat Mulai - Selesai</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min={1}
                            placeholder="Mulai"
                            value={draft.ayatMulai}
                            onChange={(e) => handleDraftChange(santri.id, 'ayatMulai', e.target.value)}
                            className="w-full text-xs text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <span className="text-slate-400 text-xs">-</span>
                          <input
                            type="number"
                            min={1}
                            placeholder="Selesai"
                            value={draft.ayatSelesai}
                            onChange={(e) => handleDraftChange(santri.id, 'ayatSelesai', e.target.value)}
                            className="w-full text-xs text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="col-span-7">
                        <label className="block text-[10px] text-slate-400 font-medium mb-1">Kualitas Setoran</label>
                        <select
                          value={draft.kualitas}
                          onChange={(e) => handleDraftChange(santri.id, 'kualitas', e.target.value)}
                          className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                        >
                          <option value="SANGAT_LANCAR">Sangat Lancar (A)</option>
                          <option value="LANCAR">Lancar (B)</option>
                          <option value="CUKUP">Cukup (C)</option>
                          <option value="PERLU_ULANG">Ulangi (D)</option>
                        </select>
                      </div>
                    </div>

                    {/* Input Controls Row 3: Catatan Tajwid + Save Button */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={draft.keterangan}
                        onChange={(e) => handleDraftChange(santri.id, 'keterangan', e.target.value)}
                        placeholder="Catatan tajwid, makhraj, adab..."
                        className="flex-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => saveSingleDraft(santri.id)}
                        className={`h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 ${
                          isRecentlySaved 
                            ? 'bg-emerald-600 text-white shadow-xs' 
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                        }`}
                      >
                        {isRecentlySaved ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Tersimpan</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            <span>Simpan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 w-10 text-center">No</th>
                    <th className="p-3.5 w-44">Santri</th>
                    <th className="p-3.5 w-28">Jenis</th>
                    <th className="p-3.5 w-52">Surah</th>
                    <th className="p-3.5 w-28 text-center">Ayat</th>
                    <th className="p-3.5 w-36">Kualitas</th>
                    <th className="p-3.5 min-w-[140px]">Catatan Tajwid</th>
                    <th className="p-3.5 w-16 text-center">Simpan</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSantri.map((santri, index) => {
                    const draft = drafts[santri.id] || {
                      jenis: 'ZIYADAH',
                      surahNumber: 1,
                      surahSelesaiNumber: 1,
                      ayatMulai: 1,
                      ayatSelesai: 7,
                      kualitas: 'SANGAT_LANCAR',
                      keterangan: ''
                    };
                    
                    const todayRecords = mutabaahRecords.filter(
                      r => r.santriId === santri.id && r.tanggal === tanggalInput && r.sesi === selectedSesi
                    );
                    const isRecentlySaved = savedRowId === santri.id;
                    
                    return (
                      <tr 
                        key={santri.id} 
                        className={`transition-colors ${isRecentlySaved ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'}`}
                      >
                        <td className="p-3.5 text-center text-slate-400 text-xs font-medium align-middle">
                          {index + 1}
                        </td>
                        <td className="p-3.5 align-middle">
                          <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {santri.nama}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                            NIS {santri.nis} · Juz {santri.currentJuz || 0}
                          </div>
                          
                          {/* Today's setoran history tags */}
                          {todayRecords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {todayRecords.map(rec => (
                                <div 
                                  key={rec.id} 
                                  className="text-[9px] font-semibold px-2 py-0.5 rounded-md flex items-center justify-between gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60"
                                >
                                  <span>{rec.jenis}: {rec.surahNama} ({rec.ayatMulai}-{rec.ayatSelesai})</span>
                                  <button 
                                    onClick={() => onDeleteSetoran(rec.id)} 
                                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                                    title="Hapus setoran"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 align-middle">
                          <select
                            value={draft.jenis}
                            onChange={(e) => handleDraftChange(santri.id, 'jenis', e.target.value)}
                            className={`w-full text-xs font-semibold rounded-xl p-2 border focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer ${
                              draft.jenis === 'ZIYADAH' ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800' : 
                              draft.jenis === 'MURAJAAH' ? 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                              'bg-purple-50/80 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                            }`}
                          >
                            <option value="ZIYADAH">Ziyadah</option>
                            <option value="MURAJAAH">Muraja'ah</option>
                            <option value="TASMI">Tasmi'</option>
                          </select>
                        </td>
                        <td className="p-3.5 align-middle">
                          <div className="space-y-1.5">
                            <select
                              value={draft.surahNumber}
                              onChange={(e) => handleDraftChange(santri.id, 'surahNumber', Number(e.target.value))}
                              className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                            >
                              {QURAN_SURAHS.map((surah) => (
                                <option key={surah.number} value={surah.number}>
                                  {surah.number}. {surah.latinName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="p-3.5 align-middle">
                          <div className="flex items-center space-x-1">
                            <input
                              type="number"
                              min={1}
                              placeholder="Ayat"
                              value={draft.ayatMulai}
                              onChange={(e) => handleDraftChange(santri.id, 'ayatMulai', e.target.value)}
                              className="w-12 text-xs text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                            <span className="text-slate-400 text-xs">-</span>
                            <input
                              type="number"
                              min={1}
                              placeholder="Ayat"
                              value={draft.ayatSelesai}
                              onChange={(e) => handleDraftChange(santri.id, 'ayatSelesai', e.target.value)}
                              className="w-12 text-xs text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </td>
                        <td className="p-3.5 align-middle">
                          <select
                            value={draft.kualitas}
                            onChange={(e) => handleDraftChange(santri.id, 'kualitas', e.target.value)}
                            className="w-full text-xs font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                          >
                            <option value="SANGAT_LANCAR">Sangat Lancar (A)</option>
                            <option value="LANCAR">Lancar (B)</option>
                            <option value="CUKUP">Cukup (C)</option>
                            <option value="PERLU_ULANG">Ulangi (D)</option>
                          </select>
                        </td>
                        <td className="p-3.5 align-middle">
                          <input
                            type="text"
                            value={draft.keterangan}
                            onChange={(e) => handleDraftChange(santri.id, 'keterangan', e.target.value)}
                            placeholder="Tajwid, makhraj, adab..."
                            className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>
                        <td className="p-3.5 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => saveSingleDraft(santri.id)}
                            className={`p-2 rounded-xl transition-all flex items-center justify-center mx-auto cursor-pointer ${
                              isRecentlySaved 
                                ? 'bg-emerald-600 text-white shadow-xs' 
                                : 'bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            }`}
                            title="Simpan Setoran Santri Ini"
                          >
                            {isRecentlySaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Riwayat Setoran Log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Riwayat Setoran Sesi Ini
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {mutabaahRecords.filter(r => r.tanggal === tanggalInput && r.sesi === selectedSesi).length} Catatan Masuk
          </span>
        </div>
        
        <div className="p-0">
          {mutabaahRecords.filter(r => r.tanggal === tanggalInput && r.sesi === selectedSesi).length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Belum ada riwayat setoran pada tanggal dan sesi ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/40 dark:bg-slate-900/30 text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-3 w-16">Waktu</th>
                    <th className="p-3">Nama Santri</th>
                    <th className="p-3">Jenis</th>
                    <th className="p-3">Surah & Ayat</th>
                    <th className="p-3">Kualitas</th>
                    <th className="p-3">Catatan Tajwid</th>
                    <th className="p-3">Musyrif</th>
                    <th className="p-3 text-center w-12">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {mutabaahRecords
                    .filter(r => r.tanggal === tanggalInput && r.sesi === selectedSesi)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((record) => {
                      const santri = santriList.find(s => s.id === record.santriId);
                      return (
                        <tr key={record.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-3 text-slate-400">
                            {new Date(record.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                            {santri?.nama || 'Unknown'}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              record.jenis === 'ZIYADAH' ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' :
                              record.jenis === 'MURAJAAH' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' :
                              'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                            }`}>
                              {record.jenis}
                            </span>
                          </td>
                          <td className="p-3 font-medium text-slate-900 dark:text-white">
                            {record.surahNama} ({record.ayatMulai}-{record.ayatSelesai})
                          </td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">
                            {record.kualitas.replace('_', ' ')}
                          </td>
                          <td className="p-3 text-slate-500 italic">
                            {record.catatanTajwid || '—'}
                          </td>
                          <td className="p-3 text-slate-500">
                            {record.musyrif}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => onDeleteSetoran(record.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Hapus setoran"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
