import mongoose from "mongoose";

// Normalized hardware specifications sub-schema for GearGrid Configure
const specificationsSchema = new mongoose.Schema(
  {
    // CPU specifications
    socket: { type: String, trim: true },
    cores: { type: Number, min: 1 },
    threads: { type: Number, min: 1 },
    baseClock: { type: Number, min: 0 }, // in GHz
    boostClock: { type: Number, min: 0 }, // in GHz
    tdp: { type: Number, min: 0 }, // in Watts
    integratedGraphics: { type: Boolean },

    // GPU specifications
    chipset: { type: String, trim: true },
    vram: { type: Number, min: 0 }, // in GB
    vramType: { type: String, trim: true }, // e.g., "GDDR7", "GDDR6X"
    recommendedPsu: { type: Number, min: 0 }, // in Watts
    powerDraw: { type: Number, min: 0 }, // in Watts (TGP/TDP)
    length: { type: Number, min: 0 }, // in mm

    // Motherboard specifications
    formFactor: { type: String, trim: true }, // e.g., "ATX", "Micro-ATX", "Mini-ITX", "E-ATX"
    memoryType: { type: String, trim: true }, // e.g., "DDR5", "DDR4"
    maxMemory: { type: Number, min: 0 }, // in GB
    memorySlots: { type: Number, min: 1 },
    maxMemorySpeed: { type: Number, min: 0 }, // in MHz
    pciExpressGeneration: { type: String, trim: true }, // e.g., "PCIe 5.0"

    // RAM specifications
    capacity: { type: Number, min: 0 }, // in GB
    speed: { type: Number, min: 0 }, // in MHz
    modules: { type: String, trim: true }, // e.g., "2x16GB", "2x32GB"

    // Storage specifications
    type: { type: String, trim: true }, // e.g., "NVMe SSD", "SATA SSD"
    interface: { type: String, trim: true }, // e.g., "PCIe 4.0 x4", "PCIe 5.0 x4"
    readSpeed: { type: Number, min: 0 }, // in MB/s
    writeSpeed: { type: Number, min: 0 }, // in MB/s

    // Cooling specifications
    coolerType: { type: String, trim: true }, // e.g., "AIO Liquid Cooler", "Air Cooler"
    supportedSockets: [{ type: String, trim: true }], // e.g., ["AM5", "AM4", "LGA1700", "LGA1851"]
    radiatorSize: { type: Number, min: 0 }, // in mm (e.g., 360, 240)
    height: { type: Number, min: 0 }, // in mm for air coolers
    maxTdp: { type: Number, min: 0 }, // in Watts

    // Case specifications
    formFactorSupport: [{ type: String, trim: true }], // e.g., ["E-ATX", "ATX", "Micro-ATX", "Mini-ITX"]
    gpuMaxLength: { type: Number, min: 0 }, // in mm
    coolerMaxHeight: { type: Number, min: 0 }, // in mm
    radiatorSupport: [{ type: String, trim: true }], // e.g., ["360mm", "280mm", "240mm"]

    // PSU specifications
    wattage: { type: Number, min: 0 }, // in Watts
    efficiency: { type: String, trim: true }, // e.g., "80+ Gold", "80+ Platinum"
    modular: { type: String, trim: true }, // e.g., "Full", "Semi", "Non"
    atx3Support: { type: Boolean },

    // Display & Peripherals
    screenSize: { type: Number, min: 0 }, // in inches
    resolution: { type: String, trim: true },
    refreshRate: { type: Number, min: 0 }, // in Hz
    panelType: { type: String, trim: true },
    responseTime: { type: Number, min: 0 }, // in ms
    switchType: { type: String, trim: true },
    connectionType: { type: String, trim: true },

    // Prebuilt / Custom Systems
    prebuiltSpecs: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false, strict: false }
);

// Workload and use-case score profile (0-10 scale)
const useCaseProfileSchema = new mongoose.Schema(
  {
    gaming: { type: Number, min: 0, max: 10, default: 0 },
    productivity: { type: Number, min: 0, max: 10, default: 0 },
    editing: { type: Number, min: 0, max: 10, default: 0 },
    rendering: { type: Number, min: 0, max: 10, default: 0 },
    programming: { type: Number, min: 0, max: 10, default: 0 },
    ai: { type: Number, min: 0, max: 10, default: 0 },
    streaming: { type: Number, min: 0, max: 10, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },

        publicId: {
          type: String,
          required: true,
        },
      },
    ],

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    specifications: {
      type: specificationsSchema,
      default: () => ({}),
    },

    useCaseProfile: {
      type: useCaseProfileSchema,
      default: () => ({}),
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Strategic indexes for Shop list queries, filters, and Configure recommendation engine
productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ brand: 1 });
productSchema.index({ featured: 1, createdAt: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: 1 });
productSchema.index({ "specifications.socket": 1 });
productSchema.index({ "specifications.memoryType": 1 });
productSchema.index({ "specifications.wattage": 1 });

export const Product = mongoose.model("Product", productSchema);