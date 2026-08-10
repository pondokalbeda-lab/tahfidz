const API_URL = 'https://script.google.com/macros/s/AKfycbzX0JGE9qhJGB4lm8nwD_E3s0SmJdQNGZ-HszaGDLjoWJvHgIu8FCb8Pfub5HZUXwm9/exec';

async function test(action) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: action, data: {} })
  });
  console.log(action, await res.text());
}
async function run() {
  const actions = ['simpan', 'tambah', 'update', 'post', 'set_all', 'create', 'backup_data', 'sync_all', 'upload', 'save_data'];
  for(let a of actions) {
    await test(a);
  }
}
run();
