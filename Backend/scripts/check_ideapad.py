import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'GearGridBot/1.0 (admin@geargrid.local; testing)'}

files = [
    "File:Lenovo IdeaPad Y510p 4.jpg",
    "File:Lenovo IdeaPad Y510p 5.jpg",
    "File:Lenovo IdeaPad Y560 (1).jpg",
    "File:Lenovo IdeaPad Y560 (2).jpg",
    "File:Lenovo IdeaPad Gaming 3 15ACH6.jpg",
    "File:Lenovo Legion 5 15ACH6H.jpg"
]

pipe_titles = "|".join(files)
api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(pipe_titles)}&prop=imageinfo&iiprop=url|size&format=json"

req = urllib.request.Request(api_url, headers=headers)
with urllib.request.urlopen(req, timeout=15) as resp:
    data = json.loads(resp.read().decode('utf-8'))
    for pid, pdata in data.get('query', {}).get('pages', {}).items():
        if pid != "-1":
            print(f"FOUND: {pdata['title']} -> {pdata['imageinfo'][0]['url']}")
