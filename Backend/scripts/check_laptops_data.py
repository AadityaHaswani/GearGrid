import re
import os

with open('Backend/src/laptopSeedData.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all titles
titles = re.findall(r'title:\s*"([^"]+)"', content)
print(f"Total titles found: {len(titles)}")
for i, t in enumerate(titles, 1):
    print(f"[{i:02d}] {t}")
