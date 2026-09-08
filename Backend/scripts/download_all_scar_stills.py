import urllib.request
import urllib.parse
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
headers = {'User-Agent': 'GearGridBot/2.0 (admin@geargrid.local)'}

out_dir = os.path.abspath('Frontend/public/images/laptops/geekerwan_scar')
os.makedirs(out_dir, exist_ok=True)

titles = [f"File:Der ASUS ROG Strix Scar-Laptop im Hands-on (极客湾Geekerwan) {i:02d}.png" for i in range(1, 18)]

pipe_titles = "|".join(titles)
api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(pipe_titles)}&prop=imageinfo&iiprop=url|size&format=json"

req = urllib.request.Request(api_url, headers=headers)
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))

for pid, pdata in data.get('query', {}).get('pages', {}).items():
    if pid != "-1" and 'imageinfo' in pdata and pdata['imageinfo']:
        t = pdata['title']
        url = pdata['imageinfo'][0]['url']
        num = t.split(') ')[-1].replace('.png', '')
        dest = os.path.join(out_dir, f"scar_{num}.png")
        try:
            r = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(r, timeout=15) as res:
                with open(dest, 'wb') as f:
                    f.write(res.read())
                print(f"Saved scar_{num}.png")
        except Exception as e:
            print(f"Error scar_{num}: {e}")
