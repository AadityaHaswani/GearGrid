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

const ramImageMap = {
  "Corsair Vengeance LPX 8GB (1x8GB) DDR4 3200MHz CL16": [
    { url: "/images/affordable/corsair_lpx_8gb_ddr4_1.jpg", publicId: "corsair_lpx_8gb_ddr4_1" },
    { url: "/images/affordable/corsair_lpx_8gb_ddr4_2.jpg", publicId: "corsair_lpx_8gb_ddr4_2" }
  ],
  "Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz CL16 Desktop RAM": [
    { url: "/images/affordable/corsair_lpx_16gb_ddr4_1.jpg", publicId: "corsair_lpx_16gb_ddr4_1" },
    { url: "/images/affordable/corsair_lpx_16gb_ddr4_2.jpg", publicId: "corsair_lpx_16gb_ddr4_2" }
  ],
  "G.Skill Ripjaws V 16GB (2x8GB) DDR4 3600MHz CL18 Gaming Memory": [
    { url: "/images/affordable/gskill_ripjaws_16gb_ddr4_1.jpg", publicId: "gskill_ripjaws_16gb_ddr4_1" },
    { url: "/images/affordable/gskill_ripjaws_16gb_ddr4_2.jpg", publicId: "gskill_ripjaws_16gb_ddr4_2" }
  ],
  "Kingston FURY Beast 16GB (2x8GB) DDR4 3200MHz Desktop RAM": [
    { url: "/images/affordable/kingston_fury_16gb_ddr4_1.jpg", publicId: "kingston_fury_16gb_ddr4_1" },
    { url: "/images/affordable/kingston_fury_16gb_ddr4_2.jpg", publicId: "kingston_fury_16gb_ddr4_2" }
  ],
  "Crucial Pro 16GB (2x8GB) DDR4 3200MHz CL22 Desktop Memory": [
    { url: "/images/affordable/crucial_pro_16gb_ddr4_1.jpg", publicId: "crucial_pro_16gb_ddr4_1" },
    { url: "/images/affordable/crucial_pro_16gb_ddr4_2.jpg", publicId: "crucial_pro_16gb_ddr4_2" }
  ],
  "Corsair Vengeance LPX 32GB (2x16GB) DDR4 3200MHz CL16 RAM": [
    { url: "/images/affordable/corsair_lpx_32gb_ddr4_1.jpg", publicId: "corsair_lpx_32gb_ddr4_1" },
    { url: "/images/affordable/corsair_lpx_32gb_ddr4_2.jpg", publicId: "corsair_lpx_32gb_ddr4_2" }
  ],
  "Kingston FURY Beast 16GB (1x16GB) DDR5 5600MHz CL40": [
    { url: "/images/affordable/kingston_fury_16gb_ddr5_1.jpg", publicId: "kingston_fury_16gb_ddr5_1" },
    { url: "/images/affordable/kingston_fury_16gb_ddr5_2.jpg", publicId: "kingston_fury_16gb_ddr5_2" }
  ],
  "Crucial 16GB (2x8GB) DDR5-4800 CL40 Desktop Memory": [
    { url: "/images/affordable/crucial_16gb_ddr5_4800_1.jpg", publicId: "crucial_16gb_ddr5_4800_1" },
    { url: "/images/affordable/crucial_16gb_ddr5_4800_2.jpg", publicId: "crucial_16gb_ddr5_4800_2" }
  ],
  "Corsair Vengeance 32GB (2x16GB) DDR5-5200 CL40": [
    { url: "/images/affordable/corsair_vengeance_32gb_ddr5_1.jpg", publicId: "corsair_vengeance_32gb_ddr5_1" },
    { url: "/images/affordable/corsair_vengeance_32gb_ddr5_2.jpg", publicId: "corsair_vengeance_32gb_ddr5_2" }
  ]
};

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const ramCat = await Category.findOne({ name: 'Memory / RAM' });
  if (!ramCat) {
    throw new Error('Memory / RAM category not found!');
  }

  let updatedCount = 0;
  for (const [title, images] of Object.entries(ramImageMap)) {
    const res = await Product.updateOne(
      { title, category: ramCat._id },
      { $set: { images } }
    );
    if (res.matchedCount > 0) {
      console.log(`Updated RAM images for: "${title}" (Modified: ${res.modifiedCount})`);
      updatedCount++;
    } else {
      console.warn(`Product not found: "${title}"`);
    }
  }

  console.log(`\nSuccessfully processed ${updatedCount} RAM products.`);

  // Validation
  const allRams = await Product.find({ category: ramCat._id });
  console.log(`\n========================================`);
  console.log(`FINAL RAM VALIDATION IN MONGODB (${allRams.length} products)`);
  console.log(`========================================`);
  
  const allImageUrls = new Set();
  let duplicateCount = 0;
  let lessThanTwoImages = 0;

  allRams.forEach((r, idx) => {
    console.log(`\n[${idx + 1}] ${r.title}`);
    console.log(`    Images (${r.images.length}):`);
    if (r.images.length < 2) {
      console.error(`    ❌ WARNING: Less than 2 images! (${r.images.length})`);
      lessThanTwoImages++;
    }
    r.images.forEach((img, i) => {
      console.log(`      [${i + 1}] ${img.url}`);
      if (allImageUrls.has(img.url)) {
        console.error(`      ❌ DUPLICATE IMAGE URL: ${img.url}`);
        duplicateCount++;
      } else {
        allImageUrls.add(img.url);
      }
    });
  });

  console.log(`\n----------------------------------------`);
  console.log(`Total RAM products checked: ${allRams.length}`);
  console.log(`Total unique RAM image URLs: ${allImageUrls.size}`);
  console.log(`Duplicate image URLs: ${duplicateCount}`);
  console.log(`Products with < 2 images: ${lessThanTwoImages}`);
  console.log(`----------------------------------------`);

  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
