const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, 'products');
const outputPath = path.join(__dirname, 'products.json');

const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.md'));

const products = files.map(filename => {
  const filePath = path.join(productsDir, filename);
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);

  if (!frontmatterMatch) {
    console.warn(`Skipping ${filename}: no frontmatter`);
    return null;
  }

  const frontmatter = {};
  frontmatterMatch[1].split('\n').forEach(line => {
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      let value = match[2].trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (value === 'true') value = true;
      if (value === 'false') value = false;
      frontmatter[match[1].trim()] = value;
    }
  });

  return {
    id: filename.replace('.md', ''),
    ...frontmatter,
    body: frontmatterMatch[2] ? frontmatterMatch[2].trim() : ''
  };
}).filter(Boolean);

fs.writeFileSync(outputPath, JSON.stringify(products, null, 2));
console.log(`Generated products.json with ${products.length} products from ${files.length} files.`);
