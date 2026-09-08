import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const ramFiles = [
  'corsair_lpx_8gb_ddr4_1.jpg',
  'corsair_lpx_8gb_ddr4_2.jpg',
  'corsair_lpx_16gb_ddr4_1.jpg',
  'corsair_lpx_16gb_ddr4_2.jpg',
  'corsair_lpx_32gb_ddr4_1.jpg',
  'corsair_lpx_32gb_ddr4_2.jpg',
  'gskill_ripjaws_16gb_ddr4_1.jpg',
  'gskill_ripjaws_16gb_ddr4_2.jpg',
  'kingston_fury_16gb_ddr4_1.jpg',
  'kingston_fury_16gb_ddr4_2.jpg',
  'crucial_pro_16gb_ddr4_1.jpg',
  'crucial_pro_16gb_ddr4_2.jpg',
  'kingston_fury_16gb_ddr5_1.jpg',
  'kingston_fury_16gb_ddr5_2.jpg',
  'crucial_16gb_ddr5_4800_1.jpg',
  'crucial_16gb_ddr5_4800_2.jpg',
  'corsair_vengeance_32gb_ddr5_1.jpg',
  'corsair_vengeance_32gb_ddr5_2.jpg'
];

const hashes = new Map();
let duplicateFound = false;

ramFiles.forEach(file => {
  const fullPath = path.join('../Frontend/public/images/affordable', file);
  if (!fs.existsSync(fullPath)) {
    console.error('MISSING:', file);
    return;
  }
  const data = fs.readFileSync(fullPath);
  const hash = crypto.createHash('md5').update(data).digest('hex');
  const size = (data.length / 1024).toFixed(1) + ' KB';
  console.log(file.padEnd(36), size.padEnd(10), hash);
  if (hashes.has(hash)) {
    console.error('DUPLICATE DETECTED:', file, 'matches', hashes.get(hash));
    duplicateFound = true;
  } else {
    hashes.set(hash, file);
  }
});

console.log('\nTotal files checked:', ramFiles.length);
console.log('Unique hashes:', hashes.size);
console.log('Duplicates found:', duplicateFound);
