import urllib.request
import urllib.parse
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')
headers = {'User-Agent': 'GearGridBot/2.0 (admin@geargrid.local)'}

title = "File:ASUS ROG Strix G15 (G513QY-HQ012T)-top keyboard PNr°0887.jpg"
api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url|size&format=json"

req = urllib.request.Request(api_url, headers=headers)
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))

for pid, pdata in data.get('query', {}).get('pages', {}).items():
    if pid != "-1" and 'imageinfo' in pdata and pdata['imageinfo']:
        url = pdata['imageinfo'][0]['url']
        dest = os.path.abspath('Frontend/public/images/laptops/test_rog/asus_rog_keyboard.jpg')
        r = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(r, timeout=15) as res:
            with open(dest, 'wb') as f:
                f.write(res.read())
        print(f"Saved asus_rog_keyboard.jpg ({os.path.getsize(dest)} bytes)")
