import React, { useState, useEffect } from 'react';
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

export default function App() {
  const [pesantrenInfo, setPesantrenInfo] = useState<PesantrenInfo>(loadPesantrenInfo);
  const [halaqahList, setHalaqahList] = useState<Halaqah[]>(loadHalaqahList);
  const [santriList, setSantriList] = useState<Santri[]>(loadSantriList);
  const [absensiRecords, setAbsensiRecords] = useState<AbsensiRecord[]>(loadAbsensiRecords);
  const [mutabaahRecords, setMutabaahRecords] = useState<MutabaahRecord[]>(loadMutabaahRecords);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'absensi' | 'mutabaah' | 'santri' | 'rekap' | 'kelola'>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('alfurqon_darkmode') === 'true';
  });

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

  // Absensi handlers
  const handleSaveAbsensi = (newRecords: AbsensiRecord[]) => {
    setAbsensiRecords(newRecords);
    saveAbsensiRecords(newRecords);
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
  };

  const handleDeleteSetoran = (id: string) => {
    const updated = mutabaahRecords.filter((r) => r.id !== id);
    setMutabaahRecords(updated);
    saveMutabaahRecords(updated);
  };

  const handleUpdateSantriJuz = (santriId: string, newJuz: number) => {
    const updated = santriList.map((s) =>
      s.id === santriId ? { ...s, currentJuz: newJuz } : s
    );
    setSantriList(updated);
    saveSantriList(updated);
  };

  // Santri CRUD handlers
  const handleAddSantri = (newSantri: Santri) => {
    const updated = [...santriList, newSantri];
    setSantriList(updated);
    saveSantriList(updated);
  };

  const handleEditSantri = (updatedSantri: Santri) => {
    const updated = santriList.map((s) => (s.id === updatedSantri.id ? updatedSantri : s));
    setSantriList(updated);
    saveSantriList(updated);
  };

  const handleDeleteSantri = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data santri ini?')) {
      const updated = santriList.filter((s) => s.id !== id);
      setSantriList(updated);
      saveSantriList(updated);
    }
  };

  const handleSaveSantriList = (list: Santri[]) => {
    setSantriList(list);
    saveSantriList(list);
  };

  // Pesantren Info & Halaqah List handlers
  const handleSavePesantrenInfo = (info: PesantrenInfo) => {
    setPesantrenInfo(info);
    savePesantrenInfo(info);
  };

  const handleSaveHalaqahList = (list: Halaqah[]) => {
    setHalaqahList(list);
    saveHalaqahList(list);
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <div>
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
          onRefreshData={refreshAllDataFromStorage}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {/* Tab Content Body */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === 'dashboard' && (
            <DashboardTab
              pesantrenInfo={pesantrenInfo}
              totalSantri={santriList.length}
              todaySetoranCount={todaySetoranCount}
              todayAttendancePercent={todayAttendancePercent}
              selectedDate={selectedDate}
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

          {activeTab === 'kelola' && (
            <KelolaDataTab
              pesantrenInfo={pesantrenInfo}
              onSavePesantrenInfo={handleSavePesantrenInfo}
              halaqahList={halaqahList}
              onSaveHalaqahList={handleSaveHalaqahList}
              santriList={santriList}
              onSaveSantriList={handleSaveSantriList}
              onRefreshData={refreshAllDataFromStorage}
            />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-300">
            {pesantrenInfo.nama} — {pesantrenInfo.lembaga}
          </p>
          <p className="text-slate-500">
            Sistem Informasi Mutaba'ah Setoran Hafalan Al-Qur'an & Absensi Presensi Santri
          </p>
        </div>
      </footer>
    </div>
  );
}
