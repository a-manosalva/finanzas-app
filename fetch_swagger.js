import fs from 'fs';

async function fetchSwagger() {
  try {
    const res = await fetch('https://finanzas-api.ubunifusoft.digital/v3/api-docs');
    const data = await res.json();
    fs.writeFileSync('swagger.json', JSON.stringify(data, null, 2));
    console.log('Saved swagger.json successfully');
  } catch (err) {
    console.error('Error fetching swagger:', err);
  }
}

fetchSwagger();
