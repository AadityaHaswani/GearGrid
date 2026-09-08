import dotenv from 'dotenv';
dotenv.config();
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({ name: String, slug: String });
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const productSchema = new mongoose.Schema({
  title: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  productType: String
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const cats = await Category.find({});
  console.log('All Categories in MongoDB:');
  for (const c of cats) {
    const count = await Product.countDocuments({ category: c._id });
    console.log(` - ID: ${c._id} | Name: "${c.name}".padEnd(32) | Slug: "${c.slug}" | Count: ${count}`);
  }
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
