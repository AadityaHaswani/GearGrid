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

categories = [
    "Category:Acer Nitro laptops",
    "Category:Acer Predator laptops",
    "Category:Asus ROG laptops",
    "Category:Asus ZenBook",
    "Category:Lenovo Legion laptops",
    "Category:Lenovo ThinkPad",
    "Category:Lenovo Yoga",
    "Category:HP Omen",
    "Category:Alienware laptops",
    "Category:Micro-Star International laptops",
    "Category:MacBook Air (Apple silicon)",
    "Category:MacBook Pro (Apple silicon)"
]

for cat in categories:
    members = get_category_members(cat)
    print(f"\n=== {cat} ({len(members)} items) ===")
    for m in members:
        if m['ns'] == 6: # File
            print(f"  * {m['title']}")
        elif m['ns'] == 14: # Subcategory
            print(f"  > [SUB] {m['title']}")
