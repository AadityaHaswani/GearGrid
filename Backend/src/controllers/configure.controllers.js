import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// -------------------------------------------------------------
// WEIGHTS & USE-CASE PROFILES
// -------------------------------------------------------------
const BASE_USECASE_WEIGHTS = {
  gaming: { cpu: 0.30, gpu: 0.45, ram: 0.13, storage: 0.12 },
  editing: { cpu: 0.32, gpu: 0.30, ram: 0.22, storage: 0.16 },
  rendering: { cpu: 0.28, gpu: 0.38, ram: 0.20, storage: 0.14 },
  programming: { cpu: 0.40, gpu: 0.10, ram: 0.30, storage: 0.20 },
  ai: { cpu: 0.18, gpu: 0.50, ram: 0.22, storage: 0.10 },
  professional: { cpu: 0.35, gpu: 0.20, ram: 0.25, storage: 0.20 },
  streaming: { cpu: 0.35, gpu: 0.35, ram: 0.18, storage: 0.12 },
  mixed: { cpu: 0.30, gpu: 0.30, ram: 0.20, storage: 0.20 },
};

// Resolution modifiers for Gaming
const RESOLUTION_MODIFIERS = {
  "1080p": { cpu: 0.36, gpu: 0.36, ram: 0.14, storage: 0.14 },
  "1440p": { cpu: 0.28, gpu: 0.45, ram: 0.14, storage: 0.13 },
  "4k": { cpu: 0.18, gpu: 0.56, ram: 0.14, storage: 0.12 },
  "6k / 8k": { cpu: 0.20, gpu: 0.50, ram: 0.18, storage: 0.12 },
};

/**
 * Helper to compute blended workload weights based on questionnaire inputs
 */
function computeWorkloadWeights(useCases = [], workloads = {}) {
  const normalizedCases = useCases.map((c) => String(c).toLowerCase().trim());
  let weights = { cpu: 0, gpu: 0, ram: 0, storage: 0 };
  let count = 0;

  for (const uc of normalizedCases) {
    let key = "mixed";
    if (uc.includes("game") || uc.includes("gaming")) key = "gaming";
    else if (uc.includes("edit") || uc.includes("video")) key = "editing";
    else if (uc.includes("render") || uc.includes("3d")) key = "rendering";
    else if (uc.includes("program") || uc.includes("dev")) key = "programming";
    else if (uc.includes("ai") || uc.includes("machine")) key = "ai";
    else if (uc.includes("prof") || uc.includes("work")) key = "professional";
    else if (uc.includes("stream")) key = "streaming";

    let w = BASE_USECASE_WEIGHTS[key] || BASE_USECASE_WEIGHTS.mixed;

    // Apply gaming resolution adjustment if gaming is present
    if (key === "gaming") {
      const res = workloads?.gaming?.resolution?.toLowerCase();
      if (res && RESOLUTION_MODIFIERS[res]) {
        w = RESOLUTION_MODIFIERS[res];
      }
    }

    weights.cpu += w.cpu;
    weights.gpu += w.gpu;
    weights.ram += w.ram;
    weights.storage += w.storage;
    count++;
  }

  if (count === 0) return BASE_USECASE_WEIGHTS.mixed;

  return {
    cpu: weights.cpu / count,
    gpu: weights.gpu / count,
    ram: weights.ram / count,
    storage: weights.storage / count,
  };
}

/**
 * Score an individual component's technical suitability for the workload
 */
function scoreComponent(item, categoryKey, weights, priorities = []) {
  const specs = item.specifications || {};
  const profile = item.useCaseProfile || {};
  let score = 5.0; // Base baseline

  switch (categoryKey) {
    case "cpu": {
      const cores = specs.cores || 6;
      const threads = specs.threads || 12;
      const boost = specs.boostClock || 4.5;
      score = (cores * 0.25) + (threads * 0.15) + (boost * 0.6);
      if (item.title.includes("X3D")) score += 2.0; // 3D V-Cache gaming bonus
      if (profile.gaming) score += profile.gaming * 0.3;
      break;
    }
    case "gpu": {
      const vram = specs.vram || 8;
      const power = specs.powerDraw || 150;
      score = (vram * 0.45) + (power * 0.015);
      if (specs.vramType === "GDDR7") score += 2.5;
      else if (specs.vramType === "GDDR6X") score += 1.5;
      if (profile.gaming) score += profile.gaming * 0.3;
      break;
    }
    case "ram": {
      const cap = specs.capacity || 16;
      const spd = specs.speed || 4800;
      score = (cap * 0.12) + (spd * 0.001);
      break;
    }
    case "storage": {
      const cap = specs.capacity || 1000;
      const read = specs.readSpeed || 4000;
      score = (cap * 0.0025) + (read * 0.0006);
      break;
    }
    case "cooling": {
      const maxTdp = specs.maxTdp || 200;
      score = maxTdp * 0.025;
      if (specs.coolerType?.includes("Liquid")) score += 1.5;
      break;
    }
    case "psu": {
      const watts = specs.wattage || 650;
      score = watts * 0.01;
      if (specs.atx3Support) score += 1.0;
      break;
    }
    case "case": {
      const maxGpu = specs.gpuMaxLength || 320;
      score = maxGpu * 0.02;
      break;
    }
    case "motherboard": {
      const slots = specs.memorySlots || 4;
      score = slots * 1.5;
      if (specs.pciExpressGeneration?.includes("5.0")) score += 1.5;
      break;
    }
  }

  // Priority bonuses
  if (priorities.includes("Quiet Operation")) {
    if (item.title.includes("Noctua") || item.title.includes("Arctic") || item.title.includes("be quiet!")) {
      score += 2.0;
    }
  }
  if (priorities.includes("More Storage") && categoryKey === "storage") {
    if ((specs.capacity || 0) >= 2000) score += 3.0;
  }
  if (priorities.includes("More RAM") && categoryKey === "ram") {
    if ((specs.capacity || 0) >= 32) score += 3.0;
  }
  if (priorities.includes("Future Upgradeability")) {
    if (categoryKey === "psu" && (specs.wattage || 0) >= 850) score += 2.0;
    if (categoryKey === "motherboard" && specs.pciExpressGeneration?.includes("5.0")) score += 2.0;
  }

  return score;
}

/**
 * Strict Compatibility Checker between an 8-tuple configuration
 */
function checkCompatibility(cpu, gpu, mobo, ram, storage, cooler, psu, pcCase) {
  const checks = [];
  let isCompatible = true;

  // 1. CPU Socket ↔ Motherboard Socket
  const cpuSocket = cpu?.specifications?.socket;
  const moboSocket = mobo?.specifications?.socket;
  if (cpuSocket && moboSocket) {
    const match = cpuSocket.toLowerCase() === moboSocket.toLowerCase();
    checks.push({
      name: "CPU Socket ↔ Motherboard",
      status: match ? "VERIFIED" : "INCOMPATIBLE",
      details: match
        ? `${cpuSocket} matches ${moboSocket} socket architecture`
        : `CPU socket ${cpuSocket} cannot fit motherboard socket ${moboSocket}`,
    });
    if (!match) isCompatible = false;
  } else {
    checks.push({
      name: "CPU Socket ↔ Motherboard",
      status: "UNAVAILABLE",
      details: "Socket metadata partially unavailable",
    });
  }

  // 2. Motherboard Memory Type ↔ RAM Memory Type
  const moboMem = mobo?.specifications?.memoryType;
  const ramMem = ram?.specifications?.memoryType;
  if (moboMem && ramMem) {
    const match = moboMem.toUpperCase() === ramMem.toUpperCase();
    checks.push({
      name: "Motherboard Memory ↔ RAM",
      status: match ? "VERIFIED" : "INCOMPATIBLE",
      details: match
        ? `${ramMem} memory standard supported by motherboard`
        : `Motherboard requires ${moboMem} but RAM is ${ramMem}`,
    });
    if (!match) isCompatible = false;
  } else {
    checks.push({
      name: "Motherboard Memory ↔ RAM",
      status: "UNAVAILABLE",
      details: "Memory type metadata partially unavailable",
    });
  }

  // 3. Motherboard Form Factor ↔ Case Support
  const moboFf = mobo?.specifications?.formFactor;
  const caseFfSupport = pcCase?.specifications?.formFactorSupport;
  if (moboFf && Array.isArray(caseFfSupport) && caseFfSupport.length > 0) {
    const match = caseFfSupport.some(
      (ff) => ff.toLowerCase() === moboFf.toLowerCase()
    );
    checks.push({
      name: "Motherboard ↔ Case Form Factor",
      status: match ? "VERIFIED" : "INCOMPATIBLE",
      details: match
        ? `${moboFf} motherboard fits case form factor envelope`
        : `Case supports [${caseFfSupport.join(", ")}] but motherboard is ${moboFf}`,
    });
    if (!match) isCompatible = false;
  } else {
    checks.push({
      name: "Motherboard ↔ Case Form Factor",
      status: "UNAVAILABLE",
      details: "Case form factor support metadata partially unavailable",
    });
  }

  // 4. GPU Length ↔ Case GPU Clearance
  const gpuLen = gpu?.specifications?.length;
  const caseGpuMax = pcCase?.specifications?.gpuMaxLength;
  if (gpuLen && caseGpuMax) {
    const match = gpuLen <= caseGpuMax;
    checks.push({
      name: "GPU Clearance in Case",
      status: match ? "VERIFIED" : "INCOMPATIBLE",
      details: match
        ? `GPU length (${gpuLen}mm) within case clearance (${caseGpuMax}mm)`
        : `GPU length (${gpuLen}mm) exceeds case max length (${caseGpuMax}mm)`,
    });
    if (!match) isCompatible = false;
  } else {
    checks.push({
      name: "GPU Clearance in Case",
      status: "UNAVAILABLE",
      details: "Physical length or chassis clearance dimension unavailable",
    });
  }

  // 5. Cooler ↔ CPU Socket & Case Height Clearance
  const coolerSockets = cooler?.specifications?.supportedSockets;
  if (cpuSocket && Array.isArray(coolerSockets) && coolerSockets.length > 0) {
    const socketMatch = coolerSockets.some(
      (s) => s.toLowerCase() === cpuSocket.toLowerCase()
    );
    let heightMatch = true;
    const coolerHeight = cooler?.specifications?.height;
    const caseCoolerMax = pcCase?.specifications?.coolerMaxHeight;
    if (coolerHeight && caseCoolerMax && coolerHeight > caseCoolerMax) {
      heightMatch = false;
    }

    const overallMatch = socketMatch && heightMatch;
    checks.push({
      name: "Cooler ↔ CPU Socket & Height",
      status: overallMatch ? "VERIFIED" : "INCOMPATIBLE",
      details: overallMatch
        ? `Cooler mounts to ${cpuSocket} with physical clearance verified`
        : !socketMatch
        ? `Cooler bracket does not support ${cpuSocket}`
        : `Cooler height (${coolerHeight}mm) exceeds case limit (${caseCoolerMax}mm)`,
    });
    if (!overallMatch) isCompatible = false;
  } else {
    checks.push({
      name: "Cooler ↔ CPU Socket & Height",
      status: "UNAVAILABLE",
      details: "Socket mounting bracket metadata partially unavailable",
    });
  }

  // 6. GPU & System Power Requirements ↔ PSU Capacity
  const psuWattage = psu?.specifications?.wattage || 0;
  const gpuRecPsu = gpu?.specifications?.recommendedPsu || 550;
  const cpuTdp = cpu?.specifications?.tdp || 65;
  const gpuPower = gpu?.specifications?.powerDraw || 150;
  const estPeak = (cpuTdp + gpuPower + 120) * 1.15;

  const powerAdequate = psuWattage >= gpuRecPsu && psuWattage >= estPeak;
  checks.push({
    name: "Power Delivery ↔ System Load",
    status: powerAdequate ? "VERIFIED" : "INCOMPATIBLE",
    details: powerAdequate
      ? `${psuWattage}W PSU exceeds recommended ${gpuRecPsu}W (est. peak ${Math.round(estPeak)}W)`
      : `${psuWattage}W PSU insufficient for ${gpuRecPsu}W GPU requirement (est. peak ${Math.round(estPeak)}W)`,
  });
  if (!powerAdequate) isCompatible = false;

  return { isCompatible, checks };
}

/**
 * Synthesize Explainability Metadata
 */
function buildExplanation(tier, components, totalPrice, budget, budgetFlex, useCases = []) {
  const { cpu, gpu, ram, storage, cooling, psu } = components;
  const withinBudget = totalPrice <= (tier === "PERFORMANCE_FLEX" ? budget + budgetFlex : budget);
  const budgetUsedPercent = Number(((totalPrice / budget) * 100).toFixed(1));

  let name = "Calibrated PC Configuration";
  let whyThisBuild = "";
  const strengths = [];
  const tradeoffs = [];

  const mainUseCase = useCases[0] || "Everyday Performance";

  if (tier === "VALUE") {
    name = `${gpu.specifications?.chipset || gpu.brand} High-Value ${mainUseCase} Rig`;
    whyThisBuild = `Designed to deliver exceptional ${mainUseCase.toLowerCase()} throughput while preserving headroom under your baseline budget. Every Rupee is focused on raw compute and stable thermal margins.`;
    strengths.push(`Total cost remains comfortably under budget (${budgetUsedPercent}% of allocation).`);
    strengths.push(`${gpu.specifications?.vram || 8}GB VRAM paired with a modern ${cpu.specifications?.cores || 6}-core processor prevents bottlenecks.`);
    strengths.push(`Solid-state PCIe NVMe storage delivers rapid game loading and OS boot times.`);
    tradeoffs.push(`Focuses on essential high-value platform rather than luxury aesthetic RGB lighting.`);
  } else if (tier === "TARGET") {
    name = `${gpu.specifications?.chipset || gpu.brand} Target Balanced System`;
    whyThisBuild = `Engineered to maximize your exact target investment. Striking the ideal equilibrium between GPU rendering power, CPU single-thread agility, and generous multi-tasking RAM.`;
    strengths.push(`Optimally matches your target budget (${budgetUsedPercent}% utilized).`);
    strengths.push(`Tier-1 hardware pairing ensures seamless 1440p/4K capability and high thermal stability.`);
    strengths.push(`${ram.specifications?.capacity || 32}GB DDR5 high-speed memory accommodates intensive multi-tasking and background workloads.`);
    tradeoffs.push(`Calibrated to your exact budget ceiling without excess over-provisioning.`);
  } else {
    name = `${gpu.specifications?.chipset || gpu.brand} Performance Flex Overclock Tier`;
    whyThisBuild = `Takes advantage of your permitted stretch allowance to step into higher-tier hardware, unlocking greater graphic fidelity, faster render times, and extended multi-year longevity.`;
    strengths.push(`Leverages flex allowance (+₹${(totalPrice - budget).toLocaleString("en-IN")}) to upgrade pivotal performance tiers.`);
    strengths.push(`Halo-class compute delivers tournament framerates and heavy creative suite acceleration.`);
    strengths.push(`Robust power delivery and high-efficiency cooling maintain sustained peak boost clocks.`);
    if (totalPrice > budget) {
      tradeoffs.push(`Requires using your permitted flex allowance (+₹${(totalPrice - budget).toLocaleString("en-IN")}).`);
    } else {
      tradeoffs.push(`Near the absolute ceiling of your baseline budget.`);
    }
  }

  return {
    name,
    tier,
    totalPrice,
    budgetUsedPercent,
    withinBudget,
    whyThisBuild,
    strengths,
    tradeoffs,
  };
}

/**
 * Sanitize product document for safe frontend delivery
 */
function sanitizeProduct(p) {
  if (!p) return null;
  return {
    _id: p._id,
    title: p.title,
    brand: p.brand,
    price: p.price,
    discountPrice: p.discountPrice || 0,
    images: p.images || [],
    category: p.category?.name || p.category,
    specifications: p.specifications || {},
    useCaseProfile: p.useCaseProfile || {},
  };
}

/**
 * Find Genuine MongoDB Upgrade Candidates for a Specific Build
 */
function findMeaningfulUpgrades(components, productsByCategory) {
  const { cpu, gpu, ram, storage, cooling, psu, case: pcCase } = components;
  const upgrades = [];

  // 1. GPU Upgrade Candidate
  if (productsByCategory.gpu && gpu) {
    const higherGpus = productsByCategory.gpu
      .filter((g) => {
        if (g._id.toString() === gpu._id.toString()) return false;
        if (g.price <= gpu.price) return false;
        // Check case clearance
        const len = g.specifications?.length || 280;
        const maxLen = pcCase?.specifications?.gpuMaxLength || 360;
        if (len > maxLen) return false;
        // Check PSU capacity
        const reqPsu = g.specifications?.recommendedPsu || 650;
        const psuWatt = psu?.specifications?.wattage || 650;
        if (psuWatt < reqPsu) return false;
        return true;
      })
      .sort((a, b) => a.price - b.price);

    if (higherGpus.length > 0) {
      const targetGpu = higherGpus[0];
      const diff = targetGpu.price - gpu.price;
      upgrades.push({
        category: "gpu",
        categoryName: "Graphics Card",
        current: sanitizeProduct(gpu),
        upgrade: sanitizeProduct(targetGpu),
        priceDifference: diff,
        benefit: `Upgrade to ${targetGpu.specifications?.chipset || targetGpu.brand} (${targetGpu.specifications?.vram || 12}GB) for higher resolution rendering and framerate headroom.`,
      });
    }
  }

  // 2. CPU Upgrade Candidate
  if (productsByCategory.cpu && cpu) {
    const cpuSocket = cpu.specifications?.socket;
    const higherCpus = productsByCategory.cpu
      .filter((c) => {
        if (c._id.toString() === cpu._id.toString()) return false;
        if (c.price <= cpu.price) return false;
        if (c.specifications?.socket && cpuSocket && c.specifications.socket !== cpuSocket) return false;
        return true;
      })
      .sort((a, b) => a.price - b.price);

    if (higherCpus.length > 0) {
      const targetCpu = higherCpus[0];
      const diff = targetCpu.price - cpu.price;
      upgrades.push({
        category: "cpu",
        categoryName: "Processor",
        current: sanitizeProduct(cpu),
        upgrade: sanitizeProduct(targetCpu),
        priceDifference: diff,
        benefit: `Upgrade to ${targetCpu.title.split("(")[0].trim()} (${targetCpu.specifications?.cores || 8} Cores) for faster compilation and multithreaded compute.`,
      });
    }
  }

  // 3. RAM Upgrade Candidate
  if (productsByCategory.ram && ram) {
    const ramType = ram.specifications?.memoryType;
    const currentCap = ram.specifications?.capacity || 16;
    const higherRams = productsByCategory.ram
      .filter((r) => {
        if (r._id.toString() === ram._id.toString()) return false;
        if (r.price <= ram.price) return false;
        if (r.specifications?.memoryType && ramType && r.specifications.memoryType !== ramType) return false;
        const cap = r.specifications?.capacity || 0;
        return cap >= currentCap;
      })
      .sort((a, b) => a.price - b.price);

    if (higherRams.length > 0) {
      const targetRam = higherRams[0];
      const diff = targetRam.price - ram.price;
      upgrades.push({
        category: "ram",
        categoryName: "Memory (RAM)",
        current: sanitizeProduct(ram),
        upgrade: sanitizeProduct(targetRam),
        priceDifference: diff,
        benefit: `Expand memory to ${targetRam.specifications?.capacity || 32}GB ${targetRam.specifications?.memoryType || "DDR5"} for seamless multi-tasking and high timeline responsiveness.`,
      });
    }
  }

  // 4. Storage Upgrade Candidate
  if (productsByCategory.storage && storage) {
    const currentCap = storage.specifications?.capacity || 500;
    const higherStorages = productsByCategory.storage
      .filter((s) => {
        if (s._id.toString() === storage._id.toString()) return false;
        if (s.price <= storage.price) return false;
        const cap = s.specifications?.capacity || 0;
        return cap > currentCap;
      })
      .sort((a, b) => a.price - b.price);

    if (higherStorages.length > 0) {
      const targetStorage = higherStorages[0];
      const diff = targetStorage.price - storage.price;
      upgrades.push({
        category: "storage",
        categoryName: "Solid State Storage",
        current: sanitizeProduct(storage),
        upgrade: sanitizeProduct(targetStorage),
        priceDifference: diff,
        benefit: `Upgrade to ${targetStorage.specifications?.capacity || 1000}GB PCIe Gen4 NVMe for expansive game installations and fast read/write speeds.`,
      });
    }
  }

  return upgrades;
}

/**
 * Primary Controller Handler: POST /api/v1/configure/recommend
 */
export const generateRecommendations = asyncHandler(async (req, res) => {
  const body = req.body || {};

  // 1. Validate & Parse Budget Inputs
  const rawBudget = Number(body.budget);
  if (!rawBudget || isNaN(rawBudget) || rawBudget < 35000) {
    throw new ApiError(400, "Valid numeric budget of at least ₹35,000 is required.");
  }

  const budget = rawBudget;
  const budgetFlex = Number(body.budgetFlex) && !isNaN(Number(body.budgetFlex)) ? Number(body.budgetFlex) : 0;
  const maxAllowedBudget = budget + budgetFlex;

  // 2. Parse Use Cases & Workloads
  let useCases = [];
  if (Array.isArray(body.useCases) && body.useCases.length > 0) {
    useCases = body.useCases;
  } else if (typeof body.primaryUse === "string") {
    useCases = [body.primaryUse];
  } else {
    useCases = ["Gaming"];
  }

  const workloads = body.workloads || {};
  // Also support flat payload structure (e.g. body.gaming, body.editing)
  if (body.gaming && !workloads.gaming) workloads.gaming = body.gaming;
  if (body.editing && !workloads.editing) workloads.editing = body.editing;
  if (body.professional && !workloads.professional) workloads.professional = body.professional;

  const priorities = Array.isArray(body.priorities) ? body.priorities : [];
  const experience = body.experience || "I know the basics";

  // 3. Compute Multi-Vector Workload Weights
  const weights = computeWorkloadWeights(useCases, workloads);

  // 4. Load Candidate Products from MongoDB
  const allProducts = await Product.find({})
    .populate("category", "name slug")
    .lean();

  if (!allProducts || allProducts.length === 0) {
    throw new ApiError(500, "Hardware catalog is currently unavailable in MongoDB.");
  }

  // Group into the 8 essential PC component categories
  const categories = {
    cpus: [],
    gpus: [],
    motherboards: [],
    rams: [],
    storages: [],
    coolers: [],
    cases: [],
    psus: [],
  };

  for (const p of allProducts) {
    const catName = p.category?.name || "";
    if (catName === "Processors") {
      categories.cpus.push(p);
    } else if (catName === "Graphics Cards") {
      categories.gpus.push(p);
    } else if (catName === "Motherboards") {
      categories.motherboards.push(p);
    } else if (catName === "Memory / RAM") {
      categories.rams.push(p);
    } else if (catName === "Storage") {
      categories.storages.push(p);
    } else if (catName === "Power Supplies") {
      categories.psus.push(p);
    } else if (catName === "Cooling & Cases") {
      if (p.specifications?.coolerType || p.title.toLowerCase().includes("cooler")) {
        categories.coolers.push(p);
      } else {
        categories.cases.push(p);
      }
    }
  }

  // Edge case: check if any essential category has zero products
  for (const [key, items] of Object.entries(categories)) {
    if (items.length === 0) {
      throw new ApiError(500, `Insufficient catalog data: No products found for component category "${key}".`);
    }
  }

  // 5. Pre-score components within each category
  const scoredCpus = categories.cpus
    .map((c) => ({ item: c, score: scoreComponent(c, "cpu", weights, priorities) }))
    .sort((a, b) => b.score - a.score);

  const scoredGpus = categories.gpus
    .map((g) => ({ item: g, score: scoreComponent(g, "gpu", weights, priorities) }))
    .sort((a, b) => b.score - a.score);

  const scoredMobos = categories.motherboards
    .map((m) => ({ item: m, score: scoreComponent(m, "motherboard", weights, priorities) }))
    .sort((a, b) => a.item.price - b.item.price);

  const scoredRams = categories.rams
    .map((r) => ({ item: r, score: scoreComponent(r, "ram", weights, priorities) }))
    .sort((a, b) => a.item.price - b.item.price);

  const scoredStorages = categories.storages
    .map((s) => ({ item: s, score: scoreComponent(s, "storage", weights, priorities) }))
    .sort((a, b) => a.item.price - b.item.price);

  const scoredCoolers = categories.coolers
    .map((c) => ({ item: c, score: scoreComponent(c, "cooling", weights, priorities) }))
    .sort((a, b) => a.item.price - b.item.price);

  const scoredCases = categories.cases
    .map((k) => ({ item: k, score: scoreComponent(k, "case", weights, priorities) }))
    .sort((a, b) => a.item.price - b.item.price);

  const scoredPsus = categories.psus
    .map((p) => ({ item: p, score: scoreComponent(p, "psu", weights, priorities) }))
    .sort((a, b) => a.item.price - b.item.price);

  // 6. Generate Compatible Candidate Combinations
  // We use intelligent candidate pruning to evaluate combinations without massive combinatorial blowup
  const candidateBuilds = [];

  // Top GPU and CPU candidates that fit within budget bounds
  for (const { item: gpu } of scoredGpus) {
    if (gpu.price > maxAllowedBudget * 0.75) continue; // GPU shouldn't consume more than 75% alone

    for (const { item: cpu } of scoredCpus) {
      if (gpu.price + cpu.price > maxAllowedBudget * 0.85) continue;

      // Find compatible Motherboards
      const compatibleMobos = scoredMobos
        .filter(({ item: m }) => m.specifications?.socket?.toLowerCase() === cpu.specifications?.socket?.toLowerCase())
        .map(({ item }) => item);

      if (compatibleMobos.length === 0) continue;

      for (const mobo of compatibleMobos) {
        // Find compatible RAM
        const compatibleRams = scoredRams
          .filter(({ item: r }) => r.specifications?.memoryType?.toUpperCase() === mobo.specifications?.memoryType?.toUpperCase())
          .map(({ item }) => item);

        if (compatibleRams.length === 0) continue;

        // Find compatible Cases
        const compatibleCases = scoredCases
          .filter(({ item: cs }) => {
            const ffMatch = !cs.specifications?.formFactorSupport ||
              cs.specifications.formFactorSupport.some(ff => ff.toLowerCase() === mobo.specifications?.formFactor?.toLowerCase());
            const lenMatch = !cs.specifications?.gpuMaxLength ||
              (gpu.specifications?.length || 250) <= cs.specifications.gpuMaxLength;
            return ffMatch && lenMatch;
          })
          .map(({ item }) => item);

        if (compatibleCases.length === 0) continue;

        // Find compatible Coolers
        const compatibleCoolers = scoredCoolers
          .filter(({ item: cl }) => {
            const sockMatch = !cl.specifications?.supportedSockets ||
              cl.specifications.supportedSockets.some(s => s.toLowerCase() === cpu.specifications?.socket?.toLowerCase());
            return sockMatch;
          })
          .map(({ item }) => item);

        if (compatibleCoolers.length === 0) continue;

        // Find compatible PSUs
        const compatiblePsus = scoredPsus
          .filter(({ item: p }) => {
            const reqPsu = gpu.specifications?.recommendedPsu || 550;
            return (p.specifications?.wattage || 650) >= reqPsu;
          })
          .map(({ item }) => item);

        if (compatiblePsus.length === 0) continue;

        // Select best matching supporting parts
        for (const ram of [compatibleRams[0], compatibleRams[1]].filter(Boolean)) {
          for (const storage of [scoredStorages[0].item, scoredStorages[1]?.item].filter(Boolean)) {
            for (const cooler of [compatibleCoolers[0], compatibleCoolers[1]].filter(Boolean)) {
              for (const pcCase of [compatibleCases[0], compatibleCases[1]].filter(Boolean)) {
                for (const psu of [compatiblePsus[0], compatiblePsus[1]].filter(Boolean)) {
                  const totalPrice =
                    cpu.price +
                    gpu.price +
                    mobo.price +
                    ram.price +
                    storage.price +
                    cooler.price +
                    psu.price +
                    pcCase.price;

                  if (totalPrice <= maxAllowedBudget) {
                    const { isCompatible, checks } = checkCompatibility(
                      cpu, gpu, mobo, ram, storage, cooler, psu, pcCase
                    );

                    if (isCompatible) {
                      const totalScore =
                        scoreComponent(cpu, "cpu", weights, priorities) * weights.cpu +
                        scoreComponent(gpu, "gpu", weights, priorities) * weights.gpu +
                        scoreComponent(ram, "ram", weights, priorities) * weights.ram +
                        scoreComponent(storage, "storage", weights, priorities) * weights.storage +
                        scoreComponent(cooler, "cooling", weights, priorities) * 0.05 +
                        scoreComponent(mobo, "motherboard", weights, priorities) * 0.05 +
                        scoreComponent(psu, "psu", weights, priorities) * 0.05 +
                        scoreComponent(pcCase, "case", weights, priorities) * 0.05;

                      candidateBuilds.push({
                        components: { cpu, gpu, motherboard: mobo, ram, storage, cooling: cooler, psu, case: pcCase },
                        totalPrice,
                        totalScore,
                        checks,
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  if (candidateBuilds.length === 0) {
    throw new ApiError(
      422,
      `Your specified budget of ₹${budget.toLocaleString("en-IN")} is insufficient to construct a complete, fully-compatible 8-component hardware system with the current catalog. Please increase your budget.`
    );
  }

  // 7. Select the Three Distinct Builds (VALUE, TARGET, PERFORMANCE FLEX)
  // Sort candidate builds by score and price
  candidateBuilds.sort((a, b) => b.totalScore - a.totalScore);

  // A. BUILD 1 — VALUE (Strictly <= budget, prefers best value-to-cost ratio around 70-92% budget)
  const underBudgetBuilds = candidateBuilds.filter((b) => b.totalPrice <= budget);

  if (underBudgetBuilds.length === 0) {
    throw new ApiError(
      422,
      `No compatible configuration could be found strictly within ₹${budget.toLocaleString("en-IN")}.`
    );
  }

  // Sort under-budget builds by value ratio (score per 10k INR)
  const valueSorted = [...underBudgetBuilds].sort(
    (a, b) => (b.totalScore / b.totalPrice) - (a.totalScore / a.totalPrice)
  );
  // Pick the best value build that stays reasonably below budget
  const valueBuild = valueSorted.find(b => b.totalPrice <= budget * 0.94) || valueSorted[0];

  // B. BUILD 2 — TARGET (Strictly <= budget, targets highest performance within 90-100% budget)
  const targetPool = underBudgetBuilds.filter(b => b.totalPrice >= (valueBuild.totalPrice + 5000));
  let targetBuild = null;
  if (targetPool.length > 0) {
    targetPool.sort((a, b) => b.totalScore - a.totalScore);
    targetBuild = targetPool[0];
  } else {
    // Pick the highest scoring build strictly <= budget that is not identical to valueBuild
    targetBuild = underBudgetBuilds.find(b => b !== valueBuild) || underBudgetBuilds[0];
  }

  // C. BUILD 3 — PERFORMANCE FLEX (Can exceed budget up to budget + budgetFlex)
  let flexPool = candidateBuilds.filter(b => b.totalPrice > budget && b.totalPrice <= maxAllowedBudget);
  if (flexPool.length === 0 || budgetFlex === 0) {
    // If no flex pool or flex is 0, pick the absolute highest scoring build within budget
    flexPool = [...underBudgetBuilds].sort((a, b) => b.totalScore - a.totalScore);
  } else {
    flexPool.sort((a, b) => b.totalScore - a.totalScore);
  }

  let flexBuild = flexPool.find(b => b !== targetBuild && b !== valueBuild) || flexPool[0];

  // If still duplicate, find a distinct candidate from the pool
  if (flexBuild === targetBuild || flexBuild === valueBuild) {
    const alternate = candidateBuilds.find(b => b !== targetBuild && b !== valueBuild);
    if (alternate) flexBuild = alternate;
  }

  // 8. Format Output Builds with Genuine MongoDB Upgrades
  const productsByCategory = {
    cpu: categories.cpus,
    gpu: categories.gpus,
    motherboard: categories.motherboards,
    ram: categories.rams,
    storage: categories.storages,
    cooling: categories.coolers,
    psu: categories.psus,
    case: categories.cases,
  };

  const outputBuilds = [
    {
      ...buildExplanation("VALUE", valueBuild.components, valueBuild.totalPrice, budget, budgetFlex, useCases),
      components: {
        cpu: sanitizeProduct(valueBuild.components.cpu),
        gpu: sanitizeProduct(valueBuild.components.gpu),
        motherboard: sanitizeProduct(valueBuild.components.motherboard),
        ram: sanitizeProduct(valueBuild.components.ram),
        storage: sanitizeProduct(valueBuild.components.storage),
        cooling: sanitizeProduct(valueBuild.components.cooling),
        psu: sanitizeProduct(valueBuild.components.psu),
        case: sanitizeProduct(valueBuild.components.case),
      },
      compatibility: {
        compatible: true,
        checks: valueBuild.checks,
      },
      upgrades: findMeaningfulUpgrades(valueBuild.components, productsByCategory),
    },
    {
      ...buildExplanation("TARGET", targetBuild.components, targetBuild.totalPrice, budget, budgetFlex, useCases),
      components: {
        cpu: sanitizeProduct(targetBuild.components.cpu),
        gpu: sanitizeProduct(targetBuild.components.gpu),
        motherboard: sanitizeProduct(targetBuild.components.motherboard),
        ram: sanitizeProduct(targetBuild.components.ram),
        storage: sanitizeProduct(targetBuild.components.storage),
        cooling: sanitizeProduct(targetBuild.components.cooling),
        psu: sanitizeProduct(targetBuild.components.psu),
        case: sanitizeProduct(targetBuild.components.case),
      },
      compatibility: {
        compatible: true,
        checks: targetBuild.checks,
      },
      upgrades: findMeaningfulUpgrades(targetBuild.components, productsByCategory),
    },
    {
      ...buildExplanation("PERFORMANCE_FLEX", flexBuild.components, flexBuild.totalPrice, budget, budgetFlex, useCases),
      components: {
        cpu: sanitizeProduct(flexBuild.components.cpu),
        gpu: sanitizeProduct(flexBuild.components.gpu),
        motherboard: sanitizeProduct(flexBuild.components.motherboard),
        ram: sanitizeProduct(flexBuild.components.ram),
        storage: sanitizeProduct(flexBuild.components.storage),
        cooling: sanitizeProduct(flexBuild.components.cooling),
        psu: sanitizeProduct(flexBuild.components.psu),
        case: sanitizeProduct(flexBuild.components.case),
      },
      compatibility: {
        compatible: true,
        checks: flexBuild.checks,
      },
      upgrades: findMeaningfulUpgrades(flexBuild.components, productsByCategory),
    },
  ];

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        requestedBudget: budget,
        budgetFlex,
        maxAllowedBudget,
        useCases,
        workloads,
        priorities,
        experience,
        recommendations: outputBuilds,
      },
      "GearGrid Configure recommendations generated successfully"
    )
  );
});
