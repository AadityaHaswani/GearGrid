import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def search_commons(query):
    headers = {
        'User-Agent': 'GearGridLaptopBot/1.0 (https://geargrid.local; admin@geargrid.local)'
    }
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=50&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        results = []
        for p in pages.values():
            info = p.get('imageinfo', [{}])[0]
            mime = info.get('mime', '')
            if 'image' in mime:
                results.append((p.get('title'), info.get('url'), info.get('width'), info.get('height')))
        return results
    except Exception as e:
        print(f"Error searching {query}: {e}")
        return []

for q in ['Geekerwan laptop', '极客湾', 'Hands-on laptop', 'gaming laptop']:
    res = search_commons(q)
    print(f"\n=== Search '{q}' ({len(res)} results) ===")
    for title, url, w, h in res[:15]:
        print(f"  * {title} ({w}x{h})")
