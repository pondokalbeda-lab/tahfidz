import React, { useState, useEffect, useRef } from 'react';
import {
  PesantrenInfo,
  Halaqah,
  Santri,
  AbsensiRecord,
  MutabaahRecord
} from './types';
import {
  loadPesantrenInfo,
  savePesantrenInfo,
  loadHalaqahList,
  saveHalaqahList,
  loadSantriList,
  saveSantriList,
  loadAbsensiRecords,
  saveAbsensiRecords,
  loadMutabaahRecords,
  saveMutabaahRecords
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { AbsensiTab } from './components/AbsensiTab';
import { MutabaahTab } from './components/MutabaahTab';
import { SantriTab } from './components/SantriTab';
import { RekapTab } from './components/RekapTab';
import { KelolaDataTab } from './components/KelolaDataTab';
import { DashboardTab } from './components/DashboardTab';
import { PengaturanTab } from './components/PengaturanTab';
import { NavigationTabBar } from './components/NavigationTabBar';
import { fetchFromCloud, syncToCloud } from './utils/api';
import { CheckCircle2, AlertCircle, RefreshCw, X } from 'lucide-react';

export default function App() {
  const [pesantrenInfo, setPesantrenInfo] = useState<PesantrenInfo>(loadPesantrenInfo);
  const [halaqahList, setHalaqahList] = useState<Halaqah[]>(loadHalaqahList);
  const [santriList, setSantriList] = useState<Santri[]>(loadSantriList);
  const [absensiRecords, setAbsensiRecords] = useState<AbsensiRecord[]>(loadAbsensiRecords);
  const [mutabaahRecords, setMutabaahRecords] = useState<MutabaahRecord[]>(loadMutabaahRecords);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'pengaturan' | 'kelola'>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('alfurqon_darkmode') === 'true';
  });

  // Cloud Database Connection State
  const [cloudStatus, setCloudStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [syncBanner, setSyncBanner] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Auto-sync debounce ref
  const autoSyncTimeoutRef = useRef<any>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('alfurqon_darkmode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('alfurqon_darkmode', 'false');
    }
  }, [darkMode]);

  const refreshAllDataFromStorage = () => {
    setPesantrenInfo(loadPesantrenInfo());
    setHalaqahList(loadHalaqahList());
    setSantriList(loadSantriList());
    setAbsensiRecords(loadAbsensiRecords());
    setMutabaahRecords(loadMutabaahRecords());
  };

  // Pull fresh data from Google Apps Script / Spreadsheet database into HTML
  const pullFromDatabase = async (isManualClick: boolean = false) => {
    setCloudStatus('syncing');
    if (isManualClick) {
      setSyncBanner({ text: 'Menghubungi Google Spreadsheet database...', type: 'info' });
    }

    try {
      const res = await fetchFromCloud();
      if (res.success && res.data) {
        setPesantrenInfo(res.data.pesantren);
        setHalaqahList(res.data.halaqah);
        setSantriList(res.data.santri);
        setAbsensiRecords(res.data.absensi);
        setMutabaahRecords(res.data.mutabaah);

        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
        setCloudStatus('synced');

        if (isManualClick) {
          setSyncBanner({
            text: `Data database berhasil dimuat (${res.data.halaqah.length} halaqah, ${res.data.santri.length} santri, ${res.data.mutabaah.length} setoran).`,
            type: 'success'
          });
          setTimeout(() => setSyncBanner(null), 4000);
        }
      } else {
        setCloudStatus('error');
        if (isManualClick) {
          setSyncBanner({
            text: res.message || 'Gagal mengambil data dari Google Spreadsheet.',
            type: 'error'
          });
          setTimeout(() => setSyncBanner(null), 5000);
        }
      }
    } catch (err: any) {
      setCloudStatus('error');
      if (isManualClick) {
        setSyncBanner({
          text: err?.message || 'Koneksi terputus ke Google Spreadsheet.',
          type: 'error'
        });
        setTimeout(() => setSyncBanner(null), 5000);
      }
    }
  };

  // Automatically fetch from database upon application mount
  useEffect(() => {
    pullFromDatabase(false);
  }, []);

  // Background auto-sync to Google Spreadsheet when mutations occur
  const triggerBackgroundSave = (updatedData?: {
    pesantren?: PesantrenInfo;
    halaqah?: Halaqah[];
    santri?: Santri[];
    absensi?: AbsensiRecord[];
    mutabaah?: MutabaahRecord[];
  }) => {
    if (autoSyncTimeoutRef.current) {
      clearTimeout(autoSyncTimeoutRef.current);
    }

    autoSyncTimeoutRef.current = setTimeout(async () => {
      setCloudStatus('syncing');
      const res = await syncToCloud(undefined, updatedData);
      if (res.success) {
        const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        setLastSyncTime(timeStr);
        setCloudStatus('synced');
      } else {
        setCloudStatus('error');
      }
    }, 1500); // 1.5s debounce to avoid excessive sheet writes
  };

  // Absensi handlers
  const handleSaveAbsensi = (newRecords: AbsensiRecord[]) => {
    setAbsensiRecords(newRecords);
    saveAbsensiRecords(newRecords);
    triggerBackgroundSave({ absensi: newRecords });
  };

  // Mutabaah handlers
  const handleSaveSetoran = (newRecord: MutabaahRecord, overwrite: boolean = false) => {
    let updated = [...mutabaahRecords];
    if (overwrite) {
      const existingIndex = updated.findIndex(r => 
        r.santriId === newRecord.santriId && 
        r.tanggal === newRecord.tanggal && 
        r.sesi === newRecord.sesi && 
        r.jenis === newRecord.jenis
      );
      
      if (existingIndex !== -1) {
        newRecord.id = updated[existingIndex].id;
        updated[existingIndex] = newRecord;
      } else {
        updated = [newRecord, ...updated];
      }
    } else {
      updated = [newRecord, ...updated];
    }
    
    setMutabaahRecords(updated);
    saveMutabaahRecords(updated);
    triggerBackgroundSave({ mutabaah: updated });
  };

  const handleDeleteSetoran = (id: string) => {
    const updated = mutabaahRecords.filter((r) => r.id !== id);
    setMutabaahRecords(updated);
    saveMutabaahRecords(updated);
    triggerBackgroundSave({ mutabaah: updated });
  };

  const handleUpdateSantriJuz = (santriId: string, newJuz: number) => {
    const updated = santriList.map((s) =>
      s.id === santriId ? { ...s, currentJuz: newJuz } : s
    );
    setSantriList(updated);
    saveSantriList(updated);
    triggerBackgroundSave({ santri: updated });
  };

  // Santri CRUD handlers
  const handleAddSantri = (newSantri: Santri) => {
    const updated = [...santriList, newSantri];
    setSantriList(updated);
    saveSantriList(updated);
    triggerBackgroundSave({ santri: updated });
  };

  const handleEditSantri = (updatedSantri: Santri) => {
    const updated = santriList.map((s) => (s.id === updatedSantri.id ? updatedSantri : s));
    setSantriList(updated);
    saveSantriList(updated);
    triggerBackgroundSave({ santri: updated });
  };

  const handleDeleteSantri = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data santri ini?')) {
      const updated = santriList.filter((s) => s.id !== id);
      setSantriList(updated);
      saveSantriList(updated);
      triggerBackgroundSave({ santri: updated });
    }
  };

  const handleSaveSantriList = (list: Santri[]) => {
    setSantriList(list);
    saveSantriList(list);
    triggerBackgroundSave({ santri: list });
  };

  // Pesantren Info & Halaqah List handlers
  const handleSavePesantrenInfo = (info: PesantrenInfo) => {
    setPesantrenInfo(info);
    savePesantrenInfo(info);
    triggerBackgroundSave({ pesantren: info });
  };

  const handleSaveHalaqahList = (list: Halaqah[]) => {
    setHalaqahList(list);
    saveHalaqahList(list);
    triggerBackgroundSave({ halaqah: list });
  };

  // Header quick metrics calculations
  const todaySetoranCount = mutabaahRecords.filter(
    (m) => m.tanggal === selectedDate
  ).length;

  const todayAbsensi = absensiRecords.filter((a) => a.tanggal === selectedDate);
  const todayHadir = todayAbsensi.filter((a) => a.status === 'HADIR').length;
  const todayAttendancePercent =
    todayAbsensi.length > 0 ? Math.round((todayHadir / todayAbsensi.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-flow-container font-sans text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-900 relative overflow-x-hidden">
      {/* Decorative ambient background wave flow (Alur Background) */}
      <svg className="wave-flow-svg hidden sm:block pointer-events-none" viewBox="0 0 1440 280" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100 120 C 300 220, 600 40, 1000 160 C 1200 220, 1400 120, 1600 140" stroke="currentColor" className="text-emerald-500/10 dark:text-emerald-400/15" strokeWidth="2.5" strokeDasharray="6 8" />
        <path d="M-50 180 C 350 260, 750 90, 1150 210 C 1350 270, 1500 190, 1650 200" stroke="currentColor" className="text-amber-500/10 dark:text-amber-400/12" strokeWidth="2" />
        <path d="M0 60 C 400 150, 800 20, 1200 120 C 1400 170, 1550 110, 1680 130" stroke="currentColor" className="text-sky-500/10 dark:text-sky-400/10" strokeWidth="1.5" />
      </svg>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Main Header / Navbar */}
        <Navbar
          pesantrenInfo={pesantrenInfo}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          totalSantri={santriList.length}
          todaySetoranCount={todaySetoranCount}
          todayAttendancePercent={todayAttendancePercent}
          onRefreshData={() => pullFromDatabase(true)}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
          cloudStatus={cloudStatus}
          lastSyncTime={lastSyncTime}
          onSyncCloud={() => pullFromDatabase(true)}
        />

        {/* Dedicated Navigation Tab Bar for Tablet & Mobile (Pilihan Tab) */}
        <div className="xl:hidden">
          <NavigationTabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Global Toast / Notification Banner */}
        {syncBanner && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div
              className={`p-3 rounded-xl border flex items-center justify-between shadow-xs transition-all ${
                syncBanner.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : syncBanner.type === 'error'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                  : 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-200'
              }`}
            >
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium">
                {syncBanner.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                {syncBanner.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}
                {syncBanner.type === 'info' && <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />}
                <span>{syncBanner.text}</span>
              </div>
              <button
                onClick={() => setSyncBanner(null)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
              >
                <X className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Content Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {activeTab === 'dashboard' && (
            <DashboardTab
              pesantrenInfo={pesantrenInfo}
              totalSantri={santriList.length}
              todaySetoranCount={todaySetoranCount}
              todayAttendancePercent={todayAttendancePercent}
              selectedDate={selectedDate}
              halaqahList={halaqahList}
              santriList={santriList}
              mutabaahRecords={mutabaahRecords}
              absensiRecords={absensiRecords}
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}
          {activeTab === 'absensi' && (
            <AbsensiTab
              santriList={santriList}
              halaqahList={halaqahList}
              absensiRecords={absensiRecords}
              onSaveAbsensi={handleSaveAbsensi}
              selectedDate={selectedDate}
            />
          )}

          {activeTab === 'mutabaah' && (
            <MutabaahTab
              santriList={santriList}
              halaqahList={halaqahList}
              mutabaahRecords={mutabaahRecords}
              onSaveSetoran={handleSaveSetoran}
              onDeleteSetoran={handleDeleteSetoran}
              onUpdateSantriJuz={handleUpdateSantriJuz}
              selectedDate={selectedDate}
            />
          )}

          {activeTab === 'santri' && (
            <SantriTab
              santriList={santriList}
              halaqahList={halaqahList}
              absensiRecords={absensiRecords}
              mutabaahRecords={mutabaahRecords}
              onAddSantri={handleAddSantri}
              onEditSantri={handleEditSantri}
              onDeleteSantri={handleDeleteSantri}
            />
          )}

          {activeTab === 'rekap' && (
            <RekapTab
              santriList={santriList}
              halaqahList={halaqahList}
              absensiRecords={absensiRecords}
              mutabaahRecords={mutabaahRecords}
              selectedDate={selectedDate}
            />
          )}

          {activeTab === 'pengaturan' && (
            <PengaturanTab
              halaqahList={halaqahList}
              onSaveHalaqahList={handleSaveHalaqahList}
              santriList={santriList}
              onSaveSantriList={handleSaveSantriList}
              pesantrenInfo={pesantrenInfo}
              onSavePesantrenInfo={handleSavePesantrenInfo}
              onRefreshData={() => pullFromDatabase(true)}
            />
          )}

          {activeTab === 'kelola' && (
            <KelolaDataTab
              pesantrenInfo={pesantrenInfo}
              onSavePesantrenInfo={handleSavePesantrenInfo}
              halaqahList={halaqahList}
              onSaveHalaqahList={handleSaveHalaqahList}
              santriList={santriList}
              onSaveSantriList={handleSaveSantriList}
              onRefreshData={() => pullFromDatabase(true)}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-md bg-emerald-600/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
              AF
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-200">
                {pesantrenInfo.nama || 'Pesantren Tahfidz Al-Furqon'}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                {pesantrenInfo.lembaga || 'Yayasan Al-Furqon'} · TA {pesantrenInfo.tahunAjaran || '2024/2025'} ({pesantrenInfo.semester || 'Ganjil'})
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Database: Google Spreadsheet Cloud</span>
            <span>•</span>
            <span>Sistem Informasi Mutaba'ah & Presensi Tahfidz</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
