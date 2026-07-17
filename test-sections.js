const fs = require('fs');
const json = fs.readFileSync('languages.json', 'utf8');

// Try parsing different sections
const sections = [
  { name: 'First 10K', end: 10000 },
  { name: 'First 15K', end: 15000 },
  { name: 'First 20K', end: 20000 },
  { name: 'First 25K', end: 25000 },
  { name: 'Full file', end: json.length }
];

for (const section of sections) {
  const slice = json.slice(0, section.end);
  // Count braces to add proper closing
  let openBraces = 0;
  for (let i = 0; i < slice.length; i++) {
    if (slice[i] === '{') openBraces++;
    else if (slice[i] === '}') openBraces--;
  }
  const testStr = slice + '}'.repeat(Math.max(0, openBraces));
  
  try {
    JSON.parse(testStr);
    console.log(`${section.name}: VALID`);
  } catch (e) {
    const posMatch = e.message.match(/position (\d+)/);
    const pos = posMatch ? parseInt(posMatch[1]) : 0;
    console.log(`${section.name}: INVALID at relative position ${pos}`);
    if (pos > 0 && pos < testStr.length) {
      console.log(`  Context: ${testStr.slice(pos - 50, pos + 50).replace(/\n/g, '\\n')}`);
    }
  }
}
