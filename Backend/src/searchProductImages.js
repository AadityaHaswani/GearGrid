import https from "https";

function getHtml(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(getHtml(res.headers.location));
      }
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => resolve(data));
    }).on("error", () => resolve(""));
  });
}

function searchDuck(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    }, (res) => {
      let data = "";
      res.on("data", c => data += c);
      res.on("end", () => {
        // extract uddg redirects
        const matches = [...data.matchAll(/uddg=([^&"']+)/g)].map(m => decodeURIComponent(m[1]));
        resolve(matches);
      });
    }).on("error", () => resolve([]));
  });
}

async function getImagesForLaptop(query) {
  const links = await searchDuck(`site:amazon.in ${query}`);
  const amazonLinks = links.filter(l => l.includes("amazon.in") && (l.includes("/dp/") || l.includes("/gp/product/")));
  if (amazonLinks.length === 0) return [];
  
  const pageHtml = await getHtml(amazonLinks[0]);
  const imgMatches = [...pageHtml.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/([a-zA-Z0-9_-]+)\._[A-Z0-9_,]+_\.jpg/g)].map(m => m[1]);
  const uniqueImgIds = [...new Set(imgMatches)].filter(id => id.length > 8 && !id.includes("icon") && !id.includes("play"));
  return uniqueImgIds.map(id => `https://m.media-amazon.com/images/I/${id}._SL1500_.jpg`);
}

async function run() {
  const testModels = [
    "Lenovo ThinkPad E16 Gen 2 Intel Core Ultra 7",
    "HP Spectre x360 14 Intel Core Ultra 7",
    "Dell Inspiron 16 Plus 7640",
    "Lenovo Yoga Slim 7x Snapdragon X Elite",
    "Lenovo LOQ 15IAX9 RTX 3050",
    "Acer Predator Helios Neo 16 PHN16-72"
  ];

  for (const model of testModels) {
    console.log(`Searching for: ${model}...`);
    const images = await getImagesForLaptop(model);
    console.log(`Found ${images.length} images:`);
    images.slice(0, 3).forEach(img => console.log("  ", img));
    console.log("");
  }
}

run();
