import urllib.request
import urllib.parse
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
headers = {'User-Agent': 'GearGridBot/2.0 (admin@geargrid.local)'}

stills = [
    f"File:Der ASUS ROG Strix Scar-Laptop im Hands-on (极客湾Geekerwan) {i:02d}.png" for i in [3, 4, 5, 6, 7, 8, 9, 12, 13, 14, 16, 17]
] + [
    "File:ROG Strix G16 2026-08-08 ASUS 01.jpg",
    "File:ROG Strix G16 2026-08-08 ASUS 02.jpg",
    "File:ROG Strix G16 2026-08-08 ASUS 03.jpg",
    "File:ASUS ROG Strix G15 (G513QY-HQ012T)-front oblique PNr°0884.jpg",
    "File:ASUS ROG Strix G15 (G513QY-HQ012T)-top cover illuminated PNr°0886.jpg"
]

pipe_titles = "|".join(stills)
api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(pipe_titles)}&prop=imageinfo&iiprop=url|size&format=json"

req = urllib.request.Request(api_url, headers=headers)
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))

out_dir = os.path.abspath('Frontend/public/images/laptops/test_rog')
os.makedirs(out_dir, exist_ok=True)

for pid, pdata in data.get('query', {}).get('pages', {}).items():
    if pid != "-1" and 'imageinfo' in pdata and pdata['imageinfo']:
        t = pdata['title']
        url = pdata['imageinfo'][0]['url']
        fname = t.replace('File:', '').replace(' ', '_').replace('(', '').replace(')', '').replace('°', '')[:40] + '.jpg'
        dest = os.path.join(out_dir, fname)
        try:
            r = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(r, timeout=15) as res:
                content = res.read()
                with open(dest, 'wb') as f:
                    f.write(content)
                print(f"Downloaded {fname} ({len(content)} bytes)")
        except Exception as e:
            print(f"Error {fname}: {e}")
