import fs from 'fs';
import path from 'path';

const outDir = path.resolve('Frontend/public/images/affordable');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function getWikiImages(titles) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles.join('|'))}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1200&format=json`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'GearGridAffordableHardwareBot/1.0 (contact@geargrid.in; catalog curation)'
    }
  });
  if (!res.ok) {
    console.error(`Wiki API returned HTTP ${res.status}`);
    return {};
  }
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    const result = {};
    const pages = data.query?.pages || {};
    for (const k in pages) {
      const p = pages[k];
      if (p.imageinfo && p.imageinfo.length > 0) {
        result[p.title] = p.imageinfo[0].thumburl || p.imageinfo[0].url;
      }
    }
    return result;
  } catch (err) {
    console.error('JSON parse error, text response was:', text.slice(0, 200));
    return {};
  }
}

async function run() {
  const testTitles = [
    'File:RTX 3060 12GB GDDR6 with GA104.png',
    'File:Zotac GeForce RTX 3060 12GB VRAM LHR video card.jpg',
    'File:AMD Ryzen 5 5600X top.jpg',
    'File:AMD Ryzen 5 5600X bottom.jpg',
    'File:ASUS TUF GAMING B550-PLUS WIFI II Motherboard.jpg',
    'File:2023 Płyta główna ASRock A320M-DVS.jpg'
  ];
  const map = await getWikiImages(testTitles);
  console.log('Resolved Map:', map);
}

run();
