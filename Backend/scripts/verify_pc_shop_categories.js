import dotenv from 'dotenv';
dotenv.config();
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  productType: String,
  price: Number,
  discountPrice: Number,
  images: [{ url: String, publicId: String }]
});
const categorySchema = new mongoose.Schema({ name: String, slug: String });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const HARDWARE_CATEGORIES = [
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
  const itemCatRaw = typeof item.category === 'string' ? item.category.toLowerCase() : '';
  const cat = catId.toLowerCase();

  if (itemCatSlug === cat || itemCatName === cat || itemCatRaw === cat) return true;
  if (itemCatSlug.includes(cat) || cat.includes(itemCatSlug)) return true;

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
    return itemCatSlug.includes('storage') || itemCatSlug.includes('ssd') || itemCatSlug.includes('nvme') || itemCatSlug.includes('drive') || itemCatName.includes('storage');
  }
  if (cat === 'monitors' || cat === 'gaming-monitors') {
    return itemCatSlug.includes('monitor') || itemCatName.includes('monitor');
  }
  if (cat === 'cooling' || cat === 'cooling-and-cases' || cat === 'cooling-cases') {
    return itemCatSlug.includes('cool') || itemCatSlug.includes('case') || itemCatSlug.includes('fan') || itemCatName.includes('cool') || itemCatName.includes('case');
  }
  if (cat === 'prebuilt' || cat === 'custom-systems-workstations' || cat === 'custom systems / workstations') {
    return itemCatSlug.includes('system') || itemCatSlug.includes('prebuilt') || itemCatSlug.includes('workstation') || itemCatName.includes('system') || itemCatName.includes('workstation') || itemCatName.includes('prebuilt');
  }

  return false;
};

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const rawProducts = await Product.find({ productType: 'desktop' }).populate('category');
  console.log(`Fetched ${rawProducts.length} desktop products from MongoDB.`);

  console.log('\n==================================================');
  console.log('  PC SHOP CATEGORY FILTERING VERIFICATION');
  console.log('==================================================');

  let totalErrors = 0;
  for (const [idx, cat] of HARDWARE_CATEGORIES.entries()) {
    const matched = rawProducts.filter(p => matchesCategory(p, cat.id));
    console.log(`[${idx + 1}] Category: "${cat.label.padEnd(32)}" (id: ${cat.id.padEnd(12)}) -> ${matched.length} items`);
    if (matched.length === 0) {
      console.error(`    ❌ ERROR: Category "${cat.label}" has 0 products!`);
      totalErrors++;
    } else {
      // Print first 2 samples
      matched.slice(0, 2).forEach(p => {
        console.log(`       • ${p.title} (₹${p.price})`);
      });
    }
  }

  console.log('==================================================');
  console.log(`Verification completed with ${totalErrors} errors.`);
  console.log('==================================================');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
