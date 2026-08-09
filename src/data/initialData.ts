import { PesantrenInfo, Halaqah, Santri, AbsensiRecord, MutabaahRecord } from '../types';

export const INITIAL_PESANTREN: PesantrenInfo = {
  nama: 'Pesantren Tahfidz Al-Furqon',
  lembaga: 'Yayasan Pendidikan & Tahfidz Al-Qur\'an Al-Furqon',
  alamat: 'Jl. Qur\'an No. 114, Kompleks Islami Al-Furqon',
  pimpinanTahfidz: 'Ust. H. Abdullah Azzam, Lc., M.Ag.',
  tahunAjaran: '2025/2026',
  semester: 'Ganjil'
};

export const INITIAL_HALAQAH: Halaqah[] = [
  {
    id: 'hlq-1',
    nama: 'Halaqah Abu Bakar Ash-Shiddiq',
    musyrif: 'Ust. Muhammad Rizky, S.Th.I',
    keterangan: 'Halaqah Tingkat Lanjutan (Juz 15-30)'
  },
  {
    id: 'hlq-2',
    nama: 'Halaqah Umar bin Khattab',
    musyrif: 'Ust. Ahmad Fauzi, Al-Hafidz',
    keterangan: 'Halaqah Menengah (Juz 5-15)'
  },
  {
    id: 'hlq-3',
    nama: 'Halaqah Utsman bin Affan',
    musyrif: 'Ust. Zulkifli Rahman, S.Pd.I',
    keterangan: 'Halaqah Dasar Ziyadah (Juz 1-5)'
  },
  {
    id: 'hlq-4',
    nama: 'Halaqah Ali bin Abi Thalib',
    musyrif: 'Ust. Hamzah As-Suyuthi, Al-Hafidz',
    keterangan: 'Halaqah Persiapan Tasmi\' 30 Juz'
  }
];

export const INITIAL_SANTRI: Santri[] = [
  {
    id: 'str-1',
    nis: '20240101',
    nama: 'Ahmad Al-Farisi',
    halaqahId: 'hlq-1',
    tanggalMasuk: '2023-07-15',
    targetJuz: 30,
    currentJuz: 18.5,
    currentSurahNumber: 18,
    currentAyat: 45,
    waliNama: 'H. Budi Santoso',
    waliTelepon: '081234567890'
  },
  {
    id: 'str-2',
    nis: '20240102',
    nama: 'Muhammad Rayhan Zaky',
    halaqahId: 'hlq-1',
    tanggalMasuk: '2023-07-15',
    targetJuz: 30,
    currentJuz: 22.0,
    currentSurahNumber: 24,
    currentAyat: 10,
    waliNama: 'Dr. Hendra Zaky',
    waliTelepon: '081398765432'
  },
  {
    id: 'str-3',
    nis: '20240103',
    nama: 'Faiz Zulkarnain',
    halaqahId: 'hlq-1',
    tanggalMasuk: '2023-08-01',
    targetJuz: 30,
    currentJuz: 16.0,
    currentSurahNumber: 16,
    currentAyat: 80,
    waliNama: 'Ir. Ahmad Zulkarnain',
    waliTelepon: '085211223344'
  },
  {
    id: 'str-4',
    nis: '20240104',
    nama: 'Abdullah Omar',
    halaqahId: 'hlq-2',
    tanggalMasuk: '2024-01-10',
    targetJuz: 30,
    currentJuz: 9.5,
    currentSurahNumber: 9,
    currentAyat: 30,
    waliNama: 'Syarifuddin',
    waliTelepon: '081807654321'
  },
  {
    id: 'str-5',
    nis: '20240105',
    nama: 'Fathir Rabbani',
    halaqahId: 'hlq-2',
    tanggalMasuk: '2024-01-10',
    targetJuz: 30,
    currentJuz: 12.0,
    currentSurahNumber: 12,
    currentAyat: 50,
    waliNama: 'M. Rabbani',
    waliTelepon: '082144556677'
  },
  {
    id: 'str-6',
    nis: '20240106',
    nama: 'Bilal Hibatullah',
    halaqahId: 'hlq-2',
    tanggalMasuk: '2024-02-01',
    targetJuz: 30,
    currentJuz: 8.0,
    currentSurahNumber: 8,
    currentAyat: 15,
    waliNama: 'H. Hibatullah',
    waliTelepon: '087812348899'
  },
  {
    id: 'str-7',
    nis: '20240107',
    nama: 'Usamah bin Malik',
    halaqahId: 'hlq-3',
    tanggalMasuk: '2024-07-01',
    targetJuz: 30,
    currentJuz: 3.5,
    currentSurahNumber: 3,
    currentAyat: 90,
    waliNama: 'Malik Ibrahim',
    waliTelepon: '081377889900'
  },
  {
    id: 'str-8',
    nis: '20240108',
    nama: "Ibrahim Nu'man",
    halaqahId: 'hlq-3',
    tanggalMasuk: '2024-07-01',
    targetJuz: 30,
    currentJuz: 4.0,
    currentSurahNumber: 3,
    currentAyat: 180,
    waliNama: 'Nu\'man Hadi',
    waliTelepon: '085699887766'
  },
  {
    id: 'str-9',
    nis: '20240109',
    nama: 'Khafifi An-Nawawi',
    halaqahId: 'hlq-3',
    tanggalMasuk: '2024-07-15',
    targetJuz: 30,
    currentJuz: 2.5,
    currentSurahNumber: 2,
    currentAyat: 200,
    waliNama: 'An-Nawawi',
    waliTelepon: '081233445566'
  },
  {
    id: 'str-10',
    nis: '20240110',
    nama: 'Sulaiman Al-Banjari',
    halaqahId: 'hlq-4',
    tanggalMasuk: '2022-07-10',
    targetJuz: 30,
    currentJuz: 29.5,
    currentSurahNumber: 2,
    currentAyat: 1,
    waliNama: 'H. Gusti Sulaiman',
    waliTelepon: '081122334455'
  },
  {
    id: 'str-11',
    nis: '20240111',
    nama: "Mu'adz bin Jabal",
    halaqahId: 'hlq-4',
    tanggalMasuk: '2022-08-01',
    targetJuz: 30,
    currentJuz: 28.0,
    currentSurahNumber: 58,
    currentAyat: 1,
    waliNama: 'Dra. Yuniati',
    waliTelepon: '081900112233'
  }
];

const today = new Date().toISOString().split('T')[0];

export const INITIAL_ABSENSI: AbsensiRecord[] = [
  {
    id: 'abs-1',
    santriId: 'str-1',
    tanggal: today,
    sesi: 'SUBUH',
    status: 'HADIR',
    musyrif: 'Ust. Muhammad Rizky, S.Th.I',
    createdAt: new Date().toISOString()
  },
  {
    id: 'abs-2',
    santriId: 'str-2',
    tanggal: today,
    sesi: 'SUBUH',
    status: 'HADIR',
    musyrif: 'Ust. Muhammad Rizky, S.Th.I',
    createdAt: new Date().toISOString()
  },
  {
    id: 'abs-3',
    santriId: 'str-3',
    tanggal: today,
    sesi: 'SUBUH',
    status: 'IZIN',
    keterangan: 'Izin Pulang Pengurusan Dokumen',
    musyrif: 'Ust. Muhammad Rizky, S.Th.I',
    createdAt: new Date().toISOString()
  },
  {
    id: 'abs-4',
    santriId: 'str-4',
    tanggal: today,
    sesi: 'SUBUH',
    status: 'HADIR',
    musyrif: 'Ust. Ahmad Fauzi, Al-Hafidz',
    createdAt: new Date().toISOString()
  },
  {
    id: 'abs-5',
    santriId: 'str-5',
    tanggal: today,
    sesi: 'SUBUH',
    status: 'SAKIT',
    keterangan: 'Demam di UKS Pesantren',
    musyrif: 'Ust. Ahmad Fauzi, Al-Hafidz',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_MUTABAAH: MutabaahRecord[] = [
  {
    id: 'mtb-1',
    santriId: 'str-1',
    tanggal: today,
    sesi: 'SUBUH',
    jenis: 'ZIYADAH',
    surahNumber: 18,
    surahNama: 'Al-Kahf',
    ayatMulai: 1,
    ayatSelesai: 15,
    halaman: 293,
    juz: 15,
    kualitas: 'SANGAT_LANCAR',
    nilaiNum: 95,
    catatanTajwid: 'Makhraj Tajwid Sangat Baik. Pertahankan Ikhfa & Ghunnah.',
    musyrif: 'Ust. Muhammad Rizky, S.Th.I',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mtb-2',
    santriId: 'str-1',
    tanggal: today,
    sesi: 'MAGHRIB',
    jenis: 'MURAJAAH',
    surahNumber: 17,
    surahNama: 'Al-Isra\'',
    ayatMulai: 1,
    ayatSelesai: 50,
    halaman: 282,
    juz: 15,
    kualitas: 'LANCAR',
    nilaiNum: 88,
    catatanTajwid: 'Satu kali lupa di ayat 23, kelancaran bagus.',
    musyrif: 'Ust. Muhammad Rizky, S.Th.I',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mtb-3',
    santriId: 'str-2',
    tanggal: today,
    sesi: 'SUBUH',
    jenis: 'ZIYADAH',
    surahNumber: 24,
    surahNama: 'An-Nur',
    ayatMulai: 1,
    ayatSelesai: 10,
    halaman: 350,
    juz: 18,
    kualitas: 'SANGAT_LANCAR',
    nilaiNum: 98,
    catatanTajwid: 'Bagus sekali, mad wajib muttasil tepat 5 harakat.',
    musyrif: 'Ust. Muhammad Rizky, S.Th.I',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mtb-4',
    santriId: 'str-4',
    tanggal: today,
    sesi: 'SUBUH',
    jenis: 'ZIYADAH',
    surahNumber: 9,
    surahNama: 'At-Taubah',
    ayatMulai: 1,
    ayatSelesai: 12,
    halaman: 187,
    juz: 10,
    kualitas: 'CUKUP',
    nilaiNum: 75,
    catatanTajwid: 'Perhatikan dengung nun mati bertemu ba (Iqlab). Perlu diulang 1x.',
    musyrif: 'Ust. Ahmad Fauzi, Al-Hafidz',
    createdAt: new Date().toISOString()
  }
];
