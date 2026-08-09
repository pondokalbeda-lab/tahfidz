import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  HelpCircle,
  Users,
  CheckCheck,
  Search,
  Filter,
  Save,
  Calendar,
  Sparkles,
  FileText
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
  const [musyrifInput, setMusyrifInput] = useState<string>('Ust. Musyrif Halaqah');
  const [tanggalInput, setTanggalInput] = useState<string>(selectedDate);
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Sync tanggalInput with selectedDate if it changes
  React.useEffect(() => {
    setTanggalInput(selectedDate);
  }, [selectedDate]);

  // Filter santri
  const filteredSantri = santriList.filter((s) => {
    const matchHalaqah = selectedHalaqahId === 'ALL' || s.halaqahId === selectedHalaqahId;
    const matchSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery);
    return matchHalaqah && matchSearch;
  });

  // Get current active record map for date & session: Map<santriId, {status, keterangan}>
  const currentSessionRecords = absensiRecords.filter(
    (r) => r.tanggal === tanggalInput && r.sesi === selectedSesi
  );

  const [localAttendanceMap, setLocalAttendanceMap] = useState<
    Record<string, { status: KehadiranStatus; keterangan: string }>
  >(() => {
    const map: Record<string, { status: KehadiranStatus; keterangan: string }> = {};
    currentSessionRecords.forEach((r) => {
      map[r.santriId] = { status: r.status, keterangan: r.keterangan || '' };
    });
    return map;
  });

  // Update local map when date or session changes
  React.useEffect(() => {
    const sessionRecords = absensiRecords.filter(
      (r) => r.tanggal === tanggalInput && r.sesi === selectedSesi
    );
    const map: Record<string, { status: KehadiranStatus; keterangan: string }> = {};
    sessionRecords.forEach((r) => {
      map[r.santriId] = { status: r.status, keterangan: r.keterangan || '' };
    });
    setLocalAttendanceMap(map);
  }, [tanggalInput, selectedSesi, absensiRecords]);

  // Set default musyrif if single halaqah selected
  React.useEffect(() => {
    if (selectedHalaqahId !== 'ALL') {
      const hlq = halaqahList.find((h) => h.id === selectedHalaqahId);
      if (hlq) setMusyrifInput(hlq.musyrif);
    }
  }, [selectedHalaqahId, halaqahList]);

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
    // Generate updated records array
    // Filter out existing records for this date and session
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
    
    setSuccessMsg(`Kehadiran ${newSessionRecords.length} santri berhasil disimpan!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleLiburAll = () => {
    const newMap = { ...localAttendanceMap };
    filteredSantri.forEach((s) => {
      newMap[s.id] = { status: 'LIBUR', keterangan: 'Libur Halaqah' };
    });
    setLocalAttendanceMap(newMap);
  };

  // Stats for this session view
  const stats = {
    total: filteredSantri.length,
    hadir: filteredSantri.filter((s) => localAttendanceMap[s.id]?.status === 'HADIR').length,
    izin: filteredSantri.filter((s) => localAttendanceMap[s.id]?.status === 'IZIN').length,
    sakit: filteredSantri.filter((s) => localAttendanceMap[s.id]?.status === 'SAKIT').length,
    alpa: filteredSantri.filter((s) => localAttendanceMap[s.id]?.status === 'ALPA').length,
    uzur: filteredSantri.filter((s) => localAttendanceMap[s.id]?.status === 'UZUR').length,
    unmarked: filteredSantri.filter((s) => !localAttendanceMap[s.id]?.status).length
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Control Card */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-xl font-bold text-slate-800">Presensi Kehadiran Halaqah</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {formatTanggalIndo(tanggalInput)} — Catat kehadiran santri secara cepat per sesi halaqah
            </p>
          </div>

          {/* Sesi Selector Tabs */}
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
                {sesi === 'SUBUH' && '🌅 Sesi Subuh'}
                {sesi === 'MAGHRIB' && '🌙 Sesi Maghrib'}
              </button>
            ))}
          </div>
        </div>

        {/* Filters and Search Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Pilih Halaqah
            </label>
            <select
              value={selectedHalaqahId}
              onChange={(e) => setSelectedHalaqahId(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Musyrif / Pengampu
            </label>
            <input
              type="text"
              value={musyrifInput}
              onChange={(e) => setMusyrifInput(e.target.value)}
              placeholder="Nama Ustaz Musyrif"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Tanggal Kehadiran
            </label>
            <input
              type="date"
              value={tanggalInput}
              onChange={(e) => setTanggalInput(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Cari Nama / NIS
            </label>
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

          <div className="flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="flex w-full sm:w-auto space-x-2">
              <button
                onClick={handleLiburAll}
                className="flex-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-semibold py-2.5 px-3 rounded-lg transition flex items-center justify-center space-x-1.5"
              >
                <span>Libur Semua</span>
              </button>
              <button
                onClick={handleMarkAllHadir}
                className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold py-2.5 px-3 rounded-lg transition flex items-center justify-center space-x-1.5"
              >
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                <span>Hadir Semua</span>
              </button>
            </div>
            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition shadow-md shadow-emerald-700/20 flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Data</span>
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Live Attendance Counter */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-slate-100 text-center text-xs">
          <div className="bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
            <span className="text-emerald-700 font-medium block">Hadir</span>
            <span className="text-base font-bold text-emerald-800">{stats.hadir}</span>
          </div>
          <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-100">
            <span className="text-amber-700 font-medium block">Izin</span>
            <span className="text-base font-bold text-amber-800">{stats.izin}</span>
          </div>
          <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100">
            <span className="text-blue-700 font-medium block">Sakit</span>
            <span className="text-base font-bold text-blue-800">{stats.sakit}</span>
          </div>
          <div className="bg-red-50/50 p-2 rounded-lg border border-red-100">
            <span className="text-red-700 font-medium block">Alpa</span>
            <span className="text-base font-bold text-red-800">{stats.alpa}</span>
          </div>
          <div className="bg-purple-50/50 p-2 rounded-lg border border-purple-100">
            <span className="text-purple-700 font-medium block">Uzur</span>
            <span className="text-base font-bold text-purple-800">{stats.uzur}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
            <span className="text-slate-600 font-medium block">Belum Diisi</span>
            <span className="text-base font-bold text-slate-800">{stats.unmarked}</span>
          </div>
        </div>
      </div>

      {/* Santri List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-bold text-sm text-slate-800">Daftar Absensi</h3>
        </div>
        
        {filteredSantri.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">Tidak ada santri ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba ganti filter halaqah atau kata kunci pencarian</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white text-[11px] uppercase text-slate-400 font-bold border-b border-slate-100">
                <tr>
                  <th className="p-3 w-12 text-center">No</th>
                  <th className="p-3">Nama Santri</th>
                  <th className="p-3">Halaqah</th>
                  <th className="p-3 min-w-[280px]">Status Kehadiran</th>
                  <th className="p-3 w-1/4">Keterangan</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredSantri.map((santri, index) => {
                  const currentStatus = localAttendanceMap[santri.id]?.status;
                  const currentKet = localAttendanceMap[santri.id]?.keterangan || '';
                  const halaqahObj = halaqahList.find((h) => h.id === santri.halaqahId);
                  
                  return (
                    <tr key={santri.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 text-center text-slate-400 font-medium">{index + 1}</td>
                      <td className="p-3">
                        <div className="font-medium text-slate-900">{santri.nama}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">NIS: {santri.nis}</div>
                      </td>
                      <td className="p-3">
                        <div className="text-xs text-slate-600">{halaqahObj?.nama || 'General'}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Juz {santri.currentJuz}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {/* HADIR */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(santri.id, 'HADIR')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                              currentStatus === 'HADIR'
                                ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-500/30'
                                : 'bg-slate-100 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
                            }`}
                          >
                            HADIR
                          </button>
                          {/* IZIN */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(santri.id, 'IZIN')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                              currentStatus === 'IZIN'
                                ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-500/30'
                                : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                            }`}
                          >
                            IZIN
                          </button>
                          {/* SAKIT */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(santri.id, 'SAKIT')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                              currentStatus === 'SAKIT'
                                ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-500/30'
                                : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
                            }`}
                          >
                            SAKIT
                          </button>
                          {/* ALPA */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(santri.id, 'ALPA')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                              currentStatus === 'ALPA'
                                ? 'bg-red-100 text-red-700 ring-1 ring-red-500/30'
                                : 'bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600'
                            }`}
                          >
                            ALPA
                          </button>
                          {/* UZUR */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(santri.id, 'UZUR')}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                              currentStatus === 'UZUR'
                                ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-500/30'
                                : 'bg-slate-100 text-slate-500 hover:bg-purple-50 hover:text-purple-600'
                            }`}
                          >
                            UZUR
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={currentKet}
                          onChange={(e) => handleKeteranganChange(santri.id, e.target.value)}
                          placeholder="Catatan..."
                          className="w-full text-xs bg-slate-50 hover:bg-white border border-slate-200 rounded p-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Save Bar for mobile / bottom convenience */}
      <div className="sticky bottom-4 z-20 bg-slate-900/95 backdrop-blur text-white p-3.5 rounded-xl shadow-2xl flex items-center justify-between border border-slate-700">
        <div className="text-xs">
          <span className="font-bold text-emerald-400">
            {stats.hadir + stats.izin + stats.sakit + stats.alpa + stats.uzur} dari {stats.total}
          </span>{' '}
          Santri telah diisi presensinya
        </div>
        <button
          onClick={handleSave}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Kehadiran</span>
        </button>
      </div>

      {/* Log Kehadiran Hari Ini */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-sm text-slate-800">Riwayat Input Kehadiran</h3>
          <span className="text-xs text-slate-500 font-medium">Sesi: <span className="font-bold text-slate-800">{selectedSesi}</span> | Tanggal: <span className="font-bold text-slate-800">{tanggalInput}</span></span>
        </div>
        <div className="p-0">
          {absensiRecords.filter(r => r.tanggal === tanggalInput && r.sesi === selectedSesi).length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">Belum ada riwayat absensi pada sesi dan tanggal ini.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="p-3">Waktu</th>
                    <th className="p-3">Nama Santri</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Keterangan</th>
                    <th className="p-3">Musyrif</th>
                  </tr>
                </thead>
                <tbody>
                  {absensiRecords
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
                            {(() => {
                              const badge = formatKehadiranBadge(record.status);
                              return (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg}`}>
                                  {badge.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="p-3 text-slate-600">{record.keterangan || '-'}</td>
                          <td className="p-3 text-slate-500">{record.musyrif}</td>
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
