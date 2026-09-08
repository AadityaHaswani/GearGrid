import urllib.request
import json
import urllib.parse

def search_wm_files(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srsearch={urllib.parse.quote(query)}&srlimit={limit}"
    req = urllib.request.Request(url, headers={'User-Agent': 'GearGridBot/1.0 (contact@geargrid.com)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            results = data.get('query', {}).get('search', [])
            titles = [r['title'] for r in results]
            return titles
    except Exception as e:
        print(f"Error: {e}")
        return []

def get_image_urls(titles):
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
        print(f"Error getting info: {e}")
        return []

queries = [
    "DDR4 SDRAM",
    "Corsair Vengeance",
    "G.Skill Ripjaws",
    "Kingston Fury",
    "Crucial DDR4",
    "HyperX DDR4",
    "DIMM RAM",
    "Computer RAM module"
]

for q in queries:
    titles = search_wm_files(q, limit=5)
    imgs = get_image_urls(titles)
    print(f"\nQuery: {q} ({len(imgs)} images)")
    for img in imgs:
        print(f"  [{img['width']}x{img['height']}] {img['title']}")
        print(f"    {img['url']}")
