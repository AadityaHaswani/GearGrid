import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def search_files(query):
    headers = {
        'User-Agent': 'GearGridLaptopBot/1.0 (https://geargrid.local; admin@geargrid.local)'
    }
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url|size|mime&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        results = []
        for p in pages.values():
            info = p.get('imageinfo', [{}])[0]
            if 'image' in info.get('mime', ''):
                results.append((p['title'], info.get('url'), info.get('width'), info.get('height')))
        return results
    except Exception as e:
        print(f"Error {query}: {e}")
        return []

terms = ['Zephyrus', 'HP Omen', 'Lenovo Legion', 'Predator laptop', 'Alienware laptop', 'MSI laptop', 'ThinkPad', 'Yoga laptop']
for t in terms:
    res = search_files(t)
    print(f"\n=== {t} ({len(res)} files) ===")
    for title, url, w, h in res[:6]:
        print(f"  * {title} ({w}x{h})")
