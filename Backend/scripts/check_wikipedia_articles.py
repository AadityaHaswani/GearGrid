import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def get_page_images(title):
    headers = {
        'User-Agent': 'GearGridLaptopBot/1.0 (https://geargrid.local; admin@geargrid.local)'
    }
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=images&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        for p in pages.values():
            images = [img['title'] for img in p.get('images', [])]
            return images
    except Exception as e:
        print(f"Error fetching {title}: {e}")
        return []

articles = [
    "Lenovo Legion",
    "Alienware",
    "Republic of Gamers",
    "Acer Predator",
    "HP Omen",
    "MacBook Air",
    "MacBook Pro",
    "ThinkPad",
    "Asus ZenBook"
]

for a in articles:
    imgs = get_page_images(a)
    print(f"\n=== Article: {a} ({len(imgs)} images) ===")
    for img in imgs:
        if any(ext in img.lower() for ext in ['.jpg', '.jpeg', '.png']):
            print(f"  * {img}")
