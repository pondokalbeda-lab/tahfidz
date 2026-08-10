const API_URL = 'https://script.google.com/macros/s/AKfycbzX0JGE9qhJGB4lm8nwD_E3s0SmJdQNGZ-HszaGDLjoWJvHgIu8FCb8Pfub5HZUXwm9/exec';
const data = {
  pesantren: {},
  halaqah: [],
  santri: [],
  absensi: [],
  mutabaah: []
};

async function test(action) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: action, data: data })
  });
  console.log(action, await res.text());
}
async function run() {
  await test('save');
  await test('sync');
  await test('backup');
  await test('export');
  await test('write');
  await test('import');
  await test('read');
  await test('load');
}
run();
