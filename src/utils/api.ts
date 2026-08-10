import { exportDataAsJSON, importDataFromJSON } from './storage';

const API_URL = 'https://script.google.com/macros/s/AKfycbzX0JGE9qhJGB4lm8nwD_E3s0SmJdQNGZ-HszaGDLjoWJvHgIu8FCb8Pfub5HZUXwm9/exec';

export async function syncToCloud(): Promise<boolean> {
  try {
    const dataString = exportDataAsJSON();
    const data = JSON.parse(dataString);
    
    // API script expects payload = { action: 'save_all', data: { pesantren, halaqah, santri, absensi, mutabaah } }
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // GAS requires text/plain for CORS without preflight
      },
      body: JSON.stringify({
        action: 'save_all',
        data: {
          pesantren: data.pesantren,
          halaqah: data.halaqah,
          santri: data.santri,
          absensi: data.absensi,
          mutabaah: data.mutabaah,
        }
      })
    });
    
    const result = await response.json();
    if (result.status === 'success') {
      return true;
    }
    console.error('API Error:', result.message);
    return false;
  } catch (error) {
    console.error('Failed to sync to cloud', error);
    return false;
  }
}

export async function fetchFromCloud(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}?action=get_all`);
    const result = await response.json();
    
    if (result.status === 'success' && result.data) {
      // Structure it so importDataFromJSON can consume it
      const backupFormat = {
        ...result.data,
        exportedAt: new Date().toISOString()
      };
      
      return importDataFromJSON(JSON.stringify(backupFormat));
    }
    return false;
  } catch (error) {
    console.error('Failed to fetch from cloud', error);
    return false;
  }
}
