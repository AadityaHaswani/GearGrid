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

// PC Builder Slot Definitions (Mapped to authentic MongoDB Categories)
export const BUILDER_SLOTS = [
  {
    slot: 'cpu',
    name: 'Processor (CPU)',
    category: 'Processors',
    categorySlug: 'processors'
  },
  {
    slot: 'gpu',
    name: 'Graphics Card (GPU)',
    category: 'Graphics Cards',
    categorySlug: 'graphics-cards'
  },
  {
    slot: 'motherboard',
    name: 'Motherboard',
    category: 'Motherboards',
    categorySlug: 'motherboards'
  },
  {
    slot: 'ram',
    name: 'System Memory (RAM)',
    category: 'Memory / RAM',
    categorySlug: 'memory-ram'
  },
  {
    slot: 'storage',
    name: 'Primary Storage (NVMe M.2)',
    category: 'Storage',
    categorySlug: 'storage'
  },
  {
    slot: 'cooling',
    name: 'Cooling Solution',
    category: 'Cooling & Cases',
    categorySlug: 'cooling-and-cases'
  },
  {
    slot: 'psu',
    name: 'Power Supply (PSU)',
    category: 'Power Supplies',
    categorySlug: 'power-supplies'
  }
];

