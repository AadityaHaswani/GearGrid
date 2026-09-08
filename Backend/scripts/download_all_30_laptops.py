import urllib.request
import urllib.parse
import json
import os
import time
import sys

sys.stdout.reconfigure(encoding='utf-8')

out_dir = os.path.abspath('Frontend/public/images/laptops')
os.makedirs(out_dir, exist_ok=True)

headers = {
    'User-Agent': 'GearGridCompliantBot/2.0 (admin@geargrid.local; educational catalog)'
}

# The 30 laptop definitions with File title or direct URL
laptops_spec = [
    # 1. Apple MacBook Air 13.6 (M2) - Midnight
    {
        "id": 1,
        "name": "Apple MacBook Air 13.6 (M2) - Midnight",
        "file1": "macbook_air_m2_midnight_1.jpg",
        "src1": "File:M2 Macbook Air Midnight model - 1.jpg",
        "file2": "macbook_air_m2_midnight_2.jpg",
        "src2": "File:M2 Macbook Air Midnight model - 2.jpg"
    },
    # 2. Apple MacBook Air 13.6 (M3) - Space Grey
    {
        "id": 2,
        "name": "Apple MacBook Air 13.6 (M3) - Space Grey",
        "file1": "macbook_air_m3_spacegrey_1.jpg",
        "src1": "File:MacBook Air (A2681) front.jpg",
        "file2": "macbook_air_m3_spacegrey_2.jpg",
        "src2": "File:MacBook Air (A2681) rear.jpg"
    },
    # 3. Apple MacBook Air 15.3 (M3) - Starlight
    {
        "id": 3,
        "name": "Apple MacBook Air 15.3 (M3) - Starlight",
        "file1": "macbook_air_15_starlight_1.jpg",
        "src1": "File:M2 Macbook Air Starlight model.jpg",
        "file2": "macbook_air_15_starlight_2.jpg",
        "src2": "File:Macbook Air 15 inch - 1.jpg"
    },
    # 4. Apple MacBook Pro 14.2 (M4) - Space Black
    {
        "id": 4,
        "name": "Apple MacBook Pro 14.2 (M4) - Space Black",
        "file1": "macbook_pro_14_spaceblack_1.jpg",
        "src1": "File:MacBook Pro (14-inch, M5, Space Black).jpg",
        "file2": "macbook_pro_14_spaceblack_2.jpg",
        "src2": "File:Apple Macbook Pro 14\" 2021 - Keyboard.png"
    },
    # 5. Apple MacBook Pro 16.2 (M4 Pro) - Silver
    {
        "id": 5,
        "name": "Apple MacBook Pro 16.2 (M4 Pro) - Silver",
        "file1": "macbook_pro_16_silver_1.jpg",
        "src1": "File:MacBook Pro (16-inch, M4 Pro, Silver).jpg",
        "file2": "macbook_pro_16_silver_2.jpg",
        "src2": "File:Apple MacBook Pro 16\" M2 Max.jpg"
    },
    # 6. ASUS Zenbook 14 OLED - Ponder Blue
    {
        "id": 6,
        "name": "ASUS Zenbook 14 OLED - Ponder Blue",
        "file1": "asus_zenbook_14_1.jpg",
        "src1": "File:Asus Zenbook UX32V-8994.jpg",
        "file2": "asus_zenbook_14_2.jpg",
        "src2": "File:Asus Zenbook UX32V-8995.jpg"
    },
    # 7. Lenovo ThinkPad E14 Gen 6 - Black
    {
        "id": 7,
        "name": "Lenovo ThinkPad E14 Gen 6 - Black",
        "file1": "lenovo_thinkpad_e14_1.jpg",
        "src1": "File:Lenovo ThinkPad E14 G7 14 WUXGA.jpg",
        "file2": "lenovo_thinkpad_e14_2.jpg",
        "src2": "File:ThinkPad X1 Carbon gen7 (0).jpg"
    },
    # 8. Dell Inspiron 14 Plus 7440 - Ice Blue
    {
        "id": 8,
        "name": "Dell Inspiron 14 Plus 7440 - Ice Blue",
        "file1": "dell_inspiron_14_1.jpg",
        "src1": "File:Dell Inspiron 16 5645.jpg",
        "file2": "dell_inspiron_14_2.jpg",
        "src2": "File:Dell Inspiron 7472.jpg"
    },
    # 9. HP Spectre x360 2-in-1 14 - Nightfall Black
    {
        "id": 9,
        "name": "HP Spectre x360 2-in-1 14 - Nightfall Black",
        "file1": "hp_spectre_x360_1.jpg",
        "src1": "File:Hp Spectre x360.jpg",
        "file2": "hp_spectre_x360_2.jpg",
        "src2": "File:Hp Spectre x360 13t.jpg"
    },
    # 10. Lenovo Yoga Slim 7x 14.5 - Cosmic Blue
    {
        "id": 10,
        "name": "Lenovo Yoga Slim 7x 14.5 - Cosmic Blue",
        "file1": "lenovo_yoga_slim_7x_1.jpg",
        "src1": "File:Yoga Slim 7x.jpg",
        "file2": "lenovo_yoga_slim_7x_2.jpg",
        "src2": "File:Lenovo Yoga 2 Pro (Silver Gray).jpg"
    },
    # 11. Acer Nitro V 15 ANV15-51 (RTX 3050)
    {
        "id": 11,
        "name": "Acer Nitro V 15 ANV15-51 (RTX 3050)",
        "file1": "acer_nitro_v15_1.jpg",
        "src1": "LOCAL",
        "file2": "acer_nitro_v15_2.jpg",
        "src2": "LOCAL"
    },
    # 12. Lenovo LOQ 15 (Ryzen 5, RTX 3050)
    {
        "id": 12,
        "name": "Lenovo LOQ 15 (Ryzen 5, RTX 3050)",
        "file1": "lenovo_loq_15_1.jpg",
        "src1": "File:Lenovo Legion Y7000P Eclipse Gray Laptop.jpg",
        "file2": "lenovo_loq_15_2.jpg",
        "src2": "File:Lenovo Legion Y520 (1).jpg"
    },
    # 13. ASUS TUF Gaming A15 FA507NU (RTX 4050)
    {
        "id": 13,
        "name": "ASUS TUF Gaming A15 FA507NU (RTX 4050)",
        "file1": "asus_tuf_a15_1.jpg",
        "src1": "LOCAL",
        "file2": "asus_tuf_a15_2.jpg",
        "src2": "LOCAL"
    },
    # 14. Lenovo LOQ 15IRX9 (RTX 4050)
    {
        "id": 14,
        "name": "Lenovo LOQ 15IRX9 (RTX 4050)",
        "file1": "lenovo_loq_15irx9_1.jpg",
        "src1": "File:Lenovo IdeaPad Y510p 1.jpg",
        "file2": "lenovo_loq_15irx9_2.jpg",
        "src2": "File:Lenovo IdeaPad Y510p 2.jpg"
    },
    # 15. HP Victus 16-r0075TX (RTX 4050)
    {
        "id": 15,
        "name": "HP Victus 16-r0075TX (RTX 4050)",
        "file1": "hp_victus_16_1.jpg",
        "src1": "File:HP Victus laptop 2.jpg",
        "file2": "hp_victus_16_2.jpg",
        "src2": "File:HP Victus laptop.jpg"
    },
    # 16. Acer Predator Helios Neo 16 (RTX 4060)
    {
        "id": 16,
        "name": "Acer Predator Helios Neo 16 (RTX 4060)",
        "file1": "acer_predator_helios_neo_1.jpg",
        "src1": "File:Predator Helios 300 20221224.jpg",
        "file2": "acer_predator_helios_neo_2.jpg",
        "src2": "File:Asus ROG Phone 2 and Acer Predator Helios 700 20201101.jpg"
    },
    # 17. Lenovo Legion 5i 16 Gen 9 (RTX 4060)
    {
        "id": 17,
        "name": "Lenovo Legion 5i 16 Gen 9 (RTX 4060)",
        "file1": "lenovo_legion_5i_1.jpg",
        "src1": "File:Lenovo legion (laptop) & Lenovo 400 Wireless (Mouse) IMG 6309ab.jpg",
        "file2": "lenovo_legion_5i_2.jpg",
        "src2": "File:Lenovo Legion Y7000P Eclipse Gray Laptop.jpg"
    },
    # 18. ASUS ROG Zephyrus G16 GU605MV (RTX 4060)
    {
        "id": 18,
        "name": "ASUS ROG Zephyrus G16 GU605MV (RTX 4060)",
        "file1": "asus_rog_zephyrus_g16_1.jpg",
        "src1": "File:ASUS ROG Strix G15 (G513QY-HQ012T)-top cover PNr°0885.jpg",
        "file2": "asus_rog_zephyrus_g16_2.jpg",
        "src2": "File:ASUS ROG Strix G15 (G513QY-HQ012T)-top keyboard WASD PNr°0888.jpg"
    },
    # 19. HP OMEN 16-wf1025TX (RTX 4060)
    {
        "id": 19,
        "name": "HP OMEN 16-wf1025TX (RTX 4060)",
        "file1": "hp_omen_16_1.jpg",
        "src1": "File:My Omen - keyboard.jpg",
        "file2": "hp_omen_16_2.jpg",
        "src2": "File:HP Victus laptop.jpg"
    },
    # 20. ASUS ROG Strix G16 G614JIR (RTX 4070)
    {
        "id": 20,
        "name": "ASUS ROG Strix G16 G614JIR (RTX 4070)",
        "file1": "asus_rog_strix_g16_1.jpg",
        "src1": "File:ASUS ROG Strix G15 (G513QY-HQ012T)-top cover PNr°0885.jpg",
        "file2": "asus_rog_strix_g16_2.jpg",
        "src2": "File:ASUS ROG Strix G15 (G513QY-HQ012T)-front oblique PNr°0884.jpg"
    },
    # 21. Lenovo Legion Pro 5 16IRX9 (RTX 4070)
    {
        "id": 21,
        "name": "Lenovo Legion Pro 5 16IRX9 (RTX 4070)",
        "file1": "lenovo_legion_pro_5_1.jpg",
        "src1": "File:Lenovo Legion Y7000P Eclipse Gray Laptop.jpg",
        "file2": "lenovo_legion_pro_5_2.jpg",
        "src2": "File:Lenovo Legion Y520 (1).jpg"
    },
    # 22. MSI Katana 15 B13VGK (RTX 4070)
    {
        "id": 22,
        "name": "MSI Katana 15 B13VGK (RTX 4070)",
        "file1": "msi_katana_15_1.jpg",
        "src1": "File:MSI Bravo 17 (0017FK-007)-front oblique PNr°0757.jpg",
        "file2": "msi_katana_15_2.jpg",
        "src2": "File:MSI Bravo 17 (0017FK-007)-top keyboard PNr°0758.jpg"
    },
    # 23. Dell Alienware m16 R2 (RTX 4070)
    {
        "id": 23,
        "name": "Dell Alienware m16 R2 (RTX 4070)",
        "file1": "dell_alienware_m16_1.jpg",
        "src1": "LOCAL",
        "file2": "dell_alienware_m16_2.jpg",
        "src2": "LOCAL"
    },
    # 24. ASUS ROG Strix SCAR 16 G634JZ (RTX 4080)
    {
        "id": 24,
        "name": "ASUS ROG Strix SCAR 16 G634JZ (RTX 4080)",
        "file1": "asus_rog_strix_scar_16_1.jpg",
        "src1": "LOCAL",
        "file2": "asus_rog_strix_scar_16_2.jpg",
        "src2": "LOCAL"
    },
    # 25. Lenovo Legion Pro 7i 16IRX9H (RTX 4080)
    {
        "id": 25,
        "name": "Lenovo Legion Pro 7i 16IRX9H (RTX 4080)",
        "file1": "lenovo_legion_pro_7i_1.jpg",
        "src1": "File:Lenovo Legion Y7000P Eclipse Gray Laptop.jpg",
        "file2": "lenovo_legion_pro_7i_2.jpg",
        "src2": "File:Lenovo legion (laptop) & Lenovo 400 Wireless (Mouse) IMG 6309ab.jpg"
    },
    # 26. Acer Predator Helios 16 PH16-72 (RTX 4080)
    {
        "id": 26,
        "name": "Acer Predator Helios 16 PH16-72 (RTX 4080)",
        "file1": "acer_predator_helios_16_1.jpg",
        "src1": "File:Asus ROG Phone 2 and Acer Predator Helios 700 20201101.jpg",
        "file2": "acer_predator_helios_16_2.jpg",
        "src2": "File:Predator Helios 300 20221224.jpg"
    },
    # 27. ASUS ROG Strix SCAR 18 G834JYR (RTX 4090)
    {
        "id": 27,
        "name": "ASUS ROG Strix SCAR 18 G834JYR (RTX 4090)",
        "file1": "asus_rog_strix_scar_18_1.jpg",
        "src1": "LOCAL",
        "file2": "asus_rog_strix_scar_18_2.jpg",
        "src2": "LOCAL"
    },
    # 28. MSI Titan 18 HX A14VIG (RTX 4090)
    {
        "id": 28,
        "name": "MSI Titan 18 HX A14VIG (RTX 4090)",
        "file1": "msi_titan_18_hx_1.jpg",
        "src1": "LOCAL",
        "file2": "msi_titan_18_hx_2.jpg",
        "src2": "LOCAL"
    },
    # 29. Lenovo Legion 9i 16IRX9 (RTX 4090)
    {
        "id": 29,
        "name": "Lenovo Legion 9i 16IRX9 (RTX 4090)",
        "file1": "lenovo_legion_9i_1.jpg",
        "src1": "File:Lenovo Legion Y7000P Eclipse Gray Laptop.jpg",
        "file2": "lenovo_legion_9i_2.jpg",
        "src2": "File:Lenovo legion (laptop) & Lenovo 400 Wireless (Mouse) IMG 6309ab.jpg"
    },
    # 30. HP OMEN Transcend 16-u1005TX (RTX 4080)
    {
        "id": 30,
        "name": "HP OMEN Transcend 16-u1005TX (RTX 4080)",
        "file1": "hp_omen_transcend_16_1.jpg",
        "src1": "File:My Omen - keyboard.jpg",
        "file2": "hp_omen_transcend_16_2.jpg",
        "src2": "File:HP Victus laptop 2.jpg"
    }
]

# Step 1: Collect all Wikimedia File titles to resolve in one batch
titles_to_resolve = set()
for lp in laptops_spec:
    for s in [lp['src1'], lp['src2']]:
        if s.startswith('File:'):
            titles_to_resolve.add(s)

print(f"Resolving {len(titles_to_resolve)} unique Wikimedia titles in batch...")
title_list = list(titles_to_resolve)
pipe_titles = "|".join(title_list)
api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(pipe_titles)}&prop=imageinfo&iiprop=url|size|mime&format=json"

resolved_map = {}
req = urllib.request.Request(api_url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        for pid, pdata in data.get('query', {}).get('pages', {}).items():
            if pid != "-1" and 'imageinfo' in pdata and pdata['imageinfo']:
                resolved_map[pdata['title']] = pdata['imageinfo'][0]['url']
except Exception as e:
    print(f"Error in batch query: {e}")

print(f"Successfully resolved {len(resolved_map)} URLs from Wikimedia.\n")

# Step 2: Download files sequentially with nice delay
def download_url(url, dest_path):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 20000:
        return True, os.path.getsize(dest_path), "cached"
    for attempt in range(3):
        try:
            r = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(r, timeout=30) as resp:
                data = resp.read()
                if len(data) < 2000:
                    raise Exception("File too small")
                with open(dest_path, 'wb') as f:
                    f.write(data)
                return True, len(data), "downloaded"
        except urllib.error.HTTPError as e:
            if e.code == 429:
                wait = 4 * (attempt + 1)
                print(f"    [429 Rate Limit] Backing off {wait}s...")
                time.sleep(wait)
            else:
                return False, 0, f"HTTP Error {e.code}"
        except Exception as ex:
            return False, 0, str(ex)
        time.sleep(2)
    return False, 0, "Max retries exceeded"

all_success = 0
for lp in laptops_spec:
    lid = lp['id']
    lname = lp['name']
    f1, s1 = lp['file1'], lp['src1']
    f2, s2 = lp['file2'], lp['src2']
    
    p1 = os.path.join(out_dir, f1)
    p2 = os.path.join(out_dir, f2)
    
    # Resolve URL 1
    if s1 == "LOCAL":
        u1 = None
    elif s1.startswith('File:'):
        u1 = resolved_map.get(s1)
    else:
        u1 = s1
        
    # Resolve URL 2
    if s2 == "LOCAL":
        u2 = None
    elif s2.startswith('File:'):
        u2 = resolved_map.get(s2)
    else:
        u2 = s2
        
    if u1:
        ok1, sz1, msg1 = download_url(u1, p1)
        time.sleep(1.2)
    else:
        ok1, sz1, msg1 = os.path.exists(p1), os.path.getsize(p1) if os.path.exists(p1) else 0, "local"
        
    if u2:
        ok2, sz2, msg2 = download_url(u2, p2)
        time.sleep(1.2)
    else:
        ok2, sz2, msg2 = os.path.exists(p2), os.path.getsize(p2) if os.path.exists(p2) else 0, "local"
        
    if ok1 and ok2 and sz1 > 20000 and sz2 > 20000:
        all_success += 1
        print(f"[{lid:02d}/30] SUCCESS: {lname}")
        print(f"       1: {f1} ({sz1//1024} KB) [{msg1}]")
        print(f"       2: {f2} ({sz2//1024} KB) [{msg2}]")
    else:
        print(f"[{lid:02d}/30] FAILED: {lname} (img1: {ok1} {sz1//1024}KB, img2: {ok2} {sz2//1024}KB)")

print(f"\n=======================================================")
print(f"FINAL AUDIT: {all_success}/30 LAPTOPS READY WITH 2 VALID IMAGES!")
print(f"=======================================================")
