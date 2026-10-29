import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  CheckCircle2,
  Users,
  CheckCheck,
  Search,
  Save,
  Calendar,
  Sparkles,
  Sun,
  Sunset,
  Sunrise,
  Moon,
  Clock
} from 'lucide-react';
import {
  Santri,
  Halaqah,
  AbsensiRecord,
  SesiHalaqah,
  KehadiranStatus
} from '../types';
import { formatTanggalIndo, formatKehadiranBadge } from '../utils/storage';

interface AbsensiTabProps {
  santriList: Santri[];
  halaqahList: Halaqah[];
  absensiRecords: AbsensiRecord[];
  onSaveAbsensi: (records: AbsensiRecord[]) => void;
  selectedDate: string;
}

export const AbsensiTab: React.FC<AbsensiTabProps> = ({
  santriList,
  halaqahList,
  absensiRecords,
  onSaveAbsensi,
  selectedDate
}) => {
  const [selectedHalaqahId, setSelectedHalaqahId] = useState<string>('ALL');
  const [selectedSesi, setSelectedSesi] = useState<SesiHalaqah>('SUBUH');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [musyrifInput, setMusyrifInput] = useState<string>('Ust. Pengampu');
  const [tanggalInput, setTanggalInput] = useState<string>(selectedDate);
  const [successMsg, setSuccessMsg] = useState<string>('');

  useEffect(() => {
    setTanggalInput(selectedDate);
  }, [selectedDate]);

  // Set default musyrif if single halaqah selected
  useEffect(() => {
    if (selectedHalaqahId !== 'ALL') {
      const hlq = halaqahList.find((h) => h.id === selectedHalaqahId);
      if (hlq && hlq.musyrif) setMusyrifInput(hlq.musyrif);
    }
  }, [selectedHalaqahId, halaqahList]);

  // Filter santri
  const filteredSantri = santriList.filter((s) => {
    const matchHalaqah = selectedHalaqahId === 'ALL' || s.halaqahId === selectedHalaqahId;
    const matchSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery);
    return matchHalaqah && matchSearch;
  });

  const [localAttendanceMap, setLocalAttendanceMap] = useState<
    Record<string, { status: KehadiranStatus; keterangan: string }>
  >(() => {
    const sessionRecords = absensiRecords.filter(
      (r) => r.tanggal === selectedDate && r.sesi === 'SUBUH'
    );
    const map: Record<string, { status: KehadiranStatus; keterangan: string }> = {};
    sessionRecords.forEach((r) => {
      map[r.santriId] = { status: r.status, keterangan: r.keterangan || '' };
    });
    return map;
  });

  // Update local map when date or session changes
  useEffect(() => {
    const sessionRecords = absensiRecords.filter(
      (r) => r.tanggal === tanggalInput && r.sesi === selectedSesi
    );
    const map: Record<string, { status: KehadiranStatus; keterangan: string }> = {};
    sessionRecords.forEach((r) => {
      map[r.santriId] = { status: r.status, keterangan: r.keterangan || '' };
    });
    setLocalAttendanceMap(map);
  }, [tanggalInput, selectedSesi, absensiRecords]);

  const handleStatusChange = (santriId: string, status: KehadiranStatus) => {
    setLocalAttendanceMap((prev) => ({
      ...prev,
      [santriId]: {
        status,
        keterangan: prev[santriId]?.keterangan || ''
      }
    }));
  };

  const handleKeteranganChange = (santriId: string, text: string) => {
    setLocalAttendanceMap((prev) => ({
      ...prev,
      [santriId]: {
        status: prev[santriId]?.status || 'HADIR',
        keterangan: text
      }
    }));
  };

  const handleMarkAllHadir = () => {
    const updatedMap = { ...localAttendanceMap };
    filteredSantri.forEach((s) => {
      updatedMap[s.id] = {
        status: 'HADIR',
        keterangan: updatedMap[s.id]?.keterangan || ''
      };
    });
    setLocalAttendanceMap(updatedMap);
  };

  const handleSave = () => {
    const otherRecords = absensiRecords.filter(
      (r) => !(r.tanggal === tanggalInput && r.sesi === selectedSesi)
    );

    const newSessionRecords: AbsensiRecord[] = [];
    Object.entries(localAttendanceMap).forEach(([santriId, item]) => {
      const data = item as { status: KehadiranStatus; keterangan: string };
      newSessionRecords.push({
        id: `abs-${Date.now()}-${santriId}`,
        santriId,
        tanggal: tanggalInput,
        sesi: selectedSesi,
        status: data.status,
        keterangan: data.keterangan,
        musyrif: musyrifInput,
        createdAt: new Date().toISOString()
      });
    });

    onSaveAbsensi([...otherRecords, ...newSessionRecords]);
    
    setSuccessMsg(`Presensi ${newSessionRecords.length} santri berhasil disimpan!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const stats = {
    total: filteredSantri.length,
    hadir: filteredSantri.filter((s) => localAttendanceMap[s.id]?.status === 'HADIR').length,
    izin: filteredSantri.filter((s) => localAttendanceMap[s.id]?.status === 'IZIN').length,
    sakit: filteredSantri.filter((s) => localAttendanceMap[s.id]?.status === 'SAKIT').length,
    alpa: filteredSantri.filter((s) => localAttendanceMap[s.id]?.status === 'ALPA').length,
    unmarked: filteredSantri.filter((s) => !localAttendanceMap[s.id]?.status).length
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Presensi Kehadiran Halaqah
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {formatTanggalIndo(tanggalInput)} · Catat presensi santri per sesi halaqah secara cepat dan presisi
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

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Kelompok Halaqah
            </label>
            <select
              value={selectedHalaqahId}
              onChange={(e) => setSelectedHalaqahId(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="ALL">Semua Halaqah ({santriList.length} Santri)</option>
              {halaqahList.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.nama} ({santriList.filter((s) => s.halaqahId === h.id).length} Santri)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Ustaz Musyrif / Pengampu
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
              Tanggal Presensi
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
              Cari Santri / NIS
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama santri..."
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleMarkAllHadir}
            className="w-full sm:w-auto bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Tandai Semua Hadir</span>
          </button>

          <button
            onClick={handleSave}
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition shadow-md shadow-emerald-700/20 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span>Simpan Presensi Sesi Ini</span>
          </button>
        </div>

        {successMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 p-3 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Live Attendance Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 text-xs">
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50 text-center">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold block text-[11px]">Hadir</span>
            <span className="text-lg font-extrabold text-emerald-900 dark:text-emerald-200">{stats.hadir}</span>
          </div>
          <div className="bg-amber-50/60 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-100 dark:border-amber-900/50 text-center">
            <span className="text-amber-700 dark:text-amber-400 font-semibold block text-[11px]">Izin</span>
            <span className="text-lg font-extrabold text-amber-900 dark:text-amber-200">{stats.izin}</span>
          </div>
          <div className="bg-blue-50/60 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/50 text-center">
            <span className="text-blue-700 dark:text-blue-400 font-semibold block text-[11px]">Sakit</span>
            <span className="text-lg font-extrabold text-blue-900 dark:text-blue-200">{stats.sakit}</span>
          </div>
          <div className="bg-rose-50/60 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-100 dark:border-rose-900/50 text-center">
            <span className="text-rose-700 dark:text-rose-400 font-semibold block text-[11px]">Alpa</span>
            <span className="text-lg font-extrabold text-rose-900 dark:text-rose-200">{stats.alpa}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 text-center">
            <span className="text-slate-500 dark:text-slate-400 font-semibold block text-[11px]">Belum Diisi</span>
            <span className="text-lg font-extrabold text-slate-800 dark:text-slate-300">{stats.unmarked}</span>
          </div>
        </div>

      </div>

      {/* Santri Attendance Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Daftar Santri ({filteredSantri.length} santri)
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Sesi: <strong className="text-emerald-700 dark:text-emerald-400">{selectedSesi}</strong>
          </span>
        </div>
        
        {filteredSantri.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Tidak ada santri ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Sesuaikan filter halaqah atau kata kunci pencarian</p>
          </div>
        ) : (
          <div>
            {/* Mobile Card List (md:hidden) - Zero collision, full width touch targets */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSantri.map((santri, index) => {
                const currentStatus = localAttendanceMap[santri.id]?.status;
                const currentKet = localAttendanceMap[santri.id]?.keterangan || '';
                const halaqahObj = halaqahList.find((h) => h.id === santri.halaqahId);

                return (
                  <div key={santri.id} className="p-4 space-y-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
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
                            NIS: {santri.nis} · {halaqahObj?.nama || 'General'}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded shrink-0">
                        Juz {santri.currentJuz || 0}
                      </span>
                    </div>

                    {/* 4 Status Buttons in dedicated equal grid columns */}
                    <div className="grid grid-cols-4 gap-1.5 w-full">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(santri.id, 'HADIR')}
                        className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          currentStatus === 'HADIR'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 active:bg-emerald-50 active:text-emerald-700'
                        }`}
                      >
                        Hadir
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(santri.id, 'IZIN')}
                        className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          currentStatus === 'IZIN'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 active:bg-amber-50 active:text-amber-700'
                        }`}
                      >
                        Izin
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(santri.id, 'SAKIT')}
                        className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          currentStatus === 'SAKIT'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 active:bg-blue-50 active:text-blue-700'
                        }`}
                      >
                        Sakit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(santri.id, 'ALPA')}
                        className={`h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          currentStatus === 'ALPA'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 active:bg-rose-50 active:text-rose-700'
                        }`}
                      >
                        Alpa
                      </button>
                    </div>

                    {/* Note Input */}
                    <input
                      type="text"
                      value={currentKet}
                      onChange={(e) => handleKeteranganChange(santri.id, e.target.value)}
                      placeholder="Catatan / keterangan (opsional)..."
                      className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (hidden md:block) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-[11px] uppercase text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 w-12 text-center">No</th>
                    <th className="p-3.5">Nama Santri</th>
                    <th className="p-3.5">Halaqah</th>
                    <th className="p-3.5 min-w-[280px]">Status Kehadiran</th>
                    <th className="p-3.5 min-w-[200px]">Catatan / Keterangan</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSantri.map((santri, index) => {
                    const currentStatus = localAttendanceMap[santri.id]?.status;
                    const currentKet = localAttendanceMap[santri.id]?.keterangan || '';
                    const halaqahObj = halaqahList.find((h) => h.id === santri.halaqahId);
                    
                    return (
                      <tr key={santri.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 text-center text-slate-400 dark:text-slate-500 text-xs font-medium">
                          {index + 1}
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {santri.nama}
                          </div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                            NIS: {santri.nis}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                            {halaqahObj?.nama || 'General'}
                          </div>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                            Capaian Juz {santri.currentJuz || 0}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStatusChange(santri.id, 'HADIR')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                currentStatus === 'HADIR'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-700'
                              }`}
                            >
                              Hadir
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(santri.id, 'IZIN')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                currentStatus === 'IZIN'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-700'
                              }`}
                            >
                              Izin
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(santri.id, 'SAKIT')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                currentStatus === 'SAKIT'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-700'
                              }`}
                            >
                              Sakit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(santri.id, 'ALPA')}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                currentStatus === 'ALPA'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-700'
                              }`}
                            >
                              Alpa
                            </button>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <input
                            type="text"
                            value={currentKet}
                            onChange={(e) => handleKeteranganChange(santri.id, e.target.value)}
                            placeholder="Catatan izin/sakit..."
                            className="w-full text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                          />
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

    </div>
  );
};
