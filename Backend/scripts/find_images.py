import urllib.request
import urllib.parse
import json
import re
import sys

def search_ddg_images(query):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    url = 'https://duckduckgo.com/?q=' + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers=headers)
    try:
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
        m = re.search(r'vqd=([0-9-]+)', html)
        if not m:
            m = re.search(r'vqd="([0-9-]+)"', html)
        if not m:
            print('No vqd found for', query)
            return []
        vqd = m.group(1)
        
        i_url = f'https://duckduckgo.com/i.js?l=wt-wt&o=json&q={urllib.parse.quote(query)}&vqd={vqd}&f=,,,&p=1'
        i_req = urllib.request.Request(i_url, headers=headers)
        data = json.loads(urllib.request.urlopen(i_req, timeout=10).read().decode('utf-8'))
        results = []
        for r in data.get('results', []):
            img = r.get('image')
            title = r.get('title', '')
            if img:
                results.append((title, img))
        return results
    except Exception as e:
        print('Error searching', query, ':', e)
        return []

if __name__ == '__main__':
    query = ' '.join(sys.argv[1:]) if len(sys.argv) > 1 else 'Lenovo LOQ 15 gaming laptop'
    res = search_ddg_images(query)
    print(f'Found {len(res)} for {query}:')
    for title, img in res[:8]:
        print(f'  * {title} -> {img}')
