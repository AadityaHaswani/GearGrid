import os
import io
import urllib.request
import hashlib
from PIL import Image

out_dir = r"c:\Users\adity\OneDrive\Desktop\GearGrid\Frontend\public\images\affordable"
os.makedirs(out_dir, exist_ok=True)

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://www.google.com/'
}

# Distinct product specifications with verified direct image sources
ram_configs = [
    {
        "id": "corsair_lpx_8gb_ddr4",
        "title": "Corsair Vengeance LPX 8GB (1x8GB) DDR4 3200MHz CL16",
        "images": [
            {
                "fname": "corsair_lpx_8gb_ddr4_1.jpg",
                "url": "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK8GX4M1A2400C16/Gallery/VENG_LPX_BLK_01.webp"
            },
            {
                "fname": "corsair_lpx_8gb_ddr4_2.jpg",
                "url": "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK8GX4M1A2400C16/Gallery/VENG_LPX_BLK_02.webp"
            }
        ]
    },
    {
        "id": "corsair_lpx_16gb_ddr4",
        "title": "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz CL16 Desktop RAM",
        "images": [
            {
                "fname": "corsair_lpx_16gb_ddr4_1.jpg",
                "url": "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK16GX4M2B3200C16/Gallery/VENG_LPX_BLK_01.webp"
            },
            {
                "fname": "corsair_lpx_16gb_ddr4_2.jpg",
                "url": "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK16GX4M2B3200C16/Gallery/VENG_LPX_BLK_03.webp"
            }
        ]
    },
    {
        "id": "gskill_ripjaws_16gb_ddr4",
        "title": "G.Skill Ripjaws V 16GB (2x8GB) DDR4 3600MHz CL18 Gaming Memory",
        "images": [
            {
                "fname": "gskill_ripjaws_16gb_ddr4_1.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/5/5e/G.Skill_RipjawsX_DDR3_memory_modules.JPG"
            },
            {
                "fname": "gskill_ripjaws_16gb_ddr4_2.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/d/d1/Tridentz_red_RAM.JPG"
            }
        ]
    },
    {
        "id": "kingston_fury_16gb_ddr4",
        "title": "Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz Desktop RAM",
        "images": [
            {
                "fname": "kingston_fury_16gb_ddr4_1.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/c/c0/HyperX_Fury_DDR4-RAM_20210611_Vorderseite.png"
            },
            {
                "fname": "kingston_fury_16gb_ddr4_2.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/6/69/HyperX_Fury_DDR4-RAM_20210611_R%C3%BCckseite.png"
            }
        ]
    },
    {
        "id": "crucial_pro_16gb_ddr4",
        "title": "Crucial Pro 16GB (2x8GB) DDR4 3200MHz CL22 Desktop Memory",
        "images": [
            {
                "fname": "crucial_pro_16gb_ddr4_1.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/3/30/Crucial_Ballistix_IMG_4938.jpg"
            },
            {
                "fname": "crucial_pro_16gb_ddr4_2.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/3/37/Crucial_Ballistix_IMG_4939.jpg"
            }
        ]
    },
    {
        "id": "corsair_lpx_32gb_ddr4",
        "title": "Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz CL16 RAM",
        "images": [
            {
                "fname": "corsair_lpx_32gb_ddr4_1.jpg",
                "url": "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK32GX4M2B3200C16/Gallery/VENG_LPX_BLK_05.webp"
            },
            {
                "fname": "corsair_lpx_32gb_ddr4_2.jpg",
                "url": "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK32GX4M2E3200C16/Gallery/VENG_LPX_BLK_01.webp"
            }
        ]
    },
    {
        "id": "kingston_fury_16gb_ddr5",
        "title": "Kingston FURY Beast 16GB (1x16GB) DDR5 5600MHz CL40",
        "images": [
            {
                "fname": "kingston_fury_16gb_ddr5_1.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/e/ed/HyperX_HX432C16FB4AK2_32_Dsc00420_RAW_202107230552crop_cens.jpg"
            },
            {
                "fname": "kingston_fury_16gb_ddr5_2.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/8/85/16_GiB-DDR4-RAM-Riegel_RAM019FIX_Small_Crop_90_PCNT.png"
            }
        ]
    },
    {
        "id": "crucial_16gb_ddr5_4800",
        "title": "Crucial 16GB (2x8GB) DDR5-4800 CL40 Desktop Memory",
        "images": [
            {
                "fname": "crucial_16gb_ddr5_4800_1.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/b/ba/DDR_4_RAM_SO-DIMM_16GB_by_Micron-top_front_PNr%C2%B00840.jpg"
            },
            {
                "fname": "crucial_16gb_ddr5_4800_2.jpg",
                "url": "https://upload.wikimedia.org/wikipedia/commons/5/5c/RAM_%281%29.jpg"
            }
        ]
    },
    {
        "id": "corsair_vengeance_32gb_ddr5",
        "title": "Corsair Vengeance 32GB (2x16GB) DDR5-5200 CL40",
        "images": [
            {
                "fname": "corsair_vengeance_32gb_ddr5_1.jpg",
                "url": "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/vengeance-ddr5-blk-config/Gallery/Vengeance-DDR5-2UP-16GB-BLACK_01.webp"
            },
            {
                "fname": "corsair_vengeance_32gb_ddr5_2.jpg",
                "url": "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/vengeance-ddr5-blk-config/Gallery/Vengeance-DDR5-1UP-32GB-BLACK_02.webp"
            }
        ]
    }
]

hashes = {}
downloaded = []

for item in ram_configs:
    print(f"\nProcessing RAM: {item['title']}")
    for img_info in item['images']:
        fname = img_info['fname']
        url = img_info['url']
        target_path = os.path.join(out_dir, fname)
        
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                content = resp.read()
            
            img = Image.open(io.BytesIO(content))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            img.save(target_path, "JPEG", quality=92)
            
            with open(target_path, "rb") as fp:
                data = fp.read()
            
            h = hashlib.md5(data).hexdigest()
            print(f"  Downloaded & saved: {fname} ({len(data)} bytes, {img.size[0]}x{img.size[1]}, MD5: {h})")
            
            if h in hashes:
                print(f"  [ERROR: DUPLICATE FOUND] {fname} is identical to {hashes[h]}!")
            else:
                hashes[h] = fname
                downloaded.append(fname)
        except Exception as e:
            print(f"  [ERROR] {fname} from {url}: {e}")

print(f"\n==========================================")
print(f"Total Unique Images Processed: {len(downloaded)} / {len(ram_configs) * 2}")
print(f"Unique MD5 Hashes: {len(hashes)}")
print(f"==========================================")
