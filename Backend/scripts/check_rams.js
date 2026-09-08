import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

import '../src/models/category.models.js';
import { Product } from '../src/models/product.models.js';
import { Category } from '../src/models/category.models.js';

async function listRams() {
  await mongoose.connect(process.env.MONGO_URI);
  const ramCat = await Category.findOne({ name: /memory|ram/i }).lean();
  console.log('RAM Category:', ramCat?.name, ramCat?._id);

  const rams = await Product.find({ category: ramCat._id }).populate('category').lean();
  console.log('Total RAM products in DB:', rams.length);
  
  const allImages = [];
  rams.forEach((r, idx) => {
    console.log(`\n${idx + 1}. [${r._id}] ${r.title}`);
    console.log(`   Brand: ${r.brand} | Model: ${r.specifications?.model || ''} | Specs: ${r.specifications?.capacity}GB ${r.specifications?.memoryType} ${r.specifications?.speed}MHz`);
    console.log(`   Images:`, r.images);
    if (r.images) allImages.push(...r.images);
  });

  const uniqueImages = new Set(allImages);
  console.log(`\n========================================`);
  console.log(`Total RAM products: ${rams.length}`);
  console.log(`Total image entries across RAM: ${allImages.length}`);
  console.log(`Unique image URLs: ${uniqueImages.size}`);
  console.log(`Duplicate image URLs: ${allImages.length - uniqueImages.size}`);
  console.log(`========================================`);

  await mongoose.disconnect();
}

listRams();
