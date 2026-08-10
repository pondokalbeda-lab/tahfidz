const API_URL = 'https://script.google.com/macros/s/AKfycbzX0JGE9qhJGB4lm8nwD_E3s0SmJdQNGZ-HszaGDLjoWJvHgIu8FCb8Pfub5HZUXwm9/exec';
const data = {
  pesantren: {},
  halaqah: [],
  santri: [],
  absensi: [],
  mutabaah: []
};

fetch(API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
  },
  body: JSON.stringify({
    action: 'save_all',
    data: data
  })
})
.then(res => res.text())
.then(console.log)
.catch(console.error);
