import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Save,
  Search,
  CheckCircle2,
  Trash2,
  RefreshCw
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
      default: return 0;
    }
  };

  const handleDraftChange = (santriId: string, field: keyof MutabaahDraft, value: any) => {
    setDrafts(prev => {
      const existing = prev[santriId] || {
        jenis: 'ZIYADAH',
        surahNumber: 114, // default An-Nas for quick start
        surahSelesaiNumber: 114,
        ayatMulai: '',
        ayatSelesai: '',
        kualitas: 'SANGAT_LANCAR',
        keterangan: ''
      };
      
      const newDraft = { ...existing, [field]: value };
      
      // Auto logic if surah changes, reset ayat
      if (field === 'surahNumber') {
        newDraft.ayatMulai = '';
        newDraft.ayatSelesai = '';
        if (newDraft.surahSelesaiNumber < newDraft.surahNumber) {
          newDraft.surahSelesaiNumber = newDraft.surahNumber;
        }
      }
      
      return { ...prev, [santriId]: newDraft };
    });
  };

  const saveSingleDraft = (santriId: string) => {
    const draft = drafts[santriId];
    if (!draft || draft.ayatMulai === '' || draft.ayatSelesai === '') {
      alert('Mohon isi Surah, Ayat Mulai, dan Ayat Selesai terlebih dahulu.');
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
    if (draft.jenis === 'ZIYADAH' && santriObj && surahInfo.juzStart > santriObj.currentJuz) {
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
            id: `mtb-${Date.now()}-${santriId}-${Math.random().toString(36).substr(2, 9)}`,
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
          if (draft.jenis === 'ZIYADAH' && santriObj && surahInfo.juzStart > santriObj.currentJuz) {
            onUpdateSantriJuz(santriId, surahInfo.juzStart);
          }
          
          delete newDrafts[santriId];
        }
      }
    });

    if (savedCount > 0) {
      setDrafts(newDrafts);
      setSuccessMsg(`${savedCount} data setoran berhasil disimpan.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      alert('Tidak ada data setoran yang valid untuk disimpan. Pastikan ayat mulai dan selesai diisi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control Card */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Input Mutaba'ah</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Input setoran masal per santri</p>
          </div>

          {/* Sesi Selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['SUBUH', 'MAGHRIB'] as SesiHalaqah[]).map((sesi) => (
              <button
                key={sesi}
                onClick={() => setSelectedSesi(sesi)}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-all ${
                  selectedSesi === sesi
                    ? 'bg-white text-emerald-800 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sesi === 'SUBUH' ? 'Subuh' : 'Maghrib'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Pilih Halaqah</label>
            <select
              value={selectedHalaqahId}
              onChange={(e) => setSelectedHalaqahId(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Musyrif / Guru</label>
            <input
              type="text"
              value={musyrifInput}
              onChange={(e) => setMusyrifInput(e.target.value)}
              placeholder="Nama Ustaz Musyrif"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Tanggal Setoran</label>
            <input
              type="date"
              value={tanggalInput}
              onChange={(e) => setTanggalInput(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-1">Cari Santri</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari santri..."
                className="w-full text-xs pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 pt-3 border-t border-slate-100">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={isOverwrite}
              onChange={(e) => setIsOverwrite(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
              Timpa data setoran jika sudah ada di sesi dan tanggal yang sama (Overwrite)
            </span>
          </label>
          
          <div className="flex w-full sm:w-auto space-x-2">
            <button
              onClick={() => {
                setDrafts({});
                setSearchQuery('');
                setSelectedHalaqahId('ALL');
                setMusyrifInput('');
                setSuccessMsg('');
              }}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg transition flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={handleSaveAll}
              className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-6 rounded-lg transition shadow-md shadow-emerald-700/20 flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Semua Draft</span>
            </button>
          </div>
        </div>
        
        {successMsg && (
          <div className="mt-3 bg-emerald-50 border border-emerald-300 text-emerald-800 p-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Santri Mutabaah Input Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-800">Daftar Input Setoran</h3>
          <span className="text-xs text-slate-500 font-medium">Tanggal: <span className="font-bold text-slate-800">{tanggalInput}</span></span>
        </div>
        
        {filteredSantri.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Tidak ada santri ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white text-[11px] uppercase text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3 w-48">Nama Santri</th>
                  <th className="p-3 w-32">Jenis</th>
                  <th className="p-3 w-48">Surah (Mulai - Selesai)</th>
                  <th className="p-3 w-32 text-center">Ayat</th>
                  <th className="p-3 w-36">Kualitas</th>
                  <th className="p-3">Catatan</th>
                  <th className="p-3 w-20 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredSantri.map((santri, index) => {
                  const draft = drafts[santri.id] || {
                    jenis: 'ZIYADAH',
                    surahNumber: 114,
                    surahSelesaiNumber: 114,
                    ayatMulai: '',
                    ayatSelesai: '',
                    kualitas: 'SANGAT_LANCAR',
                    keterangan: ''
                  };
                  
                  // Get records for today/session for this santri to show history badges
                  const todayRecords = mutabaahRecords.filter(r => r.santriId === santri.id && r.tanggal === tanggalInput && r.sesi === selectedSesi);
                  const isRecentlySaved = savedRowId === santri.id;
                  
                  return (
                    <tr key={santri.id} className={`border-b border-slate-50 transition-colors ${isRecentlySaved ? 'bg-emerald-50' : 'hover:bg-slate-50/50'}`}>
                      <td className="p-3 text-center text-slate-400 font-medium align-top pt-4">{index + 1}</td>
                      <td className="p-3 align-top pt-4">
                        <div className="font-medium text-slate-900 leading-tight mb-1">{santri.nama}</div>
                        
                        {/* History Badges for today's session */}
                        {todayRecords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {todayRecords.map(rec => (
                              <div key={rec.id} className="text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center justify-between gap-1 border border-emerald-200 bg-emerald-50 text-emerald-700">
                                <span>{rec.jenis === 'ZIYADAH' ? 'Z' : rec.jenis === 'MURAJAAH' ? 'M' : 'T'}: {rec.surahNama} {rec.ayatMulai}-{rec.ayatSelesai}</span>
                                <button onClick={() => onDeleteSetoran(rec.id)} className="hover:text-rose-600 ml-1">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="p-3 align-top pt-3">
                        <select
                          value={draft.jenis}
                          onChange={(e) => handleDraftChange(santri.id, 'jenis', e.target.value)}
                          className={`w-full text-xs font-bold rounded p-1.5 border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                            draft.jenis === 'ZIYADAH' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            draft.jenis === 'MURAJAAH' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            'bg-purple-50 text-purple-700 border-purple-200'
                          }`}
                        >
                          <option value="ZIYADAH">Ziyadah</option>
                          <option value="MURAJAAH">Muraja'ah</option>
                          <option value="TASMI">Tasmi'</option>
                        </select>
                      </td>
                      <td className="p-3 align-top pt-3">
                        <div className="flex flex-col space-y-1.5">
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] text-slate-400 w-7">Dr:</span>
                            <select
                              value={draft.surahNumber}
                              onChange={(e) => handleDraftChange(santri.id, 'surahNumber', Number(e.target.value))}
                              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              {QURAN_SURAHS.map((surah) => (
                                <option key={surah.number} value={surah.number}>
                                  {surah.number}. {surah.latinName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] text-slate-400 w-7">Sp:</span>
                            <select
                              value={draft.surahSelesaiNumber}
                              onChange={(e) => handleDraftChange(santri.id, 'surahSelesaiNumber', Number(e.target.value))}
                              className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            >
                              {QURAN_SURAHS.map((surah) => (
                                <option key={surah.number} value={surah.number} disabled={surah.number < draft.surahNumber}>
                                  {surah.number}. {surah.latinName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 align-top pt-3">
                        <div className="flex flex-col space-y-1.5">
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] text-slate-400 w-7">Ay:</span>
                            <input
                              type="number"
                              list={`ayat-list-${draft.surahNumber}`}
                              placeholder="1"
                              min={1}
                              value={draft.ayatMulai}
                              onChange={(e) => handleDraftChange(santri.id, 'ayatMulai', e.target.value)}
                              className="w-full min-w-[36px] text-xs text-center bg-white border border-slate-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-[10px] text-slate-400 w-7">Ay:</span>
                            <input
                              type="number"
                              list={`ayat-list-${draft.surahSelesaiNumber}`}
                              placeholder="10"
                              min={1}
                              value={draft.ayatSelesai}
                              onChange={(e) => handleDraftChange(santri.id, 'ayatSelesai', e.target.value)}
                              className="w-full min-w-[36px] text-xs text-center bg-white border border-slate-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-3 align-top pt-3">
                        <select
                          value={draft.kualitas}
                          onChange={(e) => handleDraftChange(santri.id, 'kualitas', e.target.value)}
                          className="w-full text-xs font-semibold bg-white border border-slate-200 rounded p-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        >
                          <option value="SANGAT_LANCAR">Sangat Lancar (A)</option>
                          <option value="LANCAR">Lancar (B)</option>
                          <option value="CUKUP">Cukup (C)</option>
                          <option value="PERLU_ULANG">Ulangi (D)</option>
                        </select>
                      </td>
                      <td className="p-3 align-top pt-3">
                        <input
                          type="text"
                          value={draft.keterangan}
                          onChange={(e) => handleDraftChange(santri.id, 'keterangan', e.target.value)}
                          placeholder="Tajwid/Adab..."
                          className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </td>
                      <td className="p-3 text-center align-top pt-3 relative">
                        <div className="flex flex-col items-center">
                          <button
                            type="button"
                            onClick={() => saveSingleDraft(santri.id)}
                            className={`p-2 rounded border transition-colors flex items-center justify-center mb-1 ${
                              isRecentlySaved 
                                ? 'bg-emerald-500 text-white border-emerald-600' 
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white border-emerald-200'
                            }`}
                            title="Simpan Setoran"
                          >
                            {isRecentlySaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                          </button>
                          {isRecentlySaved && <span className="text-[10px] text-emerald-600 font-bold">Tersimpan</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Mutabaah Hari Ini */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-800">Riwayat Input Mutaba'ah</h3>
          <span className="text-xs text-slate-500 font-medium">Sesi: <span className="font-bold text-slate-800">{selectedSesi}</span> | Tanggal: <span className="font-bold text-slate-800">{tanggalInput}</span></span>
        </div>
        <div className="p-0">
          {mutabaahRecords.filter(r => r.tanggal === tanggalInput && r.sesi === selectedSesi).length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">Belum ada riwayat setoran pada sesi dan tanggal ini.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Nama Santri</th>
                    <th className="p-3">Jenis</th>
                    <th className="p-3">Surah & Ayat</th>
                    <th className="p-3">Kualitas</th>
                    <th className="p-3">Musyrif</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {mutabaahRecords
                    .filter(r => r.tanggal === tanggalInput && r.sesi === selectedSesi)
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((record) => {
                      const santri = santriList.find(s => s.id === record.santriId);
                      return (
                        <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                          <td className="p-3 text-slate-400">
                            {new Date(record.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-3 font-medium text-slate-800">{santri?.nama || 'Unknown'}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              record.jenis === 'ZIYADAH' ? 'bg-blue-100 text-blue-700' :
                              record.jenis === 'MURAJAAH' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {record.jenis}
                            </span>
                          </td>
                          <td className="p-3 font-medium">{record.surahNama} ({record.ayatMulai}-{record.ayatSelesai})</td>
                          <td className="p-3">{record.kualitas.replace('_', ' ')}</td>
                          <td className="p-3 text-slate-500">{record.musyrif}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => onDeleteSetoran(record.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded transition-colors"
                              title="Hapus"
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

      {/* Global Datalists for Ayat selection */}
      {QURAN_SURAHS.map((surah) => (
        <datalist key={`ayat-list-${surah.number}`} id={`ayat-list-${surah.number}`}>
          {Array.from({ length: surah.totalAyat }, (_, i) => (
            <option key={i + 1} value={i + 1} />
          ))}
        </datalist>
      ))}
    </div>
  );
};
