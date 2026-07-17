const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, 'products');
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir);

const products = [
  { id: 'bookmarks', title: 'Bookmarks', category: 'art', description: 'Delicate bookmarks preserving floral beauty for your reading moments', price: 'Starting from €18', priceType: 'starting', featured: true, ctaText: 'Customize Yours', icon: '🔮' },
  { id: 'coaster-sets', title: 'Coaster Sets', category: 'home-decor', description: 'Handcrafted coasters that protect your surfaces with timeless elegance', price: 'Starting from €35', priceType: 'starting', featured: true, ctaText: 'Customize Yours', icon: '🔮' },
  { id: 'marble-trays', title: 'Marble Trays', category: 'home-decor', description: 'Elegant marble-effect trays handcrafted to organize and beautify your space', price: 'Starting from €55', priceType: 'starting', featured: true, ctaText: 'Customize Yours', icon: '🔮' },
  { id: 'letters', title: 'Letters', category: 'personalized-gifts', description: 'Personalized letters celebrating names, initials, and meaningful words', price: 'Starting from €39', priceType: 'starting', featured: true, ctaText: 'Customize Yours', icon: '🔮' },
  { id: 'nameplates', title: 'Nameplates', category: 'personalized-gifts', description: 'Custom nameplates and personalized gifts for homes, offices, and special occasions', price: 'Starting from €45', priceType: 'starting', featured: true, ctaText: 'Customize Yours', icon: '🎁' },
  { id: 'flower-preservation-frames', title: 'Flower Preservation Frames', category: 'flower-preservation', description: 'Forever-preserved flowers and precious memories captured in premium frames', price: 'Starting from €79', priceType: 'starting', featured: true, ctaText: 'Customize Yours', icon: '🔮' },
  { id: 'clocks', title: 'Clocks', category: 'home-decor', description: 'Unique clocks combining functionality with artistic beauty for your home', price: 'Starting from €99', priceType: 'starting', featured: true, ctaText: 'Customize Yours', icon: '🕐' },
  { id: 'bookends', title: 'Bookends', category: 'art', description: 'Custom bookends that elevate your space with functional art and preserved beauty', price: 'Starting from €149', priceType: 'starting', featured: true, ctaText: 'Customize Yours', icon: '📚' },
  { id: 'wedding-bouquet-preservation', title: 'Wedding Bouquet Preservation', category: 'flower-preservation', description: 'Transform your wedding bouquet into a timeless keepsake preserved in premium material', price: 'Starting from €179', priceType: 'starting', featured: true, ctaText: 'Request a Quote', icon: '💐' },
  { id: 'memorial-flower-preservation', title: 'Memorial Flower Preservation', category: 'flower-preservation', description: 'Honor loved ones with beautiful memorial flower keepsakes preserved in material', price: 'Starting from €89', priceType: 'starting', featured: true, ctaText: 'Request a Quote', icon: '🕊️' },
  { id: 'custom-gifts', title: 'Custom Gifts', category: 'personalized-gifts', description: 'Personalized gifts and mementos for birthdays, anniversaries, and every occasion', price: 'Starting from €49', priceType: 'starting', featured: true, ctaText: 'Customize Yours', icon: '🎁' },
  { id: 'earrings', title: 'Earrings', category: 'art', description: 'Bespoke earrings crafted with care, lightweight and uniquely designed', price: 'Starting from €35', priceType: 'starting', featured: false, ctaText: 'Customize Yours', icon: '💎' },
  { id: 'sticker-plotting', title: 'Sticker Plotting', category: 'creative-services', description: 'Precision-cut custom stickers for personal and commercial use', price: 'Starting from €10', priceType: 'starting', featured: false, ctaText: 'Request a Quote', icon: '✂️' },
  { id: 'sticker-printing', title: 'Sticker Printing', category: 'creative-services', description: 'High-quality printed stickers on premium materials', price: 'Starting from €15', priceType: 'starting', featured: false, ctaText: 'Request a Quote', icon: '🖨️' },
  { id: 'vinyl-decals', title: 'Vinyl Decals', category: 'creative-services', description: 'Custom vinyl decals for walls, windows, vehicles, and gifts', price: 'Starting from €12', priceType: 'starting', featured: false, ctaText: 'Request a Quote', icon: '📋' },
  { id: 'acrylic-signs', title: 'Acrylic Signs', category: 'creative-services', description: 'Elegant acrylic signs with custom engraving and precision design', price: 'Starting from €35', priceType: 'starting', featured: false, ctaText: 'Request a Quote', icon: '🔷' },
  { id: '3d-design', title: '3D Design', category: 'creative-services', description: 'Creative 3D modeling and design for unique artistic visions and prototypes', price: '€40/hour', priceType: 'hourly', featured: false, ctaText: 'Request a Quote', icon: '🎨' },
  { id: '3d-printing', title: '3D Printing', category: 'creative-services', description: 'High-quality 3D printing for prototypes and custom pieces', price: 'Starting from €20', priceType: 'starting', featured: false, ctaText: 'Request a Quote', icon: '🖨️' }
];

products.forEach(p => {
  const content = `---
title: "${p.title}"
category: "${p.category}"
description: "${p.description}"
price: "${p.price}"
priceType: "${p.priceType}"
featured: ${p.featured}
ctaText: "${p.ctaText}"
icon: "${p.icon}"
---
${p.description}
`;
  fs.writeFileSync(path.join(productsDir, `${p.id}.md`), content);
  console.log(`Created: products/${p.id}.md`);
});

console.log('Done! All product files created.');
