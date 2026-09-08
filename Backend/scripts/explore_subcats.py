import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def get_category_members(cmtitle):
    headers = {
        'User-Agent': 'GearGridLaptopBot/1.0 (https://geargrid.local; admin@geargrid.local)'
    }
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle={urllib.parse.quote(cmtitle)}&cmnamespace=6|14&cmlimit=50&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        members = data.get('query', {}).get('categorymembers', [])
        return members
    except Exception as e:
        print(f"Error fetching {cmtitle}: {e}")
        return []

subcats = [
    "Category:Acer Predator Helios 16",
    "Category:HP Omen Transcend 16",
    "Category:Lenovo ThinkPad E14",
    "Category:Lenovo Yoga Pro 7i",
    "Category:Alienware x16 R2",
    "Category:MacBook Air M2",
    "Category:MacBook Air M3",
    "Category:MacBook Pro M4 Max",
    "Category:HP Omen laptops"
]

for cat in subcats:
    members = get_category_members(cat)
    print(f"\n=== {cat} ({len(members)} items) ===")
    for m in members:
        print(f"  * {m['title']}")
