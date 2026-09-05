import dotenv from "dotenv";
import mongoose from "mongoose";
import slugify from "slugify";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";
import { Category } from "./models/category.models.js";
import { Product } from "./models/product.models.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: "./.env" });

const CATEGORIES_DATA = [
  {
    name: "Graphics Cards",
    description: "Next-generation NVIDIA and AMD desktop graphics cards featuring ultra-fast GDDR7/GDDR6X VRAM, advanced ray tracing cores, and neural rendering for 4K gaming and AI workloads.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Processors",
    description: "High-performance AMD Ryzen and Intel Core desktop CPUs with massive 3D V-Cache and hybrid architectures for esports, streaming, and intensive multi-threaded computing.",
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Motherboards",
    description: "Enthusiast AM5 and LGA1851 motherboards with heavy-duty VRM power delivery, PCIe 5.0 expansion slots, Wi-Fi 6E/7, and high-fidelity audio engineering.",
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Gaming Monitors",
    description: "Ultra-fast QHD/4K OLED, Fast-IPS, and color-calibrated professional displays with high refresh rates up to 360Hz and 99% DCI-P3 color reproduction.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Peripherals",
    description: "Esports-grade wireless optical gaming mice, hot-swappable custom mechanical keyboards, and precision studio productivity peripherals.",
    image: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cooling & Cases",
    description: "Enthusiast AIO liquid coolers with digital LCD screens, silent dual-tower heatsinks, and high-airflow Scandinavian chassis with real wood and mesh.",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Storage",
    description: "Ultra-fast PCIe Gen4 and Gen5 NVMe M.2 solid state drives reaching transfer speeds up to 14,500 MB/s for instantaneous game loading and 8K timeline scrubbing.",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Memory / RAM",
    description: "High-frequency DDR5 dual-channel and workstation memory kits with low-latency EXPO and XMP profiles, custom heat spreaders, and dynamic RGB lighting.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Custom Systems / Workstations",
    description: "Turnkey custom-built liquid-cooled battle stations, 8K creative workstations, and ISV-certified enterprise towers tested for zero-compromise reliability.",
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80",
  },
];

const getRawProducts = (catMap) => [
  // -------------------------------------------------------------
  // 1. GRAPHICS CARDS
  // -------------------------------------------------------------
  {
    title: "NVIDIA GeForce RTX 5090 32GB GDDR7",
    category: catMap["Graphics Cards"],
    brand: "NVIDIA",
    price: 249990,
    discountPrice: 239990,
    stock: 8,
    rating: 4.9,
    numReviews: 48,
    featured: true,
    description: "Flagship Blackwell architecture desktop graphics card featuring 32GB ultra-high-speed GDDR7 VRAM, 21,760 CUDA cores, and 512-bit memory interface. Engineered for uncompromised 4K/8K path-traced gaming, real-time AI inference, and generative neural rendering.",
    images: [
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_5090_1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_5090_2" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_5090_3" }
    ]
  },
  {
    title: "ASUS TUF Gaming GeForce RTX 5080 OC Edition 16GB GDDR7",
    category: catMap["Graphics Cards"],
    brand: "ASUS",
    price: 169990,
    discountPrice: 164990,
    stock: 14,
    rating: 4.8,
    numReviews: 32,
    featured: true,
    description: "Military-grade engineered RTX 5080 with dual ball bearing Axial-tech fans, vented metal exoskeleton, and factory GPU boost clock. Delivers blistering frame rates in high-refresh 4K gaming with DLSS 4 and advanced frame generation.",
    images: [
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_tuf5080_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_tuf5080_2" }
    ]
  },
  {
    title: "ASUS PRIME GeForce RTX 5080 OC 16GB GDDR7",
    category: catMap["Graphics Cards"],
    brand: "ASUS",
    price: 158900,
    discountPrice: 154500,
    stock: 11,
    rating: 4.7,
    numReviews: 19,
    featured: false,
    description: "Clean modern triple-fan cooling design optimized for enthusiast airflow chassis. Features 16GB GDDR7 memory, robust power delivery, and dual BIOS switch for silent operation and maximum performance.",
    images: [
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_prime5080_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_prime5080_2" }
    ]
  },
  {
    title: "MSI GeForce RTX 5080 16G VENTUS 3X OC",
    category: catMap["Graphics Cards"],
    brand: "MSI",
    price: 156990,
    discountPrice: 152990,
    stock: 16,
    rating: 4.7,
    numReviews: 24,
    featured: false,
    description: "Performance-focused industrial design with TORX Fan 4.0 cooling, precision heat pipes, and reinforced anti-bending backplate. Delivers dependable thermal stability under sustained heavy compute workloads.",
    images: [
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_msi5080_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_msi5080_2" }
    ]
  },
  {
    title: "NVIDIA GeForce RTX 5070 Ti 16GB GDDR7",
    category: catMap["Graphics Cards"],
    brand: "NVIDIA",
    price: 139900,
    discountPrice: 136999,
    stock: 22,
    rating: 4.8,
    numReviews: 56,
    featured: true,
    description: "Enthusiast-tier Blackwell graphics card featuring 16GB GDDR7 memory on a 256-bit bus with 4th Gen Tensor Cores. Exceptional performance sweet-spot for competitive 1440p high-refresh and immersive 4K gaming.",
    images: [
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_5070ti_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_5070ti_2" }
    ]
  },
  {
    title: "Gigabyte GeForce RTX 4090 Gaming OC 24GB GDDR6X",
    category: catMap["Graphics Cards"],
    brand: "Gigabyte",
    price: 209990,
    discountPrice: 199990,
    stock: 7,
    rating: 4.9,
    numReviews: 64,
    featured: true,
    description: "Legendary Ada Lovelace halo GPU featuring 24GB GDDR6X, WINDFORCE cooling with alternate spinning 110mm fans, vapor chamber direct-touch GPU contact, dual BIOS, and RGB Fusion lighting.",
    images: [
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_4090_1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_4090_2" }
    ]
  },
  {
    title: "ASUS ROG Strix GeForce RTX 5080 OC 16GB GDDR7",
    category: catMap["Graphics Cards"],
    brand: "ASUS",
    price: 184990,
    discountPrice: 178990,
    stock: 12,
    rating: 4.9,
    numReviews: 38,
    featured: true,
    description: "Peak luxury Blackwell graphics card with diecast metal shroud and frame, patented vapor chamber, 3.5-slot cooling finstack, Aura Sync ARGB lighting, and extreme factory GPU overclock.",
    images: [
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_rog5080_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "gpu_rog5080_2" }
    ]
  },

  // -------------------------------------------------------------
  // 2. PROCESSORS
  // -------------------------------------------------------------
  {
    title: "AMD Ryzen 7 9800X3D Processor (8 Cores / 16 Threads)",
    category: catMap["Processors"],
    brand: "AMD",
    price: 48990,
    discountPrice: 47990,
    stock: 18,
    rating: 5.0,
    numReviews: 84,
    featured: true,
    description: "The undisputed champion of PC gaming CPUs powered by 2nd-generation 3D V-Cache architecture with 96MB total L3 cache. Delivers unmatched minimum 0.1% lows and ultra-smooth frame pacing in demanding AAA and esports titles.",
    images: [
      { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_9800x3d_1" },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_9800x3d_2" }
    ]
  },
  {
    title: "AMD Ryzen 9 9950X3D Processor (16 Cores / 32 Threads)",
    category: catMap["Processors"],
    brand: "AMD",
    price: 74990,
    discountPrice: 71700,
    stock: 9,
    rating: 4.9,
    numReviews: 41,
    featured: true,
    description: "Ultimate dual-purpose powerhouse combining massive 144MB total cache with 16 Zen 5 compute cores. Effortlessly dominates simultaneous 4K streaming, real-time physics simulations, 3D viewport rendering, and competitive gaming.",
    images: [
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_9950x3d_1" },
      { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_9950x3d_2" }
    ]
  },
  {
    title: "AMD Ryzen 7 7800X3D Processor (8 Cores / 16 Threads)",
    category: catMap["Processors"],
    brand: "AMD",
    price: 39990,
    discountPrice: 38490,
    stock: 25,
    rating: 4.9,
    numReviews: 112,
    featured: false,
    description: "Legendary AM5 gaming processor featuring 104MB cache and extreme thermal efficiency with 120W TDP. Unrivaled price-to-performance ratio for enthusiast 1440p and 4K battle stations.",
    images: [
      { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_7800x3d_1" },
      { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_7800x3d_2" }
    ]
  },
  {
    title: "Intel Core Ultra 7 265K Desktop Processor (20 Cores / 20 Threads)",
    category: catMap["Processors"],
    brand: "Intel",
    price: 34900,
    discountPrice: 32600,
    stock: 20,
    rating: 4.6,
    numReviews: 28,
    featured: false,
    description: "Arrow Lake architecture desktop processor with 8 Performance cores and 12 Efficient cores built on Intel 20A technology. Features integrated NPU for hardware AI acceleration and native PCIe 5.0 storage lanes.",
    images: [
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_265k_1" },
      { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_265k_2" }
    ]
  },
  {
    title: "Intel Core Ultra 9 285K Flagship Processor (24 Cores / 24 Threads)",
    category: catMap["Processors"],
    brand: "Intel",
    price: 56900,
    discountPrice: 54490,
    stock: 12,
    rating: 4.7,
    numReviews: 33,
    featured: true,
    description: "Flagship hybrid processor engineered for high-throughput workstation tasks, multi-track audio production, code compilation, and enthusiast gaming with maximum single-core turbo up to 5.7 GHz.",
    images: [
      { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_285k_1" },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_285k_2" }
    ]
  },
  {
    title: "Intel Core i9-14900K Desktop Processor (24 Cores / 32 Threads)",
    category: catMap["Processors"],
    brand: "Intel",
    price: 51990,
    discountPrice: 48990,
    stock: 20,
    rating: 4.8,
    numReviews: 76,
    featured: false,
    description: "High-clock Raptor Lake Refresh flagship desktop CPU with 8 Performance-cores and 16 Efficient-cores reaching up to 6.0 GHz with Intel Thermal Velocity Boost. Delivers exceptional productivity compute and tournament frame rates.",
    images: [
      { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_14900k_1" },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_14900k_2" }
    ]
  },
  {
    title: "AMD Ryzen 9 7950X3D Desktop Processor (16 Cores / 32 Threads)",
    category: catMap["Processors"],
    brand: "AMD",
    price: 58990,
    discountPrice: 54990,
    stock: 14,
    rating: 4.9,
    numReviews: 52,
    featured: true,
    description: "Dual-CCD powerhouse featuring 144MB total cache and 3D V-Cache technology on Zen 4 architecture. Masterfully blends high-FPS gaming prowess with extreme 32-thread content creation and rendering throughput.",
    images: [
      { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_7950x3d_1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "cpu_7950x3d_2" }
    ]
  },

  // -------------------------------------------------------------
  // 3. MOTHERBOARDS
  // -------------------------------------------------------------
  {
    title: "ASUS ROG Strix B650-A Gaming WiFi Motherboard",
    category: catMap["Motherboards"],
    brand: "ASUS",
    price: 31990,
    discountPrice: 30950,
    stock: 15,
    rating: 4.8,
    numReviews: 45,
    featured: true,
    description: "Premium white-and-silver accented AM5 motherboard featuring 12+2 power stages (60A), PCIe 5.0 M.2 NVMe slot, WiFi 6E, 2.5G LAN, and SupremeFX ALC4080 high-fidelity audio with Savitech amplifier.",
    images: [
      { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80", publicId: "mb_rog_b650a_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "mb_rog_b650a_2" }
    ]
  },
  {
    title: "Gigabyte B650 Eagle AX WiFi Motherboard",
    category: catMap["Motherboards"],
    brand: "Gigabyte",
    price: 15400,
    discountPrice: 14900,
    stock: 30,
    rating: 4.7,
    numReviews: 67,
    featured: false,
    description: "Reliable and high-value AM5 ATX board with robust 12+2+2 digital VRM, twin PCIe 5.0/4.0 M.2 thermal guards, Wi-Fi 6E connectivity, and USB 3.2 Gen 2x2 Type-C front/rear support.",
    images: [
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "mb_gb_eagle_1" },
      { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80", publicId: "mb_gb_eagle_2" }
    ]
  },
  {
    title: "Gigabyte B650 Gaming X AX V2 WiFi Motherboard",
    category: catMap["Motherboards"],
    brand: "Gigabyte",
    price: 18900,
    discountPrice: 17800,
    stock: 24,
    rating: 4.6,
    numReviews: 38,
    featured: false,
    description: "Streamlined gaming platform featuring 8+2+2 phase power design, extended VRM heatsinks, Q-Flash Plus BIOS button, and ultra-durable PCIe armor engineered for heavy graphics cards.",
    images: [
      { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80", publicId: "mb_gb_gamingx_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "mb_gb_gamingx_2" }
    ]
  },
  {
    title: "MSI MAG B650M Mortar WiFi Motherboard",
    category: catMap["Motherboards"],
    brand: "MSI",
    price: 21500,
    discountPrice: 20490,
    stock: 18,
    rating: 4.8,
    numReviews: 52,
    featured: false,
    description: "Heavyweight Micro-ATX motherboard built with an aggressive thermal heatsink design, 12+2 Duet Rail Power System, Lightning Gen 4 M.2 with Shield Frozr, and pre-installed I/O shield.",
    images: [
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "mb_msi_mortar_1" },
      { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80", publicId: "mb_msi_mortar_2" }
    ]
  },
  {
    title: "ASRock B650 Pro RS Motherboard",
    category: catMap["Motherboards"],
    brand: "ASRock",
    price: 17900,
    discountPrice: 16990,
    stock: 16,
    rating: 4.5,
    numReviews: 22,
    featured: false,
    description: "Sleek race-inspired white/silver ATX platform with 14+2+1 phase Dr.MOS power design, Blazing M.2 PCIe 5.0 x4 slot, DDR5 7200+(OC) support, and Nahimic Audio engine.",
    images: [
      { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80", publicId: "mb_asrock_prors_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "mb_asrock_prors_2" }
    ]
  },
  {
    title: "ASUS ROG Crosshair X670E Hero Motherboard",
    category: catMap["Motherboards"],
    brand: "ASUS",
    price: 64990,
    discountPrice: 59990,
    stock: 9,
    rating: 4.9,
    numReviews: 27,
    featured: true,
    description: "Flagship AM5 enthusiast motherboard engineered for uncompromised Ryzen 9000/7000 overclocking with 18+2 teamed power stages (110A), dual USB4 Type-C 40Gbps ports, PCIe 5.0 x16, and Polymo lighting.",
    images: [
      { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80", publicId: "mb_crosshair_hero_1" },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", publicId: "mb_crosshair_hero_2" }
    ]
  },

  // -------------------------------------------------------------
  // 4. GAMING MONITORS
  // -------------------------------------------------------------
  {
    title: "ASUS ROG Swift OLED PG27AQDM 27-inch 240Hz Gaming Monitor",
    category: catMap["Gaming Monitors"],
    brand: "ASUS",
    price: 84990,
    discountPrice: 81850,
    stock: 10,
    rating: 4.9,
    numReviews: 42,
    featured: true,
    description: "Ultra-fast 27-inch 1440p OLED gaming monitor with 240Hz refresh rate, 0.03ms response time, custom heatsink, anti-glare micro-texture coating, and 99% DCI-P3 cinematic color reproduction.",
    images: [
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "mon_rog_oled_1" },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "mon_rog_oled_2" }
    ]
  },
  {
    title: "ASUS TUF Gaming VG27AQ3A 27-inch 180Hz QHD IPS Monitor",
    category: catMap["Gaming Monitors"],
    brand: "ASUS",
    price: 58000,
    discountPrice: 55900,
    stock: 28,
    rating: 4.7,
    numReviews: 89,
    featured: false,
    description: "27-inch WQHD (2560x1440) Fast IPS display with 180Hz refresh rate, Extreme Low Motion Blur Sync (ELMB SYNC), FreeSync Premium, and 130% sRGB color gamut for competitive gaming.",
    images: [
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "mon_tuf_vg27_1" },
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "mon_tuf_vg27_2" }
    ]
  },
  {
    title: "Dell UltraSharp U2724D 27-inch IPS Black 120Hz Professional Monitor",
    category: catMap["Gaming Monitors"],
    brand: "Dell",
    price: 44500,
    discountPrice: 42900,
    stock: 15,
    rating: 4.8,
    numReviews: 34,
    featured: true,
    description: "Color-accurate professional 1440p monitor featuring groundbreaking IPS Black technology with 2000:1 contrast ratio, 120Hz refresh rate, 98% DCI-P3 coverage, and ambient light sensor.",
    images: [
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "mon_dell_u2724d_1" },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "mon_dell_u2724d_2" }
    ]
  },
  {
    title: "Samsung Odyssey OLED G6 (G60SD) 27-inch 360Hz Gaming Monitor",
    category: catMap["Gaming Monitors"],
    brand: "Samsung",
    price: 74990,
    discountPrice: 69990,
    stock: 12,
    rating: 4.9,
    numReviews: 29,
    featured: true,
    description: "Blazing 360Hz QHD QD-OLED esports display with 0.03ms response time, OLED Safeguard+ cooling system, dynamic black equalizer, and metallic slim ergonomic stand.",
    images: [
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "mon_samsung_g6_1" },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "mon_samsung_g6_2" }
    ]
  },
  {
    title: "BenQ PD2706U 27-inch 4K UHD DesignVue Creator Monitor",
    category: catMap["Gaming Monitors"],
    brand: "BenQ",
    price: 49990,
    discountPrice: 47500,
    stock: 14,
    rating: 4.8,
    numReviews: 21,
    featured: false,
    description: "CalMAN and Pantone-validated 4K UHD designer monitor with 90W USB-C PD, KVM switch, Hotkey Puck G2 controller, DualView mode, and factory color calibration report.",
    images: [
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "mon_benq_pd2706u_1" },
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "mon_benq_pd2706u_2" }
    ]
  },
  {
    title: "LG UltraGear 27GR95QE-B 27-inch QHD OLED 240Hz Gaming Monitor",
    category: catMap["Gaming Monitors"],
    brand: "LG",
    price: 69990,
    discountPrice: 64990,
    stock: 16,
    rating: 4.8,
    numReviews: 68,
    featured: true,
    description: "World-class 27-inch OLED tournament display featuring 2560x1440 resolution, blazing 240Hz refresh rate, 0.03ms (GtG) response time, anti-glare low reflection coating, and 98.5% DCI-P3 color gamut.",
    images: [
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "mon_lg_oled_1" },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "mon_lg_oled_2" }
    ]
  },

  // -------------------------------------------------------------
  // 5. PERIPHERALS
  // -------------------------------------------------------------
  {
    title: "Logitech G Pro X Superlight 2 Wireless Gaming Mouse",
    category: catMap["Peripherals"],
    brand: "Logitech",
    price: 15995,
    discountPrice: 14995,
    stock: 35,
    rating: 4.9,
    numReviews: 140,
    featured: true,
    description: "Ultra-lightweight 60-gram competitive esports mouse featuring HERO 2 sensor with 32,000 DPI, LIGHTFORCE hybrid optical-mechanical switches, and true 4K wireless polling rate.",
    images: [
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "periph_superlight2_1" },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "periph_superlight2_2" }
    ]
  },
  {
    title: "Logitech G502 X Lightspeed Wireless RGB Gaming Mouse",
    category: catMap["Peripherals"],
    brand: "Logitech",
    price: 12495,
    discountPrice: 11400,
    stock: 40,
    rating: 4.8,
    numReviews: 185,
    featured: false,
    description: "Iconic gaming ergonomic mouse redesigned with LIGHTFORCE switches, HERO 25K sub-micron tracking, dual-mode hyper-fast scroll wheel, and 140 hours of continuous battery life.",
    images: [
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "periph_g502x_1" },
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "periph_g502x_2" }
    ]
  },
  {
    title: "Razer BlackWidow V4 75% Mechanical Gaming Keyboard",
    category: catMap["Peripherals"],
    brand: "Razer",
    price: 17999,
    discountPrice: 16499,
    stock: 20,
    rating: 4.7,
    numReviews: 54,
    featured: true,
    description: "Hot-swappable 75% mechanical keyboard featuring factory-lubed Razer Orange tactile switches, sound-dampening foam, gasket-mounted FR4 plate, and multi-function roller.",
    images: [
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "periph_blackwidow_1" },
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "periph_blackwidow_2" }
    ]
  },
  {
    title: "Keychron Q1 Pro QMK/VIA Wireless Custom Mechanical Keyboard",
    category: catMap["Peripherals"],
    brand: "Keychron",
    price: 18500,
    discountPrice: 16990,
    stock: 18,
    rating: 4.9,
    numReviews: 68,
    featured: true,
    description: "Full CNC machined aluminum body 75% custom keyboard with double-gasket design, Bluetooth 5.1 & Type-C wired connectivity, south-facing RGB, and K Pro mechanical switches.",
    images: [
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "periph_q1pro_1" },
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "periph_q1pro_2" }
    ]
  },
  {
    title: "Keychron K2 V2 Wireless Bluetooth Mechanical Keyboard",
    category: catMap["Peripherals"],
    brand: "Keychron",
    price: 8499,
    discountPrice: 7999,
    stock: 30,
    rating: 4.6,
    numReviews: 96,
    featured: false,
    description: "Compact 84-key mechanical keyboard with Mac/Windows physical toggle, wireless multi-device pairing, 4000mAh battery, and Gateron G Pro Brown tactile switches.",
    images: [
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "periph_k2v2_1" },
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "periph_k2v2_2" }
    ]
  },
  {
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    category: catMap["Peripherals"],
    brand: "Logitech",
    price: 9995,
    discountPrice: 8995,
    stock: 45,
    rating: 4.9,
    numReviews: 210,
    featured: false,
    description: "Premier productivity mouse with 8K DPI any-surface glass tracking, Quiet Click switches, MagSpeed electromagnetic scroll wheel, and ergonomic thumb rest gesture button.",
    images: [
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "periph_mxmaster3s_1" },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "periph_mxmaster3s_2" }
    ]
  },
  {
    title: "Wooting 80HE Rapid Trigger Magnetic Gaming Keyboard",
    category: catMap["Peripherals"],
    brand: "Wooting",
    price: 22990,
    discountPrice: 20990,
    stock: 18,
    rating: 5.0,
    numReviews: 95,
    featured: true,
    description: "World's most responsive competitive esports keyboard featuring Gateron Lekker Hall-effect magnetic analog switches, true 0.1mm Rapid Trigger, 8000Hz polling rate, and PBT dye-sub keycaps.",
    images: [
      { url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80", publicId: "periph_wooting80he_1" },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "periph_wooting80he_2" }
    ]
  },

  // -------------------------------------------------------------
  // 6. COOLING & CASES
  // -------------------------------------------------------------
  {
    title: "NZXT Kraken 360 RGB Liquid Cooler (360mm AIO)",
    category: catMap["Cooling & Cases"],
    brand: "NZXT",
    price: 16490,
    discountPrice: 15200,
    stock: 22,
    rating: 4.8,
    numReviews: 72,
    featured: true,
    description: "High-performance 360mm AIO liquid cooler equipped with a 1.54-inch square LCD display for real-time system stats or custom GIFs, Asetek 7th gen pump, and F120 RGB Core fans.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "cool_kraken360_1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "cool_kraken360_2" }
    ]
  },
  {
    title: "Arctic Liquid Freezer III 360 Black Liquid Cooler",
    category: catMap["Cooling & Cases"],
    brand: "Arctic",
    price: 10990,
    discountPrice: 10000,
    stock: 28,
    rating: 4.9,
    numReviews: 115,
    featured: true,
    description: "Class-leading thick 38mm radiator AIO with integrated VRM cooling fan, PWM-controlled pump, high static pressure P12 PWM fans, and pre-applied MX-6 thermal compound.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "cool_arctic360_1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "cool_arctic360_2" }
    ]
  },
  {
    title: "DeepCool AK620 High-Performance Dual Tower Air Cooler",
    category: catMap["Cooling & Cases"],
    brand: "DeepCool",
    price: 5999,
    discountPrice: 5400,
    stock: 40,
    rating: 4.7,
    numReviews: 130,
    featured: false,
    description: "Dual-tower CPU air cooler with six 6mm copper heatpipes, matrix fin array, and two silent 120mm FDB PWM fans capable of dissipating up to 260W of thermal heat.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "cool_ak620_1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "cool_ak620_2" }
    ]
  },
  {
    title: "Noctua NH-D15 chromax.black Dual-Tower CPU Cooler",
    category: catMap["Cooling & Cases"],
    brand: "Noctua",
    price: 11990,
    discountPrice: 10800,
    stock: 19,
    rating: 5.0,
    numReviews: 95,
    featured: true,
    description: "Legendary enthusiast flagship dual-tower heatsink in stealth all-black design with two NF-A15 140mm PWM fans, SecuFirm2 mounting system, and NT-H1 thermal paste.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "cool_nhd15_1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "cool_nhd15_2" }
    ]
  },
  {
    title: "Fractal Design North Charcoal Black Mid-Tower Case",
    category: catMap["Cooling & Cases"],
    brand: "Fractal Design",
    price: 19990,
    discountPrice: 18900,
    stock: 14,
    rating: 4.9,
    numReviews: 63,
    featured: true,
    description: "Scandinavian-designed luxury chassis featuring genuine FSC-certified walnut wood front slats, sleek brass details, high-airflow mesh side panel, and dual 140mm Aspect PWM fans.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "case_fractal_north_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "case_fractal_north_2" }
    ]
  },
  {
    title: "Lian Li Lancool 216 RGB Mid-Tower Gaming Case",
    category: catMap["Cooling & Cases"],
    brand: "Lian Li",
    price: 9900,
    discountPrice: 9000,
    stock: 25,
    rating: 4.8,
    numReviews: 82,
    featured: false,
    description: "All-around airflow chassis with dual custom 160mm ARGB front intake fans, continuous fine mesh front panel, modular rear bracket, and dedicated PCIe fan bracket.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "case_lancool216_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "case_lancool216_2" }
    ]
  },
  {
    title: "Corsair 5000D Airflow Tempered Glass Mid-Tower Case",
    category: catMap["Cooling & Cases"],
    brand: "Corsair",
    price: 14990,
    discountPrice: 13490,
    stock: 24,
    rating: 4.8,
    numReviews: 110,
    featured: false,
    description: "High-airflow mid-tower ATX chassis engineered with steel front ventilation, RapidRoute cable management system, spacious interior supporting dual 360mm radiators, and two AirGuide fans.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "case_corsair5000d_1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "case_corsair5000d_2" }
    ]
  },

  // -------------------------------------------------------------
  // 7. STORAGE
  // -------------------------------------------------------------
  {
    title: "WD Black SN850X 2TB NVMe PCIe Gen4 M.2 SSD",
    category: catMap["Storage"],
    brand: "Western Digital",
    price: 18990,
    discountPrice: 17490,
    stock: 35,
    rating: 4.9,
    numReviews: 160,
    featured: true,
    description: "Top-tier PCIe Gen4 x4 NVMe gaming solid state drive delivering blistering sequential read speeds up to 7,300 MB/s, predictive Game Mode 2.0 cache loading, and low-latency TLC NAND.",
    images: [
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "ssd_sn850x_2tb_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "ssd_sn850x_2tb_2" }
    ]
  },
  {
    title: "Samsung 990 PRO 2TB NVMe PCIe 4.0 M.2 SSD",
    category: catMap["Storage"],
    brand: "Samsung",
    price: 19490,
    discountPrice: 17990,
    stock: 40,
    rating: 4.9,
    numReviews: 210,
    featured: true,
    description: "Industry-standard PCIe 4.0 SSD powered by Samsung in-house Pascal controller and V-NAND with up to 7,450 MB/s read, 6,900 MB/s write, 2GB LPDDR4 DRAM cache, and nickel-coated heat spreader.",
    images: [
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "ssd_990pro_2tb_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "ssd_990pro_2tb_2" }
    ]
  },
  {
    title: "Samsung 990 PRO 4TB NVMe PCIe 4.0 M.2 SSD",
    category: catMap["Storage"],
    brand: "Samsung",
    price: 38990,
    discountPrice: 35900,
    stock: 15,
    rating: 4.9,
    numReviews: 45,
    featured: false,
    description: "Massive 4TB high-density PCIe 4.0 SSD designed for heavy 4K/8K video production, vast local AI model checkpoint storage, and huge gaming libraries with 2,400 TBW endurance rating.",
    images: [
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "ssd_990pro_4tb_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "ssd_990pro_4tb_2" }
    ]
  },
  {
    title: "Crucial T705 2TB PCIe Gen5 NVMe M.2 SSD with Heatsink",
    category: catMap["Storage"],
    brand: "Crucial",
    price: 32990,
    discountPrice: 29990,
    stock: 12,
    rating: 4.8,
    numReviews: 38,
    featured: true,
    description: "Next-gen PCIe Gen5 x4 powerhouse reaching unbelievable speeds up to 14,500 MB/s sequential read. Features Micron 232-layer TLC NAND and custom aluminum/copper thermal heatsink.",
    images: [
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "ssd_t705_2tb_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "ssd_t705_2tb_2" }
    ]
  },
  {
    title: "Kingston KC3000 1TB PCIe 4.0 NVMe M.2 SSD",
    category: catMap["Storage"],
    brand: "Kingston",
    price: 9490,
    discountPrice: 8490,
    stock: 50,
    rating: 4.7,
    numReviews: 76,
    featured: false,
    description: "High-value Gen 4x4 NVMe SSD featuring Phison E18 controller, 7,000 MB/s read speeds, low profile graphene aluminum heat spreader, and 800 TBW write endurance.",
    images: [
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "ssd_kc3000_1tb_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "ssd_kc3000_1tb_2" }
    ]
  },

  // -------------------------------------------------------------
  // 8. MEMORY / RAM
  // -------------------------------------------------------------
  {
    title: "G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5-6000 CL30",
    category: catMap["Memory / RAM"],
    brand: "G.Skill",
    price: 13490,
    discountPrice: 12490,
    stock: 30,
    rating: 4.9,
    numReviews: 128,
    featured: true,
    description: "AMD EXPO certified extreme overclocking memory kit featuring ultra-tight CL30-38-38-96 timings at 1.35V, dual-tone matte black aluminum heatspreader, and customizable RGB light bar.",
    images: [
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "ram_trident_32gb_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "ram_trident_32gb_2" }
    ]
  },
  {
    title: "Corsair Vengeance RGB 32GB (2x16GB) DDR5-6000 CL36",
    category: catMap["Memory / RAM"],
    brand: "Corsair",
    price: 12990,
    discountPrice: 11990,
    stock: 35,
    rating: 4.8,
    numReviews: 94,
    featured: false,
    description: "High-frequency DDR5 RAM with ten-zone dynamic RGB lighting, custom performance PCB, onboard voltage regulation, and Corsair iCUE software synchronization with Intel XMP 3.0.",
    images: [
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "ram_corsair_32gb_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "ram_corsair_32gb_2" }
    ]
  },
  {
    title: "Kingston Fury Beast RGB 32GB (2x16GB) DDR5-6000 CL36",
    category: catMap["Memory / RAM"],
    brand: "Kingston",
    price: 11990,
    discountPrice: 10990,
    stock: 40,
    rating: 4.7,
    numReviews: 70,
    featured: false,
    description: "Aggressive low-profile heat spreader with Infrared Sync RGB technology, automatic plug-and-play overclocking, and certified compatibility with both Intel XMP 3.0 and AMD EXPO.",
    images: [
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "ram_fury_32gb_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "ram_fury_32gb_2" }
    ]
  },
  {
    title: "G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5-6000 CL30",
    category: catMap["Memory / RAM"],
    brand: "G.Skill",
    price: 24990,
    discountPrice: 22990,
    stock: 18,
    rating: 4.9,
    numReviews: 52,
    featured: true,
    description: "High-capacity 64GB dual-channel DDR5 memory kit with low latency CL30 timings for intensive content creation, Unreal Engine 5 level compilation, 3D asset caching, and extreme multitasking.",
    images: [
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "ram_trident_64gb_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "ram_trident_64gb_2" }
    ]
  },
  {
    title: "Corsair Vengeance 96GB (2x48GB) DDR5-5600 CL40 Workstation Kit",
    category: catMap["Memory / RAM"],
    brand: "Corsair",
    price: 36990,
    discountPrice: 33900,
    stock: 10,
    rating: 4.8,
    numReviews: 26,
    featured: false,
    description: "High-density 96GB non-binary DDR5 memory kit optimized for high-throughput scientific computing, LLM inference workstations, complex virtual machines, and massive 8K timeline rendering.",
    images: [
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "ram_corsair_96gb_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "ram_corsair_96gb_2" }
    ]
  },

  // -------------------------------------------------------------
  // 9. CUSTOM SYSTEMS / WORKSTATIONS
  // -------------------------------------------------------------
  {
    title: "GearGrid Apex Gaming Rig (Blackwell Extreme Edition)",
    category: catMap["Custom Systems / Workstations"],
    brand: "GearGrid",
    price: 449990,
    discountPrice: 429990,
    stock: 5,
    rating: 5.0,
    numReviews: 34,
    featured: true,
    description: "Ultra-enthusiast gaming battle station engineered for maximum 4K path-traced gaming and liquid-cooled reliability.\n\n• CPU: AMD Ryzen 7 9800X3D (8C/16T, 96MB V-Cache)\n• GPU: NVIDIA GeForce RTX 5090 32GB GDDR7\n• RAM: G.Skill Trident Z5 Neo RGB 64GB DDR5-6000 CL30\n• Storage: 2TB WD Black SN850X Gen4 NVMe SSD (7300 MB/s)\n• PSU: Corsair RM1200x Shift 1200W 80+ Gold Fully Modular ATX 3.0\n• Cooling: NZXT Kraken 360 RGB LCD Liquid Cooler\n• Chassis: Fractal Design North XL Charcoal Black\n• Intended Workload: Extreme 4K/8K Gaming, High-Framerate VR, and Generative AI Model Execution.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "sys_apex_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "sys_apex_2" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "sys_apex_3" }
    ]
  },
  {
    title: "GearGrid Titan 5080 4K Gaming Rig",
    category: catMap["Custom Systems / Workstations"],
    brand: "GearGrid",
    price: 299990,
    discountPrice: 284990,
    stock: 6,
    rating: 4.9,
    numReviews: 29,
    featured: true,
    description: "Premium 4K ultra gaming desktop built for maxed-out ray tracing and simultaneous high-bitrate AV1 streaming.\n\n• CPU: AMD Ryzen 9 9950X3D (16C/32T, 144MB Cache, 5.7 GHz)\n• GPU: ASUS TUF Gaming GeForce RTX 5080 OC Edition 16GB GDDR7\n• RAM: G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6000 CL30\n• Storage: 2TB Samsung 990 PRO NVMe PCIe 4.0 M.2 SSD (7450 MB/s)\n• PSU: Corsair RM1000e 1000W 80+ Gold ATX 3.0 Modular\n• Cooling: Arctic Liquid Freezer III 360 Black AIO Liquid Cooler\n• Chassis: Lian Li Lancool 216 RGB Mid-Tower High-Airflow Mesh\n• Intended Workload: 4K Ultra Gaming @ 120+ FPS, Ray Traced Cyberpunk & Alan Wake 2, 4K OBS Streaming.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "sys_titan_1" },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "sys_titan_2" }
    ]
  },
  {
    title: "GearGrid Velocity 5070 Ti High-Framerate Gaming Rig",
    category: catMap["Custom Systems / Workstations"],
    brand: "GearGrid",
    price: 229990,
    discountPrice: 219990,
    stock: 7,
    rating: 4.9,
    numReviews: 22,
    featured: true,
    description: "High-end 1440p gaming machine optimized for ultra-high refresh rates, flawless frame pacing, and competitive esports.\n\n• CPU: AMD Ryzen 7 7800X3D (8C/16T, 96MB 3D V-Cache, 5.0 GHz)\n• GPU: NVIDIA GeForce RTX 5070 Ti 16GB GDDR7\n• RAM: Corsair Vengeance RGB 32GB (2x16GB) DDR5-6000 CL36\n• Storage: 2TB Crucial T705 PCIe Gen5 NVMe SSD (14,500 MB/s)\n• PSU: Seasonic Focus GX-850 850W 80+ Gold\n• Cooling: DeepCool AK620 High-Performance Dual-Tower Air Cooler\n• Chassis: Fractal Design North Charcoal Black (Real Walnut Front)\n• Intended Workload: 1440p Competitive Gaming @ 240Hz+, Sim-Racing (iRacing, Assetto Corsa), Flight Simulators.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "sys_velocity_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "sys_velocity_2" }
    ]
  },
  {
    title: "GearGrid Phantom Competitive Gaming Rig",
    category: catMap["Custom Systems / Workstations"],
    brand: "GearGrid",
    price: 249990,
    discountPrice: 239990,
    stock: 8,
    rating: 4.8,
    numReviews: 19,
    featured: false,
    description: "Tournament-grade gaming weapon engineered for minimum click-to-photon latency and blistering competitive framerates.\n\n• CPU: Intel Core Ultra 7 265K (20 Cores / 20 Threads, 5.5 GHz Turbo)\n• GPU: MSI GeForce RTX 5080 16G VENTUS 3X OC 16GB GDDR7\n• RAM: Kingston Fury Beast RGB 32GB (2x16GB) DDR5-6000 CL36\n• Storage: 1TB Kingston KC3000 Gen4 NVMe (7000 MB/s) + 1TB Secondary SSD\n• PSU: Seasonic Focus GX-850 850W 80+ Gold\n• Cooling: Arctic Liquid Freezer III 360 Black AIO\n• Chassis: Lian Li Lancool 216 RGB Mid-Tower\n• Intended Workload: Sub-5ms System Latency with NVIDIA Reflex, 360Hz/540Hz CS2, Valorant, Apex Legends Tournament Play.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "sys_phantom_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "sys_phantom_2" }
    ]
  },
  {
    title: "GearGrid Forge 1440p Performance Gaming Rig",
    category: catMap["Custom Systems / Workstations"],
    brand: "GearGrid",
    price: 199990,
    discountPrice: 189990,
    stock: 10,
    rating: 4.8,
    numReviews: 36,
    featured: false,
    description: "The gold-standard price-to-performance 1440p gaming setup with quiet thermals and clean Scandinavian aesthetics.\n\n• CPU: AMD Ryzen 7 7700X (8C/16T, 5.4 GHz Max Boost)\n• GPU: ASUS PRIME GeForce RTX 5080 OC 16GB GDDR7\n• RAM: G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5-6000 CL30\n• Storage: 1TB Samsung 990 PRO NVMe Gen4 SSD (7450 MB/s)\n• PSU: Corsair RM750e 750W 80+ Gold\n• Cooling: DeepCool AK620 Dual-Tower High-Airflow Cooler\n• Chassis: Corsair 4000D Airflow High-Airflow Black\n• Intended Workload: 1440p Ultra Settings in Cyberpunk 2077, Black Myth: Wukong, Call of Duty: Warzone, Helldivers 2.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "sys_forge_1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "sys_forge_2" }
    ]
  },
  {
    title: "GearGrid 4K Creator Studio PC",
    category: catMap["Custom Systems / Workstations"],
    brand: "GearGrid",
    price: 319990,
    discountPrice: 299990,
    stock: 6,
    rating: 4.9,
    numReviews: 28,
    featured: true,
    description: "Precision-tuned workstation for 4K/8K video editing, color grading, VFX rendering, and audio production.\n\n• CPU: AMD Ryzen 9 9950X3D (16C/32T, 144MB Cache)\n• GPU: ASUS TUF Gaming RTX 5080 OC 16GB GDDR7\n• RAM: 64GB Corsair Vengeance DDR5-6000\n• Storage: 2TB Samsung 990 PRO Gen4 M.2 SSD + 4TB Secondary NVMe\n• PSU: Corsair RM1000e 1000W 80+ Gold ATX 3.0\n• Cooling: Arctic Liquid Freezer III 360mm AIO\n• Chassis: Lian Li Lancool 216 Mesh\n• Intended Workload: DaVinci Resolve Studio 8K, Adobe Premiere Pro, Blender 3D Cycles, After Effects.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "sys_creator_1" },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "sys_creator_2" }
    ]
  },
  {
    title: "GearGrid Studio Workstation (3D & AI Acceleration)",
    category: catMap["Custom Systems / Workstations"],
    brand: "GearGrid",
    price: 369990,
    discountPrice: 349990,
    stock: 4,
    rating: 4.9,
    numReviews: 19,
    featured: true,
    description: "Architectural and engineering workstation tailored for CAD, real-time Unreal Engine 5 simulation, and deep learning workflows.\n\n• CPU: Intel Core Ultra 9 285K (24 Cores, 5.7 GHz Turbo)\n• GPU: NVIDIA GeForce RTX 5080 16GB GDDR7\n• RAM: 96GB (2x48GB) High-Density DDR5-5600\n• Storage: 2TB Crucial T705 Gen5 NVMe (14,500 MB/s) + 4TB WD Black Gen4\n• PSU: Seasonic Focus GX-1000 1000W 80+ Gold\n• Cooling: Noctua NH-D15 chromax.black Dual-Tower Air Cooler\n• Chassis: Fractal Design North Mesh\n• Intended Workload: AutoCAD, Maya, Houdini Simulations, Unreal Engine 5 Virtual Production, LLM Fine-Tuning.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "sys_studio_1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "sys_studio_2" }
    ]
  },
  {
    title: "HP Z2 Tower G9 Workstation Configuration",
    category: catMap["Custom Systems / Workstations"],
    brand: "HP",
    price: 249900,
    discountPrice: 239000,
    stock: 7,
    rating: 4.8,
    numReviews: 15,
    featured: false,
    description: "ISV-certified enterprise desktop workstation with server-grade hardware reliability and tool-less chassis serviceability.\n\n• CPU: Intel Core i9-14900K (24 Cores / 32 Threads)\n• GPU: NVIDIA RTX 4080 Super 16GB GDDR6X\n• RAM: 64GB DDR5-5600 ECC / Non-ECC Workstation Memory\n• Storage: 2TB HP Z Turbo PCIe Gen4 NVMe SSD\n• PSU: HP 700W 92% High-Efficiency Internal Power Supply\n• Cooling: HP Enterprise Vented Liquid Cooling Module\n• Chassis: HP Z2 Industrial Workstation Tower\n• Intended Workload: SolidWorks, Revit, Siemens NX, High-Fidelity Photogrammetry, Enterprise Engineering.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "sys_hp_z2_1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "sys_hp_z2_2" }
    ]
  },
  {
    title: "Dell Precision 3680 Tower Workstation Configuration",
    category: catMap["Custom Systems / Workstations"],
    brand: "Dell",
    price: 269900,
    discountPrice: 255000,
    stock: 8,
    rating: 4.7,
    numReviews: 22,
    featured: false,
    description: "Compact enterprise tower engineered for mission-critical reliability, thermal headroom, and Dell Optimizer AI tuning.\n\n• CPU: Intel Core i9-14900 (24 Cores / 32 Threads, 65W Base)\n• GPU: NVIDIA RTX 4080 16GB GDDR6X Workstation\n• RAM: 64GB (2x32GB) DDR5-5600 ECC Memory\n• Storage: 2TB Class 40 PCIe Gen4 M.2 SSD\n• PSU: Dell 1000W Platinum Certified Modular PSU\n• Cooling: Premium Dell Precision Dual-Fan Air Cooler\n• Chassis: Dell Precision 3680 Tool-Free Security Tower\n• Intended Workload: ISV-Certified CAD Modeling, Financial Modeling, Medical Imaging Analysis, High-Reliability 24/7 Compute.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "sys_dell_3680_1" },
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "sys_dell_3680_2" }
    ]
  },
  {
    title: "GearGrid Horizon Office & Pro Station",
    category: catMap["Custom Systems / Workstations"],
    brand: "GearGrid",
    price: 119900,
    discountPrice: 112500,
    stock: 15,
    rating: 4.8,
    numReviews: 41,
    featured: false,
    description: "Silent, ultra-responsive workstation for business executives, financial traders, and creative multi-tasking.\n\n• CPU: AMD Ryzen 7 7700X (8 Cores / 16 Threads, 5.4 GHz)\n• GPU: NVIDIA GeForce RTX 4060 8GB GDDR6\n• RAM: 32GB (2x16GB) Corsair Vengeance DDR5-5600\n• Storage: 1TB Samsung 990 EVO PCIe 4.0 NVMe SSD\n• PSU: Corsair RM650e 650W 80+ Gold\n• Cooling: DeepCool AK620 Air Cooler (Near-Silent Operation)\n• Chassis: Corsair 4000D Airflow Black\n• Intended Workload: Multi-Monitor Financial Trading (4x 4K displays), Large Excel Data Modeling, Visual Studio Coding, 4K Web Production.",
    images: [
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "sys_horizon_1" },
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "sys_horizon_2" }
    ]
  }
];

async function seedDatabase() {
  console.log("==================================================");
  console.log("  GEARGRID DATABASE SEEDER (INDIAN HARDWARE DATA) ");
  console.log("==================================================");

  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing from Backend/.env");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log(" Connected to MongoDB successfully.");

    // Clear existing collections
    console.log("\nPurging existing test products and categories...");
    const deletedProducts = await Product.deleteMany({});
    const deletedCategories = await Category.deleteMany({});
    console.log(` Cleared ${deletedProducts.deletedCount} products and ${deletedCategories.deletedCount} categories.`);

    // Insert Categories
    console.log("\nSeeding 9 hardware categories...");
    const categoryDocs = [];
    for (const cat of CATEGORIES_DATA) {
      const slug = slugify(cat.name, { lower: true, strict: true });
      const doc = await Category.create({
        name: cat.name,
        slug,
        description: cat.description,
        image: cat.image,
      });
      categoryDocs.push(doc);
    }
    console.log(` Created ${categoryDocs.length} categories.`);

    // Map Category Name to ObjectId
    const categoryMap = {};
    for (const doc of categoryDocs) {
      categoryMap[doc.name] = doc._id;
    }

    // Insert Products
    console.log("\nSeeding authentic Indian-market hardware products...");
    const rawProducts = getRawProducts(categoryMap);
    const productDocs = await Product.insertMany(rawProducts);
    console.log(` Created ${productDocs.length} products.`);

    console.log("\n==================================================");
    console.log("  SEED SUMMARY:");
    console.log(`  Categories Created : ${categoryDocs.length}`);
    console.log(`  Products Created   : ${productDocs.length}`);
    console.log("  Currency           : INR (₹)");
    console.log("  Status             : SUCCESS");
    console.log("==================================================\n");

    // Breakdown per category
    for (const cat of categoryDocs) {
      const count = await Product.countDocuments({ category: cat._id });
      console.log(`  - ${cat.name.padEnd(32)}: ${count} products`);
    }
    console.log("");

  } catch (error) {
    console.error("\n❌ Seeding Failed with Error:", error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB connection closed cleanly.\n");
    process.exit(0);
  }
}

seedDatabase();
