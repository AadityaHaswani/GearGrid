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
  console.log('RAM Category ID:', ramCat?._id);

  const rams = await Product.find({ category: ramCat._id });
  console.log('Total RAM products in DB:', rams.length);
  rams.forEach((r, idx) => {
    console.log(`\n[${idx + 1}] ID: ${r._id}`);
    console.log(`Title: ${r.title}`);
    console.log(`Brand: ${r.brand} | Price: ₹${r.price}`);
    console.log(`Images (${r.images.length}):`, r.images);
  });

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
