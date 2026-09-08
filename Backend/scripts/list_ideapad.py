import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'GearGridBot/1.0 (admin@geargrid.local; testing)'}

def get_cat(cat):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=categorymembers&cmtitle={urllib.parse.quote(cat)}&cmnamespace=6&cmlimit=50&format=json"
    req = urllib.request.Request(url, headers=headers)
    data = json.loads(urllib.request.urlopen(req, timeout=10).read().decode('utf-8'))
    return [x['title'] for x in data.get('query', {}).get('categorymembers', [])]

print("IdeaPad Y files:", get_cat("Category:IdeaPad Y series"))
print("Lenovo IdeaPad files:", get_cat("Category:Lenovo IdeaPad"))
