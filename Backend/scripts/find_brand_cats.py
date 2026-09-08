import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def get_category_members(cmtitle):
    headers = {
        'User-Agent': 'GearGridLaptopBot/1.0 (https://geargrid.local; admin@geargrid.local)'
    }
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle={urllib.parse.quote(cmtitle)}&cmnamespace=14&cmlimit=50&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        return data.get('query', {}).get('categorymembers', [])
    except Exception as e:
        print(f"Error fetching {cmtitle}: {e}")
        return []

cats = ["Category:Laptops by brand", "Category:Gaming laptops"]
for c in cats:
    print(f"\n=== {c} ===")
    for sub in get_category_members(c):
        print(f"  > {sub['title']}")
