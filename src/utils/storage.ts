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
    return data ? normalizePesantrenInfo(JSON.parse(data)) : INITIAL_PESANTREN;
  } catch {
    return INITIAL_PESANTREN;
  }
}

export function savePesantrenInfo(info: PesantrenInfo): void {
  try {
    localStorage.setItem(KEYS.PESANTREN, JSON.stringify(info));
  } catch (e) {
    console.error('Failed to save pesantren info', e);
  }
}

export function loadHalaqahList(): Halaqah[] {
  try {
    const data = localStorage.getItem(KEYS.HALAQAH);
    const parsed = data ? JSON.parse(data) : INITIAL_HALAQAH;
    return normalizeHalaqah(parsed);
  } catch {
    return INITIAL_HALAQAH;
  }
}

export function saveHalaqahList(list: Halaqah[]): void {
  try {
    localStorage.setItem(KEYS.HALAQAH, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save halaqah list', e);
  }
}

export function loadSantriList(): Santri[] {
  try {
    const data = localStorage.getItem(KEYS.SANTRI);
    const parsed = data ? JSON.parse(data) : INITIAL_SANTRI;
    const halaqahs = loadHalaqahList();
    return normalizeSantri(parsed, halaqahs);
  } catch {
    return INITIAL_SANTRI;
  }
}

export function saveSantriList(list: Santri[]): void {
  try {
    localStorage.setItem(KEYS.SANTRI, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save santri list', e);
  }
}

export function loadAbsensiRecords(): AbsensiRecord[] {
  try {
    const data = localStorage.getItem(KEYS.ABSENSI);
    const parsed = data ? JSON.parse(data) : INITIAL_ABSENSI;
    return normalizeAbsensi(parsed);
  } catch {
    return INITIAL_ABSENSI;
  }
}

export function saveAbsensiRecords(list: AbsensiRecord[]): void {
  try {
    localStorage.setItem(KEYS.ABSENSI, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save absensi records', e);
  }
}

export function loadMutabaahRecords(): MutabaahRecord[] {
  try {
    const data = localStorage.getItem(KEYS.MUTABAAH);
    const parsed = data ? JSON.parse(data) : INITIAL_MUTABAAH;
    return normalizeMutabaah(parsed);
  } catch {
    return INITIAL_MUTABAAH;
  }
}

export function saveMutabaahRecords(list: MutabaahRecord[]): void {
  try {
    localStorage.setItem(KEYS.MUTABAAH, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save mutabaah records', e);
  }
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

// Safe string converter
function safeStr(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

// Safe date normalizer (converts ISO strings or DD/MM/YYYY into YYYY-MM-DD)
export function normalizeDateStr(val: any): string {
  if (!val) return '';
  if (val instanceof Date) {
    return val.toISOString().split('T')[0];
  }
  let str = safeStr(val);
  if (!str) return '';
  if (str.includes('T')) {
    str = str.split('T')[0];
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  // If DD/MM/YYYY or DD-MM-YYYY
  if (/^\d{1,2}[\/-]\d{1,2}[\/-]\d{4}$/.test(str)) {
    const parts = str.split(/[\/-]/);
    const d = parts[0].padStart(2, '0');
    const m = parts[1].padStart(2, '0');
    const y = parts[2];
    return `${y}-${m}-${d}`;
  }
  return str;
}

// Normalize Pesantren Info
export function normalizePesantrenInfo(p: any): PesantrenInfo {
  if (!p || typeof p !== 'object') return INITIAL_PESANTREN;
  return {
    nama: safeStr(p.nama) || INITIAL_PESANTREN.nama,
    lembaga: safeStr(p.lembaga) || INITIAL_PESANTREN.lembaga,
    alamat: safeStr(p.alamat),
    pimpinanTahfidz: safeStr(p.pimpinanTahfidz),
    tahunAjaran: safeStr(p.tahunAjaran) || INITIAL_PESANTREN.tahunAjaran,
    semester: (safeStr(p.semester) as any) || INITIAL_PESANTREN.semester
  };
}

// Normalize Halaqah
export function normalizeHalaqah(rawHalaqah: any[]): Halaqah[] {
  if (!Array.isArray(rawHalaqah)) return [];
  
  // Filter out completely blank rows from Spreadsheet
  const validRows = rawHalaqah.filter(h => {
    if (!h) return false;
    const n = safeStr(h.nama);
    const id = safeStr(h.id);
    const m = safeStr(h.musyrif);
    return n !== '' || id !== '' || m !== '';
  });

  return validRows.map((h, i) => {
    const rawName = safeStr(h.nama);
    // If name is purely numeric e.g. "1" or 1, make it "Halaqah 1"
    const displayName = /^\d+$/.test(rawName)
      ? `Halaqah ${rawName}`
      : (rawName || `Halaqah ${i + 1}`);

    const id = safeStr(h.id) || `hlq-${displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || String(i + 1)}`;
    const musyrif = safeStr(h.musyrif) || 'Ust. Pembimbing';
    const keterangan = safeStr(h.keterangan);

    return {
      id,
      nama: displayName,
      musyrif,
      keterangan
    };
  });
}

// Normalize Santri
export function normalizeSantri(rawSantri: any[], validHalaqahList: Halaqah[] = []): Santri[] {
  if (!Array.isArray(rawSantri)) return [];

  // Filter out empty rows
  const validRows = rawSantri.filter(s => {
    if (!s) return false;
    const n = safeStr(s.nama);
    const nis = safeStr(s.nis);
    const id = safeStr(s.id);
    return n !== '' || nis !== '' || id !== '';
  });

  const halaqahMapByName = new Map<string, string>();
  const halaqahIds = new Set<string>();
  
  validHalaqahList.forEach(h => {
    halaqahIds.add(h.id);
    halaqahMapByName.set(h.nama.toLowerCase(), h.id);
    const numMatch = h.nama.match(/\d+/);
    if (numMatch) {
      halaqahMapByName.set(numMatch[0], h.id);
    }
  });

  return validRows.map((s, i) => {
    const nis = safeStr(s.nis);
    const rawId = safeStr(s.id) || `san-${nis ? nis : String(i + 1)}`;
    const rawHalaqah = safeStr(s.halaqahId);
    
    let halaqahId = 'UNASSIGNED';
    if (rawHalaqah && rawHalaqah !== 'UNASSIGNED') {
      if (halaqahIds.has(rawHalaqah)) {
        halaqahId = rawHalaqah;
      } else {
        const match = halaqahMapByName.get(rawHalaqah.toLowerCase());
        if (match) {
          halaqahId = match;
        } else if (halaqahIds.size > 0) {
          halaqahId = 'UNASSIGNED';
        } else {
          halaqahId = rawHalaqah;
        }
      }
    }

    return {
      id: rawId,
      nis,
      nama: safeStr(s.nama) || `Santri ${i + 1}`,
      halaqahId,
      tanggalMasuk: normalizeDateStr(s.tanggalMasuk),
      targetJuz: Number(s.targetJuz) || 30,
      currentJuz: Number(s.currentJuz) || 1,
      currentSurahNumber: Number(s.currentSurahNumber) || 1,
      currentAyat: Number(s.currentAyat) || 1,
      waliNama: safeStr(s.waliNama),
      waliTelepon: safeStr(s.waliTelepon),
      fotoUrl: safeStr(s.fotoUrl)
    };
  });
}

// Normalize Absensi
export function normalizeAbsensi(rawAbsensi: any[]): AbsensiRecord[] {
  if (!Array.isArray(rawAbsensi)) return [];
  const validRows = rawAbsensi.filter(a => {
    if (!a) return false;
    const sId = safeStr(a.santriId);
    const tgl = safeStr(a.tanggal);
    return sId !== '' && tgl !== '';
  });

  return validRows.map((a, i) => ({
    id: safeStr(a.id) || `abs-${Date.now()}-${i}`,
    santriId: safeStr(a.santriId),
    tanggal: normalizeDateStr(a.tanggal),
    sesi: (safeStr(a.sesi).toUpperCase() as any) || 'SUBUH',
    status: (safeStr(a.status).toUpperCase() as any) || 'HADIR',
    keterangan: safeStr(a.keterangan),
    musyrif: safeStr(a.musyrif),
    createdAt: safeStr(a.createdAt) || new Date().toISOString()
  }));
}

// Normalize Mutabaah
export function normalizeMutabaah(rawMutabaah: any[]): MutabaahRecord[] {
  if (!Array.isArray(rawMutabaah)) return [];
  const validRows = rawMutabaah.filter(m => {
    if (!m) return false;
    const sId = safeStr(m.santriId);
    const tgl = safeStr(m.tanggal);
    return sId !== '' && tgl !== '';
  });

  return validRows.map((m, i) => {
    const sNumber = Number(m.surahNumber) || 1;
    return {
      id: safeStr(m.id) || `mut-${Date.now()}-${i}`,
      santriId: safeStr(m.santriId),
      tanggal: normalizeDateStr(m.tanggal),
      sesi: (safeStr(m.sesi).toUpperCase() as any) || 'SUBUH',
      jenis: (safeStr(m.jenis).toUpperCase() as any) || 'ZIYADAH',
      surahNumber: sNumber,
      surahMulaiNumber: Number(m.surahMulaiNumber) || sNumber,
      surahSelesaiNumber: Number(m.surahSelesaiNumber) || sNumber,
      surahNama: safeStr(m.surahNama) || 'Al-Fatihah',
      ayatMulai: Number(m.ayatMulai) || 1,
      ayatSelesai: Number(m.ayatSelesai) || 1,
      halaman: Number(m.halaman) || 1,
      juz: Number(m.juz) || 1,
      kualitas: (safeStr(m.kualitas) as any) || 'LANCAR',
      nilaiNum: Number(m.nilaiNum) || 85,
      catatanTajwid: safeStr(m.catatanTajwid),
      catatanAdab: safeStr(m.catatanAdab),
      musyrif: safeStr(m.musyrif),
      createdAt: safeStr(m.createdAt) || new Date().toISOString()
    };
  });
}

// Compatibility helper
export function normalizeHalaqahAndSantri(rawHalaqah: any[], rawSantri: any[]): { halaqah: Halaqah[]; santri: Santri[] } {
  const halaqah = normalizeHalaqah(rawHalaqah);
  const santri = normalizeSantri(rawSantri, halaqah);
  return { halaqah, santri };
}

export interface NormalizedDatabaseData {
  pesantren: PesantrenInfo;
  halaqah: Halaqah[];
  santri: Santri[];
  absensi: AbsensiRecord[];
  mutabaah: MutabaahRecord[];
}

// Import all data from object or json string
export function importAllData(data: any): NormalizedDatabaseData | null {
  try {
    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    if (!parsed || typeof parsed !== 'object') return null;

    const halaqah = normalizeHalaqah(parsed.halaqah || []);
    const santri = normalizeSantri(parsed.santri || [], halaqah);
    const absensi = normalizeAbsensi(parsed.absensi || []);
    const mutabaah = normalizeMutabaah(parsed.mutabaah || []);
    const pesantren = parsed.pesantren ? normalizePesantrenInfo(parsed.pesantren) : loadPesantrenInfo();

    savePesantrenInfo(pesantren);
    saveHalaqahList(halaqah);
    saveSantriList(santri);
    saveAbsensiRecords(absensi);
    saveMutabaahRecords(mutabaah);

    return { pesantren, halaqah, santri, absensi, mutabaah };
  } catch (err) {
    console.error('Failed to import data', err);
    return null;
  }
}

// Import JSON legacy compatibility
export function importDataFromJSON(jsonString: string): boolean {
  return importAllData(jsonString) !== null;
}

// Helper formatting date to Indonesian format e.g. "Minggu, 9 Agustus 2026"
export function formatTanggalIndo(dateStr: string): string {
  if (!dateStr) return '-';
  const clean = normalizeDateStr(dateStr);
  const parts = clean.split('-');
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
