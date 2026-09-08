import dotenv from 'dotenv';
dotenv.config();
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [{ url: String, publicId: String }],
  brand: String,
  price: Number
});
const categorySchema = new mongoose.Schema({ name: String, slug: String });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const ramCat = await Category.findOne({ name: 'Memory / RAM' });
  const allRams = await Product.find({ category: ramCat._id });

  console.log(`Checking HTTP status for all ${allRams.length} RAM products...`);
  let brokenCount = 0;

  for (const ram of allRams) {
    console.log(`\nChecking: "${ram.title}"`);
    for (const [idx, img] of ram.images.entries()) {
      let fullUrl = img.url;
      if (fullUrl.startsWith('/')) {
        fullUrl = `http://localhost:5173${fullUrl}`;
      }
      try {
        const res = await fetch(fullUrl, { method: 'HEAD' });
        const contentType = res.headers.get('content-type') || '';
        const contentLength = res.headers.get('content-length') || '';
        if (res.ok && contentType.startsWith('image/')) {
          console.log(`  [${idx + 1}] OK (${res.status}) - ${contentType} (${contentLength} bytes) -> ${img.url}`);
        } else if (res.ok) {
          // If HEAD doesn't return image content-type, try GET
          const getRes = await fetch(fullUrl);
          const getCt = getRes.headers.get('content-type') || '';
          if (getRes.ok && getCt.startsWith('image/')) {
            console.log(`  [${idx + 1}] OK (${getRes.status}) - ${getCt} -> ${img.url}`);
          } else {
            console.error(`  [${idx + 1}] ❌ FAILED (${getRes.status}) - Content-Type: ${getCt} -> ${img.url}`);
            brokenCount++;
          }
        } else {
          console.error(`  [${idx + 1}] ❌ FAILED (${res.status}) -> ${img.url}`);
          brokenCount++;
        }
      } catch (e) {
        console.error(`  [${idx + 1}] ❌ ERROR: ${e.message} -> ${img.url}`);
        brokenCount++;
      }
    }
  }

  console.log(`\n========================================`);
  console.log(`HTTP Check Completed. Broken URLs: ${brokenCount}`);
  console.log(`========================================`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
