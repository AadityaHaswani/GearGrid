import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
headers = {'User-Agent': 'GearGridBot/2.0 (admin@geargrid.local)'}

query = 'ASUS ROG Strix'
url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json&srlimit=40"

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))

titles = [item['title'] for item in data.get('query', {}).get('search', [])]
print(f"Found {len(titles)} files:")
for t in titles:
    print(f"  - {t}")
