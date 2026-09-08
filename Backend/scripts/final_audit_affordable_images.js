import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

const productSchema = new mongoose.Schema({
  title: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  price: Number,
  images: [{ url: String, publicId: String }]
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const categorySchema = new mongoose.Schema({ name: String }, { strict: false });
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

async function runAudit() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const products = await Product.find({}).populate('category');
  console.log('Total products in DB:', products.length);

  let affordableCount = 0;
  let affordableImagesCount = 0;
  const affordableUrlSet = new Set();
  const duplicateUrls = [];
  const brokenLocalUrls = [];
  const affordableCategories = {};

  const publicDir = path.resolve('../Frontend/public');

  for (const p of products) {
    const isAffordable = p.images && p.images.some(img => img.url && img.url.startsWith('/images/affordable/'));
    if (isAffordable) {
      affordableCount++;
      const catName = p.category?.name || 'Unknown';
      affordableCategories[catName] = (affordableCategories[catName] || 0) + 1;

      for (const img of p.images) {
        affordableImagesCount++;
        if (affordableUrlSet.has(img.url)) {
          duplicateUrls.push({ product: p.title, url: img.url });
        }
        affordableUrlSet.add(img.url);

        const localPath = path.join(publicDir, img.url.replace(/^\//, ''));
        if (!fs.existsSync(localPath) || fs.statSync(localPath).size < 5000) {
          brokenLocalUrls.push({ product: p.title, url: img.url, exists: fs.existsSync(localPath) });
        }
      }
    }
  }

  console.log('\n=============================================');
  console.log('         AFFORDABLE PRODUCTS AUDIT           ');
  console.log('=============================================');
  console.log(`New Products Checked : ${affordableCount}`);
  console.log(`Images Added         : ${affordableImagesCount}`);
  console.log(`Unique Image Count   : ${affordableUrlSet.size}`);
  console.log(`Duplicates           : ${duplicateUrls.length}`);
  console.log(`Broken URLs          : ${brokenLocalUrls.length}`);
  console.log('---------------------------------------------');
  console.log('Category Breakdown:', affordableCategories);
  console.log('=============================================');

  await mongoose.disconnect();
}

runAudit();
