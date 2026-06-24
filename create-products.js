const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, 'products');
if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir);

const products = [
  { id: '3d-printed-parts', title: '3D Printed Parts', category: '3d-printing', description: 'Precision-engineered components for prototypes and manufacturing', price: 'Custom Quote', priceType: 'quote', featured: true, ctaText: 'Request Quote', icon: '🖨️' },
  { id: '3d-prototypes', title: '3D Prototypes', category: '3d-printing', description: 'Rapid prototyping and iterative design solutions', price: 'Custom Quote', priceType: 'quote', featured: true, ctaText: 'Request Quote', icon: '🖨️' },
  { id: 'custom-decals', title: 'Custom Decals', category: 'sticker-plotting', description: 'Professional sticker plotting for decals and branding', price: 'From \u20ac8', priceType: 'fixed', featured: true, ctaText: 'Inquire', icon: '✂️' },
  { id: 'printed-stickers', title: 'Printed Stickers', category: 'sticker-plotting', description: 'High-quality printed stickers for branding and promotion', price: 'From \u20ac5', priceType: 'fixed', featured: false, ctaText: 'Inquire', icon: '✂️' },
  { id: 'resin-bookends', title: 'Resin Bookends', category: 'resin-products', description: 'Custom resin bookends with 3D printed cores', price: 'From \u20ac28', priceType: 'fixed', featured: true, ctaText: 'Inquire', icon: '🔮' },
  { id: 'resin-earrings', title: 'Resin Earrings', category: 'resin-products', description: 'Custom resin earrings with bespoke designs', price: 'From \u20ac18', priceType: 'fixed', featured: false, ctaText: 'Inquire', icon: '🔮' },
  { id: 'resin-trays', title: 'Resin Trays', category: 'resin-products', description: 'Precision-cast resin trays for organization and display', price: 'From \u20ac35', priceType: 'fixed', featured: false, ctaText: 'Inquire', icon: '🔮' },
  { id: 'preserved-flowers', title: 'Preserved Flowers', category: 'resin-products', description: 'Forever-preserved flowers and wedding bouquets in premium resin', price: 'From \u20ac45', priceType: 'fixed', featured: false, ctaText: 'Inquire', icon: '🔮' },
  { id: 'resin-photo-frames', title: 'Resin Photo Frames', category: 'resin-products', description: 'Custom resin frames for precious photos and memories', price: 'From \u20ac25', priceType: 'fixed', featured: false, ctaText: 'Inquire', icon: '🔮' },
  { id: 'resin-bookmarks', title: 'Resin Bookmarks', category: 'resin-products', description: 'Durable resin bookmarks with custom personalization', price: 'From \u20ac8', priceType: 'fixed', featured: false, ctaText: 'Inquire', icon: '🔮' },
  { id: 'custom-nameplates', title: 'Custom Nameplates', category: 'custom-gifts', description: 'Professional nameplates for offices and personalization', price: 'From \u20ac15', priceType: 'fixed', featured: true, ctaText: 'Inquire', icon: '🎁' },
  { id: 'custom-gifts', title: 'Custom Gifts', category: 'custom-gifts', description: 'Personalized gifts and mementos for any occasion', price: 'From \u20ac20', priceType: 'fixed', featured: false, ctaText: 'Inquire', icon: '🎁' },
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
