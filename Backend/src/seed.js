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
  {
    name: "Power Supplies",
    description: "Ultra-efficient 80+ Gold and Platinum certified modular power supplies with native ATX 3.0 support, PCIe 5.0 12V-2x6 power delivery, and silent zero-RPM fan modes.",
    image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80",
  },
];

const PRODUCT_SPECS_DATA = {
  "ZOTAC Gaming GeForce RTX 4060 8GB Twin Edge": {
  "specifications": {
    "chipset": "GeForce RTX 4060",
    "vram": 8,
    "vramType": "GDDR6",
    "recommendedPsu": 550,
    "powerDraw": 115,
    "length": 224
  },
  "useCaseProfile": {
    "gaming": 7.5,
    "productivity": 7,
    "editing": 7,
    "rendering": 6.5,
    "programming": 7.5,
    "ai": 6.5,
    "streaming": 7.5
  }
},
  "MSI GeForce RTX 4060 Ti VENTUS 2X Black 8G OC": {
  "specifications": {
    "chipset": "GeForce RTX 4060 Ti",
    "vram": 8,
    "vramType": "GDDR6",
    "recommendedPsu": 550,
    "powerDraw": 160,
    "length": 199
  },
  "useCaseProfile": {
    "gaming": 8.2,
    "productivity": 7.5,
    "editing": 7.8,
    "rendering": 7.2,
    "programming": 7.8,
    "ai": 7,
    "streaming": 8
  }
},
  "ASUS Dual GeForce RTX 4070 Super EVO 12GB GDDR6X": {
  "specifications": {
    "chipset": "GeForce RTX 4070 Super",
    "vram": 12,
    "vramType": "GDDR6X",
    "recommendedPsu": 650,
    "powerDraw": 220,
    "length": 227
  },
  "useCaseProfile": {
    "gaming": 9,
    "productivity": 8.5,
    "editing": 8.8,
    "rendering": 8.5,
    "programming": 8.2,
    "ai": 8.2,
    "streaming": 8.8
  }
},
  "Gigabyte GeForce RTX 4070 Ti Super Windforce OC 16GB GDDR6X": {
  "specifications": {
    "chipset": "GeForce RTX 4070 Ti Super",
    "vram": 16,
    "vramType": "GDDR6X",
    "recommendedPsu": 700,
    "powerDraw": 285,
    "length": 261
  },
  "useCaseProfile": {
    "gaming": 9.3,
    "productivity": 9,
    "editing": 9.2,
    "rendering": 9,
    "programming": 8.5,
    "ai": 8.8,
    "streaming": 9.2
  }
},
  "AMD Ryzen 5 7600 Desktop Processor (6 Cores / 12 Threads)": {
  "specifications": {
    "socket": "AM5",
    "cores": 6,
    "threads": 12,
    "baseClock": 3.8,
    "boostClock": 5.1,
    "tdp": 65,
    "integratedGraphics": true
  },
  "useCaseProfile": {
    "gaming": 8.5,
    "productivity": 7.8,
    "editing": 7.5,
    "rendering": 7,
    "programming": 8,
    "ai": 6.5,
    "streaming": 7.8
  }
},
  "AMD Ryzen 5 7600X Desktop Processor (6 Cores / 12 Threads)": {
  "specifications": {
    "socket": "AM5",
    "cores": 6,
    "threads": 12,
    "baseClock": 4.7,
    "boostClock": 5.3,
    "tdp": 105,
    "integratedGraphics": true
  },
  "useCaseProfile": {
    "gaming": 8.8,
    "productivity": 8,
    "editing": 7.8,
    "rendering": 7.2,
    "programming": 8.2,
    "ai": 6.8,
    "streaming": 8
  }
},
  "Intel Core i5-14400F Desktop Processor (10 Cores / 16 Threads)": {
  "specifications": {
    "socket": "LGA1700",
    "cores": 10,
    "threads": 16,
    "baseClock": 2.5,
    "boostClock": 4.7,
    "tdp": 65,
    "integratedGraphics": false
  },
  "useCaseProfile": {
    "gaming": 8,
    "productivity": 8,
    "editing": 7.8,
    "rendering": 7.2,
    "programming": 8.2,
    "ai": 6.5,
    "streaming": 7.5
  }
},
  "Intel Core i7-14700K Desktop Processor (20 Cores / 28 Threads)": {
  "specifications": {
    "socket": "LGA1700",
    "cores": 20,
    "threads": 28,
    "baseClock": 3.4,
    "boostClock": 5.6,
    "tdp": 125,
    "integratedGraphics": true
  },
  "useCaseProfile": {
    "gaming": 9.2,
    "productivity": 9.5,
    "editing": 9.5,
    "rendering": 9.2,
    "programming": 9.5,
    "ai": 8.2,
    "streaming": 9.2
  }
},
  "MSI PRO B650M-P Micro-ATX Motherboard": {
  "specifications": {
    "socket": "AM5",
    "chipset": "AMD B650",
    "formFactor": "Micro-ATX",
    "memoryType": "DDR5",
    "maxMemory": 192,
    "memorySlots": 4,
    "maxMemorySpeed": 6400,
    "pciExpressGeneration": "PCIe 4.0"
  },
  "useCaseProfile": {
    "gaming": 8,
    "productivity": 8,
    "editing": 7.8,
    "rendering": 7.5,
    "programming": 8,
    "ai": 7.5,
    "streaming": 7.8
  }
},
  "ASRock B760M Pro RS WiFi Motherboard": {
  "specifications": {
    "socket": "LGA1700",
    "chipset": "Intel B760",
    "formFactor": "Micro-ATX",
    "memoryType": "DDR5",
    "maxMemory": 192,
    "memorySlots": 4,
    "maxMemorySpeed": 7200,
    "pciExpressGeneration": "PCIe 5.0"
  },
  "useCaseProfile": {
    "gaming": 8.5,
    "productivity": 8.5,
    "editing": 8.2,
    "rendering": 8,
    "programming": 8.5,
    "ai": 7.8,
    "streaming": 8.2
  }
},
  "ASUS Prime Z890-P WiFi Motherboard": {
  "specifications": {
    "socket": "LGA1851",
    "chipset": "Intel Z890",
    "formFactor": "ATX",
    "memoryType": "DDR5",
    "maxMemory": 192,
    "memorySlots": 4,
    "maxMemorySpeed": 8400,
    "pciExpressGeneration": "PCIe 5.0"
  },
  "useCaseProfile": {
    "gaming": 9.2,
    "productivity": 9.5,
    "editing": 9.5,
    "rendering": 9.5,
    "programming": 9.5,
    "ai": 9,
    "streaming": 9.2
  }
},
  "Crucial 16GB (2x8GB) DDR5-4800 CL40 Desktop Memory": {
  "specifications": {
    "memoryType": "DDR5",
    "capacity": 16,
    "speed": 4800,
    "modules": "2x8GB",
    "formFactor": "DIMM"
  },
  "useCaseProfile": {
    "gaming": 7.5,
    "productivity": 7.5,
    "editing": 7,
    "rendering": 6.5,
    "programming": 7.5,
    "ai": 6,
    "streaming": 7
  }
},
  "Corsair Vengeance 32GB (2x16GB) DDR5-5200 CL40": {
  "specifications": {
    "memoryType": "DDR5",
    "capacity": 32,
    "speed": 5200,
    "modules": "2x16GB",
    "formFactor": "DIMM"
  },
  "useCaseProfile": {
    "gaming": 8.8,
    "productivity": 8.8,
    "editing": 8.5,
    "rendering": 8,
    "programming": 8.8,
    "ai": 7.5,
    "streaming": 8.5
  }
},
  "Crucial P3 Plus 500GB PCIe 4.0 NVMe M.2 SSD": {
  "specifications": {
    "type": "NVMe SSD",
    "interface": "PCIe 4.0 x4",
    "capacity": 500,
    "readSpeed": 4700,
    "writeSpeed": 1900,
    "formFactor": "M.2 2280"
  },
  "useCaseProfile": {
    "gaming": 7.5,
    "productivity": 7.5,
    "editing": 7,
    "rendering": 6.5,
    "programming": 7.5,
    "ai": 6,
    "streaming": 7
  }
},
  "Western Digital Blue SN580 1TB PCIe Gen4 NVMe M.2 SSD": {
  "specifications": {
    "type": "NVMe SSD",
    "interface": "PCIe 4.0 x4",
    "capacity": 1000,
    "readSpeed": 4150,
    "writeSpeed": 4150,
    "formFactor": "M.2 2280"
  },
  "useCaseProfile": {
    "gaming": 8.2,
    "productivity": 8.2,
    "editing": 8,
    "rendering": 7.5,
    "programming": 8.2,
    "ai": 7,
    "streaming": 8
  }
},
  "DeepCool AG400 Single-Tower CPU Air Cooler": {
  "specifications": {
    "coolerType": "Air Cooler",
    "supportedSockets": [
      "AM5",
      "AM4",
      "LGA1700",
      "LGA1851",
      "LGA1200"
    ],
    "height": 150,
    "maxTdp": 220
  },
  "useCaseProfile": {
    "gaming": 7.8,
    "productivity": 7.8,
    "editing": 7.5,
    "rendering": 7,
    "programming": 7.8,
    "ai": 7,
    "streaming": 7.5
  }
},
  "Thermalright Peerless Assassin 120 SE Air Cooler": {
  "specifications": {
    "coolerType": "Air Cooler",
    "supportedSockets": [
      "AM5",
      "AM4",
      "LGA1700",
      "LGA1851",
      "LGA1200"
    ],
    "height": 155,
    "maxTdp": 245
  },
  "useCaseProfile": {
    "gaming": 8.8,
    "productivity": 8.8,
    "editing": 8.5,
    "rendering": 8.2,
    "programming": 8.8,
    "ai": 8,
    "streaming": 8.5
  }
},
  "Ant Esports ICE-112 Mid-Tower Gaming Case": {
  "specifications": {
    "formFactorSupport": [
      "ATX",
      "Micro-ATX",
      "Mini-ITX"
    ],
    "gpuMaxLength": 320,
    "coolerMaxHeight": 160,
    "radiatorSupport": [
      "240mm",
      "120mm"
    ]
  },
  "useCaseProfile": {
    "gaming": 7.5,
    "productivity": 7.5,
    "editing": 7.2,
    "rendering": 7,
    "programming": 7.5,
    "ai": 7,
    "streaming": 7.2
  }
},
  "DeepCool CC560 V2 High-Airflow Mid-Tower Case": {
  "specifications": {
    "formFactorSupport": [
      "ATX",
      "Micro-ATX",
      "Mini-ITX"
    ],
    "gpuMaxLength": 370,
    "coolerMaxHeight": 163,
    "radiatorSupport": [
      "360mm",
      "280mm",
      "240mm",
      "120mm"
    ]
  },
  "useCaseProfile": {
    "gaming": 8.5,
    "productivity": 8.5,
    "editing": 8.2,
    "rendering": 8.2,
    "programming": 8.5,
    "ai": 8,
    "streaming": 8.2
  }
},
  "DeepCool PK650D 650W 80 Plus Bronze Power Supply": {
  "specifications": {
    "wattage": 650,
    "efficiency": "80+ Bronze",
    "modular": "Non",
    "atx3Support": false
  },
  "useCaseProfile": {
    "gaming": 7.8,
    "productivity": 7.8,
    "editing": 7.5,
    "rendering": 7.2,
    "programming": 7.8,
    "ai": 7,
    "streaming": 7.5
  }
},
  "Cooler Master MWE 750 Bronze V2 750W Power Supply": {
  "specifications": {
    "wattage": 750,
    "efficiency": "80+ Bronze",
    "modular": "Non",
    "atx3Support": false
  },
  "useCaseProfile": {
    "gaming": 8.5,
    "productivity": 8.5,
    "editing": 8.2,
    "rendering": 8,
    "programming": 8.2,
    "ai": 7.8,
    "streaming": 8.2
  }
},
  "NVIDIA GeForce RTX 5090 32GB GDDR7": {
    "specifications": {
      "chipset": "GeForce RTX 5090",
      "vram": 32,
      "vramType": "GDDR7",
      "recommendedPsu": 1000,
      "powerDraw": 600,
      "length": 304
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 9.5,
      "editing": 10,
      "rendering": 10,
      "programming": 9,
      "ai": 10,
      "streaming": 10
    }
  },
  "ASUS TUF Gaming GeForce RTX 5080 OC Edition 16GB GDDR7": {
    "specifications": {
      "chipset": "GeForce RTX 5080",
      "vram": 16,
      "vramType": "GDDR7",
      "recommendedPsu": 850,
      "powerDraw": 400,
      "length": 348
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 9,
      "editing": 9.5,
      "rendering": 9.5,
      "programming": 8.5,
      "ai": 9,
      "streaming": 9.5
    }
  },
  "ASUS PRIME GeForce RTX 5080 OC 16GB GDDR7": {
    "specifications": {
      "chipset": "GeForce RTX 5080",
      "vram": 16,
      "vramType": "GDDR7",
      "recommendedPsu": 850,
      "powerDraw": 400,
      "length": 305
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 9,
      "editing": 9.5,
      "rendering": 9.5,
      "programming": 8.5,
      "ai": 9,
      "streaming": 9.5
    }
  },
  "MSI GeForce RTX 5080 16G VENTUS 3X OC": {
    "specifications": {
      "chipset": "GeForce RTX 5080",
      "vram": 16,
      "vramType": "GDDR7",
      "recommendedPsu": 850,
      "powerDraw": 400,
      "length": 305
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 9,
      "editing": 9.5,
      "rendering": 9.5,
      "programming": 8.5,
      "ai": 9,
      "streaming": 9.5
    }
  },
  "NVIDIA GeForce RTX 5070 Ti 16GB GDDR7": {
    "specifications": {
      "chipset": "GeForce RTX 5070 Ti",
      "vram": 16,
      "vramType": "GDDR7",
      "recommendedPsu": 750,
      "powerDraw": 285,
      "length": 285
    },
    "useCaseProfile": {
      "gaming": 9,
      "productivity": 8.5,
      "editing": 8.5,
      "rendering": 8.5,
      "programming": 8,
      "ai": 8.5,
      "streaming": 9
    }
  },
  "Gigabyte GeForce RTX 4090 Gaming OC 24GB GDDR6X": {
    "specifications": {
      "chipset": "GeForce RTX 4090",
      "vram": 24,
      "vramType": "GDDR6X",
      "recommendedPsu": 1000,
      "powerDraw": 450,
      "length": 340
    },
    "useCaseProfile": {
      "gaming": 9.7,
      "productivity": 9.5,
      "editing": 9.8,
      "rendering": 10,
      "programming": 9,
      "ai": 9.8,
      "streaming": 9.5
    }
  },
  "ASUS ROG Strix GeForce RTX 5080 OC 16GB GDDR7": {
    "specifications": {
      "chipset": "GeForce RTX 5080",
      "vram": 16,
      "vramType": "GDDR7",
      "recommendedPsu": 850,
      "powerDraw": 400,
      "length": 358
    },
    "useCaseProfile": {
      "gaming": 9.6,
      "productivity": 9,
      "editing": 9.5,
      "rendering": 9.5,
      "programming": 8.5,
      "ai": 9,
      "streaming": 9.5
    }
  },
  "AMD Ryzen 7 9800X3D Processor (8 Cores / 16 Threads)": {
    "specifications": {
      "socket": "AM5",
      "cores": 8,
      "threads": 16,
      "baseClock": 4.7,
      "boostClock": 5.2,
      "tdp": 120,
      "integratedGraphics": true
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 8.5,
      "editing": 8.5,
      "rendering": 8.5,
      "programming": 9,
      "ai": 7.5,
      "streaming": 9.5
    }
  },
  "AMD Ryzen 9 9950X3D Processor (16 Cores / 32 Threads)": {
    "specifications": {
      "socket": "AM5",
      "cores": 16,
      "threads": 32,
      "baseClock": 4.3,
      "boostClock": 5.7,
      "tdp": 170,
      "integratedGraphics": true
    },
    "useCaseProfile": {
      "gaming": 9.8,
      "productivity": 10,
      "editing": 10,
      "rendering": 10,
      "programming": 10,
      "ai": 9.5,
      "streaming": 10
    }
  },
  "AMD Ryzen 7 7800X3D Processor (8 Cores / 16 Threads)": {
    "specifications": {
      "socket": "AM5",
      "cores": 8,
      "threads": 16,
      "baseClock": 4.2,
      "boostClock": 5,
      "tdp": 120,
      "integratedGraphics": true
    },
    "useCaseProfile": {
      "gaming": 9.7,
      "productivity": 8,
      "editing": 8,
      "rendering": 8,
      "programming": 8.5,
      "ai": 7,
      "streaming": 9
    }
  },
  "Intel Core Ultra 7 265K Desktop Processor (20 Cores / 20 Threads)": {
    "specifications": {
      "socket": "LGA1851",
      "cores": 20,
      "threads": 20,
      "baseClock": 3.9,
      "boostClock": 5.5,
      "tdp": 125,
      "integratedGraphics": true
    },
    "useCaseProfile": {
      "gaming": 8.8,
      "productivity": 9.5,
      "editing": 9.5,
      "rendering": 9,
      "programming": 9.5,
      "ai": 9,
      "streaming": 9
    }
  },
  "Intel Core Ultra 9 285K Flagship Processor (24 Cores / 24 Threads)": {
    "specifications": {
      "socket": "LGA1851",
      "cores": 24,
      "threads": 24,
      "baseClock": 3.7,
      "boostClock": 5.7,
      "tdp": 125,
      "integratedGraphics": true
    },
    "useCaseProfile": {
      "gaming": 9.2,
      "productivity": 10,
      "editing": 10,
      "rendering": 9.8,
      "programming": 10,
      "ai": 9.5,
      "streaming": 9.5
    }
  },
  "Intel Core i9-14900K Desktop Processor (24 Cores / 32 Threads)": {
    "specifications": {
      "socket": "LGA1700",
      "cores": 24,
      "threads": 32,
      "baseClock": 3.2,
      "boostClock": 6,
      "tdp": 125,
      "integratedGraphics": true
    },
    "useCaseProfile": {
      "gaming": 9.3,
      "productivity": 9.8,
      "editing": 9.8,
      "rendering": 9.8,
      "programming": 9.8,
      "ai": 8.5,
      "streaming": 9.5
    }
  },
  "AMD Ryzen 9 7950X3D Desktop Processor (16 Cores / 32 Threads)": {
    "specifications": {
      "socket": "AM5",
      "cores": 16,
      "threads": 32,
      "baseClock": 4.2,
      "boostClock": 5.7,
      "tdp": 120,
      "integratedGraphics": true
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 9.8,
      "editing": 9.8,
      "rendering": 9.8,
      "programming": 9.8,
      "ai": 9,
      "streaming": 9.8
    }
  },
  "ASUS ROG Strix B650-A Gaming WiFi Motherboard": {
    "specifications": {
      "socket": "AM5",
      "chipset": "AMD B650",
      "formFactor": "ATX",
      "memoryType": "DDR5",
      "maxMemory": 192,
      "memorySlots": 4,
      "maxMemorySpeed": 7600,
      "pciExpressGeneration": "PCIe 5.0"
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 9,
      "editing": 9,
      "rendering": 9,
      "programming": 9,
      "ai": 8.5,
      "streaming": 9
    }
  },
  "Gigabyte B650 Eagle AX WiFi Motherboard": {
    "specifications": {
      "socket": "AM5",
      "chipset": "AMD B650",
      "formFactor": "ATX",
      "memoryType": "DDR5",
      "maxMemory": 192,
      "memorySlots": 4,
      "maxMemorySpeed": 7600,
      "pciExpressGeneration": "PCIe 5.0"
    },
    "useCaseProfile": {
      "gaming": 8.5,
      "productivity": 8.5,
      "editing": 8,
      "rendering": 8,
      "programming": 8.5,
      "ai": 8,
      "streaming": 8.5
    }
  },
  "Gigabyte B650 Gaming X AX V2 WiFi Motherboard": {
    "specifications": {
      "socket": "AM5",
      "chipset": "AMD B650",
      "formFactor": "ATX",
      "memoryType": "DDR5",
      "maxMemory": 192,
      "memorySlots": 4,
      "maxMemorySpeed": 8000,
      "pciExpressGeneration": "PCIe 5.0"
    },
    "useCaseProfile": {
      "gaming": 8.8,
      "productivity": 8.5,
      "editing": 8.5,
      "rendering": 8.5,
      "programming": 8.5,
      "ai": 8,
      "streaming": 8.5
    }
  },
  "MSI MAG B650M Mortar WiFi Motherboard": {
    "specifications": {
      "socket": "AM5",
      "chipset": "AMD B650",
      "formFactor": "Micro-ATX",
      "memoryType": "DDR5",
      "maxMemory": 192,
      "memorySlots": 4,
      "maxMemorySpeed": 7600,
      "pciExpressGeneration": "PCIe 4.0"
    },
    "useCaseProfile": {
      "gaming": 8.8,
      "productivity": 8.5,
      "editing": 8.5,
      "rendering": 8.5,
      "programming": 8.5,
      "ai": 8,
      "streaming": 8.5
    }
  },
  "ASRock B650 Pro RS Motherboard": {
    "specifications": {
      "socket": "AM5",
      "chipset": "AMD B650",
      "formFactor": "ATX",
      "memoryType": "DDR5",
      "maxMemory": 192,
      "memorySlots": 4,
      "maxMemorySpeed": 7200,
      "pciExpressGeneration": "PCIe 5.0"
    },
    "useCaseProfile": {
      "gaming": 8.5,
      "productivity": 8.5,
      "editing": 8,
      "rendering": 8,
      "programming": 8.5,
      "ai": 8,
      "streaming": 8
    }
  },
  "ASUS ROG Crosshair X670E Hero Motherboard": {
    "specifications": {
      "socket": "AM5",
      "chipset": "AMD X670E",
      "formFactor": "ATX",
      "memoryType": "DDR5",
      "maxMemory": 192,
      "memorySlots": 4,
      "maxMemorySpeed": 8000,
      "pciExpressGeneration": "PCIe 5.0"
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 10,
      "editing": 10,
      "rendering": 10,
      "programming": 10,
      "ai": 10,
      "streaming": 10
    }
  },
  "ASUS ROG Swift OLED PG27AQDM 27-inch 240Hz Gaming Monitor": {
    "specifications": {
      "screenSize": 27,
      "resolution": "2560x1440 (QHD)",
      "refreshRate": 240,
      "panelType": "OLED",
      "responseTime": 0.03,
      "connectionType": "DisplayPort 1.4, HDMI 2.0"
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 7.5,
      "editing": 8.5,
      "rendering": 7.5,
      "programming": 7.5,
      "ai": 6,
      "streaming": 9
    }
  },
  "ASUS TUF Gaming VG27AQ3A 27-inch 180Hz QHD IPS Monitor": {
    "specifications": {
      "screenSize": 27,
      "resolution": "2560x1440 (QHD)",
      "refreshRate": 180,
      "panelType": "Fast IPS",
      "responseTime": 1,
      "connectionType": "DisplayPort 1.2, HDMI 2.0"
    },
    "useCaseProfile": {
      "gaming": 8.5,
      "productivity": 8.5,
      "editing": 8,
      "rendering": 7.5,
      "programming": 8.5,
      "ai": 6,
      "streaming": 8
    }
  },
  "Dell UltraSharp U2724D 27-inch IPS Black 120Hz Professional Monitor": {
    "specifications": {
      "screenSize": 27,
      "resolution": "2560x1440 (QHD)",
      "refreshRate": 120,
      "panelType": "IPS Black",
      "responseTime": 5,
      "connectionType": "DisplayPort 1.4, HDMI, USB-C"
    },
    "useCaseProfile": {
      "gaming": 7,
      "productivity": 10,
      "editing": 9.5,
      "rendering": 9,
      "programming": 10,
      "ai": 7,
      "streaming": 8
    }
  },
  "Samsung Odyssey OLED G6 (G60SD) 27-inch 360Hz Gaming Monitor": {
    "specifications": {
      "screenSize": 27,
      "resolution": "2560x1440 (QHD)",
      "refreshRate": 360,
      "panelType": "OLED",
      "responseTime": 0.03,
      "connectionType": "DisplayPort 1.4, HDMI 2.1"
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 7,
      "editing": 8,
      "rendering": 7,
      "programming": 7,
      "ai": 6,
      "streaming": 9
    }
  },
  "BenQ PD2706U 27-inch 4K UHD DesignVue Creator Monitor": {
    "specifications": {
      "screenSize": 27,
      "resolution": "3840x2160 (4K UHD)",
      "refreshRate": 60,
      "panelType": "IPS",
      "responseTime": 5,
      "connectionType": "Thunderbolt 3 / USB-C, DisplayPort 1.4, HDMI 2.0"
    },
    "useCaseProfile": {
      "gaming": 5.5,
      "productivity": 10,
      "editing": 10,
      "rendering": 9.5,
      "programming": 9.5,
      "ai": 7.5,
      "streaming": 7.5
    }
  },
  "LG UltraGear 27GR95QE-B 27-inch QHD OLED 240Hz Gaming Monitor": {
    "specifications": {
      "screenSize": 27,
      "resolution": "2560x1440 (QHD)",
      "refreshRate": 240,
      "panelType": "OLED",
      "responseTime": 0.03,
      "connectionType": "DisplayPort 1.4, HDMI 2.1"
    },
    "useCaseProfile": {
      "gaming": 9.8,
      "productivity": 7.5,
      "editing": 8.5,
      "rendering": 7.5,
      "programming": 7.5,
      "ai": 6,
      "streaming": 9
    }
  },
  "Logitech G Pro X Superlight 2 Wireless Gaming Mouse": {
    "specifications": {
      "connectionType": "LIGHTSPEED Wireless, USB-C",
      "responseTime": 0.25
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 8,
      "editing": 7.5,
      "rendering": 7,
      "programming": 8,
      "ai": 5,
      "streaming": 9
    }
  },
  "Logitech G502 X Lightspeed Wireless RGB Gaming Mouse": {
    "specifications": {
      "connectionType": "LIGHTSPEED Wireless, USB-C",
      "responseTime": 1
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 9,
      "editing": 9,
      "rendering": 8.5,
      "programming": 9,
      "ai": 5,
      "streaming": 9
    }
  },
  "Razer BlackWidow V4 75% Mechanical Gaming Keyboard": {
    "specifications": {
      "switchType": "Razer Orange Tactile (Hot-swappable)",
      "connectionType": "Detachable USB-C"
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 8.5,
      "editing": 8,
      "rendering": 7,
      "programming": 9,
      "ai": 5,
      "streaming": 9
    }
  },
  "Keychron Q1 Pro QMK/VIA Wireless Custom Mechanical Keyboard": {
    "specifications": {
      "switchType": "Keychron K Pro Red (Hot-swappable)",
      "connectionType": "Bluetooth 5.1 & Type-C"
    },
    "useCaseProfile": {
      "gaming": 8.5,
      "productivity": 10,
      "editing": 9.5,
      "rendering": 8.5,
      "programming": 10,
      "ai": 6,
      "streaming": 8.5
    }
  },
  "Keychron K2 V2 Wireless Bluetooth Mechanical Keyboard": {
    "specifications": {
      "switchType": "Gateron G Pro Brown",
      "connectionType": "Bluetooth 5.1 & Type-C"
    },
    "useCaseProfile": {
      "gaming": 8,
      "productivity": 9.5,
      "editing": 8.5,
      "rendering": 7.5,
      "programming": 9.5,
      "ai": 5,
      "streaming": 8
    }
  },
  "Logitech MX Master 3S Wireless Performance Mouse": {
    "specifications": {
      "connectionType": "Bluetooth Low Energy & Logi Bolt",
      "responseTime": 4
    },
    "useCaseProfile": {
      "gaming": 6,
      "productivity": 10,
      "editing": 10,
      "rendering": 9.5,
      "programming": 10,
      "ai": 6,
      "streaming": 8.5
    }
  },
  "Wooting 80HE Rapid Trigger Magnetic Gaming Keyboard": {
    "specifications": {
      "switchType": "Lekker Hall Effect Magnetic Switches (Analog)",
      "connectionType": "USB-C"
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 8,
      "editing": 7.5,
      "rendering": 7,
      "programming": 8.5,
      "ai": 5,
      "streaming": 9
    }
  },
  "NZXT Kraken 360 RGB Liquid Cooler (360mm AIO)": {
    "specifications": {
      "coolerType": "AIO Liquid Cooler",
      "supportedSockets": [
        "AM5",
        "AM4",
        "LGA1700",
        "LGA1851",
        "LGA1200"
      ],
      "radiatorSize": 360,
      "maxTdp": 300
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 9.5,
      "editing": 9.5,
      "rendering": 9.5,
      "programming": 9,
      "ai": 9,
      "streaming": 9.5
    }
  },
  "Arctic Liquid Freezer III 360 Black Liquid Cooler": {
    "specifications": {
      "coolerType": "AIO Liquid Cooler",
      "supportedSockets": [
        "AM5",
        "AM4",
        "LGA1700",
        "LGA1851"
      ],
      "radiatorSize": 360,
      "maxTdp": 320
    },
    "useCaseProfile": {
      "gaming": 9.8,
      "productivity": 10,
      "editing": 10,
      "rendering": 10,
      "programming": 9.5,
      "ai": 9.5,
      "streaming": 9.8
    }
  },
  "DeepCool AK620 High-Performance Dual Tower Air Cooler": {
    "specifications": {
      "coolerType": "Air Cooler",
      "supportedSockets": [
        "AM5",
        "AM4",
        "LGA1700",
        "LGA1851",
        "LGA1200"
      ],
      "height": 160,
      "maxTdp": 260
    },
    "useCaseProfile": {
      "gaming": 9,
      "productivity": 9,
      "editing": 8.8,
      "rendering": 8.8,
      "programming": 9,
      "ai": 8.5,
      "streaming": 9
    }
  },
  "Noctua NH-D15 chromax.black Dual-Tower CPU Cooler": {
    "specifications": {
      "coolerType": "Air Cooler",
      "supportedSockets": [
        "AM5",
        "AM4",
        "LGA1700",
        "LGA1851",
        "LGA1200"
      ],
      "height": 165,
      "maxTdp": 250
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 9.5,
      "editing": 9.5,
      "rendering": 9.5,
      "programming": 9.5,
      "ai": 9,
      "streaming": 9.5
    }
  },
  "Fractal Design North Charcoal Black Mid-Tower Case": {
    "specifications": {
      "formFactorSupport": [
        "ATX",
        "Micro-ATX",
        "Mini-ITX"
      ],
      "gpuMaxLength": 355,
      "coolerMaxHeight": 170,
      "radiatorSupport": [
        "360mm",
        "280mm",
        "240mm",
        "120mm"
      ]
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 10,
      "editing": 10,
      "rendering": 9.5,
      "programming": 10,
      "ai": 9,
      "streaming": 9.5
    }
  },
  "Lian Li Lancool 216 RGB Mid-Tower Gaming Case": {
    "specifications": {
      "formFactorSupport": [
        "E-ATX",
        "ATX",
        "Micro-ATX",
        "Mini-ITX"
      ],
      "gpuMaxLength": 392,
      "coolerMaxHeight": 180,
      "radiatorSupport": [
        "360mm",
        "280mm",
        "240mm"
      ]
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 9,
      "editing": 9,
      "rendering": 9.5,
      "programming": 9,
      "ai": 9.5,
      "streaming": 9.5
    }
  },
  "Corsair 5000D Airflow Tempered Glass Mid-Tower Case": {
    "specifications": {
      "formFactorSupport": [
        "ATX",
        "Micro-ATX",
        "Mini-ITX"
      ],
      "gpuMaxLength": 400,
      "coolerMaxHeight": 170,
      "radiatorSupport": [
        "360mm",
        "280mm",
        "240mm",
        "120mm"
      ]
    },
    "useCaseProfile": {
      "gaming": 9.8,
      "productivity": 9.5,
      "editing": 9.5,
      "rendering": 10,
      "programming": 9.5,
      "ai": 9.5,
      "streaming": 9.8
    }
  },
  "WD Black SN850X 2TB NVMe PCIe Gen4 M.2 SSD": {
    "specifications": {
      "type": "NVMe SSD",
      "interface": "PCIe 4.0 x4",
      "capacity": 2000,
      "readSpeed": 7300,
      "writeSpeed": 6600,
      "formFactor": "M.2 2280"
    },
    "useCaseProfile": {
      "gaming": 9.8,
      "productivity": 9.5,
      "editing": 9.5,
      "rendering": 9.5,
      "programming": 9.5,
      "ai": 9,
      "streaming": 9.5
    }
  },
  "Samsung 990 PRO 2TB NVMe PCIe 4.0 M.2 SSD": {
    "specifications": {
      "type": "NVMe SSD",
      "interface": "PCIe 4.0 x4",
      "capacity": 2000,
      "readSpeed": 7450,
      "writeSpeed": 6900,
      "formFactor": "M.2 2280"
    },
    "useCaseProfile": {
      "gaming": 9.8,
      "productivity": 9.8,
      "editing": 10,
      "rendering": 10,
      "programming": 9.8,
      "ai": 9.5,
      "streaming": 9.8
    }
  },
  "Samsung 990 PRO 4TB NVMe PCIe 4.0 M.2 SSD": {
    "specifications": {
      "type": "NVMe SSD",
      "interface": "PCIe 4.0 x4",
      "capacity": 4000,
      "readSpeed": 7450,
      "writeSpeed": 6900,
      "formFactor": "M.2 2280"
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 10,
      "editing": 10,
      "rendering": 10,
      "programming": 10,
      "ai": 10,
      "streaming": 10
    }
  },
  "Crucial T705 2TB PCIe Gen5 NVMe M.2 SSD with Heatsink": {
    "specifications": {
      "type": "NVMe SSD",
      "interface": "PCIe 5.0 x4",
      "capacity": 2000,
      "readSpeed": 14500,
      "writeSpeed": 12700,
      "formFactor": "M.2 2280"
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 10,
      "editing": 10,
      "rendering": 10,
      "programming": 10,
      "ai": 10,
      "streaming": 10
    }
  },
  "Kingston KC3000 1TB PCIe 4.0 NVMe M.2 SSD": {
    "specifications": {
      "type": "NVMe SSD",
      "interface": "PCIe 4.0 x4",
      "capacity": 1000,
      "readSpeed": 7000,
      "writeSpeed": 6000,
      "formFactor": "M.2 2280"
    },
    "useCaseProfile": {
      "gaming": 9,
      "productivity": 9,
      "editing": 8.8,
      "rendering": 8.8,
      "programming": 9,
      "ai": 8,
      "streaming": 9
    }
  },
  "G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5-6000 CL30": {
    "specifications": {
      "memoryType": "DDR5",
      "capacity": 32,
      "speed": 6000,
      "modules": "2x16GB",
      "formFactor": "DIMM"
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 9,
      "editing": 9,
      "rendering": 8.5,
      "programming": 9,
      "ai": 8,
      "streaming": 9.5
    }
  },
  "Corsair Vengeance RGB 32GB (2x16GB) DDR5-6000 CL36": {
    "specifications": {
      "memoryType": "DDR5",
      "capacity": 32,
      "speed": 6000,
      "modules": "2x16GB",
      "formFactor": "DIMM"
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 9,
      "editing": 9,
      "rendering": 8.5,
      "programming": 9,
      "ai": 8,
      "streaming": 9
    }
  },
  "Kingston Fury Beast RGB 32GB (2x16GB) DDR5-6000 CL36": {
    "specifications": {
      "memoryType": "DDR5",
      "capacity": 32,
      "speed": 6000,
      "modules": "2x16GB",
      "formFactor": "DIMM"
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 9,
      "editing": 9,
      "rendering": 8.5,
      "programming": 9,
      "ai": 8,
      "streaming": 9
    }
  },
  "G.Skill Trident Z5 RGB 64GB (2x32GB) DDR5-6000 CL30": {
    "specifications": {
      "memoryType": "DDR5",
      "capacity": 64,
      "speed": 6000,
      "modules": "2x32GB",
      "formFactor": "DIMM"
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 10,
      "editing": 10,
      "rendering": 10,
      "programming": 10,
      "ai": 9.5,
      "streaming": 10
    }
  },
  "Corsair Vengeance 96GB (2x48GB) DDR5-5600 CL40 Workstation Kit": {
    "specifications": {
      "memoryType": "DDR5",
      "capacity": 96,
      "speed": 5600,
      "modules": "2x48GB",
      "formFactor": "DIMM"
    },
    "useCaseProfile": {
      "gaming": 9,
      "productivity": 10,
      "editing": 10,
      "rendering": 10,
      "programming": 10,
      "ai": 10,
      "streaming": 10
    }
  },
  "GearGrid Apex Gaming Rig (Blackwell Extreme Edition)": {
    "specifications": {
      "prebuiltSpecs": {
        "cpu": "AMD Ryzen 7 9800X3D",
        "gpu": "NVIDIA GeForce RTX 5090 32GB",
        "ram": "64GB DDR5-6000",
        "storage": "2TB Gen4 NVMe",
        "psu": "1200W ATX 3.0",
        "cooling": "360mm AIO Liquid Cooler",
        "chassis": "Fractal Design North XL"
      }
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 9.8,
      "editing": 10,
      "rendering": 10,
      "programming": 9.8,
      "ai": 10,
      "streaming": 10
    }
  },
  "GearGrid Titan 5080 4K Gaming Rig": {
    "specifications": {
      "prebuiltSpecs": {
        "cpu": "AMD Ryzen 9 9950X3D",
        "gpu": "ASUS TUF RTX 5080 16GB",
        "ram": "32GB DDR5-6000",
        "storage": "2TB Gen4 NVMe",
        "psu": "1000W 80+ Gold",
        "cooling": "360mm AIO Liquid Cooler",
        "chassis": "Lian Li Lancool 216"
      }
    },
    "useCaseProfile": {
      "gaming": 9.8,
      "productivity": 10,
      "editing": 9.8,
      "rendering": 9.8,
      "programming": 9.8,
      "ai": 9.5,
      "streaming": 10
    }
  },
  "GearGrid Velocity 5070 Ti High-Framerate Gaming Rig": {
    "specifications": {
      "prebuiltSpecs": {
        "cpu": "AMD Ryzen 7 7800X3D",
        "gpu": "NVIDIA GeForce RTX 5070 Ti 16GB",
        "ram": "32GB DDR5-6000",
        "storage": "2TB Gen5 NVMe",
        "psu": "850W 80+ Gold",
        "cooling": "DeepCool AK620 Dual-Tower",
        "chassis": "Fractal Design North"
      }
    },
    "useCaseProfile": {
      "gaming": 9.5,
      "productivity": 8.5,
      "editing": 8.5,
      "rendering": 8.5,
      "programming": 8.8,
      "ai": 8.5,
      "streaming": 9.2
    }
  },
  "GearGrid Phantom Competitive Gaming Rig": {
    "specifications": {
      "prebuiltSpecs": {
        "cpu": "Intel Core Ultra 7 265K",
        "gpu": "MSI GeForce RTX 5080 16GB",
        "ram": "32GB DDR5-6000",
        "storage": "2TB NVMe",
        "psu": "850W 80+ Gold",
        "cooling": "Arctic Liquid Freezer III 360",
        "chassis": "Lian Li Lancool 216"
      }
    },
    "useCaseProfile": {
      "gaming": 9.6,
      "productivity": 9.5,
      "editing": 9.2,
      "rendering": 9.2,
      "programming": 9.5,
      "ai": 9,
      "streaming": 9.5
    }
  },
  "GearGrid Forge 1440p Performance Gaming Rig": {
    "specifications": {
      "prebuiltSpecs": {
        "cpu": "AMD Ryzen 7 7700X",
        "gpu": "ASUS PRIME GeForce RTX 5080 16GB",
        "ram": "32GB DDR5-6000",
        "storage": "1TB Gen4 NVMe",
        "psu": "750W 80+ Gold",
        "cooling": "DeepCool AK620 Air Cooler",
        "chassis": "Corsair 4000D Airflow"
      }
    },
    "useCaseProfile": {
      "gaming": 9.4,
      "productivity": 8.8,
      "editing": 8.8,
      "rendering": 8.8,
      "programming": 9,
      "ai": 8.5,
      "streaming": 9
    }
  },
  "GearGrid 4K Creator Studio PC": {
    "specifications": {
      "prebuiltSpecs": {
        "cpu": "AMD Ryzen 9 9950X3D",
        "gpu": "ASUS TUF RTX 5080 16GB",
        "ram": "64GB DDR5-6000",
        "storage": "6TB Gen4 NVMe (2TB + 4TB)",
        "psu": "1000W 80+ Gold",
        "cooling": "Arctic Liquid Freezer III 360",
        "chassis": "Lian Li Lancool 216 Mesh"
      }
    },
    "useCaseProfile": {
      "gaming": 9.6,
      "productivity": 10,
      "editing": 10,
      "rendering": 10,
      "programming": 10,
      "ai": 9.5,
      "streaming": 9.8
    }
  },
  "GearGrid Studio Workstation (3D & AI Acceleration)": {
    "specifications": {
      "prebuiltSpecs": {
        "cpu": "Intel Core Ultra 9 285K",
        "gpu": "NVIDIA GeForce RTX 5080 16GB",
        "ram": "96GB DDR5-5600",
        "storage": "6TB NVMe (2TB Gen5 + 4TB Gen4)",
        "psu": "1000W 80+ Gold",
        "cooling": "Noctua NH-D15 chromax.black",
        "chassis": "Fractal Design North Mesh"
      }
    },
    "useCaseProfile": {
      "gaming": 9.2,
      "productivity": 10,
      "editing": 10,
      "rendering": 10,
      "programming": 10,
      "ai": 10,
      "streaming": 9.5
    }
  },
  "HP Z2 Tower G9 Workstation Configuration": {
    "specifications": {
      "prebuiltSpecs": {
        "cpu": "Intel Core i9-14900K",
        "gpu": "NVIDIA RTX 4080 Super 16GB",
        "ram": "64GB DDR5 ECC",
        "storage": "2TB Gen4 NVMe",
        "psu": "700W 92% Efficiency",
        "cooling": "HP Vented Liquid Cooling",
        "chassis": "HP Z2 Industrial Tower"
      }
    },
    "useCaseProfile": {
      "gaming": 8.8,
      "productivity": 9.8,
      "editing": 9.8,
      "rendering": 9.8,
      "programming": 9.8,
      "ai": 9.2,
      "streaming": 9
    }
  },
  "Dell Precision 3680 Tower Workstation Configuration": {
    "specifications": {
      "prebuiltSpecs": {
        "cpu": "Intel Core i9-14900",
        "gpu": "NVIDIA RTX 4080 16GB",
        "ram": "64GB DDR5 ECC",
        "storage": "2TB Gen4 NVMe",
        "psu": "1000W Platinum Certified",
        "cooling": "Dell Precision Dual-Fan",
        "chassis": "Dell Precision 3680 Security Tower"
      }
    },
    "useCaseProfile": {
      "gaming": 8.5,
      "productivity": 9.8,
      "editing": 9.8,
      "rendering": 9.8,
      "programming": 9.8,
      "ai": 9,
      "streaming": 9
    }
  },
  "GearGrid Horizon Office & Pro Station": {
    "specifications": {
      "prebuiltSpecs": {
        "cpu": "Intel Core Ultra 7 265K",
        "gpu": "Intel Iris Xe Integrated / RTX 5070 Ti Ready",
        "ram": "32GB DDR5-5600",
        "storage": "1TB Gen4 NVMe",
        "psu": "750W 80+ Gold",
        "cooling": "DeepCool Air Cooler",
        "chassis": "Fractal Design Mesh"
      }
    },
    "useCaseProfile": {
      "gaming": 6.5,
      "productivity": 9.5,
      "editing": 8.5,
      "rendering": 8,
      "programming": 9.5,
      "ai": 8,
      "streaming": 8
    }
  },
  "Corsair RM1000x 1000W 80+ Gold Fully Modular Power Supply": {
    "specifications": {
      "wattage": 1000,
      "efficiency": "80+ Gold",
      "modular": "Full",
      "atx3Support": true
    },
    "useCaseProfile": {
      "gaming": 9.8,
      "productivity": 9.8,
      "editing": 9.8,
      "rendering": 9.8,
      "programming": 9.5,
      "ai": 9.8,
      "streaming": 9.8
    }
  },
  "Seasonic Focus GX-850 850W 80+ Gold Modular Power Supply": {
    "specifications": {
      "wattage": 850,
      "efficiency": "80+ Gold",
      "modular": "Full",
      "atx3Support": false
    },
    "useCaseProfile": {
      "gaming": 9.2,
      "productivity": 9.2,
      "editing": 9.2,
      "rendering": 9.2,
      "programming": 9.2,
      "ai": 9,
      "streaming": 9.2
    }
  },
  "be quiet! Pure Power 12 M 850W 80+ Gold ATX 3.0 Power Supply": {
    "specifications": {
      "wattage": 850,
      "efficiency": "80+ Gold",
      "modular": "Full",
      "atx3Support": true
    },
    "useCaseProfile": {
      "gaming": 9.4,
      "productivity": 9.4,
      "editing": 9.4,
      "rendering": 9.4,
      "programming": 9.2,
      "ai": 9.2,
      "streaming": 9.4
    }
  },
  "Corsair RM1200x Shift 1200W 80+ Gold Fully Modular ATX 3.0 PSU": {
    "specifications": {
      "wattage": 1200,
      "efficiency": "80+ Gold",
      "modular": "Full",
      "atx3Support": true
    },
    "useCaseProfile": {
      "gaming": 10,
      "productivity": 10,
      "editing": 10,
      "rendering": 10,
      "programming": 10,
      "ai": 10,
      "streaming": 10
    }
  },
  "Corsair RM750e 750W 80+ Gold Fully Modular Power Supply": {
    "specifications": {
      "wattage": 750,
      "efficiency": "80+ Gold",
      "modular": "Full",
      "atx3Support": true
    },
    "useCaseProfile": {
      "gaming": 8.8,
      "productivity": 8.8,
      "editing": 8.8,
      "rendering": 8.8,
      "programming": 8.8,
      "ai": 8.5,
      "streaming": 8.8
    }
  }
};

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
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "nvidia_geforce_rtx_5090__img1" },
      { url: "https://images.unsplash.com/photo-1555618254-84e2cf498b01?auto=format&fit=crop&w=1200&q=80", publicId: "nvidia_geforce_rtx_5090__img2" },
      { url: "https://images.unsplash.com/photo-1601153211050-ae2e1fa428d7?auto=format&fit=crop&w=1200&q=80", publicId: "nvidia_geforce_rtx_5090__img3" }
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
      { url: "https://images.unsplash.com/photo-1604754742629-3e5728249d73?auto=format&fit=crop&w=1200&q=80", publicId: "asus_tuf_gaming_geforce__img1" },
      { url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80", publicId: "asus_tuf_gaming_geforce__img2" }
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
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "asus_prime_geforce_rtx_5_img1" },
      { url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80", publicId: "asus_prime_geforce_rtx_5_img2" }
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
      { url: "https://images.unsplash.com/photo-1531500435567-d5a03bbb46a6?auto=format&fit=crop&w=1200&q=80", publicId: "msi_geforce_rtx_5080_16g_img1" },
      { url: "https://images.unsplash.com/photo-1542730251-bacb0e880133?auto=format&fit=crop&w=1200&q=80", publicId: "msi_geforce_rtx_5080_16g_img2" }
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
      { url: "https://images.unsplash.com/photo-1551640179-9e39f8055291?auto=format&fit=crop&w=1200&q=80", publicId: "nvidia_geforce_rtx_5070__img1" },
      { url: "https://images.unsplash.com/photo-1555618565-9f2b0323a10d?auto=format&fit=crop&w=1200&q=80", publicId: "nvidia_geforce_rtx_5070__img2" }
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
      { url: "https://images.unsplash.com/photo-1562136935-2c010ce547b7?auto=format&fit=crop&w=1200&q=80", publicId: "gigabyte_geforce_rtx_409_img1" },
      { url: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?auto=format&fit=crop&w=1200&q=80", publicId: "gigabyte_geforce_rtx_409_img2" }
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
      { url: "https://images.unsplash.com/photo-1634672350437-f9632adc9c3f?auto=format&fit=crop&w=1200&q=80", publicId: "asus_rog_strix_geforce_r_img1" },
      { url: "https://images.unsplash.com/photo-1612952020559-c68992a70529?auto=format&fit=crop&w=1200&q=80", publicId: "asus_rog_strix_geforce_r_img2" }
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
      { url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80", publicId: "amd_ryzen_7_9800x3d_proc_img1" },
      { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80", publicId: "amd_ryzen_7_9800x3d_proc_img2" }
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
      { url: "https://images.unsplash.com/photo-1551642044-b5e65d8a7fac?auto=format&fit=crop&w=1200&q=80", publicId: "amd_ryzen_9_9950x3d_proc_img1" },
      { url: "https://images.unsplash.com/photo-1555617778-02518510b9fa?auto=format&fit=crop&w=1200&q=80", publicId: "amd_ryzen_9_9950x3d_proc_img2" }
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
      { url: "https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=1200&q=80", publicId: "amd_ryzen_7_7800x3d_proc_img1" },
      { url: "https://images.unsplash.com/photo-1678957949479-b1e876bee3f1?auto=format&fit=crop&w=1200&q=80", publicId: "amd_ryzen_7_7800x3d_proc_img2" }
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
      { url: "https://images.unsplash.com/photo-1716436329478-e4261139e1ca?auto=format&fit=crop&w=1200&q=80", publicId: "intel_core_ultra_7_265k__img1" },
      { url: "https://plus.unsplash.com/premium_photo-1729871881761-5e92926c88bb?auto=format&fit=crop&w=1200&q=80", publicId: "intel_core_ultra_7_265k__img2" }
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
      { url: "https://images.unsplash.com/photo-1540829917886-91ab031b1764?auto=format&fit=crop&w=1200&q=80", publicId: "intel_core_ultra_9_285k__img1" },
      { url: "https://images.unsplash.com/photo-1555616635-96c8fef588c1?auto=format&fit=crop&w=1200&q=80", publicId: "intel_core_ultra_9_285k__img2" }
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
      { url: "https://images.unsplash.com/photo-1555616635-640b71bdb185?auto=format&fit=crop&w=1200&q=80", publicId: "intel_core_i9_14900k_des_img1" },
      { url: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=1200&q=80", publicId: "intel_core_i9_14900k_des_img2" }
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
      { url: "https://images.unsplash.com/photo-1561972465-05c968dc2c91?auto=format&fit=crop&w=1200&q=80", publicId: "amd_ryzen_9_7950x3d_desk_img1" },
      { url: "https://images.unsplash.com/photo-1575296505699-7648cf327b3b?auto=format&fit=crop&w=1200&q=80", publicId: "amd_ryzen_9_7950x3d_desk_img2" }
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
      { url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80", publicId: "asus_rog_strix_b650_a_ga_img1" },
      { url: "https://images.unsplash.com/photo-1532188363366-3a1b2ac4a338?auto=format&fit=crop&w=1200&q=80", publicId: "asus_rog_strix_b650_a_ga_img2" }
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
      { url: "https://images.unsplash.com/photo-1535136104956-115a2cd67fc4?auto=format&fit=crop&w=1200&q=80", publicId: "gigabyte_b650_eagle_ax_w_img1" },
      { url: "https://images.unsplash.com/photo-1537313796346-65fb768b1ebd?auto=format&fit=crop&w=1200&q=80", publicId: "gigabyte_b650_eagle_ax_w_img2" }
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
      { url: "https://images.unsplash.com/photo-1538180034828-ca03b3710451?auto=format&fit=crop&w=1200&q=80", publicId: "gigabyte_b650_gaming_x_a_img1" },
      { url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80", publicId: "gigabyte_b650_gaming_x_a_img2" }
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
      { url: "https://images.unsplash.com/photo-1557855506-3619a44bab73?auto=format&fit=crop&w=1200&q=80", publicId: "msi_mag_b650m_mortar_wif_img1" },
      { url: "https://images.unsplash.com/photo-1579803166067-eb82186c1aa3?auto=format&fit=crop&w=1200&q=80", publicId: "msi_mag_b650m_mortar_wif_img2" }
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
      { url: "https://images.unsplash.com/photo-1579803166678-7acf374cfe52?auto=format&fit=crop&w=1200&q=80", publicId: "asrock_b650_pro_rs_mothe_img1" },
      { url: "https://images.unsplash.com/photo-1579803168094-b93f4b2e58c1?auto=format&fit=crop&w=1200&q=80", publicId: "asrock_b650_pro_rs_mothe_img2" }
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
      { url: "https://images.unsplash.com/photo-1579803270477-eed1a57ddefc?auto=format&fit=crop&w=1200&q=80", publicId: "asus_rog_crosshair_x670e_img1" },
      { url: "https://images.unsplash.com/photo-1579803270279-0e5cabff7dc8?auto=format&fit=crop&w=1200&q=80", publicId: "asus_rog_crosshair_x670e_img2" }
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
      { url: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80", publicId: "asus_rog_swift_oled_pg27_img1" },
      { url: "https://images.unsplash.com/photo-1522684894605-cdcdf44be259?auto=format&fit=crop&w=1200&q=80", publicId: "asus_rog_swift_oled_pg27_img2" }
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
      { url: "https://images.unsplash.com/photo-1525183480399-e8706926adac?auto=format&fit=crop&w=1200&q=80", publicId: "asus_tuf_gaming_vg27aq3a_img1" },
      { url: "https://images.unsplash.com/photo-1526374870839-e155464bb9b2?auto=format&fit=crop&w=1200&q=80", publicId: "asus_tuf_gaming_vg27aq3a_img2" }
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
      { url: "https://images.unsplash.com/photo-1527800792452-506aacb2101f?auto=format&fit=crop&w=1200&q=80", publicId: "dell_ultrasharp_u2724d_2_img1" },
      { url: "https://images.unsplash.com/photo-1529338296731-c4280a44fc48?auto=format&fit=crop&w=1200&q=80", publicId: "dell_ultrasharp_u2724d_2_img2" }
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
      { url: "https://images.unsplash.com/photo-1533326021152-7ae7008635de?auto=format&fit=crop&w=1200&q=80", publicId: "samsung_odyssey_oled_g6__img1" },
      { url: "https://images.unsplash.com/photo-1536148935331-408321065b18?auto=format&fit=crop&w=1200&q=80", publicId: "samsung_odyssey_oled_g6__img2" }
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
      { url: "https://images.unsplash.com/photo-1537845161697-51873cdf49e3?auto=format&fit=crop&w=1200&q=80", publicId: "benq_pd2706u_27_inch_4k__img1" },
      { url: "https://images.unsplash.com/photo-1538330496851-c475c75a7631?auto=format&fit=crop&w=1200&q=80", publicId: "benq_pd2706u_27_inch_4k__img2" }
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
      { url: "https://images.unsplash.com/photo-1538370621607-4919ce7889b3?auto=format&fit=crop&w=1200&q=80", publicId: "lg_ultragear_27gr95qe_b__img1" },
      { url: "https://images.unsplash.com/photo-1538652116325-8f5fa30fefff?auto=format&fit=crop&w=1200&q=80", publicId: "lg_ultragear_27gr95qe_b__img2" }
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
      { url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80", publicId: "logitech_g_pro_x_superli_img1" },
      { url: "https://images.unsplash.com/photo-1542023041311-0ccf63dad0fc?auto=format&fit=crop&w=1200&q=80", publicId: "logitech_g_pro_x_superli_img2" }
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
      { url: "https://images.unsplash.com/photo-1547142632-bca340742184?auto=format&fit=crop&w=1200&q=80", publicId: "logitech_g502_x_lightspe_img1" },
      { url: "https://images.unsplash.com/photo-1547489401-fcada4966052?auto=format&fit=crop&w=1200&q=80", publicId: "logitech_g502_x_lightspe_img2" }
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
      { url: "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80", publicId: "razer_blackwidow_v4_75_m_img1" },
      { url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80", publicId: "razer_blackwidow_v4_75_m_img2" }
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
      { url: "https://images.unsplash.com/photo-1523297927020-8b58406e40f7?auto=format&fit=crop&w=1200&q=80", publicId: "keychron_q1_pro_qmk_via__img1" },
      { url: "https://images.unsplash.com/photo-1523754346425-2f3e98dacb0d?auto=format&fit=crop&w=1200&q=80", publicId: "keychron_q1_pro_qmk_via__img2" }
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
      { url: "https://images.unsplash.com/photo-1524560655877-cbb140089e18?auto=format&fit=crop&w=1200&q=80", publicId: "keychron_k2_v2_wireless__img1" },
      { url: "https://images.unsplash.com/photo-1527600478564-488952effedb?auto=format&fit=crop&w=1200&q=80", publicId: "keychron_k2_v2_wireless__img2" }
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
      { url: "https://images.unsplash.com/photo-1551739440-5dd934d3a94a?auto=format&fit=crop&w=1200&q=80", publicId: "logitech_mx_master_3s_wi_img1" },
      { url: "https://images.unsplash.com/photo-1565925250506-2562533338b2?auto=format&fit=crop&w=1200&q=80", publicId: "logitech_mx_master_3s_wi_img2" }
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
      { url: "https://images.unsplash.com/photo-1530333988528-4a4e54a074e7?auto=format&fit=crop&w=1200&q=80", publicId: "wooting_80he_rapid_trigg_img1" },
      { url: "https://images.unsplash.com/photo-1531092601737-e5b3b6e57365?auto=format&fit=crop&w=1200&q=80", publicId: "wooting_80he_rapid_trigg_img2" }
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
      { url: "https://images.unsplash.com/photo-1613258176465-eb77f3a050d2?auto=format&fit=crop&w=1200&q=80", publicId: "nzxt_kraken_360_rgb_liqu_img1" },
      { url: "https://images.unsplash.com/photo-1573053986275-840ffc7cc685?auto=format&fit=crop&w=1200&q=80", publicId: "nzxt_kraken_360_rgb_liqu_img2" }
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
      { url: "https://images.unsplash.com/photo-1575219021257-c69d86afddf8?auto=format&fit=crop&w=1200&q=80", publicId: "arctic_liquid_freezer_ii_img1" },
      { url: "https://images.unsplash.com/photo-1575219021578-352f4a2aaaad?auto=format&fit=crop&w=1200&q=80", publicId: "arctic_liquid_freezer_ii_img2" }
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
      { url: "https://images.unsplash.com/photo-1576669801838-1b1c52121e6a?auto=format&fit=crop&w=1200&q=80", publicId: "deepcool_ak620_high_perf_img1" },
      { url: "https://images.unsplash.com/photo-1576750540989-682154c115d8?auto=format&fit=crop&w=1200&q=80", publicId: "deepcool_ak620_high_perf_img2" }
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
      { url: "https://images.unsplash.com/photo-1579493594420-ffe1d8d3a9b5?auto=format&fit=crop&w=1200&q=80", publicId: "noctua_nh_d15_chromax_bl_img1" },
      { url: "https://images.unsplash.com/photo-1581936036303-fb815a1b9463?auto=format&fit=crop&w=1200&q=80", publicId: "noctua_nh_d15_chromax_bl_img2" }
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
      { url: "https://images.unsplash.com/flagged/photo-1582567257363-8605111df91f?auto=format&fit=crop&w=1200&q=80", publicId: "fractal_design_north_cha_img1" },
      { url: "https://images.unsplash.com/photo-1582748298043-0c0d31aa506e?auto=format&fit=crop&w=1200&q=80", publicId: "fractal_design_north_cha_img2" }
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
      { url: "https://images.unsplash.com/photo-1582954820640-42c30eeabe35?auto=format&fit=crop&w=1200&q=80", publicId: "lian_li_lancool_216_rgb__img1" },
      { url: "https://images.unsplash.com/photo-1583001393568-39b4fc60d2ba?auto=format&fit=crop&w=1200&q=80", publicId: "lian_li_lancool_216_rgb__img2" }
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
      { url: "https://images.unsplash.com/photo-1583414381542-c0ed01dc29ae?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_5000d_airflow_te_img1" },
      { url: "https://images.unsplash.com/photo-1586891411382-e7bc1fe29093?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_5000d_airflow_te_img2" }
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
      { url: "https://images.unsplash.com/photo-1598346653523-10a11538b971?auto=format&fit=crop&w=1200&q=80", publicId: "wd_black_sn850x_2tb_nvme_img1" },
      { url: "https://images.unsplash.com/photo-1598347612624-5cd3c00d1b5c?auto=format&fit=crop&w=1200&q=80", publicId: "wd_black_sn850x_2tb_nvme_img2" }
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
      { url: "https://images.unsplash.com/photo-1598848900323-41f46a5c11bd?auto=format&fit=crop&w=1200&q=80", publicId: "samsung_990_pro_2tb_nvme_img1" },
      { url: "https://images.unsplash.com/photo-1599108859677-156e153b2e66?auto=format&fit=crop&w=1200&q=80", publicId: "samsung_990_pro_2tb_nvme_img2" }
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
      { url: "https://images.unsplash.com/photo-1599226335946-faf96a7cc10c?auto=format&fit=crop&w=1200&q=80", publicId: "samsung_990_pro_4tb_nvme_img1" },
      { url: "https://images.unsplash.com/photo-1599268172136-b2a6f9c95b93?auto=format&fit=crop&w=1200&q=80", publicId: "samsung_990_pro_4tb_nvme_img2" }
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
      { url: "https://images.unsplash.com/photo-1600852435692-8f34756456e5?auto=format&fit=crop&w=1200&q=80", publicId: "crucial_t705_2tb_pcie_ge_img1" },
      { url: "https://images.unsplash.com/photo-1602331133490-aca0c835240e?auto=format&fit=crop&w=1200&q=80", publicId: "crucial_t705_2tb_pcie_ge_img2" }
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
      { url: "https://images.unsplash.com/photo-1603533262601-ce30bda5f45c?auto=format&fit=crop&w=1200&q=80", publicId: "kingston_kc3000_1tb_pcie_img1" },
      { url: "https://images.unsplash.com/photo-1607850479109-d64e634c69d3?auto=format&fit=crop&w=1200&q=80", publicId: "kingston_kc3000_1tb_pcie_img2" }
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
      { url: "https://images.unsplash.com/photo-1624451323240-4a2652e561c5?auto=format&fit=crop&w=1200&q=80", publicId: "g_skill_trident_z5_neo_r_img1" },
      { url: "https://images.unsplash.com/photo-1625571705670-38fc39c923ba?auto=format&fit=crop&w=1200&q=80", publicId: "g_skill_trident_z5_neo_r_img2" }
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
      { url: "https://images.unsplash.com/photo-1626274892129-063b1112d61b?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_vengeance_rgb_32_img1" },
      { url: "https://images.unsplash.com/photo-1627355263723-42c86ea13fac?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_vengeance_rgb_32_img2" }
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
      { url: "https://images.unsplash.com/photo-1630851853343-6c87200d167a?auto=format&fit=crop&w=1200&q=80", publicId: "kingston_fury_beast_rgb__img1" },
      { url: "https://images.unsplash.com/photo-1635717004369-aad620a9d0c3?auto=format&fit=crop&w=1200&q=80", publicId: "kingston_fury_beast_rgb__img2" }
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
      { url: "https://images.unsplash.com/photo-1580600699843-4fdb722d4abf?auto=format&fit=crop&w=1200&q=80", publicId: "g_skill_trident_z5_rgb_6_img1" },
      { url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80", publicId: "g_skill_trident_z5_rgb_6_img2" }
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
      { url: "https://images.unsplash.com/photo-1595692682118-774e5182f484?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_vengeance_96gb_2_img1" },
      { url: "https://images.unsplash.com/photo-1604590003050-14c5b8521015?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_vengeance_96gb_2_img2" }
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
      { url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_apex_gaming_rig_img1" },
      { url: "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_apex_gaming_rig_img2" },
      { url: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_apex_gaming_rig_img3" }
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
      { url: "https://images.unsplash.com/photo-1573103108433-4d712735e660?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_titan_5080_4k_g_img1" },
      { url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_titan_5080_4k_g_img2" }
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
      { url: "https://images.unsplash.com/photo-1551033541-2075d8363c66?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_velocity_5070_t_img1" },
      { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_velocity_5070_t_img2" }
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
      { url: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_phantom_competi_img1" },
      { url: "https://images.unsplash.com/photo-1563605990484-8d4c1fa9c3d2?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_phantom_competi_img2" }
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
      { url: "https://images.unsplash.com/photo-1554702311-4f5b532c182a?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_forge_1440p_per_img1" },
      { url: "https://images.unsplash.com/photo-1562826668-51258810ccfb?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_forge_1440p_per_img2" }
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
      { url: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_4k_creator_stud_img1" },
      { url: "https://images.unsplash.com/photo-1608403890614-ec62cb35b46e?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_4k_creator_stud_img2" }
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
      { url: "https://images.unsplash.com/photo-1537158345907-c4fb34477bd6?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_studio_workstat_img1" },
      { url: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_studio_workstat_img2" }
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
      { url: "https://images.unsplash.com/photo-1549082984-1323b94df9a6?auto=format&fit=crop&w=1200&q=80", publicId: "hp_z2_tower_g9_workstati_img1" },
      { url: "https://images.unsplash.com/photo-1558698972-c50e325e6799?auto=format&fit=crop&w=1200&q=80", publicId: "hp_z2_tower_g9_workstati_img2" }
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
      { url: "https://images.unsplash.com/photo-1558949623-35b2e2649754?auto=format&fit=crop&w=1200&q=80", publicId: "dell_precision_3680_towe_img1" },
      { url: "https://images.unsplash.com/photo-1552308995-2baac1ad5490?auto=format&fit=crop&w=1200&q=80", publicId: "dell_precision_3680_towe_img2" }
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
      { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_horizon_office__img1" },
      { url: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?auto=format&fit=crop&w=1200&q=80", publicId: "geargrid_horizon_office__img2" }
    ]
  },

  // -------------------------------------------------------------
  // 10. POWER SUPPLIES
  // -------------------------------------------------------------
  {
    title: "Corsair RM1000x 1000W 80+ Gold Fully Modular Power Supply",
    category: catMap["Power Supplies"],
    brand: "Corsair",
    price: 18990,
    discountPrice: 17490,
    stock: 25,
    rating: 4.9,
    numReviews: 84,
    featured: true,
    description: "Enthusiast-grade 1000W 80 PLUS Gold certified fully modular PSU featuring Japanese 105°C capacitors, Zero RPM fan mode for ultra-quiet operation, and native ATX 3.0 support.",
    images: [
      { url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_rm1000x_1000w_img1" },
      { url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_rm1000x_1000w_img2" }
    ]
  },
  {
    title: "Seasonic Focus GX-850 850W 80+ Gold Modular Power Supply",
    category: catMap["Power Supplies"],
    brand: "Seasonic",
    price: 14490,
    discountPrice: 13490,
    stock: 30,
    rating: 4.9,
    numReviews: 62,
    featured: true,
    description: "Legendary reliability with 850W 80 PLUS Gold efficiency, fluid dynamic bearing fan, compact 140mm chassis, tight voltage regulation, and 10-year manufacturer warranty.",
    images: [
      { url: "https://images.unsplash.com/photo-1555618254-84e2cf498b01?auto=format&fit=crop&w=1200&q=80", publicId: "seasonic_focus_gx850_img1" },
      { url: "https://images.unsplash.com/photo-1601153211050-ae2e1fa428d7?auto=format&fit=crop&w=1200&q=80", publicId: "seasonic_focus_gx850_img2" }
    ]
  },
  {
    title: "be quiet! Pure Power 12 M 850W 80+ Gold ATX 3.0 Power Supply",
    category: catMap["Power Supplies"],
    brand: "be quiet!",
    price: 12990,
    discountPrice: 11990,
    stock: 20,
    rating: 4.8,
    numReviews: 45,
    featured: false,
    description: "Whisper-quiet 850W ATX 3.0 power supply with PCIe 5.0 12VHPWR 600W cable, 80 PLUS Gold certified up to 93.2% efficiency, and silence-optimized 120mm be quiet! fan.",
    images: [
      { url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "be_quiet_pure_power_12_img1" },
      { url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80", publicId: "be_quiet_pure_power_12_img2" }
    ]
  },
  {
    title: "Corsair RM1200x Shift 1200W 80+ Gold Fully Modular ATX 3.0 PSU",
    category: catMap["Power Supplies"],
    brand: "Corsair",
    price: 24990,
    discountPrice: 22990,
    stock: 15,
    rating: 5.0,
    numReviews: 38,
    featured: true,
    description: "Revolutionary side-mounted modular cable interface for effortless cable routing, 1200W ATX 3.0 certified with native PCIe 5.0 power delivery and 100% Japanese capacitors.",
    images: [
      { url: "https://images.unsplash.com/photo-1604754742629-3e5728249d73?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_rm1200x_shift_img1" },
      { url: "https://images.unsplash.com/photo-1531500435567-d5a03bbb46a6?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_rm1200x_shift_img2" }
    ]
  },
  {
    title: "Corsair RM750e 750W 80+ Gold Fully Modular Power Supply",
    category: catMap["Power Supplies"],
    brand: "Corsair",
    price: 10490,
    discountPrice: 9490,
    stock: 35,
    rating: 4.7,
    numReviews: 78,
    featured: false,
    description: "Compact 140mm modular 750W 80 PLUS Gold power supply with low-noise 120mm fan, resonant LLC topology with DC-DC conversion, and robust dual EPS12V connectors.",
    images: [
      { url: "https://images.unsplash.com/photo-1551640179-9e39f8055291?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_rm750e_750w_img1" },
      { url: "https://images.unsplash.com/photo-1555618565-9f2b0323a10d?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_rm750e_750w_img2" }
    ]
  },

  // -------------------------------------------------------------
  // MAINSTREAM HARDWARE EXPANSION (FOR MAINSTREAM BUDGET TIERS)
  // -------------------------------------------------------------
  {
    title: "ZOTAC Gaming GeForce RTX 4060 8GB Twin Edge",
    category: catMap["Graphics Cards"],
    brand: "ZOTAC",
    price: 28990,
    discountPrice: 27990,
    stock: 25,
    rating: 4.7,
    numReviews: 88,
    featured: false,
    description: "Compact dual-fan Ada Lovelace graphics card with 8GB GDDR6 memory, DLSS 3 frame generation, and IceStorm 2.0 advanced cooling for 1080p and 1440p gaming.",
    images: [{ url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80", publicId: "zotac_rtx_4060_img1" }]
  },
  {
    title: "MSI GeForce RTX 4060 Ti VENTUS 2X Black 8G OC",
    category: catMap["Graphics Cards"],
    brand: "MSI",
    price: 38490,
    discountPrice: 37490,
    stock: 20,
    rating: 4.7,
    numReviews: 64,
    featured: false,
    description: "Factory-overclocked dual-fan RTX 4060 Ti with TORX Fan 4.0, reinforcing backplate, and full DLSS 3 support for 1440p high-refresh gaming.",
    images: [{ url: "https://images.unsplash.com/photo-1555618254-84e2cf498b01?auto=format&fit=crop&w=1200&q=80", publicId: "msi_rtx_4060ti_img1" }]
  },
  {
    title: "ASUS Dual GeForce RTX 4070 Super EVO 12GB GDDR6X",
    category: catMap["Graphics Cards"],
    brand: "ASUS",
    price: 58990,
    discountPrice: 56990,
    stock: 18,
    rating: 4.9,
    numReviews: 52,
    featured: true,
    description: "High-performance 1440p/4K graphics card featuring 12GB GDDR6X, Axial-tech fan design, 0dB technology, and dual BIOS.",
    images: [{ url: "https://images.unsplash.com/photo-1601153211050-ae2e1fa428d7?auto=format&fit=crop&w=1200&q=80", publicId: "asus_dual_rtx_4070s_img1" }]
  },
  {
    title: "Gigabyte GeForce RTX 4070 Ti Super Windforce OC 16GB GDDR6X",
    category: catMap["Graphics Cards"],
    brand: "Gigabyte",
    price: 79990,
    discountPrice: 77490,
    stock: 15,
    rating: 4.8,
    numReviews: 44,
    featured: true,
    description: "16GB GDDR6X powerhouse with 256-bit memory bus, WINDFORCE cooling system, and protective metal backplate.",
    images: [{ url: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80", publicId: "gigabyte_rtx_4070tis_img1" }]
  },
  {
    title: "AMD Ryzen 5 7600 Desktop Processor (6 Cores / 12 Threads)",
    category: catMap["Processors"],
    brand: "AMD",
    price: 18490,
    discountPrice: 17990,
    stock: 30,
    rating: 4.8,
    numReviews: 120,
    featured: false,
    description: "Efficient Zen 4 desktop processor with 6 cores and 12 threads, 38MB cache, 65W TDP, and bundled Wraith Stealth cooler.",
    images: [{ url: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80", publicId: "amd_ryzen_5_7600_img1" }]
  },
  {
    title: "AMD Ryzen 5 7600X Desktop Processor (6 Cores / 12 Threads)",
    category: catMap["Processors"],
    brand: "AMD",
    price: 20490,
    discountPrice: 19990,
    stock: 25,
    rating: 4.8,
    numReviews: 95,
    featured: false,
    description: "High-clock AM5 gaming processor with 5.3 GHz boost, 38MB cache, and unlocked multiplier for overclocking.",
    images: [{ url: "https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&w=1200&q=80", publicId: "amd_ryzen_5_7600x_img1" }]
  },
  {
    title: "Intel Core i5-14400F Desktop Processor (10 Cores / 16 Threads)",
    category: catMap["Processors"],
    brand: "Intel",
    price: 18200,
    discountPrice: 17500,
    stock: 28,
    rating: 4.7,
    numReviews: 70,
    featured: false,
    description: "10-core hybrid processor (6 Performance + 4 Efficient) reaching up to 4.7 GHz max boost on LGA1700 socket.",
    images: [{ url: "https://images.unsplash.com/photo-1555616635-640b71bdb185?auto=format&fit=crop&w=1200&q=80", publicId: "intel_i5_14400f_img1" }]
  },
  {
    title: "Intel Core i7-14700K Desktop Processor (20 Cores / 28 Threads)",
    category: catMap["Processors"],
    brand: "Intel",
    price: 36990,
    discountPrice: 35490,
    stock: 18,
    rating: 4.8,
    numReviews: 55,
    featured: true,
    description: "20-core Raptor Lake Refresh powerhouse (8 P-cores + 12 E-cores) up to 5.6 GHz for gaming and content creation.",
    images: [{ url: "https://images.unsplash.com/photo-1540829917886-91ab031b1764?auto=format&fit=crop&w=1200&q=80", publicId: "intel_i7_14700k_img1" }]
  },
  {
    title: "MSI PRO B650M-P Micro-ATX Motherboard",
    category: catMap["Motherboards"],
    brand: "MSI",
    price: 9990,
    discountPrice: 9490,
    stock: 35,
    rating: 4.6,
    numReviews: 82,
    featured: false,
    description: "High-value AM5 Micro-ATX board with DDR5 support, PCIe 4.0 x16 Steel Armor, and M.2 Shield Frozr.",
    images: [{ url: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=1200&q=80", publicId: "msi_pro_b650m_p_img1" }]
  },
  {
    title: "ASRock B760M Pro RS WiFi Motherboard",
    category: catMap["Motherboards"],
    brand: "ASRock",
    price: 12490,
    discountPrice: 11990,
    stock: 24,
    rating: 4.7,
    numReviews: 48,
    featured: false,
    description: "White-themed Intel LGA1700 motherboard with DDR5 support, PCIe 5.0 slot, dual Hyper M.2 slots, and Wi-Fi 6E.",
    images: [{ url: "https://images.unsplash.com/photo-1579803166678-7acf374cfe52?auto=format&fit=crop&w=1200&q=80", publicId: "asrock_b760m_pro_rs_img1" }]
  },
  {
    title: "ASUS Prime Z890-P WiFi Motherboard",
    category: catMap["Motherboards"],
    brand: "ASUS",
    price: 22990,
    discountPrice: 21990,
    stock: 16,
    rating: 4.8,
    numReviews: 30,
    featured: false,
    description: "Intel LGA1851 motherboard engineered for Core Ultra processors with DDR5, PCIe 5.0, Thunderbolt 4, and WiFi 7.",
    images: [{ url: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80", publicId: "asus_prime_z890p_img1" }]
  },
  {
    title: "Crucial 16GB (2x8GB) DDR5-4800 CL40 Desktop Memory",
    category: catMap["Memory / RAM"],
    brand: "Crucial",
    price: 4990,
    discountPrice: 4690,
    stock: 45,
    rating: 4.6,
    numReviews: 110,
    featured: false,
    description: "Reliable dual-channel DDR5 desktop RAM kit running at 4800 MHz CL40 for mainstream builds.",
    images: [{ url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "crucial_16gb_ddr5_img1" }]
  },
  {
    title: "Corsair Vengeance 32GB (2x16GB) DDR5-5200 CL40",
    category: catMap["Memory / RAM"],
    brand: "Corsair",
    price: 8990,
    discountPrice: 8490,
    stock: 32,
    rating: 4.7,
    numReviews: 75,
    featured: false,
    description: "Low-profile solid aluminum heatspreader DDR5 memory optimized for Intel and AMD motherboards.",
    images: [{ url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80", publicId: "corsair_32gb_5200_img1" }]
  },
  {
    title: "Crucial P3 Plus 500GB PCIe 4.0 NVMe M.2 SSD",
    category: catMap["Storage"],
    brand: "Crucial",
    price: 3790,
    discountPrice: 3490,
    stock: 40,
    rating: 4.6,
    numReviews: 95,
    featured: false,
    description: "Fast Gen4 NVMe storage reaching up to 4700 MB/s read speeds for responsive OS booting.",
    images: [{ url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "crucial_p3plus_500gb_img1" }]
  },
  {
    title: "Western Digital Blue SN580 1TB PCIe Gen4 NVMe M.2 SSD",
    category: catMap["Storage"],
    brand: "Western Digital",
    price: 5690,
    discountPrice: 5390,
    stock: 38,
    rating: 4.8,
    numReviews: 130,
    featured: false,
    description: "High-value NVMe SSD with nCache 4.0 technology delivering up to 4150 MB/s read and write speeds.",
    images: [{ url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80", publicId: "wd_blue_sn580_1tb_img1" }]
  },
  {
    title: "DeepCool AG400 Single-Tower CPU Air Cooler",
    category: catMap["Cooling & Cases"],
    brand: "DeepCool",
    price: 1990,
    discountPrice: 1850,
    stock: 50,
    rating: 4.7,
    numReviews: 140,
    featured: false,
    description: "Compact 120mm air cooler with 4 direct-contact heat pipes capable of cooling up to 220W TDP.",
    images: [{ url: "https://images.unsplash.com/photo-1576669801838-1b1c52121e6a?auto=format&fit=crop&w=1200&q=80", publicId: "deepcool_ag400_img1" }]
  },
  {
    title: "Thermalright Peerless Assassin 120 SE Air Cooler",
    category: catMap["Cooling & Cases"],
    brand: "Thermalright",
    price: 3490,
    discountPrice: 3290,
    stock: 35,
    rating: 4.9,
    numReviews: 160,
    featured: false,
    description: "Dual-tower 6-heatpipe air cooler with dual 120mm PWM fans delivering legendary thermal dissipation.",
    images: [{ url: "https://images.unsplash.com/photo-1576750540989-682154c115d8?auto=format&fit=crop&w=1200&q=80", publicId: "thermalright_pa120_img1" }]
  },
  {
    title: "Ant Esports ICE-112 Mid-Tower Gaming Case",
    category: catMap["Cooling & Cases"],
    brand: "Ant Esports",
    price: 3290,
    discountPrice: 2990,
    stock: 30,
    rating: 4.5,
    numReviews: 75,
    featured: false,
    description: "Budget mid-tower chassis with mesh front panel, 4 pre-installed RGB fans, and tempered glass side window.",
    images: [{ url: "https://images.unsplash.com/photo-1582954820640-42c30eeabe35?auto=format&fit=crop&w=1200&q=80", publicId: "ant_ice112_img1" }]
  },
  {
    title: "DeepCool CC560 V2 High-Airflow Mid-Tower Case",
    category: catMap["Cooling & Cases"],
    brand: "DeepCool",
    price: 4190,
    discountPrice: 3990,
    stock: 28,
    rating: 4.7,
    numReviews: 85,
    featured: false,
    description: "High-airflow mid-tower case with 4 pre-installed LED fans, full-length PSU shroud, and 360mm radiator support.",
    images: [{ url: "https://images.unsplash.com/photo-1583001393568-39b4fc60d2ba?auto=format&fit=crop&w=1200&q=80", publicId: "deepcool_cc560_img1" }]
  },
  {
    title: "DeepCool PK650D 650W 80 Plus Bronze Power Supply",
    category: catMap["Power Supplies"],
    brand: "DeepCool",
    price: 4490,
    discountPrice: 4190,
    stock: 40,
    rating: 4.6,
    numReviews: 90,
    featured: false,
    description: "Reliable 650W 80 PLUS Bronze certified power supply with flat black cables and 120mm silent fan.",
    images: [{ url: "https://images.unsplash.com/photo-1551640179-9e39f8055291?auto=format&fit=crop&w=1200&q=80", publicId: "deepcool_pk650d_img1" }]
  },
  {
    title: "Cooler Master MWE 750 Bronze V2 750W Power Supply",
    category: catMap["Power Supplies"],
    brand: "Cooler Master",
    price: 6490,
    discountPrice: 6190,
    stock: 30,
    rating: 4.8,
    numReviews: 105,
    featured: false,
    description: "750W 80 PLUS Bronze non-modular power supply with DC-to-DC circuit design and 120mm HDB fan.",
    images: [{ url: "https://images.unsplash.com/photo-1555618565-9f2b0323a10d?auto=format&fit=crop&w=1200&q=80", publicId: "coolermaster_mwe750_img1" }]
  },
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
    console.log("\nSeeding 10 hardware categories...");
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
    const rawProducts = getRawProducts(categoryMap).map((prod) => {
      const specData = PRODUCT_SPECS_DATA[prod.title] || {};
      return {
        ...prod,
        specifications: specData.specifications || {},
        useCaseProfile: specData.useCaseProfile || { gaming: 5, productivity: 5, editing: 5, rendering: 5, programming: 5, ai: 5, streaming: 5 },
      };
    });
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
