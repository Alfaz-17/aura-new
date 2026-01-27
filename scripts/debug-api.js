async function checkApi() {
  try {
    const res = await fetch('http://localhost:3000/api/items');
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Error Message:', data.details);
    if (data.stack) console.log('Stack Preview:', data.stack.substring(0, 200));
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

checkApi();
