import urllib.request, json, urllib.parse, sys

sys.stdout.reconfigure(encoding='utf-8')

def search(q):
    url = f'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srsearch={urllib.parse.quote(q)}&srlimit=10'
    req = urllib.request.Request(url, headers={'User-Agent': 'GearGridBot/1.0'})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        return [r['title'] for r in data.get('query', {}).get('search', [])]

def get_urls(titles):
    if not titles: return []
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&titles={urllib.parse.quote('|'.join(titles))}&prop=imageinfo&iiprop=url|size"
    req = urllib.request.Request(url, headers={'User-Agent': 'GearGridBot/1.0'})
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        res = []
        for pid, p in pages.items():
            if 'imageinfo' in p:
                res.append((p['title'], p['imageinfo'][0]['url']))
        return res

print('G.Skill:')
for title, u in get_urls(search('G.Skill')):
    print(f"  {title} -> {u}")

print('\nRipjaws:')
for title, u in get_urls(search('Ripjaws')):
    print(f"  {title} -> {u}")

print('\nTrident:')
for title, u in get_urls(search('Trident RAM')):
    print(f"  {title} -> {u}")
