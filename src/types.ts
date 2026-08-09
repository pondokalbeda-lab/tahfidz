export type KehadiranStatus = 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA' | 'UZUR' | 'LIBUR';

export type JenisSetoran = 'ZIYADAH' | 'MURAJAAH' | 'TASMI';

export type KualitasSetoran = 'SANGAT_LANCAR' | 'LANCAR' | 'CUKUP' | 'PERLU_ULANG';

export type SesiHalaqah = 'SUBUH' | 'MAGHRIB';

export interface SurahInfo {
  number: number;
  name: string;
  latinName: string;
  totalAyat: number;
  juzStart: number;
  juzEnd: number;
}

export interface Halaqah {
  id: string;
  nama: string; // e.g., "Halaqah Abu Bakar Ash-Shiddiq"
  musyrif: string; // e.g., "Ustadz Ahmad Hilmi, S.Pd.I"
  keterangan?: string;
}

export interface Santri {
  id: string;
  nis: string; // Nomor Induk Santri, e.g., "202401001"
  nama: string;
  halaqahId: string;
  tanggalMasuk: string;
  targetJuz: number; // e.g., 30
  currentJuz: number; // e.g., 12
  currentSurahNumber?: number; // e.g., 2
  currentAyat?: number; // e.g., 255
  waliNama?: string;
  waliTelepon?: string;
  fotoUrl?: string;
}

export interface AbsensiRecord {
  id: string;
  santriId: string;
  tanggal: string; // YYYY-MM-DD
  sesi: SesiHalaqah;
  status: KehadiranStatus;
  keterangan?: string;
  musyrif: string;
  createdAt: string;
}

export interface MutabaahRecord {
  id: string;
  santriId: string;
  tanggal: string; // YYYY-MM-DD
  sesi: SesiHalaqah;
  jenis: JenisSetoran;
  surahNumber: number;
  surahMulaiNumber?: number;
  surahSelesaiNumber?: number;
  surahNama: string;
  ayatMulai: number;
  ayatSelesai: number;
  halaman?: number;
  juz: number;
  kualitas: KualitasSetoran;
  nilaiNum: number; // 0 - 100
  catatanTajwid?: string;
  catatanAdab?: string;
  musyrif: string;
  createdAt: string;
}

export interface PesantrenInfo {
  nama: string;
  lembaga: string;
  alamat: string;
  pimpinanTahfidz: string;
  tahunAjaran: string;
  semester: string;
}
