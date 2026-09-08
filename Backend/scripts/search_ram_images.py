import urllib.request
import json
import urllib.parse

def search_wikimedia(query, limit=15):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime"
    req = urllib.request.Request(url, headers={'User-Agent': 'GearGridBot/1.0 (contact@geargrid.com)'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, page in pages.items():
                title = page.get('title', '')
                info = page.get('imageinfo', [{}])[0]
                img_url = info.get('url', '')
                mime = info.get('mime', '')
                width = info.get('width', 0)
                height = info.get('height', 0)
                if img_url and 'image' in mime:
                    results.append({'title': title, 'url': img_url, 'width': width, 'height': height})
            return results
    except Exception as e:
        print(f"Error searching for {query}: {e}")
        return []

queries = [
    "Corsair Vengeance",
    "G.Skill Ripjaws",
    "Kingston Fury",
    "Crucial RAM",
    "Crucial Pro DDR4",
    "HyperX Fury",
    "DDR4 RAM module",
    "DDR5 RAM module",
    "Corsair DDR4",
    "Kingston DDR4",
    "G.Skill DDR4",
    "Desktop RAM kit"
]

for q in queries:
    res = search_wikimedia(q, limit=8)
    print(f"\n=== Query: {q} ({len(res)} results) ===")
    for r in res:
        print(f"  [{r['width']}x{r['height']}] {r['title']}")
        print(f"    URL: {r['url']}")
