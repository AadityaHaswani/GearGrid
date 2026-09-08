import dotenv from 'dotenv';
dotenv.config();
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  productType: String
});
const categorySchema = new mongoose.Schema({ name: String, slug: String });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const isLaptopProduct = (item) => {
  if (!item) return false;
  const slug = (item.category?.slug || '').toLowerCase();
  const name = (item.category?.name || '').toLowerCase();
  const type = (item.productType || '').toLowerCase();
  return slug.includes('laptop') || slug.includes('macbook') || name.includes('laptop') || type === 'laptop';
};

const matchesCategory = (item, catId) => {
  if (isLaptopProduct(item)) return false;
  if (!catId || catId === 'all') return true;
  const itemCatSlug = (item.category?.slug || '').toLowerCase();
  const itemCatName = (item.category?.name || '').toLowerCase();
  const cat = catId.toLowerCase();

  if (itemCatSlug === cat || itemCatName === cat) return true;

  if (cat === 'peripherals') {
    const peripheralTypes = ['keyboard', 'mouse', 'headphone', 'audio', 'headset', 'mic', 'peripheral'];
    return peripheralTypes.some(t => itemCatSlug.includes(t) || itemCatName.includes(t));
  }
  if (cat === 'gpus' || cat === 'graphics-cards') {
    return itemCatSlug.includes('gpu') || itemCatSlug.includes('graphic') || itemCatName.includes('gpu') || itemCatName.includes('graphic');
  }
  if (cat === 'cpus' || cat === 'processors') {
    return itemCatSlug.includes('cpu') || itemCatSlug.includes('processor') || itemCatName.includes('cpu') || itemCatName.includes('processor');
  }
  if (cat === 'motherboards') {
    return itemCatSlug.includes('motherboard') || itemCatName.includes('motherboard');
  }
  if (cat === 'ram' || cat === 'memory' || cat === 'memory-ram') {
    return itemCatSlug.includes('ram') || itemCatSlug.includes('memory') || itemCatName.includes('ram') || itemCatName.includes('memory');
  }
  if (cat === 'storage') {
    return itemCatSlug.includes('storage') || itemCatSlug.includes('ssd') || itemCatSlug.includes('nvme') || itemCatName.includes('storage');
  }
  if (cat === 'monitors' || cat === 'gaming-monitors') {
    return itemCatSlug.includes('monitor') || itemCatName.includes('monitor');
  }
  if (cat === 'cooling' || cat === 'cooling-and-cases' || cat === 'cooling-cases') {
    return itemCatSlug.includes('cool') || itemCatSlug.includes('case') || itemCatSlug.includes('fan') || itemCatName.includes('cool') || itemCatName.includes('case');
  }
  if (cat === 'prebuilt' || cat === 'custom-systems-workstations') {
    return itemCatSlug.includes('system') || itemCatSlug.includes('prebuilt') || itemCatSlug.includes('workstation') || itemCatName.includes('system') || itemCatName.includes('workstation');
  }

  return false;
};

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const products = await Product.find({ productType: 'desktop' }).populate('category');

  console.log('Total desktop products in DB:', products.length);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'gpus', label: 'Graphics Cards' },
    { id: 'cpus', label: 'Processors' },
    { id: 'motherboards', label: 'Motherboards' },
    { id: 'memory-ram', label: 'Memory / RAM' },
    { id: 'storage', label: 'Storage' },
    { id: 'monitors', label: 'Gaming Monitors' },
    { id: 'peripherals', label: 'Peripherals' },
    { id: 'cooling', label: 'Cooling & Cases' },
    { id: 'prebuilt', label: 'Custom Systems / Workstations' }
  ];

  console.log('\nCategory Matching Results:');
  categories.forEach(cat => {
    const matched = products.filter(p => matchesCategory(p, cat.id));
    console.log(` - ${cat.label.padEnd(32)} (id: ${cat.id.padEnd(12)}): ${matched.length} products`);
  });

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
