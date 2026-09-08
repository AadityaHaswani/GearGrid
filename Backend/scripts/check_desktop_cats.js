import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const categorySchema = new mongoose.Schema({ name: String }, { strict: false });
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const productSchema = new mongoose.Schema({
  title: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  price: Number
}, { strict: false });
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({ productType: { $ne: 'laptop' } }).populate('category');
  const catCounts = {};
  products.forEach(p => {
    const cname = p.category ? p.category.name : 'Unknown';
    catCounts[cname] = (catCounts[cname] || 0) + 1;
  });
  console.log('Desktop categories in DB:', catCounts);
  await mongoose.disconnect();
}
check();
