import os
import hashlib

dir_path = r"c:\Users\adity\OneDrive\Desktop\GearGrid\Frontend\public\images\affordable"
files = [f for f in os.listdir(dir_path) if any(k in f for k in ['ddr4', 'ddr5', 'ram', 'lpx', 'fury', 'ripjaws', 'crucial_pro'])]

print(f"Found {len(files)} RAM files:")
hashes = {}
for f in sorted(files):
    full_path = os.path.join(dir_path, f)
    with open(full_path, "rb") as fp:
        data = fp.read()
    h = hashlib.md5(data).hexdigest()
    print(f"{f}: {len(data)} bytes, MD5: {h}")
    hashes.setdefault(h, []).append(f)

print("\nDuplicate groups:")
for h, flist in hashes.items():
    if len(flist) > 1:
        print(f"  MD5 {h}: {flist}")
