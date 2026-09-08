import urllib.request
import urllib.parse
import json
import os

headers = {'User-Agent': 'GearGridBot/1.0 (admin@geargrid.local; testing)'}
out_dir = os.path.abspath('Frontend/public/images/laptops')

replacements = [
    {
        "file": "lenovo_yoga_slim_7x_1.jpg",
        "title": "File:Lenovo Yoga 530 Opening English Wikipedia (cropped, perspective corrected).jpg"
    },
    {
        "file": "lenovo_loq_15irx9_2.jpg",
        "title": "File:Lenovo IdeaPad Y510p 3.jpg"
    }
]

pipe_titles = "|".join([r['title'] for r in replacements])
api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(pipe_titles)}&prop=imageinfo&iiprop=url&format=json"

req = urllib.request.Request(api_url, headers=headers)
with urllib.request.urlopen(req, timeout=15) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    for pid, pdata in data.get('query', {}).get('pages', {}).items():
        title = pdata.get('title', '')
        if 'imageinfo' in pdata:
            img_url = pdata['imageinfo'][0]['url']
            for r in replacements:
                if r['title'] == title:
                    dest = os.path.join(out_dir, r['file'])
                    print(f"Downloading replacement for {r['file']} from {img_url}...")
                    r_req = urllib.request.Request(img_url, headers=headers)
                    with urllib.request.urlopen(r_req, timeout=25) as img_resp:
                        with open(dest, 'wb') as f:
                            f.write(img_resp.read())
                    print(f"Saved {dest} ({os.path.getsize(dest)//1024} KB)")

