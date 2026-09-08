import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def test_lenovo(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8', errors='ignore')
        matches = list(set(re.findall(r'https://p[0-9]-ofp\.static\.pub/fes/cms/[0-9/]+/[a-zA-Z0-9_\-]+\.(?:png|jpg|webp)', html)))
        print(f"Matches for {url} ({len(matches)}):")
        for m in matches[:6]:
            print("  *", m)
        return matches
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

test_lenovo('https://www.lenovo.com/us/en/p/laptops/loq-laptops/lenovo-loq-15irx9/len101q0005')
