import os
import time
import io
import urllib.request
import hashlib
from PIL import Image

out_dir = r"c:\Users\adity\OneDrive\Desktop\GearGrid\Frontend\public\images\affordable"
os.makedirs(out_dir, exist_ok=True)

headers = {
    'User-Agent': 'GearGridApp/2.0 (https://geargrid.com; contact@geargrid.com) Python-urllib/3.11',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
}

ram_items = [
    {
        "id": "corsair_lpx_8gb_ddr4",
        "title": "Corsair Vengeance LPX 8GB (1x8GB) DDR4 3200MHz CL16",
        "images": [
            ("corsair_lpx_8gb_ddr4_1.jpg", "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK16GX4M2B3200C16/Gallery/VENG_LPX_BLK_05.webp"),
            ("corsair_lpx_8gb_ddr4_2.jpg", "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK8GX4M1A2400C16/Gallery/VENG_LPX_BLK_01.webp")
        ]
    },
    {
        "id": "corsair_lpx_16gb_ddr4",
        "title": "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz CL16 Desktop RAM",
        "images": [
            ("corsair_lpx_16gb_ddr4_1.jpg", "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK16GX4M2B3200C16/Gallery/VENG_LPX_BLK_01.webp"),
            ("corsair_lpx_16gb_ddr4_2.jpg", "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK16GX4M2B3200C16/Gallery/VENG_LPX_BLK_02.webp")
        ]
    },
    {
        "id": "corsair_lpx_32gb_ddr4",
        "title": "Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz CL16 RAM",
        "images": [
            ("corsair_lpx_32gb_ddr4_1.jpg", "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK32GX4M2B3200C16/Gallery/VENG_LPX_BLK_05.webp"),
            ("corsair_lpx_32gb_ddr4_2.jpg", "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK32GX4M2E3200C16/Gallery/VENG_LPX_BLK_01.webp")
        ]
    },
    {
        "id": "gskill_ripjaws_16gb_ddr4",
        "title": "G.Skill Ripjaws V 16GB (2x8GB) DDR4 3600MHz CL18 Gaming Memory",
        "images": [
            ("gskill_ripjaws_16gb_ddr4_1.jpg", "https://upload.wikimedia.org/wikipedia/commons/5/5e/G.Skill_RipjawsX_DDR3_memory_modules.JPG"),
            ("gskill_ripjaws_16gb_ddr4_2.jpg", "https://upload.wikimedia.org/wikipedia/commons/d/d1/Tridentz_red_RAM.JPG")
        ]
    },
    {
        "id": "kingston_fury_16gb_ddr4",
        "title": "Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz Desktop RAM",
        "images": [
            ("kingston_fury_16gb_ddr4_1.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/c0/HyperX_Fury_DDR4-RAM_20210611_Vorderseite.png"),
            ("kingston_fury_16gb_ddr4_2.jpg", "https://upload.wikimedia.org/wikipedia/commons/6/69/HyperX_Fury_DDR4-RAM_20210611_R%C3%BCckseite.png")
        ]
    },
    {
        "id": "crucial_pro_16gb_ddr4",
        "title": "Crucial Pro 16GB (2x8GB) DDR4 3200MHz CL22 Desktop Memory",
        "images": [
            ("crucial_pro_16gb_ddr4_1.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/30/Crucial_Ballistix_IMG_4938.jpg"),
            ("crucial_pro_16gb_ddr4_2.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/37/Crucial_Ballistix_IMG_4939.jpg")
        ]
    },
    {
        "id": "kingston_fury_16gb_ddr5",
        "title": "Kingston FURY Beast 16GB (1x16GB) DDR5 5600MHz CL40",
        "images": [
            ("kingston_fury_16gb_ddr5_1.jpg", "https://upload.wikimedia.org/wikipedia/commons/e/ed/HyperX_HX432C16FB4AK2_32_Dsc00420_RAW_202107230552crop_cens.jpg"),
            ("kingston_fury_16gb_ddr5_2.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/85/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png")
        ]
    },
    {
        "id": "crucial_16gb_ddr5_4800",
        "title": "Crucial 16GB (2x8GB) DDR5-4800 CL40 Desktop Memory",
        "images": [
            ("crucial_16gb_ddr5_4800_1.jpg", "https://upload.wikimedia.org/wikipedia/commons/b/ba/DDR_4_RAM_SO-DIMM_16GB_by_Micron-top_front_PNr%C2%B00840.jpg"),
            ("crucial_16gb_ddr5_4800_2.jpg", "https://upload.wikimedia.org/wikipedia/commons/5/5c/RAM_%281%29.jpg")
        ]
    },
    {
        "id": "corsair_vengeance_32gb_ddr5",
        "title": "Corsair Vengeance 32GB (2x16GB) DDR5-5200 CL40",
        "images": [
            ("corsair_vengeance_32gb_ddr5_1.jpg", "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/vengeance-ddr5-blk-config/Gallery/Vengeance-DDR5-2UP-16GB-BLACK_01.webp"),
            ("corsair_vengeance_32gb_ddr5_2.jpg", "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/vengeance-ddr5-blk-config/Gallery/Vengeance-DDR5-1UP-32GB-BLACK_02.webp")
        ]
    }
]

hashes = {}
successful = []
errors = []

for item in ram_items:
    print(f"\nProcessing {item['title']}...")
    for fname, url in item['images']:
        target_path = os.path.join(out_dir, fname)
        time.sleep(1.2) # Polite crawl delay for Wikimedia/CDNs
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=20) as resp:
                data = resp.read()
            
            img = Image.open(io.BytesIO(data))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize if unnecessarily gigantic (> 2500px)
            if img.width > 2400 or img.height > 2400:
                img.thumbnail((2400, 2400), Image.Resampling.LANCZOS)
                
            img.save(target_path, "JPEG", quality=92)
            
            with open(target_path, "rb") as fp:
                saved = fp.read()
                
            h = hashlib.md5(saved).hexdigest()
            print(f"  OK -> {fname} ({len(saved)} bytes, {img.size[0]}x{img.size[1]}, MD5: {h[:10]}...)")
            
            if h in hashes:
                print(f"  [ERROR: DUPLICATE HASH] {fname} is identical to {hashes[h]}")
                errors.append(f"Duplicate {fname} and {hashes[h]}")
            else:
                hashes[h] = fname
                successful.append(fname)
        except Exception as e:
            print(f"  [ERROR] Failed {fname} from {url}: {e}")
            errors.append(f"Failed {fname}: {e}")

print("\n==========================================")
print(f"Total Successfully Downloaded: {len(successful)} / {len(ram_items) * 2}")
print(f"Total Unique MD5 Hashes: {len(hashes)}")
print(f"Total Errors / Duplicates: {len(errors)}")
print("==========================================")
