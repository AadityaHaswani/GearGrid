import re
import json

# Mapping of laptop index (1 to 30) to image files
mapping = [
    # 1
    ["/images/laptops/macbook_air_m2_midnight_1.jpg", "/images/laptops/macbook_air_m2_midnight_2.jpg"],
    # 2
    ["/images/laptops/macbook_air_m3_spacegrey_1.jpg", "/images/laptops/macbook_air_m3_spacegrey_2.jpg"],
    # 3
    ["/images/laptops/macbook_air_15_starlight_1.jpg", "/images/laptops/macbook_air_15_starlight_2.jpg"],
    # 4
    ["/images/laptops/macbook_pro_14_spaceblack_1.jpg", "/images/laptops/macbook_pro_14_spaceblack_2.jpg"],
    # 5
    ["/images/laptops/macbook_pro_16_silver_1.jpg", "/images/laptops/macbook_pro_16_silver_2.jpg"],
    # 6
    ["/images/laptops/asus_zenbook_14_1.jpg", "/images/laptops/asus_zenbook_14_2.jpg"],
    # 7
    ["/images/laptops/lenovo_thinkpad_e14_1.jpg", "/images/laptops/lenovo_thinkpad_e14_2.jpg"],
    # 8
    ["/images/laptops/dell_inspiron_14_1.jpg", "/images/laptops/dell_inspiron_14_2.jpg"],
    # 9
    ["/images/laptops/hp_spectre_x360_1.jpg", "/images/laptops/hp_spectre_x360_2.jpg"],
    # 10
    ["/images/laptops/lenovo_yoga_slim_7x_1.jpg", "/images/laptops/lenovo_yoga_slim_7x_2.jpg"],
    # 11
    ["/images/laptops/acer_nitro_v15_1.jpg", "/images/laptops/acer_nitro_v15_2.jpg"],
    # 12
    ["/images/laptops/lenovo_loq_15_1.jpg", "/images/laptops/lenovo_loq_15_2.jpg"],
    # 13
    ["/images/laptops/asus_tuf_a15_1.jpg", "/images/laptops/asus_tuf_a15_2.jpg"],
    # 14
    ["/images/laptops/lenovo_loq_15irx9_1.jpg", "/images/laptops/lenovo_loq_15irx9_2.jpg"],
    # 15
    ["/images/laptops/hp_victus_16_1.jpg", "/images/laptops/hp_victus_16_2.jpg"],
    # 16
    ["/images/laptops/acer_predator_helios_neo_1.jpg", "/images/laptops/acer_predator_helios_neo_2.jpg"],
    # 17
    ["/images/laptops/lenovo_legion_5i_1.jpg", "/images/laptops/lenovo_legion_5i_2.jpg"],
    # 18
    ["/images/laptops/asus_rog_zephyrus_g16_1.jpg", "/images/laptops/asus_rog_zephyrus_g16_2.jpg"],
    # 19
    ["/images/laptops/hp_omen_16_1.jpg", "/images/laptops/hp_omen_16_2.jpg"],
    # 20
    ["/images/laptops/asus_rog_strix_g16_1.jpg", "/images/laptops/asus_rog_strix_g16_2.jpg"],
    # 21
    ["/images/laptops/lenovo_legion_pro_5_1.jpg", "/images/laptops/lenovo_legion_pro_5_2.jpg"],
    # 22
    ["/images/laptops/msi_katana_15_1.jpg", "/images/laptops/msi_katana_15_2.jpg"],
    # 23
    ["/images/laptops/dell_alienware_m16_1.jpg", "/images/laptops/dell_alienware_m16_2.jpg"],
    # 24
    ["/images/laptops/asus_rog_strix_scar_16_1.jpg", "/images/laptops/asus_rog_strix_scar_16_2.jpg"],
    # 25
    ["/images/laptops/lenovo_legion_pro_7i_1.jpg", "/images/laptops/lenovo_legion_pro_7i_2.jpg"],
    # 26
    ["/images/laptops/acer_predator_helios_16_1.jpg", "/images/laptops/acer_predator_helios_16_2.jpg"],
    # 27
    ["/images/laptops/asus_rog_strix_scar_18_1.jpg", "/images/laptops/asus_rog_strix_scar_18_2.jpg"],
    # 28
    ["/images/laptops/msi_titan_18_hx_1.jpg", "/images/laptops/msi_titan_18_hx_2.jpg"],
    # 29
    ["/images/laptops/lenovo_legion_9i_1.jpg", "/images/laptops/lenovo_legion_9i_2.jpg"],
    # 30
    ["/images/laptops/hp_omen_transcend_16_1.jpg", "/images/laptops/hp_omen_transcend_16_2.jpg"]
]

with open('Backend/src/laptopSeedData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace images arrays
# Pattern looks for images: [\s*\{\s*url:[^}]+\},\s*\{\s*url:[^}]+\}\s*]
img_pattern = re.compile(r'images:\s*\[\s*\{\s*url:\s*"[^"]*",\s*publicId:\s*"[^"]*"\s*\},\s*\{\s*url:\s*"[^"]*",\s*publicId:\s*"[^"]*"\s*\}\s*\]')

matches = list(img_pattern.finditer(content))
print(f"Found {len(matches)} image blocks to replace.")

if len(matches) == 30:
    new_content = ""
    last_idx = 0
    for i, match in enumerate(matches):
        img1, img2 = mapping[i]
        pub1 = img1.split('/')[-1].replace('.jpg', '')
        pub2 = img2.split('/')[-1].replace('.jpg', '')
        replacement = f'images: [\n        {{ url: "{img1}", publicId: "{pub1}" }},\n        {{ url: "{img2}", publicId: "{pub2}" }}\n      ]'
        new_content += content[last_idx:match.start()] + replacement
        last_idx = match.end()
    new_content += content[last_idx:]

    with open('Backend/src/laptopSeedData.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated Backend/src/laptopSeedData.js with 30 laptop image pairs!")
else:
    print(f"ERROR: Expected 30 matches, found {len(matches)}")
