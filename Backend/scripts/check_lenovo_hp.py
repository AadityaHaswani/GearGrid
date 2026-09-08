import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def get_category_members(cmtitle):
    headers = {
        'User-Agent': 'GearGridLaptopBot/1.0 (https://geargrid.local; admin@geargrid.local)'
    }
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle={urllib.parse.quote(cmtitle)}&cmnamespace=6|14&cmlimit=100&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        return data.get('query', {}).get('categorymembers', [])
    except Exception as e:
        print(f"Error fetching {cmtitle}: {e}")
        return []

cats = [
    "Category:Lenovo laptops",
    "Category:IdeaPad Y series",
    "Category:Hewlett-Packard laptops",
    "Category:HP Pavilion Gaming 16",
    "Category:Asus laptops",
    "Category:Acer Predator laptops"
]

for c in cats:
    print(f"\n=== {c} ===")
    for item in get_category_members(c):
        prefix = "> [SUB]" if item['ns'] == 14 else "* [FILE]"
        print(f"  {prefix} {item['title']}")
