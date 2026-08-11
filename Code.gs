/**
 * Google Apps Script for Setup Database (Spreadsheet)
 * Salin kode ini ke editor Apps Script (Extensions > Apps Script di Google Sheets Anda)
 * 
 * PENTING:
 * Setelah menyalin, lakukan DEPLOY ULANG (New Deployment) agar perubahan tersimpan di URL API.
 */

function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. PesantrenInfo
  let sheetInfo = ss.getSheetByName('PesantrenInfo');
  if (!sheetInfo) {
    sheetInfo = ss.insertSheet('PesantrenInfo');
    sheetInfo.appendRow(['nama', 'lembaga', 'alamat', 'pimpinanTahfidz', 'tahunAjaran', 'semester']);
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

  Browser.msgBox('Setup Selesai', 'Semua sheet dan kolom tabel telah dibuat dengan sukses!', Browser.Buttons.OK);
}

// -------------------------------------------------------------
// API doPost & doGet
// -------------------------------------------------------------

function doGet(e) {
  try {
    let action = e.parameter.action;
    if (action === "get_all") {
      let data = getAllData();
      return responseJson({ status: "success", data: data });
    }
    return ContentService.createTextOutput("API Spreadsheet Al-Furqon berjalan! Tambahkan ?action=get_all untuk mengambil data.")
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    return responseJson({ status: "error", message: error.toString() });
  }
}

function doPost(e) {
  try {
    let payload = JSON.parse(e.postData.contents);
    let action = payload.action;

    if (action === "save_all") {
      saveAllData(payload.data);
      return responseJson({ status: "success", message: "Data berhasil disimpan ke Spreadsheet" });
    }
    
    if (action === "ping") {
      return responseJson({ status: "success", message: "pong" });
    }

    return responseJson({ status: "error", message: "Aksi tidak dikenali", received: action });
  } catch (error) {
    return responseJson({ status: "error", message: error.toString() });
  }
}

function responseJson(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// -------------------------------------------------------------
// Core Functions
// -------------------------------------------------------------

function getAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    pesantren: getSheetDataAsObject(ss, 'PesantrenInfo')[0] || null,
    halaqah: getSheetDataAsObject(ss, 'Halaqah'),
    santri: getSheetDataAsObject(ss, 'Santri'),
    absensi: getSheetDataAsObject(ss, 'AbsensiRecord'),
    mutabaah: getSheetDataAsObject(ss, 'MutabaahRecord')
  };
}

function saveAllData(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (data.pesantren) {
    writeObjectToSheet(ss, 'PesantrenInfo', [data.pesantren], ['nama', 'lembaga', 'alamat', 'pimpinanTahfidz', 'tahunAjaran', 'semester']);
  }
  if (data.halaqah) {
    writeObjectToSheet(ss, 'Halaqah', data.halaqah, ['id', 'nama', 'musyrif', 'keterangan']);
  }
  if (data.santri) {
    writeObjectToSheet(ss, 'Santri', data.santri, ['id', 'nis', 'nama', 'halaqahId', 'tanggalMasuk', 'targetJuz', 'currentJuz', 'currentSurahNumber', 'currentAyat', 'waliNama', 'waliTelepon', 'fotoUrl']);
  }
  if (data.absensi) {
    writeObjectToSheet(ss, 'AbsensiRecord', data.absensi, ['id', 'santriId', 'tanggal', 'sesi', 'status', 'keterangan', 'musyrif', 'createdAt']);
  }
  if (data.mutabaah) {
    writeObjectToSheet(ss, 'MutabaahRecord', data.mutabaah, ['id', 'santriId', 'tanggal', 'sesi', 'jenis', 'surahNumber', 'surahMulaiNumber', 'surahSelesaiNumber', 'surahNama', 'ayatMulai', 'ayatSelesai', 'halaman', 'juz', 'kualitas', 'nilaiNum', 'catatanTajwid', 'catatanAdab', 'musyrif', 'createdAt']);
  }
}

function getSheetDataAsObject(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = data.slice(1);
  return rows.map(row => {
    let obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
}

function writeObjectToSheet(ss, sheetName, objects, headers) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return;
  
  // Clear existing data except headers
  if (sheet.getLastRow() > 1) {
    sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).clearContent();
  }
  
  if (!objects || objects.length === 0) return;
  
  const rows = objects.map(obj => {
    return headers.map(header => (obj[header] !== undefined && obj[header] !== null) ? obj[header] : '');
  });
  
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}
