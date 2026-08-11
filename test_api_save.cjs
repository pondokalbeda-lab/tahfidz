const fetch = require('node-fetch'); // actually fetch is global in modern node
const API_URL = 'https://script.google.com/macros/s/AKfycbzX0JGE9qhJGB4lm8nwD_E3s0SmJdQNGZ-HszaGDLjoWJvHgIu8FCb8Pfub5HZUXwm9/exec';
async function test() {
  const res = await fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      action: 'save_all',
      data: {
        pesantren: { nama: 'Test' },
        halaqah: [],
        santri: [],
        absensi: [],
        mutabaah: []
      }
    })
  });
  console.log(await res.text());
}
test();
