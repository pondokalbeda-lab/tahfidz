const API_URL = 'https://script.google.com/macros/s/AKfycbzX0JGE9qhJGB4lm8nwD_E3s0SmJdQNGZ-HszaGDLjoWJvHgIu8FCb8Pfub5HZUXwm9/exec';

async function test(action) {
  const res = await fetch(`${API_URL}?action=${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ data: {} })
  });
  console.log(action, await res.text());
}
async function run() {
  await test('save_all');
  await test('post');
}
run();
