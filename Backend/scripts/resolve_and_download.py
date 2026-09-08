import urllib.request
import urllib.parse
import json
import os
import time

headers = {
    'User-Agent': 'GearGridImageResolver/1.0 (admin@geargrid.local; testing laptop images)'
}

def search_wikimedia(query, limit=5):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit={limit}&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            results = []
            for pid, pdata in pages.items():
                title = pdata.get('title', '')
                ii = pdata.get('imageinfo', [{}])[0]
                img_url = ii.get('url', '')
                mime = ii.get('mime', '')
                size = ii.get('size', 0)
                if 'image' in mime:
                    results.append({'title': title, 'url': img_url, 'size': size})
            return results
    except Exception as e:
        print(f"Error searching {query}: {e}")
        return []

queries = [
    "MacBook Air M2 Midnight",
    "MacBook Air M3",
    "MacBook Air 15",
    "MacBook Pro 14 M4",
    "MacBook Pro 16 M4",
    "ThinkPad E14",
    "Dell Inspiron 14",
    "HP Spectre x360",
    "Yoga Slim 7",
    "Asus Zenbook 14",
    "Lenovo LOQ",
    "HP Victus 16",
    "Legion 5i",
    "MSI Katana 15",
    "HP Omen 16",
    "Legion Pro 5",
    "Legion Pro 7i",
    "Legion 9i"
]

for q in queries:
    print(f"\n--- Query: {q} ---")
    res = search_wikimedia(q, limit=4)
    for r in res:
        print(f"  Title: {r['title']}")
        print(f"  URL: {r['url']}")
    time.sleep(1.2)
