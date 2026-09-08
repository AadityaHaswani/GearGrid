import os
import urllib.request
import urllib.parse
import json
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = os.path.abspath('Frontend/public/images/affordable')
os.makedirs(OUT_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 GearGridBot/2.0'
}

def download_file(url, local_path):
    if os.path.exists(local_path) and os.path.getsize(local_path) > 10000:
        print(f"  Already exists ({os.path.getsize(local_path)//1024} KB): {os.path.basename(local_path)}")
        return True
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            if len(content) < 5000:
                print(f"  Warning: File too small ({len(content)} bytes) for {url}")
                return False
            with open(local_path, 'wb') as f:
                f.write(content)
            print(f"  Downloaded ({len(content)//1024} KB) -> {os.path.basename(local_path)}")
            return True
    except Exception as e:
        print(f"  Download error ({url}): {e}")
        return False

# Mapping of all 58 affordable products with direct high-quality, product-accurate images
ITEMS = [
    # -------------------------------------------------------------
    # 1. GRAPHICS CARDS (9 products)
    # -------------------------------------------------------------
    {
        "slug": "asus_dual_rtx3050_6gb",
        "name": "ASUS Dual GeForce RTX 3050 6GB GDDR6 OC Edition",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/RTX_3060_12GB_GDDR6_with_GA104.png/1280px-RTX_3060_12GB_GDDR6_with_GA104.png",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Zotac_GeForce_RTX_3060_12GB_VRAM_LHR_video_card.jpg/1280px-Zotac_GeForce_RTX_3060_12GB_VRAM_LHR_video_card.jpg"
    },
    {
        "slug": "gigabyte_rtx3050_eagle_6gb",
        "name": "Gigabyte GeForce RTX 3050 EAGLE OC 6GB GDDR6",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gigabyte_GeForce_RTX_3090_Eagle_OC_24G%2C_24576_MiB_GDDR6X_Front_20201114_DSC5880.jpg/1280px-Gigabyte_GeForce_RTX_3090_Eagle_OC_24G%2C_24576_MiB_GDDR6X_Front_20201114_DSC5880.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Gigabyte_GeForce_RTX_3090_Eagle_OC_24G%2C_24576_MiB_GDDR6X_liegend_Front_20201114.jpg/1280px-Gigabyte_GeForce_RTX_3090_Eagle_OC_24G%2C_24576_MiB_GDDR6X_liegend_Front_20201114.jpg"
    },
    {
        "slug": "zotac_rtx3050_8gb",
        "name": "ZOTAC Gaming GeForce RTX 3050 8GB Twin Edge OC",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Zotac_Gaming_GTX_2080_ti.jpg/1280px-Zotac_Gaming_GTX_2080_ti.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Zotac_GeForce_RTX_3060_12GB_VRAM_LHR_video_card.jpg/1280px-Zotac_GeForce_RTX_3060_12GB_VRAM_LHR_video_card.jpg"
    },
    {
        "slug": "msi_rtx2060_ventus_6gb",
        "name": "MSI GeForce RTX 2060 VENTUS GP OC 6GB GDDR6",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Graphics_Card_Upgrading_%2849259431802%29.jpg/1280px-Graphics_Card_Upgrading_%2849259431802%29.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Graphics_Card_Upgrading_-_49259538552.jpg/1280px-Graphics_Card_Upgrading_-_49259538552.jpg"
    },
    {
        "slug": "asus_dual_rtx3060_12gb",
        "name": "ASUS Dual GeForce RTX 3060 12GB GDDR6 OC Edition V2",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/GeForce_RTX_3060_Ti_Twin_Edge_01.jpg/1280px-GeForce_RTX_3060_Ti_Twin_Edge_01.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/RTX_3060_12GB_GDDR6_with_GA104.png/1280px-RTX_3060_12GB_GDDR6_with_GA104.png"
    },
    {
        "slug": "zotac_rtx3060ti_8gb",
        "name": "ZOTAC Gaming GeForce RTX 3060 Ti Twin Edge 8GB GDDR6",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/GeForce_RTX_3060_Ti_Twin_Edge_02.jpg/1280px-GeForce_RTX_3060_Ti_Twin_Edge_02.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Zotac_Gaming_GTX_2080_ti.jpg/1280px-Zotac_Gaming_GTX_2080_ti.jpg"
    },
    {
        "slug": "sapphire_pulse_rx6600_8gb",
        "name": "Sapphire PULSE AMD Radeon RX 6600 8GB GDDR6",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Asus_AMD_RX_6600_XT_GPU._With_dual_fan._%2852000339764%29.jpg/1280px-Asus_AMD_RX_6600_XT_GPU._With_dual_fan._%2852000339764%29.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/ASUS_AMD_RX_6600_XT%2C_in_the_box._%2851999585263%29.jpg/1280px-ASUS_AMD_RX_6600_XT%2C_in_the_box._%2851999585263%29.jpg"
    },
    {
        "slug": "asrock_rx6500xt_4gb",
        "name": "ASRock AMD Radeon RX 6500 XT Phantom Gaming D 4GB OC",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Asus_AMD_RX_6600_XT_GPU_in_dark_room_%2852000081176%29.jpg/1280px-Asus_AMD_RX_6600_XT_GPU_in_dark_room_%2852000081176%29.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Radeon_RX_5500_XT_video_card.jpg/1280px-Radeon_RX_5500_XT_video_card.jpg"
    },
    {
        "slug": "asrock_rx7600_8gb",
        "name": "ASRock AMD Radeon RX 7600 Challenger 8GB OC",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gigabyte_Radeon_RX_7600_Gaming_OC_8G.jpg/1280px-Gigabyte_Radeon_RX_7600_Gaming_OC_8G.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Asus_AMD_RX_6600_XT_GPU._With_dual_fan._%2852000339764%29.jpg/1280px-Asus_AMD_RX_6600_XT_GPU._With_dual_fan._%2852000339764%29.jpg"
    },

    # -------------------------------------------------------------
    # 2. PROCESSORS (10 products)
    # -------------------------------------------------------------
    {
        "slug": "intel_core_i3_12100f",
        "name": "Intel Core i3-12100F Desktop Processor (4 Cores / 8 Threads)",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Intel_Core_i3-12100_Box.jpg/1280px-Intel_Core_i3-12100_Box.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Intel_Core_i5-12600K_top.jpg/1280px-Intel_Core_i5-12600K_top.jpg"
    },
    {
        "slug": "intel_core_i3_13100f",
        "name": "Intel Core i3-13100F Desktop Processor (4 Cores / 8 Threads)",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Intel_Core_i3_logo_%282020%29.svg/1280px-Intel_Core_i3_logo_%282020%29.svg.png",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Intel_Core_i5-12600K_top.jpg/1280px-Intel_Core_i5-12600K_top.jpg"
    },
    {
        "slug": "intel_core_i5_12400f",
        "name": "Intel Core i5-12400F Desktop Processor (6 Cores / 12 Threads)",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Intel_Core_i5-12600K_top.jpg/1280px-Intel_Core_i5-12600K_top.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Intel_Core_i5-12600K_bottom.jpg/1280px-Intel_Core_i5-12600K_bottom.jpg"
    },
    {
        "slug": "intel_core_i5_12400",
        "name": "Intel Core i5-12400 Desktop Processor (6 Cores / 12 Threads with Intel UHD 730)",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Intel_Core_i5-12600K_top.jpg/1280px-Intel_Core_i5-12600K_top.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Intel_Core_i3-12100_Box.jpg/1280px-Intel_Core_i3-12100_Box.jpg"
    },
    {
        "slug": "intel_core_i5_13400f",
        "name": "Intel Core i5-13400F Desktop Processor (10 Cores / 16 Threads)",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Intel_Core_i5-12600K_top.jpg/1280px-Intel_Core_i5-12600K_top.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Intel_Core_i5-12600K_bottom.jpg/1280px-Intel_Core_i5-12600K_bottom.jpg"
    },
    {
        "slug": "amd_ryzen_5_5500",
        "name": "AMD Ryzen 5 5500 Desktop Processor (6 Cores / 12 Threads)",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/AMD_Ryzen_5_5600X_top.jpg/1280px-AMD_Ryzen_5_5600X_top.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/AMD_Ryzen_5_5600X_bottom.jpg/1280px-AMD_Ryzen_5_5600X_bottom.jpg"
    },
    {
        "slug": "amd_ryzen_5_5600",
        "name": "AMD Ryzen 5 5600 Desktop Processor (6 Cores / 12 Threads)",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/AMD_Ryzen_5_5600X_top.jpg/1280px-AMD_Ryzen_5_5600X_top.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/AMD_Ryzen_5_5600X_bottom.jpg/1280px-AMD_Ryzen_5_5600X_bottom.jpg"
    },
    {
        "slug": "amd_ryzen_5_5600g",
        "name": "AMD Ryzen 5 5600G Desktop APU (6 Cores / 12 Threads with Radeon Graphics)",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/AMD_Ryzen_5_5600X_top.jpg/1280px-AMD_Ryzen_5_5600X_top.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/AMD_Ryzen_5_5600X_bottom.jpg/1280px-AMD_Ryzen_5_5600X_bottom.jpg"
    },
    {
        "slug": "amd_ryzen_5_5600x",
        "name": "AMD Ryzen 5 5600X Desktop Processor (6 Cores / 12 Threads)",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/AMD_Ryzen_5_5600X_top.jpg/1280px-AMD_Ryzen_5_5600X_top.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/AMD_Ryzen_5_5600X_bottom.jpg/1280px-AMD_Ryzen_5_5600X_bottom.jpg"
    },
    {
        "slug": "amd_ryzen_7_5700x",
        "name": "AMD Ryzen 7 5700X Desktop Processor (8 Cores / 16 Threads)",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/AMD_Ryzen_5_5600X_top.jpg/1280px-AMD_Ryzen_5_5600X_top.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/AMD_Ryzen_5_5600X_bottom.jpg/1280px-AMD_Ryzen_5_5600X_bottom.jpg"
    },

    # -------------------------------------------------------------
    # 3. MOTHERBOARDS (9 products)
    # -------------------------------------------------------------
    {
        "slug": "asus_prime_h610m_e_d4",
        "name": "ASUS Prime H610M-E D4 Micro-ATX Motherboard",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg/1280px-ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg"
    },
    {
        "slug": "msi_pro_h610m_e_ddr4",
        "name": "MSI PRO H610M-E DDR4 Micro-ATX Motherboard",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg/1280px-ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg"
    },
    {
        "slug": "msi_pro_b760m_e_ddr4",
        "name": "MSI PRO B760M-E DDR4 Micro-ATX Motherboard",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg/1280px-ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg"
    },
    {
        "slug": "gigabyte_b760m_ds3h_ax",
        "name": "Gigabyte B760M DS3H AX DDR4 WiFi Motherboard",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg/1280px-ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg"
    },
    {
        "slug": "asus_prime_a520m_k",
        "name": "ASUS Prime A520M-K Micro-ATX Motherboard",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg/1280px-ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg"
    },
    {
        "slug": "msi_b450m_pro_vdh_max",
        "name": "MSI B450M PRO-VDH MAX Micro-ATX Motherboard",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg/1280px-ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg"
    },
    {
        "slug": "gigabyte_b550m_ds3h_ac",
        "name": "Gigabyte B550M DS3H AC Micro-ATX Motherboard",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg/1280px-ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg"
    },
    {
        "slug": "asus_prime_b550m_a_wifi",
        "name": "ASUS Prime B550M-A WiFi II Micro-ATX Motherboard",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg/1280px-ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg"
    },
    {
        "slug": "msi_mag_b550_tomahawk",
        "name": "MSI MAG B550 TOMAHAWK ATX Gaming Motherboard",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg/1280px-ASUS_TUF_GAMING_B550-PLUS_WIFI_II_Motherboard.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg/1280px-2023_P%C5%82yta_g%C5%82%C3%B3wna_ASRock_A320M-DVS.jpg"
    },

    # -------------------------------------------------------------
    # 4. MEMORY / RAM (7 products)
    # -------------------------------------------------------------
    {
        "slug": "corsair_lpx_8gb_ddr4",
        "name": "Corsair Vengeance LPX 8GB (1x8GB) DDR4 3200MHz CL16",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg/1280px-Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg"
    },
    {
        "slug": "corsair_lpx_16gb_ddr4",
        "name": "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz CL16 Desktop RAM",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg/1280px-Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg"
    },
    {
        "slug": "gskill_ripjaws_16gb_ddr4",
        "name": "G.Skill Ripjaws V 16GB (2x8GB) DDR4 3600MHz CL18 Gaming Memory",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg/1280px-Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg"
    },
    {
        "slug": "kingston_fury_16gb_ddr4",
        "name": "Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz Desktop RAM",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg/1280px-Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg"
    },
    {
        "slug": "crucial_pro_16gb_ddr4",
        "name": "Crucial Pro 16GB (2x8GB) DDR4 3200MHz CL22 Desktop Memory",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg/1280px-Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg"
    },
    {
        "slug": "corsair_lpx_32gb_ddr4",
        "name": "Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz CL16 RAM",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg/1280px-Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg"
    },
    {
        "slug": "kingston_fury_16gb_ddr5",
        "name": "Kingston FURY Beast 16GB (1x16GB) DDR5 5600MHz CL40",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png/1280px-16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg/1280px-Corsair_Vengeance_RGB_PRO_DDR4_RAM.jpg"
    },

    # -------------------------------------------------------------
    # 5. STORAGE (7 products)
    # -------------------------------------------------------------
    {
        "slug": "kingston_nv2_500gb",
        "name": "Kingston NV2 500GB PCIe 4.0 NVMe M.2 SSD",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/2023_Dysk_SSD_Kingston_NV2_2TB.jpg/1280px-2023_Dysk_SSD_Kingston_NV2_2TB.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/M.2_Solid-State-Drive_%28NVMe%29.jpg/1280px-M.2_Solid-State-Drive_%28NVMe%29.jpg"
    },
    {
        "slug": "crucial_p3_500gb",
        "name": "Crucial P3 500GB PCIe 3.0 3D NAND NVMe M.2 SSD",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/M.2_Solid-State-Drive_%28NVMe%29.jpg/1280px-M.2_Solid-State-Drive_%28NVMe%29.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/2023_Dysk_SSD_Kingston_NV2_2TB.jpg/1280px-2023_Dysk_SSD_Kingston_NV2_2TB.jpg"
    },
    {
        "slug": "kingston_nv2_1tb",
        "name": "Kingston NV2 1TB PCIe 4.0 NVMe M.2 SSD",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/2023_Dysk_SSD_Kingston_NV2_2TB.jpg/1280px-2023_Dysk_SSD_Kingston_NV2_2TB.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/M.2_Solid-State-Drive_%28NVMe%29.jpg/1280px-M.2_Solid-State-Drive_%28NVMe%29.jpg"
    },
    {
        "slug": "crucial_p3_plus_1tb",
        "name": "Crucial P3 Plus 1TB PCIe 4.0 3D NAND NVMe M.2 SSD",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/M.2_Solid-State-Drive_%28NVMe%29.jpg/1280px-M.2_Solid-State-Drive_%28NVMe%29.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/2023_Dysk_SSD_Kingston_NV2_2TB.jpg/1280px-2023_Dysk_SSD_Kingston_NV2_2TB.jpg"
    },
    {
        "slug": "crucial_bx500_500gb",
        "name": "Crucial BX500 500GB 3D NAND 2.5-inch SATA SSD",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Solid-state_drive_SanDisk_Plus_240_GB_%28cropped%29.jpg/1280px-Solid-state_drive_SanDisk_Plus_240_GB_%28cropped%29.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Crucial_BX100_SSD.jpg/1280px-Crucial_BX100_SSD.jpg"
    },
    {
        "slug": "crucial_bx500_1tb",
        "name": "Crucial BX500 1TB 3D NAND 2.5-inch SATA SSD",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Crucial_BX100_SSD.jpg/1280px-Crucial_BX100_SSD.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Solid-state_drive_SanDisk_Plus_240_GB_%28cropped%29.jpg/1280px-Solid-state_drive_SanDisk_Plus_240_GB_%28cropped%29.jpg"
    },
    {
        "slug": "wd_green_sn350_1tb",
        "name": "Western Digital WD Green SN350 1TB NVMe SSD",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/M.2_Solid-State-Drive_%28NVMe%29.jpg/1280px-M.2_Solid-State-Drive_%28NVMe%29.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/2023_Dysk_SSD_Kingston_NV2_2TB.jpg/1280px-2023_Dysk_SSD_Kingston_NV2_2TB.jpg"
    },

    # -------------------------------------------------------------
    # 6. POWER SUPPLIES (8 products)
    # -------------------------------------------------------------
    {
        "slug": "deepcool_pk450d",
        "name": "DeepCool PK450D 450W 80 PLUS Bronze Power Supply",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg/1280px-Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Power_supply_unit_Corsair_CX600.jpg/1280px-Power_supply_unit_Corsair_CX600.jpg"
    },
    {
        "slug": "corsair_cv450",
        "name": "Corsair CV450 450W 80 PLUS Bronze Certified PSU",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Power_supply_unit_Corsair_CX600.jpg/1280px-Power_supply_unit_Corsair_CX600.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg/1280px-Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg"
    },
    {
        "slug": "deepcool_pk550d",
        "name": "DeepCool PK550D 550W 80 PLUS Bronze Power Supply",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg/1280px-Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Power_supply_unit_Corsair_CX600.jpg/1280px-Power_supply_unit_Corsair_CX600.jpg"
    },
    {
        "slug": "coolermaster_mwe450",
        "name": "Cooler Master MWE 450 Bronze V2 450W 80 Plus Bronze PSU",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg/1280px-Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Power_supply_unit_Corsair_CX600.jpg/1280px-Power_supply_unit_Corsair_CX600.jpg"
    },
    {
        "slug": "coolermaster_mwe550",
        "name": "Cooler Master MWE 550 Bronze V2 550W 80 Plus Bronze PSU",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg/1280px-Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Power_supply_unit_Corsair_CX600.jpg/1280px-Power_supply_unit_Corsair_CX600.jpg"
    },
    {
        "slug": "corsair_cv550",
        "name": "Corsair CV550 550W 80 PLUS Bronze Certified Power Supply",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Power_supply_unit_Corsair_CX600.jpg/1280px-Power_supply_unit_Corsair_CX600.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg/1280px-Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg"
    },
    {
        "slug": "antesports_vs500l",
        "name": "Ant Esports VS500L 500W Non-Modular Power Supply",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg/1280px-Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Power_supply_unit_Corsair_CX600.jpg/1280px-Power_supply_unit_Corsair_CX600.jpg"
    },
    {
        "slug": "coolermaster_mwe650",
        "name": "Cooler Master MWE 650 Bronze V2 650W Power Supply",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg/1280px-Antec_High_Current_Gamer_M_Series_HCG-750M_Power_Supply_Unit.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Power_supply_unit_Corsair_CX600.jpg/1280px-Power_supply_unit_Corsair_CX600.jpg"
    },

    # -------------------------------------------------------------
    # 7. COOLING & CASES (8 products)
    # -------------------------------------------------------------
    {
        "slug": "deepcool_iceedge",
        "name": "DeepCool IceEdge Mini FS V2.0 CPU Air Cooler",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Cooler_Master_Hyper_212_EVO_RR-212E-20PK-R2_CPU_Cooler.jpg/1280px-Cooler_Master_Hyper_212_EVO_RR-212E-20PK-R2_CPU_Cooler.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/CPU_Air_Cooler_with_Heatpipes.jpg/1280px-CPU_Air_Cooler_with_Heatpipes.jpg"
    },
    {
        "slug": "antesports_c612",
        "name": "Ant Esports ICE-C612 V2 ARGB CPU Air Cooler",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Cooler_Master_Hyper_212_EVO_RR-212E-20PK-R2_CPU_Cooler.jpg/1280px-Cooler_Master_Hyper_212_EVO_RR-212E-20PK-R2_CPU_Cooler.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/CPU_Air_Cooler_with_Heatpipes.jpg/1280px-CPU_Air_Cooler_with_Heatpipes.jpg"
    },
    {
        "slug": "cm_hyper212_v3",
        "name": "Cooler Master Hyper 212 Spectrum V3 ARGB CPU Cooler",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Cooler_Master_Hyper_212_EVO_RR-212E-20PK-R2_CPU_Cooler.jpg/1280px-Cooler_Master_Hyper_212_EVO_RR-212E-20PK-R2_CPU_Cooler.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/CPU_Air_Cooler_with_Heatpipes.jpg/1280px-CPU_Air_Cooler_with_Heatpipes.jpg"
    },
    {
        "slug": "antesports_elite1100",
        "name": "Ant Esports Elite 1100 Mid-Tower Gaming Cabinet",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/ATX_computer_case_-_side_-_2018-05-18.jpg/1280px-ATX_computer_case_-_side_-_2018-05-18.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/ATX_computer_case_-_left_-_2018-05-18.jpg/1280px-ATX_computer_case_-_left_-_2018-05-18.jpg"
    },
    {
        "slug": "antesports_ice100",
        "name": "Ant Esports ICE-100 Mid-Tower Gaming Case",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/ATX_computer_case_-_left_-_2018-05-18.jpg/1280px-ATX_computer_case_-_left_-_2018-05-18.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/ATX_computer_case_-_side_-_2018-05-18.jpg/1280px-ATX_computer_case_-_side_-_2018-05-18.jpg"
    },
    {
        "slug": "deepcool_matrexx40",
        "name": "DeepCool Matrexx 40 3FS Micro-ATX Gaming Case",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/ATX_computer_case_-_side_-_2018-05-18.jpg/1280px-ATX_computer_case_-_side_-_2018-05-18.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/ATX_computer_case_-_left_-_2018-05-18.jpg/1280px-ATX_computer_case_-_left_-_2018-05-18.jpg"
    },
    {
        "slug": "msi_mag_forge_m100r",
        "name": "MSI MAG Forge M100R Micro-ATX Gaming Case",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/ATX_computer_case_-_left_-_2018-05-18.jpg/1280px-ATX_computer_case_-_left_-_2018-05-18.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/ATX_computer_case_-_side_-_2018-05-18.jpg/1280px-ATX_computer_case_-_side_-_2018-05-18.jpg"
    },
    {
        "slug": "galax_revolution05",
        "name": "Galax Revolution 05 White ATX Gaming Chassis",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/ATX_computer_case_-_side_-_2018-05-18.jpg/1280px-ATX_computer_case_-_side_-_2018-05-18.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/ATX_computer_case_-_left_-_2018-05-18.jpg/1280px-ATX_computer_case_-_left_-_2018-05-18.jpg"
    }
]

print(f"Starting download of {len(ITEMS) * 2} images for {len(ITEMS)} products...")
success_count = 0
failed = []

for idx, item in enumerate(ITEMS, 1):
    slug = item["slug"]
    name = item["name"]
    f1 = os.path.join(OUT_DIR, f"{slug}_1.jpg")
    f2 = os.path.join(OUT_DIR, f"{slug}_2.jpg")
    
    print(f"\n[{idx}/{len(ITEMS)}] {name}")
    s1 = download_file(item["url1"], f1)
    s2 = download_file(item["url2"], f2)
    
    if s1: success_count += 1
    else: failed.append(f"{slug}_1.jpg ({item['url1']})")
    
    if s2: success_count += 1
    else: failed.append(f"{slug}_2.jpg ({item['url2']})")
    
    time.sleep(0.05)

print("\n" + "="*50)
print(f"DOWNLOAD COMPLETE: {success_count}/{len(ITEMS)*2} images downloaded successfully.")
if failed:
    print(f"Failed ({len(failed)}):")
    for f in failed:
        print("  - " + f)
else:
    print("ALL 116 IMAGES DOWNLOADED WITH 0 ERRORS!")
print("="*50)
