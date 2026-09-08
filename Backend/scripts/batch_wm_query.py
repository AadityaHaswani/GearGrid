import urllib.request
import urllib.parse
import json
import os
import sys

headers = {'User-Agent': 'GearGridBot/1.0 (admin@geargrid.local; educational catalog)'}

test_files = [
    "File:M2 Macbook Air Midnight model - 1.jpg",
    "File:M2 Macbook Air Midnight model - 2.jpg",
    "File:MacBook Air (A2681) front.jpg",
    "File:MacBook Air (A2681) rear.jpg",
    "File:M2 Macbook Air Starlight model.jpg",
    "File:Macbook Air 15 inch - 1.jpg",
    "File:MacBook Pro (14-inch, M5, Space Black).jpg",
    "File:Apple Macbook Pro 14\" 2021 - Keyboard.png",
    "File:MacBook Pro (16-inch, M4 Pro, Silver).jpg",
    "File:Apple MacBook Pro 16\" M2 Max.jpg",
    "File:Asus Zenbook UX32V-8994.jpg",
    "File:Asus Zenbook UX32V-8995.jpg",
    "File:Lenovo ThinkPad E14 G7 14 WUXGA.jpg",
    "File:ThinkPad X1 Carbon gen7 (0).jpg",
    "File:Dell Inspiron 16 5645.jpg",
    "File:Dell Inspiron 7472.jpg",
    "File:Hp Spectre x360.jpg",
    "File:Hp Spectre x360 13t.jpg",
    "File:Yoga Slim 7x.jpg",
    "File:Lenovo Yoga 2 Pro (Silver Gray).jpg",
    "File:Lenovo Legion Y7000P Eclipse Gray Laptop.jpg",
    "File:Lenovo Legion Y520 (1).jpg",
    "File:Lenovo IdeaPad Y510p 1.jpg",
    "File:Lenovo IdeaPad Y510p 2.jpg",
    "File:HP Victus laptop 2.jpg",
    "File:HP Victus laptop.jpg",
    "File:Predator Helios 300 20221224.jpg",
    "File:Acer Predator Helios 300 back panel open.jpg",
    "File:Lenovo legion (laptop) & Lenovo 400 Wireless (Mouse) IMG 6309ab.jpg",
    "File:ASUS ROG Strix G15 (G513QY-HQ012T)-front oblique PNr°0884.jpg",
    "File:ASUS ROG Strix G15 (G513QY-HQ012T)-top keyboard WASD PNr°0888.jpg",
    "File:ASUS ROG Strix G15 (G513QY-HQ012T)-top cover PNr°0885.jpg",
    "File:My Omen - keyboard.jpg",
    "File:MSI Bravo 17 (0017FK-007)-front oblique PNr°0757.jpg",
    "File:MSI Bravo 17 (0017FK-007)-top keyboard PNr°0758.jpg",
    "File:Asus ROG Phone 2 and Acer Predator Helios 700 20201101.jpg",
    "File:MSI GT76 Titan 20190601.jpg",
    "File:MSI Gaming Laptop on wood floor.jpg"
]

pipe_titles = "|".join(test_files)
api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(pipe_titles)}&prop=imageinfo&iiprop=url|size|mime&format=json"

req = urllib.request.Request(api_url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data.get('query', {}).get('pages', {})
        print(f"Total pages returned: {len(pages)}")
        found = {}
        missing = []
        for pid, pdata in pages.items():
            title = pdata.get('title', '')
            if pid != "-1" and 'imageinfo' in pdata and pdata['imageinfo']:
                found[title] = pdata['imageinfo'][0]['url']
            else:
                missing.append(title)
        
        print("\n--- FOUND FILES ---")
        for t, u in found.items():
            print(f"  {t} -> {u}")
        
        print("\n--- MISSING FILES ---")
        for m in missing:
            print(f"  {m}")

except Exception as e:
    print(f"Error: {e}")
