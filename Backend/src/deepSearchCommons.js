import https from "https";

function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=8&gsrsearch=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url|mime|size`;
  return new Promise((resolve) => {
    https.get(url, {
      headers: { "User-Agent": "GearGridImageDownloader/1.0 (aditya@geargrid.io)" }
    }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query?.pages || {};
          const results = Object.values(pages).map(p => ({
            title: p.title.replace("File:", ""),
            url: p.imageinfo?.[0]?.url,
            mime: p.imageinfo?.[0]?.mime,
            width: p.imageinfo?.[0]?.width,
            height: p.imageinfo?.[0]?.height
          })).filter(r => r.mime && (r.mime === "image/jpeg" || r.mime === "image/png") && r.url);
          resolve(results);
        } catch (e) {
          resolve([]);
        }
      });
    }).on("error", () => resolve([]));
  });
}

async function run() {
  const specificQueries = [
    "MacBook Air M2",
    "MacBook Air M3",
    "MacBook Pro 14",
    "MacBook Pro 16",
    "Lenovo ThinkPad",
    "ThinkPad X1 Carbon",
    "ASUS Zenbook",
    "ASUS Zenbook 14",
    "Dell Inspiron laptop",
    "Dell XPS 15 laptop",
    "HP Spectre x360",
    "Lenovo Yoga Slim",
    "Lenovo LOQ",
    "ASUS TUF Gaming",
    "HP Victus",
    "Acer Nitro 5",
    "Acer Nitro V 15",
    "Acer Predator Helios",
    "Lenovo Legion",
    "Lenovo Legion 5",
    "ASUS ROG Zephyrus",
    "MSI Katana",
    "HP Omen laptop",
    "ASUS ROG Strix",
    "ASUS ROG Strix SCAR",
    "Alienware laptop",
    "Alienware m15",
    "MSI Titan laptop",
    "MSI gaming laptop"
  ];

  for (const q of specificQueries) {
    const res = await searchCommons(q);
    console.log(`\n=== "${q}" (${res.length}) ===`);
    res.forEach(r => console.log(`  * ${r.title} | ${r.width}x${r.height} | ${r.url}`));
  }
}

run();
