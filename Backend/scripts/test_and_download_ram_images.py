import os
import urllib.request
import hashlib
from PIL import Image
import io

ram_specs = [
    {
        "id": "corsair_lpx_8gb_ddr4",
        "title": "Corsair Vengeance LPX 8GB (1x8GB) DDR4 3200MHz CL16",
        "urls": [
            "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK16GX4M2B3200C16/Gallery/VENG_LPX_BLK_05.webp",
            "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK8GX4M1A2400C16/Gallery/VENG_LPX_BLK_03.webp"
        ]
    },
    {
        "id": "corsair_lpx_16gb_ddr4",
        "title": "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz CL16 Desktop RAM",
        "urls": [
            "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK16GX4M2B3200C16/Gallery/VENG_LPX_BLK_01.webp",
            "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK16GX4M2B3200C16/Gallery/VENG_LPX_BLK_02.webp"
        ]
    },
    {
        "id": "gskill_ripjaws_16gb_ddr4",
        "title": "G.Skill Ripjaws V 16GB (2x8GB) DDR4 3600MHz CL18 Gaming Memory",
        "urls": [
            "https://mdcomputers.in/image/catalog/memory/g%20skill/f4-3200c16s-32gvk/f4-3200c16s-32gvk-image-main.webp",
            "https://elitehubs.com/cdn/shop/products/f4-3200c16d-32gvk-image-main-600x600-1-2.jpg?v=1695336473&width=533"
        ]
    },
    {
        "id": "kingston_fury_16gb_ddr4",
        "title": "Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz Desktop RAM",
        "urls": [
            "https://computechstore.in/media/uploads/wp/2022/12/Fury-best-DDR4-Black-1.jpg",
            "https://rukminim2.flixcart.com/image/480/480/xif0q/ram/w/y/m/fury-beast-ddr4-3200mhz-sdram-kingston-original-imahbmavddmewsgf.jpeg?q=80"
        ]
    },
    {
        "id": "crucial_pro_16gb_ddr4",
        "title": "Crucial Pro 16GB (2x8GB) DDR4 3200MHz CL22 Desktop Memory",
        "urls": [
            "https://assets.micron.com/adobe/assets/urn:aaid:aem:106d29f7-1968-4ae4-9879-378b062df495/renditions/transformpng-1024-1024.png/as/crucial-ddr4-pro-udimm-kit-front.png",
            "https://assets.micron.com/adobe/assets/urn:aaid:aem:e44a81a5-8612-449d-a944-dfcf4d541e00/original/as/crucial-DDR4-pro-gallery-image-2.jpg"
        ]
    },
    {
        "id": "corsair_lpx_32gb_ddr4",
        "title": "Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz CL16 RAM",
        "urls": [
            "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK32GX4M2E3200C16/Gallery/VENG_LPX_BLK_01.webp",
            "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/CMK32GX4M2E3200C16/Gallery/VENG_LPX_BLK_04.webp"
        ]
    },
    {
        "id": "kingston_fury_16gb_ddr5",
        "title": "Kingston FURY Beast 16GB (1x16GB) DDR5 5600MHz CL40",
        "urls": [
            "https://mdcomputers.in/image/catalog/memory/kinsgton/kf556c40bb-16/kf556c40bb-16-image-main.webp",
            "https://krgkart.com/wp-content/uploads/2025/05/Kingston-Fury-Beast-RGB-32GB-2x16GB-5200MHz-DDR5-RAM-Black-KF552C40BBAK2-32-2-krgkart.jpg"
        ]
    },
    {
        "id": "crucial_16gb_ddr5_4800",
        "title": "Crucial 16GB (2x8GB) DDR5-4800 CL40 Desktop Memory",
        "urls": [
            "https://assets.micron.com/adobe/assets/urn:aaid:aem:12d3ef27-4ef6-4cab-9fa8-18199bcffffd/original/as/crucial-ddr5-classic-desktop-gallery-image-2-performance.jpg",
            "https://mdcomputers.in/image/catalog/memory/crucial/ct16g48c40u5/ct16g48c40u5-image-main.jpg"
        ]
    },
    {
        "id": "corsair_vengeance_32gb_ddr5",
        "title": "Corsair Vengeance 32GB (2x16GB) DDR5-5200 CL40",
        "urls": [
            "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/vengeance-ddr5-blk-config/Gallery/Vengeance-DDR5-2UP-16GB-BLACK_01.webp",
            "https://assets.corsair.com/image/upload/c_pad,q_auto,h_1024,w_1024,f_auto/products/Memory/vengeance-ddr5-blk-config/Gallery/Vengeance-DDR5-1UP-32GB-BLACK_02.webp"
        ]
    }
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://www.google.com/'
}

out_dir = r"c:\Users\adity\OneDrive\Desktop\GearGrid\Frontend\public\images\affordable"
os.makedirs(out_dir, exist_ok=True)

hashes = {}
downloaded_count = 0
errors = []

for item in ram_specs:
    print(f"\nProcessing: {item['title']} ({item['id']})")
    for idx, url in enumerate(item['urls']):
        fname = f"{item['id']}_{idx + 1}.jpg"
        target_path = os.path.join(out_dir, fname)
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=12) as response:
                content = response.read()
            
            # Convert to clean RGB JPEG
            img = Image.open(io.BytesIO(content))
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            img.save(target_path, "JPEG", quality=92)
            
            with open(target_path, "rb") as fp:
                saved_data = fp.read()
            
            h = hashlib.md5(saved_data).hexdigest()
            print(f"  Saved {fname} ({len(saved_data)} bytes, {img.size[0]}x{img.size[1]}, MD5: {h})")
            
            if h in hashes:
                print(f"  [WARNING DUPLICATE] with {hashes[h]}")
                errors.append(f"Duplicate {fname} with {hashes[h]}")
            hashes[h] = fname
            downloaded_count += 1
        except Exception as e:
            print(f"  [ERROR] Failed downloading {url}: {e}")
            errors.append(f"Failed {fname}: {e}")

print(f"\n==========================================")
print(f"Total downloaded: {downloaded_count} / {len(ram_specs) * 2}")
print(f"Unique MD5 hashes: {len(hashes)}")
print(f"Total errors/duplicates: {len(errors)}")
print(f"==========================================")
