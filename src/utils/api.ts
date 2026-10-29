import {
  exportDataAsJSON,
  importAllData,
  NormalizedDatabaseData,
  loadPesantrenInfo,
  loadHalaqahList,
  loadSantriList,
  loadAbsensiRecords,
  loadMutabaahRecords
} from './storage';

export const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbzX0JGE9qhJGB4lm8nwD_E3s0SmJdQNGZ-HszaGDLjoWJvHgIu8FCb8Pfub5HZUXwm9/exec';
const STORAGE_KEY_API_URL = 'alfurqon_cloud_api_url';

export function getApiUrl(): string {
  try {
    const custom = localStorage.getItem(STORAGE_KEY_API_URL);
    if (custom && custom.trim().startsWith('http')) {
      return custom.trim();
    }
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_API_URL;
}

export function setApiUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_API_URL, url.trim());
  } catch {
    // Ignore storage errors
  }
}

export function resetApiUrl(): string {
  try {
    localStorage.removeItem(STORAGE_KEY_API_URL);
  } catch {
    // Ignore storage errors
  }
  return DEFAULT_API_URL;
}

export async function testCloudConnection(customUrl?: string): Promise<{
  success: boolean;
  message: string;
  halaqahCount?: number;
  santriCount?: number;
}> {
  const url = customUrl || getApiUrl();
  try {
    const response = await fetch(`${url}?action=get_all`, {
      method: 'GET',
      redirect: 'follow',
    });

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP ${response.status}: ${response.statusText || 'Gagal menghubungi server database'}`
      };
    }

    const result = await response.json();
    if (result.status === 'success' && result.data) {
      const hCount = Array.isArray(result.data.halaqah) ? result.data.halaqah.length : 0;
      const sCount = Array.isArray(result.data.santri) ? result.data.santri : 0;
      return {
        success: true,
        message: `Koneksi berhasil! Terdeteksi ${hCount} halaqah dan ${sCount} santri dari Google Spreadsheet.`,
        halaqahCount: hCount,
        santriCount: sCount
      };
    }

    return {
      success: false,
      message: result.message || 'Format respons dari Apps Script tidak sesuai.'
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Tidak dapat terhubung ke Google Apps Script. Periksa koneksi internet.'
    };
  }
}

export async function syncToCloud(
  customUrl?: string,
  customData?: Partial<NormalizedDatabaseData>
): Promise<{ success: boolean; message: string }> {
  const url = customUrl || getApiUrl();
  try {
    const dataToSend = {
      pesantren: customData?.pesantren || loadPesantrenInfo(),
      halaqah: customData?.halaqah || loadHalaqahList(),
      santri: customData?.santri || loadSantriList(),
      absensi: customData?.absensi || loadAbsensiRecords(),
      mutabaah: customData?.mutabaah || loadMutabaahRecords(),
    };

    const response = await fetch(url, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain', // GAS requires text/plain for CORS without preflight
      },
      body: JSON.stringify({
        action: 'save_all',
        data: dataToSend
      })
    });

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP ${response.status}: Gagal menyimpan ke Spreadsheet`
      };
    }
    
    const result = await response.json();
    if (result.status === 'success') {
      return {
        success: true,
        message: 'Data berhasil disinkronkan dan disimpan ke Google Spreadsheet!'
      };
    }
    return {
      success: false,
      message: result.message || 'Gagal menyimpan ke Google Spreadsheet.'
    };
  } catch (error: any) {
    console.error('Failed to sync to cloud', error);
    return {
      success: false,
      message: error?.message || 'Gagal menyinkronkan data ke Cloud Google Spreadsheet.'
    };
  }
}

export async function fetchFromCloud(customUrl?: string): Promise<{
  success: boolean;
  message: string;
  data?: NormalizedDatabaseData;
  halaqahCount?: number;
  santriCount?: number;
}> {
  const url = customUrl || getApiUrl();
  try {
    const response = await fetch(`${url}?action=get_all`, {
      method: 'GET',
      redirect: 'follow',
    });

    if (!response.ok) {
      return {
        success: false,
        message: `HTTP ${response.status}: ${response.statusText || 'Gagal menghubungi server Google Sheets'}`
      };
    }

    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      const imported = importAllData(result.data);
      if (imported) {
        return {
          success: true,
          message: `Berhasil mengambil data dari Google Spreadsheet (${imported.halaqah.length} halaqah, ${imported.santri.length} santri).`,
          data: imported,
          halaqahCount: imported.halaqah.length,
          santriCount: imported.santri.length
        };
      }
    }
    return {
      success: false,
      message: result.message || 'Data di Google Spreadsheet tidak valid atau kosong.'
    };
  } catch (error: any) {
    console.error('Failed to fetch from cloud', error);
    return {
      success: false,
      message: error?.message || 'Gagal mengambil data dari Google Sheets. Periksa koneksi internet.'
    };
  }
}
