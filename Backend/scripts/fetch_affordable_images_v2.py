import urllib.request
import urllib.parse
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

headers = {
    'User-Agent': 'GearGridHardwareCatalog/2.0 (admin@geargrid.local; educational catalog)'
}

def search_wikimedia(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=1000&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, page in pages.items():
                title = page.get('title', '')
                ii = page.get('imageinfo', [{}])[0]
                thumb_url = ii.get('thumburl', ii.get('url', ''))
                results.append({'title': title, 'url': thumb_url, 'size': ii.get('size', 0), 'mime': ii.get('mime', '')})
            return results
    except Exception as e:
        print(f"Error searching '{query}': {e}")
        return []

# Test searching some sample components
tests = [
    "RTX 3060",
    "RTX 3050",
    "RX 6600",
    "Core i5-12400",
    "Ryzen 5 5600",
    "LGA 1700 motherboard",
    "AM4 motherboard",
    "DDR4 RAM module",
    "M.2 NVMe SSD",
    "ATX power supply unit",
    "Computer case"
]

for t in tests:
    res = search_wikimedia(t, limit=4)
    print(f"Query: {t} -> {len(res)} results")
    for r in res[:2]:
        print(f"  {r['title']} -> {r['url']}")
