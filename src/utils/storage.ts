import {
  PesantrenInfo,
  Halaqah,
  Santri,
  AbsensiRecord,
  MutabaahRecord
} from '../types';
import {
  INITIAL_PESANTREN,
  INITIAL_HALAQAH,
  INITIAL_SANTRI,
  INITIAL_ABSENSI,
  INITIAL_MUTABAAH
} from '../data/initialData';

const KEYS = {
  PESANTREN: 'v2_alfurqon_pesantren_info',
  HALAQAH: 'v2_alfurqon_halaqah_list',
  SANTRI: 'v2_alfurqon_santri_list',
  ABSENSI: 'v2_alfurqon_absensi_records',
  MUTABAAH: 'v2_alfurqon_mutabaah_records'
};

export function loadPesantrenInfo(): PesantrenInfo {
  try {
    const data = localStorage.getItem(KEYS.PESANTREN);
    return data ? JSON.parse(data) : INITIAL_PESANTREN;
  } catch {
    return INITIAL_PESANTREN;
  }
}

export function savePesantrenInfo(info: PesantrenInfo): void {
  localStorage.setItem(KEYS.PESANTREN, JSON.stringify(info));
}

export function loadHalaqahList(): Halaqah[] {
  try {
    const data = localStorage.getItem(KEYS.HALAQAH);
    return data ? JSON.parse(data) : INITIAL_HALAQAH;
  } catch {
    return INITIAL_HALAQAH;
  }
}

export function saveHalaqahList(list: Halaqah[]): void {
  localStorage.setItem(KEYS.HALAQAH, JSON.stringify(list));
}

export function loadSantriList(): Santri[] {
  try {
    const data = localStorage.getItem(KEYS.SANTRI);
    return data ? JSON.parse(data) : INITIAL_SANTRI;
  } catch {
    return INITIAL_SANTRI;
  }
}

export function saveSantriList(list: Santri[]): void {
  localStorage.setItem(KEYS.SANTRI, JSON.stringify(list));
}

export function loadAbsensiRecords(): AbsensiRecord[] {
  try {
    const data = localStorage.getItem(KEYS.ABSENSI);
    return data ? JSON.parse(data) : INITIAL_ABSENSI;
  } catch {
    return INITIAL_ABSENSI;
  }
}

export function saveAbsensiRecords(list: AbsensiRecord[]): void {
  localStorage.setItem(KEYS.ABSENSI, JSON.stringify(list));
}

export function loadMutabaahRecords(): MutabaahRecord[] {
  try {
    const data = localStorage.getItem(KEYS.MUTABAAH);
    return data ? JSON.parse(data) : INITIAL_MUTABAAH;
  } catch {
    return INITIAL_MUTABAAH;
  }
}

export function saveMutabaahRecords(list: MutabaahRecord[]): void {
  localStorage.setItem(KEYS.MUTABAAH, JSON.stringify(list));
}

export function resetAllDataToDefault(): void {
  localStorage.setItem(KEYS.PESANTREN, JSON.stringify(INITIAL_PESANTREN));
  localStorage.setItem(KEYS.HALAQAH, JSON.stringify(INITIAL_HALAQAH));
  localStorage.setItem(KEYS.SANTRI, JSON.stringify(INITIAL_SANTRI));
  localStorage.setItem(KEYS.ABSENSI, JSON.stringify(INITIAL_ABSENSI));
  localStorage.setItem(KEYS.MUTABAAH, JSON.stringify(INITIAL_MUTABAAH));
}

// Export JSON
export function exportDataAsJSON(): string {
  const backup = {
    pesantren: loadPesantrenInfo(),
    halaqah: loadHalaqahList(),
    santri: loadSantriList(),
    absensi: loadAbsensiRecords(),
    mutabaah: loadMutabaahRecords(),
    exportedAt: new Date().toISOString()
  };
  return JSON.stringify(backup, null, 2);
}

// Import JSON
export function importDataFromJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.santri && parsed.halaqah) {
      if (parsed.pesantren) savePesantrenInfo(parsed.pesantren);
      saveHalaqahList(parsed.halaqah);
      saveSantriList(parsed.santri);
      if (parsed.absensi) saveAbsensiRecords(parsed.absensi);
      if (parsed.mutabaah) saveMutabaahRecords(parsed.mutabaah);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Helper formatting date to Indonesian format e.g. "Minggu, 9 Agustus 2026"
export function formatTanggalIndo(dateStr: string): string {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ][date.getMonth()];
  
  return `${hari}, ${date.getDate()} ${bulan} ${date.getFullYear()}`;
}

export function formatKehadiranBadge(status: string) {
  switch (status) {
    case 'HADIR':
      return { label: 'Hadir', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case 'IZIN':
      return { label: 'Izin', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'SAKIT':
      return { label: 'Sakit', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
    case 'ALPA':
      return { label: 'Alpa', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
    case 'UZUR':
      return { label: 'Uzur Syar\'i', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
    case 'LIBUR':
      return { label: 'Libur', bg: 'bg-slate-200 text-slate-800 border-slate-400' };
    default:
      return { label: status, bg: 'bg-slate-100 text-slate-800 border-slate-300' };
  }
}

export function formatKualitasSetoran(kualitas: string) {
  switch (kualitas) {
    case 'SANGAT_LANCAR':
      return { label: 'Sangat Lancar (A)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', score: '90-100' };
    case 'LANCAR':
      return { label: 'Lancar (B)', bg: 'bg-teal-100 text-teal-800 border-teal-300', score: '80-89' };
    case 'CUKUP':
      return { label: 'Cukup (C)', bg: 'bg-amber-100 text-amber-800 border-amber-300', score: '70-79' };
    case 'PERLU_ULANG':
      return { label: 'Perlu Ulangi (D)', bg: 'bg-rose-100 text-rose-800 border-rose-300', score: '< 70' };
    default:
      return { label: kualitas, bg: 'bg-slate-100 text-slate-800 border-slate-300', score: '-' };
  }
}
