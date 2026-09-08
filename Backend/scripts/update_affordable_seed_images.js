import fs from 'fs';
import path from 'path';
import { AFFORDABLE_IMAGES_CONFIG } from './fetch_and_verify_all_affordable_images.js';

const seedPath = path.resolve('Backend/src/affordableSeedData.js');
let content = fs.readFileSync(seedPath, 'utf8');

// Build map from product title to slug
const titleToSlug = new Map();
AFFORDABLE_IMAGES_CONFIG.forEach(item => {
  titleToSlug.set(item.title, item.slug);
});

console.log(`Mapped ${titleToSlug.size} titles to slugs.`);

// Check and replace images in each product block
let replacedCount = 0;
AFFORDABLE_IMAGES_CONFIG.forEach(item => {
  const { title, slug } = item;
  const titleIdx = content.indexOf(`title: "${title}"`);
  if (titleIdx === -1) {
    console.warn(`Title not found: "${title}"`);
    return;
  }

  // Find next images: [ ... ] after this title
  const imagesIdx = content.indexOf('images: [', titleIdx);
  const imagesEnd = content.indexOf(']', imagesIdx);

  if (imagesIdx !== -1 && imagesEnd !== -1 && imagesIdx < titleIdx + 600) {
    const oldImagesBlock = content.substring(imagesIdx, imagesEnd + 1);
    const newImagesBlock = `images: [\n      { url: "/images/affordable/${slug}_1.jpg", publicId: "${slug}_1" },\n      { url: "/images/affordable/${slug}_2.jpg", publicId: "${slug}_2" }\n    ]`;
    
    content = content.substring(0, imagesIdx) + newImagesBlock + content.substring(imagesEnd + 1);
    replacedCount++;
  } else {
    console.warn(`Could not locate images block for "${title}"`);
  }
});

fs.writeFileSync(seedPath, content, 'utf8');
console.log(`Successfully updated image paths for ${replacedCount}/${AFFORDABLE_IMAGES_CONFIG.length} products in affordableSeedData.js!`);
