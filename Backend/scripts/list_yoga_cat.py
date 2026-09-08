import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

headers = {'User-Agent': 'GearGridBot/1.0 (admin@geargrid.local; testing)'}

def get_cat(cmtitle):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle={urllib.parse.quote(cmtitle)}&cmnamespace=6|14&cmlimit=50&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
        return data.get('query', {}).get('categorymembers', [])
    except Exception as e:
        print(f"Error {cmtitle}: {e}")
        return []

cats = ["Category:Lenovo Yoga", "Category:IdeaPad Y series"]
for c in cats:
    print(f"\n=== {c} ===")
    for item in get_cat(c):
        print(f"  {item['title']}")
