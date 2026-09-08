import os
import sys

# List all 30 laptops and their 2 images
laptops_spec = [
    (1, "Apple MacBook Air 13 M2", "macbook_air_m2_midnight_1.jpg", "macbook_air_m2_midnight_2.jpg"),
    (2, "Apple MacBook Air 13 M3", "macbook_air_m3_spacegrey_1.jpg", "macbook_air_m3_spacegrey_2.jpg"),
    (3, "Apple MacBook Air 15 M3", "macbook_air_15_starlight_1.jpg", "macbook_air_15_starlight_2.jpg"),
    (4, "Apple MacBook Pro 14 M4", "macbook_pro_14_spaceblack_1.jpg", "macbook_pro_14_spaceblack_2.jpg"),
    (5, "Apple MacBook Pro 16 M4 Pro", "macbook_pro_16_silver_1.jpg", "macbook_pro_16_silver_2.jpg"),
    (6, "ASUS Zenbook 14 OLED", "asus_zenbook_14_1.jpg", "asus_zenbook_14_2.jpg"),
    (7, "Lenovo ThinkPad E14 Gen 6", "lenovo_thinkpad_e14_1.jpg", "lenovo_thinkpad_e14_2.jpg"),
    (8, "Dell Inspiron 14 Plus 7440", "dell_inspiron_14_1.jpg", "dell_inspiron_14_2.jpg"),
    (9, "HP Spectre x360 2-in-1 14", "hp_spectre_x360_1.jpg", "hp_spectre_x360_2.jpg"),
    (10, "Lenovo Yoga Slim 7x 14.5", "lenovo_yoga_slim_7x_1.jpg", "lenovo_yoga_slim_7x_2.jpg"),
    (11, "Acer Nitro V 15 ANV15-51", "acer_nitro_v15_1.jpg", "acer_nitro_v15_2.jpg"),
    (12, "Lenovo LOQ 15", "lenovo_loq_15_1.jpg", "lenovo_loq_15_2.jpg"),
    (13, "ASUS TUF Gaming A15", "asus_tuf_a15_1.jpg", "asus_tuf_a15_2.jpg"),
    (14, "Lenovo LOQ 15IRX9", "lenovo_loq_15irx9_1.jpg", "lenovo_loq_15irx9_2.jpg"),
    (15, "HP Victus 16-r0075TX", "hp_victus_16_1.jpg", "hp_victus_16_2.jpg"),
    (16, "Acer Predator Helios Neo 16", "acer_predator_helios_neo_1.jpg", "acer_predator_helios_neo_2.jpg"),
    (17, "Lenovo Legion 5i 16 Gen 9", "lenovo_legion_5i_1.jpg", "lenovo_legion_5i_2.jpg"),
    (18, "ASUS ROG Zephyrus G16", "asus_rog_zephyrus_g16_1.jpg", "asus_rog_zephyrus_g16_2.jpg"),
    (19, "HP OMEN 16-wf1025TX", "hp_omen_16_1.jpg", "hp_omen_16_2.jpg"),
    (20, "ASUS ROG Strix G16", "asus_rog_strix_g16_1.jpg", "asus_rog_strix_g16_2.jpg"),
    (21, "Lenovo Legion Pro 5 16IRX9", "lenovo_legion_pro_5_1.jpg", "lenovo_legion_pro_5_2.jpg"),
    (22, "MSI Katana 15 B13VGK", "msi_katana_15_1.jpg", "msi_katana_15_2.jpg"),
    (23, "Dell Alienware m16 R2", "dell_alienware_m16_1.jpg", "dell_alienware_m16_2.jpg"),
    (24, "ASUS ROG Strix SCAR 16", "asus_rog_strix_scar_16_1.jpg", "asus_rog_strix_scar_16_2.jpg"),
    (25, "Lenovo Legion Pro 7i 16", "lenovo_legion_pro_7i_1.jpg", "lenovo_legion_pro_7i_2.jpg"),
    (26, "Acer Predator Helios 16", "acer_predator_helios_16_1.jpg", "acer_predator_helios_16_2.jpg"),
    (27, "ASUS ROG Strix SCAR 18", "asus_rog_strix_scar_18_1.jpg", "asus_rog_strix_scar_18_2.jpg"),
    (28, "MSI Titan 18 HX A14VIG", "msi_titan_18_hx_1.jpg", "msi_titan_18_hx_2.jpg"),
    (29, "Lenovo Legion 9i 16", "lenovo_legion_9i_1.jpg", "lenovo_legion_9i_2.jpg"),
    (30, "HP OMEN Transcend 16", "hp_omen_transcend_16_1.jpg", "hp_omen_transcend_16_2.jpg")
]

base_dir = 'Frontend/public/images/laptops'
for idx, name, f1, f2 in laptops_spec:
    p1 = os.path.join(base_dir, f1)
    p2 = os.path.join(base_dir, f2)
    s1 = os.path.getsize(p1) if os.path.exists(p1) else 0
    s2 = os.path.getsize(p2) if os.path.exists(p2) else 0
    print(f"[{idx:02d}] {name:30} -> {f1} ({s1//1024}KB) | {f2} ({s2//1024}KB)")
