import urllib.request
import urllib.parse
import json
import os
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = os.path.abspath('Frontend/public/images/affordable')
os.makedirs(OUT_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'GearGridHardwareCatalogBot/1.0 (contact@geargrid.local; educational project)'
}

def get_wikimedia_image_url(file_title):
    try:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(file_title)}&prop=imageinfo&iiprop=url|mime|size&format=json"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, page in pages.items():
                info = page.get('imageinfo', [{}])[0]
                return info.get('url')
    except Exception as e:
        print(f"Error fetching {file_title}: {e}")
    return None

def search_wikimedia(query, limit=5):
    try:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|mime|size&format=json"
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, page in pages.items():
                info = page.get('imageinfo', [{}])[0]
                title = page.get('title')
                img_url = info.get('url')
                mime = info.get('mime')
                if img_url and ('image' in str(mime) or img_url.endswith(('.jpg', '.jpeg', '.png', '.webp'))):
                    results.append({'title': title, 'url': img_url})
            return results
    except Exception as e:
        print(f"Search error for {query}: {e}")
        return []

def download_image(url, target_path):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = resp.read()
            if len(content) < 5000:
                print(f"  Warning: file too small ({len(content)} bytes) for {url}")
                return False
            with open(target_path, 'wb') as f:
                f.write(content)
            print(f"  Downloaded ({len(content)//1024} KB) -> {os.path.basename(target_path)}")
            return True
    except Exception as e:
        print(f"  Download failed for {url}: {e}")
        return False

# List of 58 products with curated queries/sources
PRODUCTS = [
    # -------------------------------------------------------------
    # 1. GPUs (9 products)
    # -------------------------------------------------------------
    {
        "id": "asus_dual_rtx3050_6gb",
        "title": "ASUS Dual GeForce RTX 3050 6GB GDDR6 OC Edition",
        "search1": "GeForce RTX 3050 graphics card",
        "search2": "ASUS Dual graphics card GeForce",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "gigabyte_rtx3050_eagle_6gb",
        "title": "Gigabyte GeForce RTX 3050 EAGLE OC 6GB GDDR6",
        "search1": "Gigabyte GeForce graphics card",
        "search2": "GeForce RTX 3050",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "zotac_rtx3050_8gb",
        "title": "ZOTAC Gaming GeForce RTX 3050 8GB Twin Edge OC",
        "search1": "ZOTAC Gaming GeForce graphics card",
        "search2": "GeForce RTX 3050 8GB",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "msi_rtx2060_ventus_6gb",
        "title": "MSI GeForce RTX 2060 VENTUS GP OC 6GB GDDR6",
        "search1": "GeForce RTX 2060 graphics card",
        "search2": "MSI GeForce RTX 2060",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "asus_dual_rtx3060_12gb",
        "title": "ASUS Dual GeForce RTX 3060 12GB GDDR6 OC Edition V2",
        "search1": "GeForce RTX 3060 12GB",
        "search2": "ASUS GeForce RTX 3060",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "zotac_rtx3060ti_8gb",
        "title": "ZOTAC Gaming GeForce RTX 3060 Ti Twin Edge 8GB GDDR6",
        "search1": "GeForce RTX 3060 Ti",
        "search2": "ZOTAC GeForce RTX graphics card",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "sapphire_pulse_rx6600_8gb",
        "title": "Sapphire PULSE AMD Radeon RX 6600 8GB GDDR6",
        "search1": "Radeon RX 6600 graphics card",
        "search2": "AMD Radeon RX 6600",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "asrock_rx6500xt_4gb",
        "title": "ASRock AMD Radeon RX 6500 XT Phantom Gaming D 4GB OC",
        "search1": "Radeon RX 6500 XT",
        "search2": "AMD Radeon graphics card",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "asrock_rx7600_8gb",
        "title": "ASRock AMD Radeon RX 7600 Challenger 8GB OC",
        "search1": "Radeon RX 7600 graphics card",
        "search2": "AMD Radeon RX 7600",
        "direct1": None,
        "direct2": None
    },

    # -------------------------------------------------------------
    # 2. CPUs (10 products)
    # -------------------------------------------------------------
    {
        "id": "intel_core_i3_12100f",
        "title": "Intel Core i3-12100F Desktop Processor (4 Cores / 8 Threads)",
        "search1": "Intel Core i3-12100",
        "search2": "Intel LGA1700 processor",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "intel_core_i3_13100f",
        "title": "Intel Core i3-13100F Desktop Processor (4 Cores / 8 Threads)",
        "search1": "Intel Core i3 processor",
        "search2": "Intel Core 13th gen processor",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "intel_core_i5_12400f",
        "title": "Intel Core i5-12400F Desktop Processor (6 Cores / 12 Threads)",
        "search1": "Intel Core i5-12400",
        "search2": "Intel Core i5 Alder Lake CPU",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "intel_core_i5_12400",
        "title": "Intel Core i5-12400 Desktop Processor (6 Cores / 12 Threads with Intel UHD 730)",
        "search1": "Intel Core i5-12400 CPU",
        "search2": "Intel LGA1700 desktop CPU",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "intel_core_i5_13400f",
        "title": "Intel Core i5-13400F Desktop Processor (10 Cores / 16 Threads)",
        "search1": "Intel Core i5-13400",
        "search2": "Intel Core i5 13th gen",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "amd_ryzen_5_5500",
        "title": "AMD Ryzen 5 5500 Desktop Processor (6 Cores / 12 Threads)",
        "search1": "AMD Ryzen 5 5500",
        "search2": "AMD Ryzen 5 processor AM4",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "amd_ryzen_5_5600",
        "title": "AMD Ryzen 5 5600 Desktop Processor (6 Cores / 12 Threads)",
        "search1": "AMD Ryzen 5 5600",
        "search2": "AMD Ryzen 5 5600 CPU",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "amd_ryzen_5_5600g",
        "title": "AMD Ryzen 5 5600G Desktop APU (6 Cores / 12 Threads with Radeon Graphics)",
        "search1": "AMD Ryzen 5 5600G",
        "search2": "Ryzen 5 5600G APU",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "amd_ryzen_5_5600x",
        "title": "AMD Ryzen 5 5600X Desktop Processor (6 Cores / 12 Threads)",
        "search1": "AMD Ryzen 5 5600X",
        "search2": "Ryzen 5 5600X processor",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "amd_ryzen_7_5700x",
        "title": "AMD Ryzen 7 5700X Desktop Processor (8 Cores / 16 Threads)",
        "search1": "AMD Ryzen 7 5700X",
        "search2": "Ryzen 7 5700X AM4",
        "direct1": None,
        "direct2": None
    },

    # -------------------------------------------------------------
    # 3. Motherboards (9 products)
    # -------------------------------------------------------------
    {
        "id": "asus_prime_h610m_e_d4",
        "title": "ASUS Prime H610M-E D4 Micro-ATX Motherboard",
        "search1": "ASUS Prime motherboard LGA1700",
        "search2": "H610 motherboard",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "msi_pro_h610m_e_ddr4",
        "title": "MSI PRO H610M-E DDR4 Micro-ATX Motherboard",
        "search1": "MSI PRO H610M motherboard",
        "search2": "MSI H610 motherboard",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "msi_pro_b760m_e_ddr4",
        "title": "MSI PRO B760M-E DDR4 Micro-ATX Motherboard",
        "search1": "MSI B760M motherboard",
        "search2": "MSI PRO B760 motherboard",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "gigabyte_b760m_ds3h_ax",
        "title": "Gigabyte B760M DS3H AX DDR4 WiFi Motherboard",
        "search1": "Gigabyte B760M motherboard",
        "search2": "Gigabyte DS3H motherboard",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "asus_prime_a520m_k",
        "title": "ASUS Prime A520M-K Micro-ATX Motherboard",
        "search1": "ASUS Prime A520M motherboard",
        "search2": "A520 motherboard AM4",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "msi_b450m_pro_vdh_max",
        "title": "MSI B450M PRO-VDH MAX Micro-ATX Motherboard",
        "search1": "MSI B450M PRO-VDH motherboard",
        "search2": "MSI B450 motherboard AM4",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "gigabyte_b550m_ds3h_ac",
        "title": "Gigabyte B550M DS3H AC Micro-ATX Motherboard",
        "search1": "Gigabyte B550M DS3H motherboard",
        "search2": "Gigabyte B550 motherboard",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "asus_prime_b550m_a_wifi",
        "title": "ASUS Prime B550M-A WiFi II Micro-ATX Motherboard",
        "search1": "ASUS Prime B550M motherboard",
        "search2": "ASUS B550 motherboard AM4",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "msi_mag_b550_tomahawk",
        "title": "MSI MAG B550 TOMAHAWK ATX Gaming Motherboard",
        "search1": "MSI MAG B550 TOMAHAWK motherboard",
        "search2": "MSI B550 TOMAHAWK",
        "direct1": None,
        "direct2": None
    },

    # -------------------------------------------------------------
    # 4. Memory / RAM (7 products)
    # -------------------------------------------------------------
    {
        "id": "corsair_lpx_8gb_ddr4",
        "title": "Corsair Vengeance LPX 8GB (1x8GB) DDR4 3200MHz CL16",
        "search1": "Corsair Vengeance LPX DDR4",
        "search2": "Corsair Vengeance DDR4 RAM",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "corsair_lpx_16gb_ddr4",
        "title": "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz CL16 Desktop RAM",
        "search1": "Corsair Vengeance LPX DDR4 RAM",
        "search2": "Corsair Vengeance LPX memory",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "gskill_ripjaws_16gb_ddr4",
        "title": "G.Skill Ripjaws V 16GB (2x8GB) DDR4 3600MHz CL18 Gaming Memory",
        "search1": "G.Skill Ripjaws V DDR4",
        "search2": "G.Skill Ripjaws DDR4 RAM",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "kingston_fury_16gb_ddr4",
        "title": "Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz Desktop RAM",
        "search1": "Kingston FURY Beast DDR4",
        "search2": "Kingston FURY DDR4 RAM",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "crucial_pro_16gb_ddr4",
        "title": "Crucial Pro 16GB (2x8GB) DDR4 3200MHz CL22 Desktop Memory",
        "search1": "Crucial DDR4 desktop RAM",
        "search2": "Crucial memory module DDR4",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "corsair_lpx_32gb_ddr4",
        "title": "Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz CL16 RAM",
        "search1": "Corsair Vengeance LPX 32GB DDR4",
        "search2": "Corsair Vengeance LPX black",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "kingston_fury_16gb_ddr5",
        "title": "Kingston FURY Beast 16GB (1x16GB) DDR5 5600MHz CL40",
        "search1": "Kingston FURY Beast DDR5",
        "search2": "Kingston DDR5 RAM",
        "direct1": None,
        "direct2": None
    },

    # -------------------------------------------------------------
    # 5. Storage (7 products)
    # -------------------------------------------------------------
    {
        "id": "kingston_nv2_500gb",
        "title": "Kingston NV2 500GB PCIe 4.0 NVMe M.2 SSD",
        "search1": "Kingston NV2 NVMe SSD",
        "search2": "Kingston NV2 SSD",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "crucial_p3_500gb",
        "title": "Crucial P3 500GB PCIe 3.0 3D NAND NVMe M.2 SSD",
        "search1": "Crucial P3 NVMe SSD",
        "search2": "Crucial P3 SSD M.2",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "kingston_nv2_1tb",
        "title": "Kingston NV2 1TB PCIe 4.0 NVMe M.2 SSD",
        "search1": "Kingston NV2 1TB SSD",
        "search2": "Kingston NVMe M.2 SSD",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "crucial_p3_plus_1tb",
        "title": "Crucial P3 Plus 1TB PCIe 4.0 3D NAND NVMe M.2 SSD",
        "search1": "Crucial P3 Plus NVMe SSD",
        "search2": "Crucial PCIe 4.0 NVMe SSD",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "crucial_bx500_500gb",
        "title": "Crucial BX500 500GB 3D NAND 2.5-inch SATA SSD",
        "search1": "Crucial BX500 SSD",
        "search2": "Crucial 2.5 SATA SSD",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "crucial_bx500_1tb",
        "title": "Crucial BX500 1TB 3D NAND 2.5-inch SATA SSD",
        "search1": "Crucial BX500 1TB SSD",
        "search2": "Crucial SATA 2.5 inch SSD",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "wd_green_sn350_1tb",
        "title": "Western Digital WD Green SN350 1TB NVMe SSD",
        "search1": "WD Green SN350 NVMe SSD",
        "search2": "Western Digital NVMe SSD M.2",
        "direct1": None,
        "direct2": None
    },

    # -------------------------------------------------------------
    # 6. Power Supplies (8 products)
    # -------------------------------------------------------------
    {
        "id": "deepcool_pk450d",
        "title": "DeepCool PK450D 450W 80 PLUS Bronze Power Supply",
        "search1": "DeepCool power supply unit",
        "search2": "DeepCool PSU 80 Plus",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "corsair_cv450",
        "title": "Corsair CV450 450W 80 PLUS Bronze Certified PSU",
        "search1": "Corsair CV power supply",
        "search2": "Corsair PSU Bronze",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "deepcool_pk550d",
        "title": "DeepCool PK550D 550W 80 PLUS Bronze Power Supply",
        "search1": "DeepCool PK550D power supply",
        "search2": "DeepCool 550W power supply",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "coolermaster_mwe450",
        "title": "Cooler Master MWE 450 Bronze V2 450W 80 Plus Bronze PSU",
        "search1": "Cooler Master MWE Bronze power supply",
        "search2": "Cooler Master PSU MWE",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "coolermaster_mwe550",
        "title": "Cooler Master MWE 550 Bronze V2 550W 80 Plus Bronze PSU",
        "search1": "Cooler Master MWE 550W power supply",
        "search2": "Cooler Master MWE Bronze V2",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "corsair_cv550",
        "title": "Corsair CV550 550W 80 PLUS Bronze Certified Power Supply",
        "search1": "Corsair CV550 power supply",
        "search2": "Corsair CV series PSU",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "antesports_vs500l",
        "title": "Ant Esports VS500L 500W Non-Modular Power Supply",
        "search1": "ATX power supply unit desktop",
        "search2": "500W power supply unit PC",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "coolermaster_mwe650",
        "title": "Cooler Master MWE 650 Bronze V2 650W Power Supply",
        "search1": "Cooler Master MWE 650W power supply",
        "search2": "Cooler Master MWE 650 Bronze",
        "direct1": None,
        "direct2": None
    },

    # -------------------------------------------------------------
    # 7. Cooling & Cases (8 products)
    # -------------------------------------------------------------
    {
        "id": "deepcool_iceedge",
        "title": "DeepCool IceEdge Mini FS V2.0 CPU Air Cooler",
        "search1": "DeepCool CPU air cooler heatsink",
        "search2": "CPU air cooler heatpipes fan",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "antesports_c612",
        "title": "Ant Esports ICE-C612 V2 ARGB CPU Air Cooler",
        "search1": "Tower CPU air cooler 120mm fan",
        "search2": "CPU cooler tower heatsink",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "cm_hyper212_v3",
        "title": "Cooler Master Hyper 212 Spectrum V3 ARGB CPU Cooler",
        "search1": "Cooler Master Hyper 212 CPU cooler",
        "search2": "Cooler Master Hyper 212",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "antesports_elite1100",
        "title": "Ant Esports Elite 1100 Mid-Tower Gaming Cabinet",
        "search1": "Mid-tower computer case ATX mesh",
        "search2": "PC gaming case desktop chassis",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "antesports_ice100",
        "title": "Ant Esports ICE-100 Mid-Tower Gaming Case",
        "search1": "Gaming PC case tempered glass side",
        "search2": "Computer chassis ATX mid tower",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "deepcool_matrexx40",
        "title": "DeepCool Matrexx 40 3FS Micro-ATX Gaming Case",
        "search1": "DeepCool computer case",
        "search2": "Micro-ATX PC case mesh",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "msi_mag_forge_m100r",
        "title": "MSI MAG Forge M100R Micro-ATX Gaming Case",
        "search1": "MSI MAG computer case gaming",
        "search2": "Micro-ATX gaming case ARGB",
        "direct1": None,
        "direct2": None
    },
    {
        "id": "galax_revolution05",
        "title": "Galax Revolution 05 White ATX Gaming Chassis",
        "search1": "White gaming PC case chassis",
        "search2": "White ATX mid tower case",
        "direct1": None,
        "direct2": None
    }
]

print(f"Total affordable products to process: {len(PRODUCTS)}")
