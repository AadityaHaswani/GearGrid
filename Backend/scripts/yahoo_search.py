import urllib.request
import urllib.parse
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

def search_yahoo_images(query):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
    url = 'https://images.search.yahoo.com/search/images?p=' + urllib.parse.quote(query)
    req = urllib.request.Request(url, headers=headers)
    try:
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
        matches = re.findall(r'imgurl=(https%3A%2F%2F[^&]+)', html)
        if not matches:
            # Check JSON blocks
            matches = re.findall(r'"imgurl":"(https:[^"]+)"', html)
        
        urls = []
        for m in matches:
            u = urllib.parse.unquote(m.replace('\\/', '/'))
            if u not in urls:
                urls.append(u)
        return urls
    except Exception as e:
        print(f"Error searching {query}: {e}")
        return []

if __name__ == '__main__':
    q = sys.argv[1] if len(sys.argv) > 1 else 'Lenovo LOQ 15 gaming laptop'
    res = search_yahoo_images(q)
    print(f"Results for '{q}' ({len(res)}):")
    for u in res[:10]:
        print(f"  * {u}")
