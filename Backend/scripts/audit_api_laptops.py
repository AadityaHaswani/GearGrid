import urllib.request
import json

url = 'http://localhost:8000/api/v1/products?limit=150'
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as resp:
    res_data = json.loads(resp.read().decode('utf-8'))

# Products might be in res_data['data'] or res_data['data']['products'] or res_data['products']
products = []
if isinstance(res_data.get('data'), list):
    products = res_data['data']
elif isinstance(res_data.get('data'), dict) and 'products' in res_data['data']:
    products = res_data['data']['products']
elif 'products' in res_data:
    products = res_data['products']

print(f"Total products fetched: {len(products)}")

laptops = [p for p in products if p.get('productType') == 'laptop' or 'laptop' in str(p.get('category', {})).lower() or 'mac' in str(p.get('category', {})).lower()]
print(f"Total laptops found: {len(laptops)}")

broken = 0
for i, lp in enumerate(laptops, 1):
    imgs = lp.get('images', [])
    title = lp.get('title') or lp.get('name')
    urls = [img.get('url') if isinstance(img, dict) else img for img in imgs]
    print(f"[{i:02d}] {title[:55]}...")
    print(f"     Images ({len(urls)}): {urls}")
    if len(urls) < 2 or not all(u and u.startswith('/images/laptops/') for u in urls):
        broken += 1

print("\n-------------------------------------------")
print(f"Laptops with valid 2 local images: {len(laptops) - broken}/{len(laptops)}")
print(f"Broken/Uncorrected laptops: {broken}")
print("-------------------------------------------")
