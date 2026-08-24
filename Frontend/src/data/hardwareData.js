// Realistic Gaming Hardware Catalog for GearGrid
export const HARDWARE_CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'Cpu' },
  { id: 'gpus', label: 'Graphics Cards', icon: 'Zap' },
  { id: 'cpus', label: 'Processors', icon: 'Cpu' },
  { id: 'motherboards', label: 'Motherboards', icon: 'Layers' },
  { id: 'monitors', label: 'Gaming Monitors', icon: 'Monitor' },
  { id: 'peripherals', label: 'Peripherals', icon: 'Keyboard' },
  { id: 'cooling', label: 'Cooling & Cases', icon: 'Fan' },
  { id: 'prebuilt', label: 'Custom Systems', icon: 'Server' }
];

export const PRODUCTS = [
  {
    id: 'gpu-5090',
    name: 'NVIDIA GeForce RTX 5090 Founders Edition',
    category: 'gpus',
    categoryLabel: 'Graphics Card',
    price: 1999,
    originalPrice: 2199,
    rating: 4.9,
    reviews: 142,
    badge: 'Flagship',
    specs: ['32GB GDDR7', '512-bit Memory Bus', 'PCIe 5.0 Support', 'DLSS 4 & Ray Tracing'],
    wattage: 500,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    description: 'Next-generation flagship graphics card built on advanced Blackwell architecture for peak 4K ultra gaming and creative workloads.'
  },
  {
    id: 'cpu-7800x3d',
    name: 'AMD Ryzen 7 7800X3D Processor',
    category: 'cpus',
    categoryLabel: 'Processor',
    price: 449,
    originalPrice: 499,
    rating: 4.9,
    reviews: 320,
    badge: 'Best Seller',
    specs: ['8 Cores / 16 Threads', '5.0 GHz Max Boost', '96MB 3D V-Cache', 'Socket AM5'],
    wattage: 120,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    description: 'The top-tier gaming CPU featuring second-generation 3D V-Cache technology for high, stable frame rates in modern titles.'
  },
  {
    id: 'rig-monolith',
    name: 'GearGrid Apex Horizon Custom Gaming PC',
    category: 'prebuilt',
    categoryLabel: 'Custom Gaming PC',
    price: 3799,
    originalPrice: 3999,
    rating: 5.0,
    reviews: 58,
    badge: 'Featured Build',
    specs: ['RTX 5090 32GB', 'Ryzen 7 7800X3D', '64GB DDR5-6000', '2TB NVMe Gen4'],
    wattage: 950,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    description: 'Expertly assembled flagship gaming desktop featuring premium cable management, quiet liquid cooling, and thermal tuning.'
  },
  {
    id: 'monitor-oled-360',
    name: 'ROG Swift 27" QHD 360Hz QD-OLED Monitor',
    category: 'monitors',
    categoryLabel: 'Gaming Monitor',
    price: 899,
    originalPrice: 999,
    rating: 4.8,
    reviews: 84,
    badge: '360Hz QD-OLED',
    specs: ['2560 x 1440 QHD', '0.03ms Response Time', '360Hz Refresh Rate', 'G-Sync Compatible'],
    wattage: 65,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    description: 'High refresh rate QD-OLED gaming monitor with ultra-fast pixel response times and true black contrast.'
  },
  {
    id: 'mb-x670e-hero',
    name: 'ASUS ROG Crosshair X670E Hero Motherboard',
    category: 'motherboards',
    categoryLabel: 'Motherboard',
    price: 649,
    originalPrice: 699,
    rating: 4.7,
    reviews: 95,
    badge: 'Enthusiast',
    specs: ['18+2 Power Stages', 'PCIe 5.0 x16 Slot', 'Dual USB4 Type-C', 'WiFi 6E + 2.5G LAN'],
    wattage: 50,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'High-end AM5 motherboard built for enthusiasts and overclockers with robust VRM power stages and fast I/O connectivity.'
  },
  {
    id: 'kb-apex-pro',
    name: 'Wooting 80HE Magnetic Hall-Effect Keyboard',
    category: 'peripherals',
    categoryLabel: 'Gaming Peripheral',
    price: 219,
    originalPrice: 249,
    rating: 4.9,
    reviews: 210,
    badge: 'Rapid Trigger',
    specs: ['Lekker Magnetic Switches', 'Adjustable Actuation (0.1–4.0mm)', 'Rapid Trigger Mode', '8000Hz Polling'],
    wattage: 5,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
    description: 'Analog mechanical keyboard with adjustable magnetic actuation points and rapid trigger resets for competitive gaming.'
  },
  {
    id: 'cool-kraken-elite',
    name: 'NZXT Kraken Elite 360 RGB AIO Liquid Cooler',
    category: 'cooling',
    categoryLabel: 'Cooling & Case',
    price: 279,
    originalPrice: 299,
    rating: 4.8,
    reviews: 175,
    badge: 'AIO Liquid',
    specs: ['360mm Aluminum Radiator', '2.36" LCD Display', '3x 120mm RGB Fans', 'Asetek 7th Gen Pump'],
    wattage: 25,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80',
    description: 'High-performance 360mm all-in-one CPU cooler with custom customizable LCD display and quiet fluid dynamic bearing fans.'
  },
  {
    id: 'ram-ddr5-64gb',
    name: 'G.Skill Trident Z5 Neo RGB 64GB (2x32GB) DDR5-6000',
    category: 'cpus',
    categoryLabel: 'Memory / RAM',
    price: 219,
    originalPrice: 249,
    rating: 4.9,
    reviews: 130,
    badge: 'AMD EXPO',
    specs: ['DDR5-6000 Speed', 'CL30-36-36-96 Timings', 'AMD EXPO Profile', 'Matte Black Aluminum'],
    wattage: 15,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80',
    description: 'Optimized high-speed DDR5 memory kit with tight CL30 latency timings designed specifically for AMD AM5 platforms.'
  }
];

// PC Builder Slots
export const BUILDER_SLOTS = [
  {
    slot: 'cpu',
    name: 'Processor (CPU)',
    options: [
      { id: 'b-cpu-1', name: 'AMD Ryzen 7 7800X3D (8 Cores, 5.0 GHz)', price: 449, wattage: 120 },
      { id: 'b-cpu-2', name: 'Intel Core i9-14900K (24 Cores, 6.0 GHz)', price: 579, wattage: 253 },
      { id: 'b-cpu-3', name: 'AMD Ryzen 5 7600X (6 Cores, 5.3 GHz)', price: 219, wattage: 105 }
    ]
  },
  {
    slot: 'gpu',
    name: 'Graphics Card (GPU)',
    options: [
      { id: 'b-gpu-1', name: 'NVIDIA GeForce RTX 5090 32GB GDDR7', price: 1999, wattage: 500 },
      { id: 'b-gpu-2', name: 'NVIDIA GeForce RTX 4080 Super 16GB', price: 999, wattage: 320 },
      { id: 'b-gpu-3', name: 'AMD Radeon RX 7900 XTX 24GB', price: 899, wattage: 355 }
    ]
  },
  {
    slot: 'motherboard',
    name: 'Motherboard',
    options: [
      { id: 'b-mb-1', name: 'ASUS ROG Crosshair X670E Hero (PCIe 5.0, WiFi 6E)', price: 649, wattage: 50 },
      { id: 'b-mb-2', name: 'MSI MAG B650 Tomahawk WiFi', price: 219, wattage: 40 },
      { id: 'b-mb-3', name: 'Gigabyte Z790 AORUS Elite AX', price: 259, wattage: 45 }
    ]
  },
  {
    slot: 'ram',
    name: 'System Memory (RAM)',
    options: [
      { id: 'b-ram-1', name: '32GB (2x16GB) DDR5-6000 CL30 RGB', price: 129, wattage: 10 },
      { id: 'b-ram-2', name: '64GB (2x32GB) DDR5-6000 CL30 RGB', price: 219, wattage: 15 },
      { id: 'b-ram-3', name: '128GB (4x32GB) DDR5-5600 Pro Workstation', price: 429, wattage: 25 }
    ]
  },
  {
    slot: 'storage',
    name: 'Primary Storage (NVMe M.2)',
    options: [
      { id: 'b-ssd-1', name: '2TB Samsung 990 PRO Gen4 NVMe SSD (7450 MB/s)', price: 179, wattage: 8 },
      { id: 'b-ssd-2', name: '4TB Crucial T700 PCIe 5.0 NVMe SSD (12400 MB/s)', price: 399, wattage: 12 },
      { id: 'b-ssd-3', name: '1TB Kingston KC3000 Gen4 NVMe SSD', price: 99, wattage: 6 }
    ]
  },
  {
    slot: 'cooling',
    name: 'Cooling Solution',
    options: [
      { id: 'b-cool-1', name: 'NZXT Kraken Elite 360 RGB AIO Liquid Cooler', price: 279, wattage: 25 },
      { id: 'b-cool-2', name: 'Noctua NH-D15 chromax.black Dual-Tower Air Cooler', price: 119, wattage: 10 },
      { id: 'b-cool-3', name: 'Corsair iCUE LINK H150i RGB 360mm AIO', price: 239, wattage: 25 }
    ]
  },
  {
    slot: 'psu',
    name: 'Power Supply (PSU)',
    options: [
      { id: 'b-psu-1', name: 'Corsair RM1000x 1000W 80+ Gold Fully Modular', price: 189, wattage: 0 },
      { id: 'b-psu-2', name: 'Seasonic Vertex GX-1200 1200W ATX 3.0 Gold', price: 249, wattage: 0 },
      { id: 'b-psu-3', name: 'be quiet! Pure Power 12 M 850W 80+ Gold', price: 139, wattage: 0 }
    ]
  }
];
