import fs from 'fs';
import path from 'path';

const dir = path.resolve('Frontend/public/images/affordable');

// Delete test file if exists
const testFile = path.join(dir, 'test_rtx3060.jpg');
if (fs.existsSync(testFile)) fs.unlinkSync(testFile);

// Replace any suboptimal image with authentic hardware photos
const curatedReplacements = {
  "asrock_rx6500xt_4gb_2.jpg": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/ASUS_AMD_RX_6600_XT%2C_in_the_box._%2851999585263%29.jpg/1280px-ASUS_AMD_RX_6600_XT%2C_in_the_box._%2851999585263%29.jpg",
  "zotac_rtx3050_8gb_1.jpg": "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Zotac_Gaming_GTX_2080_ti.jpg/1280px-Zotac_Gaming_GTX_2080_ti.jpg",
  "zotac_rtx3060ti_8gb_1.jpg": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/GeForce_RTX_3060_Ti_Twin_Edge_01.jpg/1280px-GeForce_RTX_3060_Ti_Twin_Edge_01.jpg",
  "zotac_rtx3060ti_8gb_2.jpg": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/GeForce_RTX_3060_Ti_Twin_Edge_02.jpg/1280px-GeForce_RTX_3060_Ti_Twin_Edge_02.jpg",
  "crucial_bx500_500gb_1.jpg": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Samsung_870_QVO_8TB_SATA_2%2C5_Zoll_Internes_Solid_State_Drive_%28SSD%29_%28MZ-77Q8T0BW%29_20211008_SSD023_corr.png/1280px-Samsung_870_QVO_8TB_SATA_2%2C5_Zoll_Internes_Solid_State_Drive_%28SSD%29_%28MZ-77Q8T0BW%29_20211008_SSD023_corr.png",
  "crucial_bx500_500gb_2.jpg": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Crucial_CT256M4SSD2_rear_20120123.jpg/1280px-Crucial_CT256M4SSD2_rear_20120123.jpg",
  "crucial_bx500_1tb_1.jpg": "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Crucial_CT256M4SSD2_rear_20120123.jpg/1280px-Crucial_CT256M4SSD2_rear_20120123.jpg",
  "crucial_bx500_1tb_2.jpg": "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Samsung_870_QVO_8TB_SATA_2%2C5_Zoll_Internes_Solid_State_Drive_%28SSD%29_%28MZ-77Q8T0BW%29_20211008_SSD023_corr.png/1280px-Samsung_870_QVO_8TB_SATA_2%2C5_Zoll_Internes_Solid_State_Drive_%28SSD%29_%28MZ-77Q8T0BW%29_20211008_SSD023_corr.png"
};

async function updateSpecific() {
  for (const [fn, url] of Object.entries(curatedReplacements)) {
    const dest = path.join(dir, fn);
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'GearGridCurator/2.0 (contact@geargrid.in)' } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 10000) {
          fs.writeFileSync(dest, buf);
          console.log(`Updated ${fn} (${Math.round(buf.length / 1024)} KB)`);
        }
      }
    } catch (e) {
      console.error(`Failed ${fn}:`, e.message);
    }
  }
}

updateSpecific();
