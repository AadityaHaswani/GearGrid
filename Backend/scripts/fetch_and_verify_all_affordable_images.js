import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('Frontend/public/images/affordable');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadAndSave(url, destPath) {
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 15000) {
    console.log(`  [EXISTS] ${path.basename(destPath)} (${Math.round(fs.statSync(destPath).size / 1024)} KB)`);
    return true;
  }

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 GearGridCatalog/2.0 (contact@geargrid.in)'
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
      if (!res.ok) {
        console.warn(`  [HTTP ${res.status}] Attempt ${attempt} failed for ${url.slice(0, 80)}`);
        await sleep(1500 * attempt);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length < 5000) {
        console.warn(`  [TOO SMALL: ${buffer.length}b] ${url.slice(0, 80)}`);
        return false;
      }
      fs.writeFileSync(destPath, buffer);
      console.log(`  [DOWNLOADED] ${path.basename(destPath)} (${Math.round(buffer.length / 1024)} KB)`);
      return true;
    } catch (err) {
      console.warn(`  [ERROR] Attempt ${attempt}: ${err.message} (${url.slice(0, 80)})`);
      await sleep(1500 * attempt);
    }
  }
  return false;
}

export const AFFORDABLE_IMAGES_CONFIG = [
  // =========================================================================
  // 1. GRAPHICS CARDS (9 items)
  // =========================================================================
  {
    slug: "asus_dual_rtx3050_6gb",
    title: "ASUS Dual GeForce RTX 3050 6GB GDDR6 OC Edition",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/RTX_3060_12GB_GDDR6_with_GA104.png/1280px-RTX_3060_12GB_GDDR6_with_GA104.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Zotac_GeForce_RTX_3060_12GB_VRAM_LHR_video_card.jpg/1280px-Zotac_GeForce_RTX_3060_12GB_VRAM_LHR_video_card.jpg"
  },
  {
    slug: "gigabyte_rtx3050_eagle_6gb",
    title: "Gigabyte GeForce RTX 3050 EAGLE OC 6GB GDDR6",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/54/Colorful_iGame_GeForce_RTX_3060_Ultra_W_OC_12G-V-00.02.13.344.png/1280px-Colorful_iGame_GeForce_RTX_3060_Ultra_W_OC_12G-V-00.02.13.344.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0a/Colorful_iGame_GeForce_RTX_3060_Ultra_W_OC_12G-V-00.02.09.542.png/1280px-Colorful_iGame_GeForce_RTX_3060_Ultra_W_OC_12G-V-00.02.09.542.png"
  },
  {
    slug: "zotac_rtx3050_8gb",
    title: "ZOTAC Gaming GeForce RTX 3050 8GB Twin Edge OC",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/GeForce_RTX_3060_Ti_Twin_Edge_01.jpg/1280px-GeForce_RTX_3060_Ti_Twin_Edge_01.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/GeForce_RTX_3060_Ti_Twin_Edge_02.jpg/1280px-GeForce_RTX_3060_Ti_Twin_Edge_02.jpg"
  },
  {
    slug: "msi_rtx2060_ventus_6gb",
    title: "MSI GeForce RTX 2060 VENTUS GP OC 6GB GDDR6",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Graphics_Card_Upgrading_%2849259431802%29.jpg/1280px-Graphics_Card_Upgrading_%2849259431802%29.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Graphics_Card_Upgrading_-_49259538552.jpg/1280px-Graphics_Card_Upgrading_-_49259538552.jpg"
  },
  {
    slug: "asus_dual_rtx3060_12gb",
    title: "ASUS Dual GeForce RTX 3060 12GB GDDR6 OC Edition V2",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b1/Zotac_GeForce_RTX_3060_12GB_VRAM_LHR_video_card.jpg/1280px-Zotac_GeForce_RTX_3060_12GB_VRAM_LHR_video_card.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/RTX_3060_12GB_GDDR6_with_GA104.png/1280px-RTX_3060_12GB_GDDR6_with_GA104.png"
  },
  {
    slug: "zotac_rtx3060ti_8gb",
    title: "ZOTAC Gaming GeForce RTX 3060 Ti Twin Edge 8GB GDDR6",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/GeForce_RTX_3060_Ti_Twin_Edge_02.jpg/1280px-GeForce_RTX_3060_Ti_Twin_Edge_02.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/86/GeForce_RTX_3060_Ti_Twin_Edge_01.jpg/1280px-GeForce_RTX_3060_Ti_Twin_Edge_01.jpg"
  },
  {
    slug: "sapphire_pulse_rx6600_8gb",
    title: "Sapphire PULSE AMD Radeon RX 6600 8GB GDDR6",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Asus_AMD_RX_6600_XT_GPU._With_dual_fan._%2852000339764%29.jpg/1280px-Asus_AMD_RX_6600_XT_GPU._With_dual_fan._%2852000339764%29.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/21/ASUS_AMD_RX_6600_XT%2C_in_the_box._%2851999585263%29.jpg/1280px-ASUS_AMD_RX_6600_XT%2C_in_the_box._%2851999585263%29.jpg"
  },
  {
    slug: "asrock_rx6500xt_4gb",
    title: "ASRock AMD Radeon RX 6500 XT Phantom Gaming D 4GB OC",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Asus_AMD_RX_6600_XT_GPU_in_dark_room_%2852000081176%29.jpg/1280px-Asus_AMD_RX_6600_XT_GPU_in_dark_room_%2852000081176%29.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Radeon_RX_5500_XT_video_card.jpg/1280px-Radeon_RX_5500_XT_video_card.jpg"
  },
  {
    slug: "asrock_rx7600_8gb",
    title: "ASRock AMD Radeon RX 7600 Challenger 8GB OC",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Asus_AMD_RX_6600_XT_GPU._With_dual_fan._%2852000339764%29.jpg/1280px-Asus_AMD_RX_6600_XT_GPU._With_dual_fan._%2852000339764%29.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bf/Asus_AMD_RX_6600_XT_GPU_in_dark_room_%2852000081176%29.jpg/1280px-Asus_AMD_RX_6600_XT_GPU_in_dark_room_%2852000081176%29.jpg"
  },

  // =========================================================================
  // 2. PROCESSORS (10 items)
  // =========================================================================
  {
    slug: "intel_core_i3_12100f",
    title: "Intel Core i3-12100F Desktop Processor (4 Cores / 8 Threads)",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Intel_Core_i7-1280P_as_mutant_in_a_desktop_computer_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29_17.png/1280px-Intel_Core_i7-1280P_as_mutant_in_a_desktop_computer_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29_17.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Intel_Core_i7-1280P_as_mutant_in_a_desktop_computer_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29_07.png/1280px-Intel_Core_i7-1280P_as_mutant_in_a_desktop_computer_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29_07.png"
  },
  {
    slug: "intel_core_i3_13100f",
    title: "Intel Core i3-13100F Desktop Processor (4 Cores / 8 Threads)",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/%D0%94%D0%B5%D1%88%D1%91%D0%B2%D1%8B%D0%B9_Core_i9_%C2%A6_%D0%9C%D1%83%D1%82%D0%B0%D0%BD%D1%82_12900HX_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_14600K_%D0%B8_14900K_%281440p_30fps_VP9-160kbit_Opus%29-00.03.15.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%94%D0%B5%D1%88%D1%91%D0%B2%D1%8B%D0%B9_Core_i9_%C2%A6_%D0%9C%D1%83%D1%82%D0%B0%D0%BD%D1%82_12900HX_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_14600K_%D0%B8_14900K_%281440p_30fps_VP9-160kbit_Opus%29-00.03.15.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/%D0%94%D0%B5%D1%88%D1%91%D0%B2%D1%8B%D0%B9_Core_i9_%C2%A6_%D0%9C%D1%83%D1%82%D0%B0%D0%BD%D1%82_12900HX_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_14600K_%D0%B8_14900K_%281440p_30fps_VP9-160kbit_Opus%29-00.03.20.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%94%D0%B5%D1%88%D1%91%D0%B2%D1%8B%D0%B9_Core_i9_%C2%A6_%D0%9C%D1%83%D1%82%D0%B0%D0%BD%D1%82_12900HX_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_14600K_%D0%B8_14900K_%281440p_30fps_VP9-160kbit_Opus%29-00.03.20.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png"
  },
  {
    slug: "intel_core_i5_12400f",
    title: "Intel Core i5-12400F Desktop Processor (6 Cores / 12 Threads)",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d1/Intel_Core_i7-1280P_as_mutant_in_a_desktop_computer_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29_07.png/1280px-Intel_Core_i7-1280P_as_mutant_in_a_desktop_computer_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29_07.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Intel_Core_i7-1280P_as_mutant_in_a_desktop_computer_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29_17.png/1280px-Intel_Core_i7-1280P_as_mutant_in_a_desktop_computer_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29_17.png"
  },
  {
    slug: "intel_core_i5_12400",
    title: "Intel Core i5-12400 Desktop Processor (6 Cores / 12 Threads with Intel UHD 730)",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/%D0%94%D0%B5%D1%88%D1%91%D0%B2%D1%8B%D0%B9_Core_i9_%C2%A6_%D0%9C%D1%83%D1%82%D0%B0%D0%BD%D1%82_12900HX_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_14600K_%D0%B8_14900K_%281440p_30fps_VP9-160kbit_Opus%29-00.03.15.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%94%D0%B5%D1%88%D1%91%D0%B2%D1%8B%D0%B9_Core_i9_%C2%A6_%D0%9C%D1%83%D1%82%D0%B0%D0%BD%D1%82_12900HX_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_14600K_%D0%B8_14900K_%281440p_30fps_VP9-160kbit_Opus%29-00.03.15.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/%D0%94%D0%B5%D1%88%D1%91%D0%B2%D1%8B%D0%B9_Core_i9_%C2%A6_%D0%9C%D1%83%D1%82%D0%B0%D0%BD%D1%82_12900HX_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_14600K_%D0%B8_14900K_%281440p_30fps_VP9-160kbit_Opus%29-00.03.20.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%94%D0%B5%D1%88%D1%91%D0%B2%D1%8B%D0%B9_Core_i9_%C2%A6_%D0%9C%D1%83%D1%82%D0%B0%D0%BD%D1%82_12900HX_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_14600K_%D0%B8_14900K_%281440p_30fps_VP9-160kbit_Opus%29-00.03.20.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png"
  },
  {
    slug: "intel_core_i5_13400f",
    title: "Intel Core i5-13400F Desktop Processor (10 Cores / 16 Threads)",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Intel_Core_i7-1280P_as_mutant_in_a_desktop_computer_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29_17.png/1280px-Intel_Core_i7-1280P_as_mutant_in_a_desktop_computer_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29_17.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/%D0%94%D0%B5%D1%88%D1%91%D0%B2%D1%8B%D0%B9_Core_i9_%C2%A6_%D0%9C%D1%83%D1%82%D0%B0%D0%BD%D1%82_12900HX_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_14600K_%D0%B8_14900K_%281440p_30fps_VP9-160kbit_Opus%29-00.03.15.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%94%D0%B5%D1%88%D1%91%D0%B2%D1%8B%D0%B9_Core_i9_%C2%A6_%D0%9C%D1%83%D1%82%D0%B0%D0%BD%D1%82_12900HX_%D0%BF%D1%80%D0%BE%D1%82%D0%B8%D0%B2_14600K_%D0%B8_14900K_%281440p_30fps_VP9-160kbit_Opus%29-00.03.15.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png"
  },
  {
    slug: "amd_ryzen_5_5500",
    title: "AMD Ryzen 5 5500 Desktop Processor (6 Cores / 12 Threads)",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.02.05.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.02.05.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.03.56.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.03.56.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png"
  },
  {
    slug: "amd_ryzen_5_5600",
    title: "AMD Ryzen 5 5600 Desktop Processor (6 Cores / 12 Threads)",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.03.56.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.03.56.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.02.05.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.02.05.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png"
  },
  {
    slug: "amd_ryzen_5_5600g",
    title: "AMD Ryzen 5 5600G Desktop APU (6 Cores / 12 Threads with Radeon Graphics)",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.02.05.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.02.05.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.03.56.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.03.56.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png"
  },
  {
    slug: "amd_ryzen_5_5600x",
    title: "AMD Ryzen 5 5600X Desktop Processor (6 Cores / 12 Threads)",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.03.56.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.03.56.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.02.05.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.02.05.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png"
  },
  {
    slug: "amd_ryzen_7_5700x",
    title: "AMD Ryzen 7 5700X Desktop Processor (8 Cores / 16 Threads)",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.02.05.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.02.05.200_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.03.56.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png/1280px-%D0%92%D1%8B%D0%B1%D0%B8%D1%80%D0%B0%D0%B5%D0%BC_%D0%BB%D1%83%D1%87%D1%88%D0%B8%D0%B9_Ryzen_%D0%A2%D0%B5%D1%81%D1%82_%D0%BF%D1%80%D0%BE%D1%86%D0%B5%D1%81%D1%81%D0%BE%D1%80%D0%BE%D0%B2_%D0%BD%D0%B0_AM4_%D0%B8_AM5-00.03.56.400_%28%D0%9C%D0%BE%D0%B9_%D0%9A%D0%BE%D0%BC%D0%BF%D1%8C%D1%8E%D1%82%D0%B5%D1%80%29.png"
  },

  // =========================================================================
  // 3. MOTHERBOARDS (9 items)
  // =========================================================================
  {
    slug: "asus_prime_h610m_e_d4",
    title: "ASUS Prime H610M-E D4 Micro-ATX Motherboard",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg/1280px-Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg"
  },
  {
    slug: "msi_pro_h610m_e_ddr4",
    title: "MSI PRO H610M-E DDR4 Micro-ATX Motherboard",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg/1280px-Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg"
  },
  {
    slug: "msi_pro_b760m_e_ddr4",
    title: "MSI PRO B760M-E DDR4 Micro-ATX Motherboard",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg/1280px-Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg"
  },
  {
    slug: "gigabyte_b760m_ds3h_ax",
    title: "Gigabyte B760M DS3H AX DDR4 WiFi Motherboard",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg/1280px-Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg"
  },
  {
    slug: "asus_prime_a520m_k",
    title: "ASUS Prime A520M-K Micro-ATX Motherboard",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg/1280px-Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg"
  },
  {
    slug: "msi_b450m_pro_vdh_max",
    title: "MSI B450M PRO-VDH MAX Micro-ATX Motherboard",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg/1280px-Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg"
  },
  {
    slug: "gigabyte_b550m_ds3h_ac",
    title: "Gigabyte B550M DS3H AC Micro-ATX Motherboard",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg/1280px-Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg"
  },
  {
    slug: "asus_prime_b550m_a_wifi",
    title: "ASUS Prime B550M-A WiFi II Micro-ATX Motherboard",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg/1280px-Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg"
  },
  {
    slug: "msi_mag_b550_tomahawk",
    title: "MSI MAG B550 TOMAHAWK ATX Gaming Motherboard",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg/1280px-Socket_AM4_%28ASRock_AB350M_Pro4%29_01.jpg"
  },

  // =========================================================================
  // 4. MEMORY / RAM (7 items)
  // =========================================================================
  {
    slug: "corsair_lpx_8gb_ddr4",
    title: "Corsair Vengeance LPX 8GB (1x8GB) DDR4 3200MHz CL16",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg/1280px-2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg"
  },
  {
    slug: "corsair_lpx_16gb_ddr4",
    title: "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz CL16 Desktop RAM",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg/1280px-2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png"
  },
  {
    slug: "gskill_ripjaws_16gb_ddr4",
    title: "G.Skill Ripjaws V 16GB (2x8GB) DDR4 3600MHz CL18 Gaming Memory",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg/1280px-2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg"
  },
  {
    slug: "kingston_fury_16gb_ddr4",
    title: "Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz Desktop RAM",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg/1280px-2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png"
  },
  {
    slug: "crucial_pro_16gb_ddr4",
    title: "Crucial Pro 16GB (2x8GB) DDR4 3200MHz CL22 Desktop Memory",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg/1280px-2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg"
  },
  {
    slug: "corsair_lpx_32gb_ddr4",
    title: "Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz CL16 RAM",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg/1280px-2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png"
  },
  {
    slug: "kingston_fury_16gb_ddr5",
    title: "Kingston FURY Beast 16GB (1x16GB) DDR5 5600MHz CL40",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg/1280px-2%2A8Go_DDR4_Corsair_-_2018-05-08.jpg"
  },

  // =========================================================================
  // 5. STORAGE (7 items)
  // =========================================================================
  {
    slug: "kingston_nv2_500gb",
    title: "Kingston NV2 500GB PCIe 4.0 NVMe M.2 SSD",
    img1: "https://upload.wikimedia.org/wikipedia/commons/5/52/256GB_2230_NVME_SSD_%2B_256GB_NGFF_SSD.jpg",
    img2: "https://upload.wikimedia.org/wikipedia/commons/c/c0/256GB_2230_NVME_SSD_1.jpg"
  },
  {
    slug: "crucial_p3_500gb",
    title: "Crucial P3 500GB PCIe 3.0 3D NAND NVMe M.2 SSD",
    img1: "https://upload.wikimedia.org/wikipedia/commons/c/c0/256GB_2230_NVME_SSD_1.jpg",
    img2: "https://upload.wikimedia.org/wikipedia/commons/5/52/256GB_2230_NVME_SSD_%2B_256GB_NGFF_SSD.jpg"
  },
  {
    slug: "kingston_nv2_1tb",
    title: "Kingston NV2 1TB PCIe 4.0 NVMe M.2 SSD",
    img1: "https://upload.wikimedia.org/wikipedia/commons/5/52/256GB_2230_NVME_SSD_%2B_256GB_NGFF_SSD.jpg",
    img2: "https://upload.wikimedia.org/wikipedia/commons/c/c0/256GB_2230_NVME_SSD_1.jpg"
  },
  {
    slug: "crucial_p3_plus_1tb",
    title: "Crucial P3 Plus 1TB PCIe 4.0 3D NAND NVMe M.2 SSD",
    img1: "https://upload.wikimedia.org/wikipedia/commons/c/c0/256GB_2230_NVME_SSD_1.jpg",
    img2: "https://upload.wikimedia.org/wikipedia/commons/5/52/256GB_2230_NVME_SSD_%2B_256GB_NGFF_SSD.jpg"
  },
  {
    slug: "crucial_bx500_500gb",
    title: "Crucial BX500 500GB 3D NAND 2.5-inch SATA SSD",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Solid-state_drive_SanDisk_Plus_240_GB_%28cropped%29.jpg/1280px-Solid-state_drive_SanDisk_Plus_240_GB_%28cropped%29.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Crucial_BX100_SSD.jpg/1280px-Crucial_BX100_SSD.jpg"
  },
  {
    slug: "crucial_bx500_1tb",
    title: "Crucial BX500 1TB 3D NAND 2.5-inch SATA SSD",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1e/Crucial_BX100_SSD.jpg/1280px-Crucial_BX100_SSD.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Solid-state_drive_SanDisk_Plus_240_GB_%28cropped%29.jpg/1280px-Solid-state_drive_SanDisk_Plus_240_GB_%28cropped%29.jpg"
  },
  {
    slug: "wd_green_sn350_1tb",
    title: "Western Digital WD Green SN350 1TB NVMe SSD",
    img1: "https://upload.wikimedia.org/wikipedia/commons/5/52/256GB_2230_NVME_SSD_%2B_256GB_NGFF_SSD.jpg",
    img2: "https://upload.wikimedia.org/wikipedia/commons/c/c0/256GB_2230_NVME_SSD_1.jpg"
  },

  // =========================================================================
  // 6. POWER SUPPLIES (8 items)
  // =========================================================================
  {
    slug: "deepcool_pk450d",
    title: "DeepCool PK450D 450W 80 PLUS Bronze Power Supply",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/ATX_Computer_power_supply_unit.jpg/1280px-ATX_Computer_power_supply_unit.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png/1280px-Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png"
  },
  {
    slug: "corsair_cv450",
    title: "Corsair CV450 450W 80 PLUS Bronze Certified PSU",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png/1280px-Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/ATX_Computer_power_supply_unit.jpg/1280px-ATX_Computer_power_supply_unit.jpg"
  },
  {
    slug: "deepcool_pk550d",
    title: "DeepCool PK550D 550W 80 PLUS Bronze Power Supply",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/ATX_Computer_power_supply_unit.jpg/1280px-ATX_Computer_power_supply_unit.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png/1280px-Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png"
  },
  {
    slug: "coolermaster_mwe450",
    title: "Cooler Master MWE 450 Bronze V2 450W 80 Plus Bronze PSU",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png/1280px-Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/ATX_Computer_power_supply_unit.jpg/1280px-ATX_Computer_power_supply_unit.jpg"
  },
  {
    slug: "coolermaster_mwe550",
    title: "Cooler Master MWE 550 Bronze V2 550W 80 Plus Bronze PSU",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/ATX_Computer_power_supply_unit.jpg/1280px-ATX_Computer_power_supply_unit.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png/1280px-Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png"
  },
  {
    slug: "corsair_cv550",
    title: "Corsair CV550 550W 80 PLUS Bronze Certified Power Supply",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png/1280px-Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/ATX_Computer_power_supply_unit.jpg/1280px-ATX_Computer_power_supply_unit.jpg"
  },
  {
    slug: "antesports_vs500l",
    title: "Ant Esports VS500L 500W Non-Modular Power Supply",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/ATX_Computer_power_supply_unit.jpg/1280px-ATX_Computer_power_supply_unit.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png/1280px-Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png"
  },
  {
    slug: "coolermaster_mwe650",
    title: "Cooler Master MWE 650 Bronze V2 650W Power Supply",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png/1280px-Be_quiet%21_Straight_Power_12_1200W_20240405_HOF1650-HDR_RAW-Export_000105.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/ATX_Computer_power_supply_unit.jpg/1280px-ATX_Computer_power_supply_unit.jpg"
  },

  // =========================================================================
  // 7. COOLING & CASES (8 items)
  // =========================================================================
  // 3 CPU Coolers (Actual Cooler / Heatsink images)
  {
    slug: "deepcool_iceedge",
    title: "DeepCool IceEdge Mini FS V2.0 CPU Air Cooler",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3b/Deepcool_cooler.png/1280px-Deepcool_cooler.png",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5f/Heatsink_with_heat_pipes.jpg/1280px-Heatsink_with_heat_pipes.jpg"
  },
  {
    slug: "antesports_c612",
    title: "Ant Esports ICE-C612 V2 ARGB CPU Air Cooler",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/2023_Ch%C5%82odzenie_procesora_be_quiet%21_Dark_Rock_Top_Flow_%281%29.jpg/1280px-2023_Ch%C5%82odzenie_procesora_be_quiet%21_Dark_Rock_Top_Flow_%281%29.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/2023_Ch%C5%82odzenie_procesora_be_quiet%21_Dark_Rock_Top_Flow_%282%29.jpg/1280px-2023_Ch%C5%82odzenie_procesora_be_quiet%21_Dark_Rock_Top_Flow_%282%29.jpg"
  },
  {
    slug: "cm_hyper212_v3",
    title: "Cooler Master Hyper 212 Spectrum V3 ARGB CPU Cooler",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5c/Cooler_Master_Hyper_EVO_212_1_2019-05-15.jpg/1280px-Cooler_Master_Hyper_EVO_212_1_2019-05-15.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Cooler_Master_Hyper_EVO_212_2_2019-05-15.jpg/1280px-Cooler_Master_Hyper_EVO_212_2_2019-05-15.jpg"
  },
  // 5 PC Cases (Actual Chassis / Enclosure images)
  {
    slug: "antesports_elite1100",
    title: "Ant Esports Elite 1100 Mid-Tower Gaming Cabinet",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/ATX_computer_case_-_left_-_2018-05-18.jpg/1280px-ATX_computer_case_-_left_-_2018-05-18.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/ATX_computer_case_-_back_-_2018-03-18.jpg/1280px-ATX_computer_case_-_back_-_2018-03-18.jpg"
  },
  {
    slug: "antesports_ice100",
    title: "Ant Esports ICE-100 Mid-Tower Gaming Case",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/ATX_Computer_cases%2C_back_view.jpg/1280px-ATX_Computer_cases%2C_back_view.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/73/ATX_Computer_cases.jpg/1280px-ATX_Computer_cases.jpg"
  },
  {
    slug: "deepcool_matrexx40",
    title: "DeepCool Matrexx 40 3FS Micro-ATX Gaming Case",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Thermaltake_Level_20_20190601.jpg/1280px-Thermaltake_Level_20_20190601.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Thermaltake_Core_P90_TG_20190601.jpg/1280px-Thermaltake_Core_P90_TG_20190601.jpg"
  },
  {
    slug: "msi_mag_forge_m100r",
    title: "MSI MAG Forge M100R Micro-ATX Gaming Case",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Thermaltake_chassis.jpg/1280px-Thermaltake_chassis.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Thermaltake_Installed.jpg/1280px-Thermaltake_Installed.jpg"
  },
  {
    slug: "galax_revolution05",
    title: "Galax Revolution 05 White ATX Gaming Chassis",
    img1: "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Antec_P182.jpg/1280px-Antec_P182.jpg",
    img2: "https://thumb.wikimedia.org/wikipedia/commons/thumb/7/75/Antec_P182_-_Front_Panel.jpg/1280px-Antec_P182_-_Front_Panel.jpg"
  }
];

async function main() {
  console.log(`Starting download for ${AFFORDABLE_IMAGES_CONFIG.length} affordable products (${AFFORDABLE_IMAGES_CONFIG.length * 2} images)...`);
  let totalSuccess = 0;
  let totalFailed = 0;
  const failedList = [];

  for (let i = 0; i < AFFORDABLE_IMAGES_CONFIG.length; i++) {
    const item = AFFORDABLE_IMAGES_CONFIG[i];
    console.log(`\n[${i + 1}/${AFFORDABLE_IMAGES_CONFIG.length}] ${item.title}`);
    
    const p1 = path.join(OUT_DIR, `${item.slug}_1.jpg`);
    const p2 = path.join(OUT_DIR, `${item.slug}_2.jpg`);

    const ok1 = await downloadAndSave(item.img1, p1);
    await sleep(400);
    const ok2 = await downloadAndSave(item.img2, p2);
    await sleep(400);

    if (ok1) totalSuccess++;
    else { totalFailed++; failedList.push(`${item.slug}_1.jpg`); }

    if (ok2) totalSuccess++;
    else { totalFailed++; failedList.push(`${item.slug}_2.jpg`); }
  }

  console.log('\n======================================================');
  console.log(`DOWNLOAD RESULTS: ${totalSuccess}/${AFFORDABLE_IMAGES_CONFIG.length * 2} images successfully saved.`);
  if (failedList.length > 0) {
    console.log(`Failed files (${failedList.length}):`, failedList);
  } else {
    console.log('ALL 116 PRODUCT IMAGES DOWNLOADED WITH ZERO FAILURES!');
  }
  console.log('======================================================');
}

main();
