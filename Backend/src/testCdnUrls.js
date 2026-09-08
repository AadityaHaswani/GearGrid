import https from "https";

function testUrl(url) {
  return new Promise((resolve) => {
    https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    }, (res) => {
      resolve({ url, status: res.statusCode, type: res.headers["content-type"], len: res.headers["content-length"] });
    }).on("error", (e) => resolve({ url, status: 500, error: e.message }));
  });
}

async function run() {
  const testUrls = [
    // Amazon image CDN
    "https://m.media-amazon.com/images/I/71TPda7cwUL._SL1500_.jpg", // MacBook Air M2
    "https://m.media-amazon.com/images/I/81Fm0tRFdHL._SL1500_.jpg", // MacBook Air M2 angle
    "https://m.media-amazon.com/images/I/61-r9zOKBCL._SL1500_.jpg", // MacBook Pro M3
    // ASUS CDN
    "https://dlcdnwebimgs.asus.com/gain/498C0B2A-3A6E-4F3D-9473-7740EE23EE74/w800",
    // Flipkart CDN
    "https://rukminim2.flixcart.com/image/832/832/xif0q/computer/m/b/n/-original-imagfdf4xnbyyxpa.jpeg",
    // Unsplash
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
  ];

  for (const u of testUrls) {
    const r = await testUrl(u);
    console.log(r.status, r.type, r.len, r.url.slice(0, 60));
  }
}

run();
