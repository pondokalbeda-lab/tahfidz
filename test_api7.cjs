const API_URL = 'https://script.google.com/macros/s/AKfycbzX0JGE9qhJGB4lm8nwD_E3s0SmJdQNGZ-HszaGDLjoWJvHgIu8FCb8Pfub5HZUXwm9/exec';

async function test(payload) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload)
  });
  console.log(JSON.stringify(payload), await res.text());
}
async function run() {
  await test({ type: 'save' });
  await test({ command: 'save' });
  await test({ method: 'save' });
  await test({ action: 'saveData' });
  await test({ action: 'get' });
  await test({});
}
run();
