import urllib.request
import json
import urllib.parse
import sys

def search_wm_files(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srsearch={urllib.parse.quote(query)}&srlimit={limit}"
    req = urllib.request.Request(url, headers={'User-Agent': 'GearGridBot/1.0 (contact@geargrid.com)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = data.get('query', {}).get('search', [])
            return [r['title'] for r in results]
    except Exception as e:
        return []

def get_image_details(titles):
    if not titles:
        return []
    t_str = "|".join(titles)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={urllib.parse.quote(t_str)}&prop=imageinfo&iiprop=url|size|mime"
    req = urllib.request.Request(url, headers={'User-Agent': 'GearGridBot/1.0 (contact@geargrid.com)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            images = []
            for pid, page in pages.items():
                title = page.get('title', '')
                info = page.get('imageinfo', [{}])[0]
                img_url = info.get('url', '')
                mime = info.get('mime', '')
                width = info.get('width', 0)
                height = info.get('height', 0)
                if img_url and 'image' in mime and not img_url.endswith('.svg') and not img_url.endswith('.tif'):
                    images.append({'title': title, 'url': img_url, 'width': width, 'height': height})
            return images
    except Exception as e:
        return []

terms = [
    "DDR4 RAM",
    "DDR5 RAM",
    "G.Skill Ripjaws",
    "Corsair Vengeance",
    "Kingston Fury",
    "Crucial RAM",
    "HyperX Fury",
    "Ballistix",
    "Trident Z",
    "RAM memory module"
]

for t in terms:
    titles = search_wm_files(t, 6)
    details = get_image_details(titles)
    print(f"\n--- Term: {t} ({len(details)} images) ---")
    for d in details:
        try:
            print(f"  [{d['width']}x{d['height']}] {d['title']}")
            print(f"    {d['url']}")
        except:
            pass
