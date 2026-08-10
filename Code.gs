/**
 * Google Apps Script for Setup Database (Spreadsheet)
 * Salin kode ini ke editor Apps Script (Extensions > Apps Script di Google Sheets Anda)
 */

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. PesantrenInfo
  let sheetInfo = ss.getSheetByName('PesantrenInfo');
  if (!sheetInfo) {
    sheetInfo = ss.insertSheet('PesantrenInfo');
    sheetInfo.appendRow(['nama', 'lembaga', 'alamat', 'pimpinanTahfidz', 'tahunAjaran', 'semester']);
    // Memberikan style header
    sheetInfo.getRange("A1:F1").setFontWeight("bold").setBackground("#d9ead3");
  }

  // 2. Halaqah
  let sheetHalaqah = ss.getSheetByName('Halaqah');
  if (!sheetHalaqah) {
    sheetHalaqah = ss.insertSheet('Halaqah');
    sheetHalaqah.appendRow(['id', 'nama', 'musyrif', 'keterangan']);
    sheetHalaqah.getRange("A1:D1").setFontWeight("bold").setBackground("#d9ead3");
  }

  // 3. Santri
  let sheetSantri = ss.getSheetByName('Santri');
  if (!sheetSantri) {
    sheetSantri = ss.insertSheet('Santri');
    sheetSantri.appendRow(['id', 'nis', 'nama', 'halaqahId', 'tanggalMasuk', 'targetJuz', 'currentJuz', 'currentSurahNumber', 'currentAyat', 'waliNama', 'waliTelepon', 'fotoUrl']);
    sheetSantri.getRange("A1:L1").setFontWeight("bold").setBackground("#d9ead3");
  }

  // 4. AbsensiRecord
  let sheetAbsensi = ss.getSheetByName('AbsensiRecord');
  if (!sheetAbsensi) {
    sheetAbsensi = ss.insertSheet('AbsensiRecord');
    sheetAbsensi.appendRow(['id', 'santriId', 'tanggal', 'sesi', 'status', 'keterangan', 'musyrif', 'createdAt']);
    sheetAbsensi.getRange("A1:H1").setFontWeight("bold").setBackground("#d9ead3");
  }

  // 5. MutabaahRecord
  let sheetMutabaah = ss.getSheetByName('MutabaahRecord');
  if (!sheetMutabaah) {
    sheetMutabaah = ss.insertSheet('MutabaahRecord');
    sheetMutabaah.appendRow(['id', 'santriId', 'tanggal', 'sesi', 'jenis', 'surahNumber', 'surahMulaiNumber', 'surahSelesaiNumber', 'surahNama', 'ayatMulai', 'ayatSelesai', 'halaman', 'juz', 'kualitas', 'nilaiNum', 'catatanTajwid', 'catatanAdab', 'musyrif', 'createdAt']);
    sheetMutabaah.getRange("A1:S1").setFontWeight("bold").setBackground("#d9ead3");
  }

  // Remove default "Sheet1" if it exists and is empty
  let defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }

  // Notification
  Browser.msgBox('Setup Selesai', 'Semua sheet dan kolom tabel telah dibuat dengan sukses!', Browser.Buttons.OK);
}

// -------------------------------------------------------------
// Boilerplate/Template untuk API doPost & doGet di masa depan
// -------------------------------------------------------------

function doGet(e) {
  return ContentService.createTextOutput("API Spreadsheet Al-Furqon berjalan!")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    let payload = JSON.parse(e.postData.contents);
    let action = payload.action;

    // TODO: Tambahkan penanganan untuk action save_santri, get_santri, save_absensi, dsb.
    // Contoh sederhana:
    if (action === "ping") {
      return responseJson({ status: "success", message: "pong" });
    }

    return responseJson({ status: "success", message: "Aksi tidak dikenali", received: action });
  } catch (error) {
    return responseJson({ status: "error", message: error.toString() });
  }
}

function responseJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
