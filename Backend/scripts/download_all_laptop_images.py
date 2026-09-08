import os
import urllib.request
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

out_dir = os.path.abspath('Frontend/public/images/laptops')
os.makedirs(out_dir, exist_ok=True)

laptop_images = [
    # 1. Apple MacBook Air 13.6-inch M2 - Midnight
    {
        "index": 1,
        "name": "Apple MacBook Air 13.6 (M2) - Midnight",
        "file1": "macbook_air_m2_midnight_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/4/4b/M2_Macbook_Air_Midnight_model_-_1.jpg",
        "file2": "macbook_air_m2_midnight_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/0/05/M2_Macbook_Air_Midnight_model_-_2.jpg"
    },
    # 2. Apple MacBook Air 13.6-inch M3 - Space Grey
    {
        "index": 2,
        "name": "Apple MacBook Air 13.6 (M3) - Space Grey",
        "file1": "macbook_air_m3_spacegrey_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/2/23/MacBook_Air_%28A2681%29_front.jpg",
        "file2": "macbook_air_m3_spacegrey_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/9/91/MacBook_Air_%28A2681%29_rear.jpg"
    },
    # 3. Apple MacBook Air 15.3-inch M3 - Starlight
    {
        "index": 3,
        "name": "Apple MacBook Air 15.3 (M3) - Starlight",
        "file1": "macbook_air_15_starlight_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/4/48/M2_Macbook_Air_Starlight_model.jpg",
        "file2": "macbook_air_15_starlight_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Macbook_Air_15_inch_-_1.jpg"
    },
    # 4. Apple MacBook Pro 14.2-inch M4 - Space Black
    {
        "index": 4,
        "name": "Apple MacBook Pro 14.2 (M4) - Space Black",
        "file1": "macbook_pro_14_spaceblack_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/a/af/MacBook_Pro_%2814-inch%2C_M5%2C_Space_Black%29.jpg",
        "file2": "macbook_pro_14_spaceblack_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/6/67/Apple_Macbook_Pro_14%22_2021_-_Keyboard.png"
    },
    # 5. Apple MacBook Pro 16.2-inch M4 Pro - Silver
    {
        "index": 5,
        "name": "Apple MacBook Pro 16.2 (M4 Pro) - Silver",
        "file1": "macbook_pro_16_silver_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/4/43/MacBook_Pro_%2816-inch%2C_M4_Pro%2C_Silver%29.jpg",
        "file2": "macbook_pro_16_silver_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/2/20/Apple_MacBook_Pro_16%22_M2_Max.jpg"
    },
    # 6. ASUS Zenbook 14 OLED - Ponder Blue
    {
        "index": 6,
        "name": "ASUS Zenbook 14 OLED - Ponder Blue",
        "file1": "asus_zenbook_14_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Asus_Zenbook_UX32V-8994.jpg",
        "file2": "asus_zenbook_14_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Asus_Zenbook_UX32V-8995.jpg"
    },
    # 7. Lenovo ThinkPad E14 Gen 6 - Black
    {
        "index": 7,
        "name": "Lenovo ThinkPad E14 Gen 6 - Black",
        "file1": "lenovo_thinkpad_e14_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Lenovo_ThinkPad_E14_G7_14_WUXGA.jpg",
        "file2": "lenovo_thinkpad_e14_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/b/b8/ThinkPad_X1_Carbon_gen7_%280%29.jpg"
    },
    # 8. Dell Inspiron 14 Plus 7440 - Ice Blue
    {
        "index": 8,
        "name": "Dell Inspiron 14 Plus 7440 - Ice Blue",
        "file1": "dell_inspiron_14_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Dell_Inspiron_16_5645.jpg",
        "file2": "dell_inspiron_14_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Dell_Inspiron_7472.jpg"
    },
    # 9. HP Spectre x360 2-in-1 14-inch - Nightfall Black
    {
        "index": 9,
        "name": "HP Spectre x360 2-in-1 14 - Nightfall Black",
        "file1": "hp_spectre_x360_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/1/1b/Hp_Spectre_x360.jpg",
        "file2": "hp_spectre_x360_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Hp_Spectre_x360_13t.jpg"
    },
    # 10. Lenovo Yoga Slim 7x 14.5-inch - Cosmic Blue
    {
        "index": 10,
        "name": "Lenovo Yoga Slim 7x 14.5 - Cosmic Blue",
        "file1": "lenovo_yoga_slim_7x_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/9/91/Yoga_Slim_7x.jpg",
        "file2": "lenovo_yoga_slim_7x_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Lenovo_Yoga_2_Pro_%28Silver_Gray%29.jpg"
    },
    # 11. Acer Nitro V 15 ANV15-51 (RTX 3050)
    {
        "index": 11,
        "name": "Acer Nitro V 15 ANV15-51 (RTX 3050)",
        "file1": "acer_nitro_v15_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/8/82/Acer_Nitro_V_15_2026-08-15_gaming_laptop_01.jpg",
        "file2": "acer_nitro_v15_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/e/e9/Acer_Nitro_V_15_2026-08-15_gaming_laptop_02.jpg"
    },
    # 12. Lenovo LOQ 15 (Ryzen 5, RTX 3050)
    {
        "index": 12,
        "name": "Lenovo LOQ 15 (Ryzen 5, RTX 3050)",
        "file1": "lenovo_loq_15_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/9/98/Lenovo_Legion_Y7000P_Eclipse_Gray_Laptop.jpg",
        "file2": "lenovo_loq_15_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/d/da/Lenovo_Legion_Y520_%281%29.jpg"
    },
    # 13. ASUS TUF Gaming A15 FA507NU (RTX 4050)
    {
        "index": 13,
        "name": "ASUS TUF Gaming A15 FA507NU (RTX 4050)",
        "file1": "asus_tuf_a15_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/5/57/ASUS_TUF_Gaming_5_Pro_Laptop.jpg",
        "file2": "asus_tuf_a15_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/8/81/Akaoni_playing_P5X_on_the_stage_20240204a.jpg"
    },
    # 14. Lenovo LOQ 15IRX9 (Intel Core i5-13450HX, RTX 4050)
    {
        "index": 14,
        "name": "Lenovo LOQ 15IRX9 (RTX 4050)",
        "file1": "lenovo_loq_15irx9_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Lenovo_IdeaPad_Y510p_1.jpg",
        "file2": "lenovo_loq_15irx9_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Lenovo_IdeaPad_Y510p_2.jpg"
    },
    # 15. HP Victus 16-r0075TX (RTX 4050)
    {
        "index": 15,
        "name": "HP Victus 16-r0075TX (RTX 4050)",
        "file1": "hp_victus_16_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/1/19/HP_Victus_laptop_2.jpg",
        "file2": "hp_victus_16_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/c/c5/HP_Victus_laptop.jpg"
    },
    # 16. Acer Predator Helios Neo 16 PHN16-72 (RTX 4060)
    {
        "index": 16,
        "name": "Acer Predator Helios Neo 16 (RTX 4060)",
        "file1": "acer_predator_helios_neo_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/7/77/Predator_Helios_300_20221224.jpg",
        "file2": "acer_predator_helios_neo_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Acer_Predator_Helios_300_back_panel_open.jpg"
    },
    # 17. Lenovo Legion 5i 16 Gen 9 (RTX 4060)
    {
        "index": 17,
        "name": "Lenovo Legion 5i 16 Gen 9 (RTX 4060)",
        "file1": "lenovo_legion_5i_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/d/da/Lenovo_legion_%28laptop%29_%26_Lenovo_400_Wireless_%28Mouse%29_IMG_6309ab.jpg",
        "file2": "lenovo_legion_5i_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Lenovo_IdeaPad_Y510p_3.jpg"
    },
    # 18. ASUS ROG Zephyrus G16 GU605MV (RTX 4060)
    {
        "index": 18,
        "name": "ASUS ROG Zephyrus G16 GU605MV (RTX 4060)",
        "file1": "asus_rog_zephyrus_g16_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/e/ee/ASUS_ROG_Strix_G15_%28G513QY-HQ012T%29-front_oblique_PNr%C2%B00884.jpg",
        "file2": "asus_rog_zephyrus_g16_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/1/14/ASUS_ROG_Strix_G15_%28G513QY-HQ012T%29-top_keyboard_WASD_PNr%C2%B00888.jpg"
    },
    # 19. HP OMEN 16-wf1025TX (RTX 4060)
    {
        "index": 19,
        "name": "HP OMEN 16-wf1025TX (RTX 4060)",
        "file1": "hp_omen_16_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/a/af/My_Omen_-_keyboard.jpg",
        "file2": "hp_omen_16_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/c/c5/HP_Victus_laptop.jpg"
    },
    # 20. ASUS ROG Strix G16 G614JIR (RTX 4070)
    {
        "index": 20,
        "name": "ASUS ROG Strix G16 G614JIR (RTX 4070)",
        "file1": "asus_rog_strix_g16_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/1/1c/ASUS_ROG_Strix_G15_%28G513QY-HQ012T%29-top_cover_PNr%C2%B00885.jpg",
        "file2": "asus_rog_strix_g16_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/e/ee/ASUS_ROG_Strix_G15_%28G513QY-HQ012T%29-front_oblique_PNr%C2%B00884.jpg"
    },
    # 21. Lenovo Legion Pro 5 16IRX9 (RTX 4070)
    {
        "index": 21,
        "name": "Lenovo Legion Pro 5 16IRX9 (RTX 4070)",
        "file1": "lenovo_legion_pro_5_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/d/da/Lenovo_Legion_Y520_%281%29.jpg",
        "file2": "lenovo_legion_pro_5_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/9/98/Lenovo_Legion_Y7000P_Eclipse_Gray_Laptop.jpg"
    },
    # 22. MSI Katana 15 B13VGK (RTX 4070)
    {
        "index": 22,
        "name": "MSI Katana 15 B13VGK (RTX 4070)",
        "file1": "msi_katana_15_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/a/af/MSI_Bravo_17_%280017FK-007%29-front_oblique_PNr%C2%B00757.jpg",
        "file2": "msi_katana_15_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/2/29/MSI_Bravo_17_%280017FK-007%29-top_keyboard_PNr%C2%B00758.jpg"
    },
    # 23. Dell Alienware m16 R2 (RTX 4070)
    {
        "index": 23,
        "name": "Dell Alienware m16 R2 (RTX 4070)",
        "file1": "dell_alienware_m16_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/3/35/Dell_Alienware_m15_2019_002.jpg",
        "file2": "dell_alienware_m16_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Dell_Alienware_m15_2019_001.jpg"
    },
    # 24. ASUS ROG Strix SCAR 16 G634JZ (RTX 4080)
    {
        "index": 24,
        "name": "ASUS ROG Strix SCAR 16 G634JZ (RTX 4080)",
        "file1": "asus_rog_strix_scar_16_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/1/17/Der_ASUS_ROG_Strix_Scar-Laptop_im_Hands-on_%28%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan%29_07.png",
        "file2": "asus_rog_strix_scar_16_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Der_ASUS_ROG_Strix_Scar-Laptop_im_Hands-on_%28%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan%29_08.png"
    },
    # 25. Lenovo Legion Pro 7i 16IRX9H (RTX 4080)
    {
        "index": 25,
        "name": "Lenovo Legion Pro 7i 16IRX9H (RTX 4080)",
        "file1": "lenovo_legion_pro_7i_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/9/98/Lenovo_Legion_Y7000P_Eclipse_Gray_Laptop.jpg",
        "file2": "lenovo_legion_pro_7i_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/d/da/Lenovo_legion_%28laptop%29_%26_Lenovo_400_Wireless_%28Mouse%29_IMG_6309ab.jpg"
    },
    # 26. Acer Predator Helios 16 PH16-72 (RTX 4080)
    {
        "index": 26,
        "name": "Acer Predator Helios 16 PH16-72 (RTX 4080)",
        "file1": "acer_predator_helios_16_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/5/52/Asus_ROG_Phone_2_and_Acer_Predator_Helios_700_20201101.jpg",
        "file2": "acer_predator_helios_16_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Acer_Predator_Helios_300_back_panel_open.jpg"
    },
    # 27. ASUS ROG Strix SCAR 18 G834JYR (RTX 4090)
    {
        "index": 27,
        "name": "ASUS ROG Strix SCAR 18 G834JYR (RTX 4090)",
        "file1": "asus_rog_strix_scar_18_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Der_ASUS_ROG_Strix_Scar-Laptop_im_Hands-on_%28%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan%29_09.png",
        "file2": "asus_rog_strix_scar_18_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/b/be/Der_ASUS_ROG_Strix_Scar-Laptop_im_Hands-on_%28%E6%9E%81%E5%AE%A2%E6%B9%BEGeekerwan%29_03.png"
    },
    # 28. MSI Titan 18 HX A14VIG (RTX 4090)
    {
        "index": 28,
        "name": "MSI Titan 18 HX A14VIG (RTX 4090)",
        "file1": "msi_titan_18_hx_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/8/8c/MSI_GT76_Titan_20190601.jpg",
        "file2": "msi_titan_18_hx_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/c/c9/MSI_Gaming_Laptop_on_wood_floor.jpg"
    },
    # 29. Lenovo Legion 9i 16IRX9 (RTX 4090)
    {
        "index": 29,
        "name": "Lenovo Legion 9i 16IRX9 (RTX 4090)",
        "file1": "lenovo_legion_9i_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/9/98/Lenovo_Legion_Y7000P_Eclipse_Gray_Laptop.jpg",
        "file2": "lenovo_legion_9i_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Lenovo_IdeaPad_Y510p_3.jpg"
    },
    # 30. HP OMEN Transcend 16-u1005TX (RTX 4080)
    {
        "index": 30,
        "name": "HP OMEN Transcend 16-u1005TX (RTX 4080)",
        "file1": "hp_omen_transcend_16_1.jpg",
        "url1": "https://upload.wikimedia.org/wikipedia/commons/a/af/My_Omen_-_keyboard.jpg",
        "file2": "hp_omen_transcend_16_2.jpg",
        "url2": "https://upload.wikimedia.org/wikipedia/commons/1/19/HP_Victus_laptop_2.jpg"
    }
]

headers = {
    'User-Agent': 'GearGridLaptopImageDownloader/2.0 (admin@geargrid.local; educational catalog)'
}

def download_file(url, target_path, retries=3):
    if os.path.exists(target_path) and os.path.getsize(target_path) > 15000:
        return True, os.path.getsize(target_path), "already cached"
    
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=25) as resp:
                data = resp.read()
                if len(data) < 500:
                    raise Exception("File too small / truncated")
                with open(target_path, 'wb') as f:
                    f.write(data)
                return True, len(data), "downloaded"
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait_sec = 4 * (attempt + 1)
                print(f"    [Rate limit 429] Waiting {wait_sec}s before retry...")
                time.sleep(wait_sec)
            else:
                return False, 0, f"HTTP Error {e.code}: {e.reason}"
        except Exception as ex:
            return False, 0, str(ex)
        time.sleep(1.5)
    return False, 0, "Max retries exceeded"

print(f"Starting compliant download of {len(laptop_images)*2} images into {out_dir}...\n")
success_count = 0

for item in laptop_images:
    idx = item['index']
    name = item['name']
    f1, u1 = item['file1'], item['url1']
    f2, u2 = item['file2'], item['url2']
    
    p1 = os.path.join(out_dir, f1)
    p2 = os.path.join(out_dir, f2)
    
    ok1, size1, msg1 = download_file(u1, p1)
    time.sleep(1.8)
    ok2, size2, msg2 = download_file(u2, p2)
    time.sleep(1.8)
    
    if ok1 and ok2:
        success_count += 1
        print(f"[{idx:02d}/30] SUCCESS: {name}")
        print(f"       -> {f1} ({size1//1024} KB) [{msg1}]")
        print(f"       -> {f2} ({size2//1024} KB) [{msg2}]")
    else:
        print(f"[{idx:02d}/30] ERROR: {name} | img1: {msg1} | img2: {msg2}")

print(f"\nFinal Download Result: {success_count}/{len(laptop_images)} laptops with valid 2-image sets.")
