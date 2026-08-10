const API_URL = 'https://script.google.com/macros/s/AKfycbzX0JGE9qhJGB4lm8nwD_E3s0SmJdQNGZ-HszaGDLjoWJvHgIu8FCb8Pfub5HZUXwm9/exec';

async function test() {
  try {
    const res = await fetch(`${API_URL}?action=get_all`, {
      method: 'GET',
    });
    console.log(res.status);
    console.log(await res.text());
  } catch (e) {
    console.error(e);
  }
}
test();
