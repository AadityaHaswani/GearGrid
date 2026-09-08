import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'GearGridBot/1.0 (admin@geargrid.local; testing)'}

def search(q):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|size&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        print(f"\nResults for '{q}':")
        for pid, pdata in pages.items():
            title = pdata.get('title', '')
            url = pdata.get('imageinfo', [{}])[0].get('url', '')
            print(f"  {title}")
    except Exception as e:
        print(f"Error {q}: {e}")

search("Lenovo Yoga laptop")
search("Lenovo IdeaPad Y500")
search("Lenovo Legion laptop")
