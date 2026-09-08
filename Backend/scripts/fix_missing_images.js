import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('Frontend/public/images/affordable');

async function searchAndDownload(slug, filename, query) {
  const destPath = path.join(OUT_DIR, filename);
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1280&format=json`;
  
  try {
    const res = await fetch(searchUrl, {
      headers: { 'User-Agent': 'GearGridCurator/2.0 (contact@geargrid.in)' }
    });
    const data = await res.json();
    const pages = data.query?.pages || {};
    for (const k in pages) {
      const p = pages[k];
      const imgUrl = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
      if (imgUrl) {
        console.log(`Trying ${p.title} -> ${imgUrl.slice(0, 70)}`);
        const imgRes = await fetch(imgUrl, {
          headers: { 'User-Agent': 'GearGridCurator/2.0 (contact@geargrid.in)' }
        });
        if (imgRes.ok) {
          const buf = Buffer.from(await imgRes.arrayBuffer());
          if (buf.length > 5000) {
            fs.writeFileSync(destPath, buf);
            console.log(`[SUCCESS] Saved ${filename} (${Math.round(buf.length / 1024)} KB)`);
            return true;
          }
        }
      }
    }
  } catch (err) {
    console.error(`Error for ${filename}:`, err);
  }
  return false;
}

async function fixMissing() {
  const missing = [
    { fn: "zotac_rtx3050_8gb_1.jpg", q: "Zotac GeForce RTX" },
    { fn: "zotac_rtx3060ti_8gb_1.jpg", q: "GeForce RTX 3060" },
    { fn: "zotac_rtx3060ti_8gb_2.jpg", q: "GeForce RTX graphics card" },
    { fn: "asrock_rx6500xt_4gb_2.jpg", q: "Radeon graphics card dual fan" },
    { fn: "crucial_bx500_500gb_1.jpg", q: "2.5 inch SATA SSD" },
    { fn: "crucial_bx500_500gb_2.jpg", q: "Solid state drive SATA" },
    { fn: "crucial_bx500_1tb_1.jpg", q: "Solid state drive SATA" },
    { fn: "crucial_bx500_1tb_2.jpg", q: "2.5 inch SATA SSD" }
  ];

  for (const m of missing) {
    console.log(`\nSearching for ${m.fn} with query: "${m.q}"`);
    await searchAndDownload('', m.fn, m.q);
    await new Promise(r => setTimeout(r, 600));
  }
}

fixMissing();
