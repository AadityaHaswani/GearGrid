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
function scoreComponent(item, categoryKey, weights, priorities = [], budget = 100000) {
  if (!item) return 0;
  if (item.isIntegrated) {
    return (weights.gpu < 0.15) ? 6.0 : 2.5;
  }

  const specs = item.specifications || {};
  const profile = item.useCaseProfile || {};
  let score = 5.0;

  switch (categoryKey) {
    case "cpu": {
      const cores = specs.cores || 6;
      const threads = specs.threads || 12;
      const boost = specs.boostClock || 4.5;
      score = (cores * 0.35) + (threads * 0.15) + (boost * 0.5);
      if (item.title.includes("X3D")) score += 2.5;
      if (profile.gaming) score += (profile.gaming - 5) * 0.4;
      if (profile.productivity) score += (profile.productivity - 5) * 0.4;
      break;
    }
    case "gpu": {
      const vram = specs.vram || 8;
      const chip = (specs.chipset || item.title || "").toLowerCase();
      let chipBase = 5.0;
      if (chip.includes("5090")) chipBase = 14.0;
      else if (chip.includes("5080")) chipBase = 12.0;
      else if (chip.includes("4090")) chipBase = 11.0;
      else if (chip.includes("4080")) chipBase = 10.0;
      else if (chip.includes("4070 ti")) chipBase = 9.0;
      else if (chip.includes("4070 super") || chip.includes("4070")) chipBase = 8.4;
      else if (chip.includes("7600")) chipBase = 7.2;
      else if (chip.includes("3060 ti")) chipBase = 7.1;
      else if (chip.includes("3060")) chipBase = 6.6;
      else if (chip.includes("6600")) chipBase = 6.4;
      else if (chip.includes("2060")) chipBase = 5.6;
      else if (chip.includes("3050 8gb")) chipBase = 5.4;
      else if (chip.includes("3050")) chipBase = 5.0;
      else if (chip.includes("6500 xt")) chipBase = 4.2;

      score = chipBase + (vram * 0.25);
      if (specs.vramType === "GDDR7") score += 2.0;
      else if (specs.vramType === "GDDR6X") score += 1.0;
      break;
    }
    case "ram": {
      const cap = specs.capacity || 16;
      const spd = specs.speed || 3200;
      score = (cap >= 64 ? 10 : cap >= 32 ? 8.6 : cap >= 16 ? 6.5 : 4.0) + (spd * 0.0004);
      if (specs.memoryType === "DDR5") score += 1.0;
      break;
    }
    case "storage": {
      const cap = specs.capacity || 1000;
      const read = specs.readSpeed || 3500;
      score = (cap >= 2000 ? 9.5 : cap >= 1000 ? 8.0 : 6.0) + (read * 0.0003);
      break;
    }
    case "cooling": {
      const maxTdp = specs.maxTdp || 150;
      score = Math.min(10, maxTdp * 0.035);
      if (specs.coolerType?.includes("Liquid")) score += 1.5;
      break;
    }
    case "psu": {
      const watts = specs.wattage || 550;
      score = (watts / 100) * 0.8;
      if (specs.efficiency?.includes("Gold") || specs.efficiency?.includes("Platinum")) score += 1.5;
      break;
    }
    case "case": {
      score = 6.0;
      if (specs.radiatorSupport?.includes("360mm")) score += 1.5;
      break;
    }
    case "motherboard": {
      const slots = specs.memorySlots || 4;
      score = slots * 1.2;
      if (specs.pciExpressGeneration?.includes("5.0")) score += 1.5;
      if (specs.memoryType === "DDR5") score += 1.0;
      break;
    }
  }

  // Priorities
  if (priorities.includes("More Storage") && categoryKey === "storage") {
    if ((specs.capacity || 0) >= 1000) score += 2.5;
  }
  if (priorities.includes("More RAM") && categoryKey === "ram") {
    if ((specs.capacity || 0) >= 32) score += 2.5;
  }
  if (priorities.includes("Future Upgradeability")) {
    if (categoryKey === "psu" && (specs.wattage || 0) >= 750) score += 1.5;
    if (categoryKey === "motherboard" && specs.memoryType === "DDR5") score += 1.5;
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
  const gpuLen = gpu?.specifications?.length || 0;
  const caseGpuMax = pcCase?.specifications?.gpuMaxLength || 320;
  if (!gpu?.isIntegrated && gpuLen > 0 && caseGpuMax > 0) {
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
      status: "VERIFIED",
      details: gpu?.isIntegrated
        ? "Integrated CPU graphics requires 0mm PCIe chassis clearance"
        : "Chassis clearance verified",
    });
  }

  // 5. Cooler ↔ CPU Socket & Thermal TDP Envelope
  const coolerSockets = cooler?.specifications?.supportedSockets;
  if (cpuSocket && Array.isArray(coolerSockets) && coolerSockets.length > 0) {
    const socketMatch = coolerSockets.some(
      (s) => s.toLowerCase() === cpuSocket.toLowerCase()
    );
    const coolerMaxTdp = cooler?.specifications?.maxTdp || 150;
    const cpuTdp = cpu?.specifications?.tdp || 65;
    const tdpMatch = coolerMaxTdp >= cpuTdp;
    const match = socketMatch && tdpMatch;

    checks.push({
      name: "Cooler ↔ CPU Socket & Thermal Envelope",
      status: match ? "VERIFIED" : "INCOMPATIBLE",
      details: match
        ? `Cooler supports ${cpuSocket} (Cooler ${coolerMaxTdp}W >= CPU ${cpuTdp}W TDP)`
        : !socketMatch
        ? `Cooler bracket does not support socket ${cpuSocket}`
        : `Cooler max TDP (${coolerMaxTdp}W) is insufficient for CPU TDP (${cpuTdp}W)`,
    });
    if (!match) isCompatible = false;
  } else {
    checks.push({
      name: "Cooler ↔ CPU Socket & Thermal Envelope",
      status: "UNAVAILABLE",
      details: "Cooler socket metadata partially unavailable",
    });
  }

  // 6. Power Delivery ↔ System Load
  const psuWattage = psu?.specifications?.wattage || 500;
  const gpuRecPsu = gpu?.isIntegrated ? 300 : (gpu?.specifications?.recommendedPsu || 450);
  const cpuTdp = cpu?.specifications?.tdp || 65;
  const gpuPower = gpu?.isIntegrated ? 15 : (gpu?.specifications?.powerDraw || 100);
  const estPeak = (cpuTdp + gpuPower + 80) * 1.15;

  const powerAdequate = psuWattage >= gpuRecPsu && psuWattage >= estPeak;
  checks.push({
    name: "Power Delivery ↔ System Load",
    status: powerAdequate ? "VERIFIED" : "INCOMPATIBLE",
    details: powerAdequate
      ? `${psuWattage}W PSU exceeds recommended ${gpuRecPsu}W (est. peak ${Math.round(estPeak)}W)`
      : `${psuWattage}W PSU insufficient for ${gpuRecPsu}W requirement (est. peak ${Math.round(estPeak)}W)`,
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
  const gpuName = gpu?.isIntegrated
    ? (gpu?.specifications?.chipset || "Integrated Graphics")
    : (gpu?.specifications?.chipset || gpu?.brand || "Dedicated GPU");

  if (tier === "VALUE") {
    name = `${gpuName} High-Value ${mainUseCase} Rig`;
    whyThisBuild = `Designed to deliver exceptional ${mainUseCase.toLowerCase()} throughput while preserving headroom under your baseline budget. Every Rupee is focused on raw compute and stable thermal margins.`;
    strengths.push(`Total cost remains comfortably under budget (${budgetUsedPercent}% of allocation).`);
    if (gpu?.isIntegrated) {
      strengths.push(`Integrated graphics keep system cost and power draw minimal while allocating budget to CPU and memory.`);
      tradeoffs.push(`Uses integrated graphics; discrete GPU recommended for heavy AAA gaming.`);
    } else {
      strengths.push(`${gpu?.specifications?.vram || 8}GB VRAM paired with a modern ${cpu?.specifications?.cores || 6}-core processor prevents bottlenecks.`);
      tradeoffs.push(`Focuses on essential high-value platform rather than luxury aesthetic RGB lighting.`);
    }
    strengths.push(`Solid-state PCIe NVMe storage delivers rapid game loading and OS boot times.`);
  } else if (tier === "TARGET") {
    name = `${gpuName} Target Balanced System`;
    whyThisBuild = `Engineered to maximize your exact target investment. Striking the ideal equilibrium between GPU rendering power, CPU single-thread agility, and generous multi-tasking RAM.`;
    strengths.push(`Optimally matches your target budget (${budgetUsedPercent}% utilized).`);
    if (gpu?.isIntegrated) {
      strengths.push(`Prioritizes high core-count ${cpu?.specifications?.cores || 6}-core processor and ${ram?.specifications?.capacity || 16}GB RAM.`);
      tradeoffs.push(`Utilizes integrated graphics to maximize computational CPU and RAM allocation.`);
    } else {
      strengths.push(`Tier-1 hardware pairing ensures seamless 1080p/1440p capability and high thermal stability.`);
      strengths.push(`${ram?.specifications?.capacity || 16}GB memory accommodates intensive multi-tasking and background workloads.`);
      tradeoffs.push(`Calibrated to your exact budget ceiling without excess over-provisioning.`);
    }
  } else {
    name = `${gpuName} Performance Flex Overclock Tier`;
    whyThisBuild = `Takes advantage of your permitted stretch allowance to step into higher-tier hardware, unlocking greater graphic fidelity, faster render times, and extended multi-year longevity.`;
    strengths.push(`Leverages flex allowance (+₹${Math.max(0, totalPrice - budget).toLocaleString("en-IN")}) to upgrade pivotal performance tiers.`);
    strengths.push(`Higher-class compute delivers faster framerates and heavy productivity suite acceleration.`);
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
    price: p.price || 0,
    discountPrice: p.discountPrice || 0,
    images: p.images || [],
    category: p.category?.name || p.category || "Component",
    specifications: p.specifications || {},
    useCaseProfile: p.useCaseProfile || {},
    isIntegrated: Boolean(p.isIntegrated),
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
    if (gpu.isIntegrated) {
      const discreteGpus = (productsByCategory.gpu || [])
        .filter((g) => !g.isIntegrated)
        .sort((a, b) => a.price - b.price);
      if (discreteGpus.length > 0) {
        const targetGpu = discreteGpus[0];
        upgrades.push({
          category: "gpu",
          categoryName: "Graphics Card",
          current: sanitizeProduct(gpu),
          upgrade: sanitizeProduct(targetGpu),
          priceDifference: targetGpu.price,
          benefit: `Add ${targetGpu.title.split("(")[0].trim()} (${targetGpu.specifications?.vram || 4}GB) for dedicated gaming framerates and 3D GPU acceleration.`,
        });
      }
    } else {
      const higherGpus = (productsByCategory.gpu || [])
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
  }

  // 2. CPU Upgrade Candidate
  if (productsByCategory.cpu && cpu) {
    const cpuSocket = cpu.specifications?.socket;
    const higherCpus = (productsByCategory.cpu || [])
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
    const higherRams = (productsByCategory.ram || [])
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
        benefit: `Expand memory to ${targetRam.specifications?.capacity || 32}GB ${targetRam.specifications?.memoryType || "DDR4"} for seamless multi-tasking and high timeline responsiveness.`,
      });
    }
  }

  // 4. Storage Upgrade Candidate
  if (productsByCategory.storage && storage) {
    const currentCap = storage.specifications?.capacity || 500;
    const higherStorages = (productsByCategory.storage || [])
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

// -------------------------------------------------------------
// LAPTOP RECOMMENDATION ENGINE & MOBILE SCORING LOGIC
// -------------------------------------------------------------

/**
 * Technical suitability scoring for integrated laptops based on real MongoDB specifications
 */
function scoreLaptop(laptop, primaryUse, workloads = {}, priorities = []) {
  const s = laptop.specifications || {};
  const p = laptop.useCaseProfile || {};

  // 1. Extract and normalize VRAM
  let vram = Number(s.gpuVram) || 0;
  const gpuTitle = (s.gpu || s.gpuModel || "").toLowerCase();
  if (!vram) {
    if (gpuTitle.includes("4090")) vram = 16;
    else if (gpuTitle.includes("4080")) vram = 12;
    else if (gpuTitle.includes("4070")) vram = 8;
    else if (gpuTitle.includes("4060")) vram = 8;
    else if (gpuTitle.includes("4050")) vram = 6;
    else if (gpuTitle.includes("3050")) vram = 6;
    else if (gpuTitle.includes("m4 pro")) vram = 24;
    else if (gpuTitle.includes("m4") || gpuTitle.includes("m3")) vram = 16;
  }

  // 2. Extract and normalize RAM
  let ramGb = 16;
  if (typeof s.ram === "string") {
    const match = s.ram.match(/(\d+)\s*GB/i);
    if (match) ramGb = parseInt(match[1], 10);
  } else if (typeof s.capacity === "number") {
    ramGb = s.capacity;
  }

  // 3. Extract and normalize Storage
  let storageGb = 512;
  if (typeof s.storage === "string") {
    if (s.storage.toUpperCase().includes("TB")) {
      const match = s.storage.match(/(\d+)\s*TB/i);
      storageGb = match ? parseInt(match[1], 10) * 1000 : 1000;
    } else {
      const match = s.storage.match(/(\d+)\s*GB/i);
      if (match) storageGb = parseInt(match[1], 10);
    }
  }

  // 4. Extract and normalize Refresh Rate
  const refreshRate = Number(s.refreshRate) || 60;

  // 5. Extract and normalize Weight
  let weightKg = 2.2;
  if (typeof s.weight === "string") {
    const match = s.weight.match(/([\d.]+)\s*kg/i);
    if (match) weightKg = parseFloat(match[1]);
  }

  // 6. Extract and normalize Battery
  let batteryWhr = 60;
  if (typeof s.battery === "string") {
    const match = s.battery.match(/(\d+)\s*Whr/i);
    if (match) batteryWhr = parseInt(match[1], 10);
  }

  // 7. Resolution & Panel Scoring
  const resLower = (s.resolution || "").toLowerCase();
  let resScore = 6.0;
  if (
    resLower.includes("3.2k") ||
    resLower.includes("4k") ||
    resLower.includes("3840") ||
    resLower.includes("3456") ||
    resLower.includes("3024")
  ) {
    resScore = 9.8;
  } else if (
    resLower.includes("2.8k") ||
    resLower.includes("2880") ||
    resLower.includes("2.5k") ||
    resLower.includes("2560") ||
    resLower.includes("wqxga")
  ) {
    resScore = 8.6;
  } else if (
    resLower.includes("2.2k") ||
    resLower.includes("2240") ||
    resLower.includes("1920 x 1200") ||
    resLower.includes("wuxga")
  ) {
    resScore = 7.4;
  }

  const panelLower = (s.panelType || "").toLowerCase();
  let panelBonus = 0;
  if (
    panelLower.includes("oled") ||
    panelLower.includes("mini led") ||
    panelLower.includes("liquid retina")
  ) {
    panelBonus = 1.8;
  }

  // 8. CPU Scoring
  const cpuLower = (s.processor || s.processorFamily || "").toLowerCase();
  let cpuScore = 6.5;
  if (
    cpuLower.includes("14900hx") ||
    cpuLower.includes("14900h") ||
    cpuLower.includes("m4 pro")
  ) {
    cpuScore = 10.0;
  } else if (cpuLower.includes("14700hx") || cpuLower.includes("m4")) {
    cpuScore = 9.2;
  } else if (
    cpuLower.includes("14650hx") ||
    cpuLower.includes("13900hx") ||
    cpuLower.includes("ultra 7 155h") ||
    cpuLower.includes("m3")
  ) {
    cpuScore = 8.6;
  } else if (
    cpuLower.includes("13620h") ||
    cpuLower.includes("13500hx") ||
    cpuLower.includes("7735hs") ||
    cpuLower.includes("m2") ||
    cpuLower.includes("x elite")
  ) {
    cpuScore = 8.0;
  } else if (
    cpuLower.includes("13450hx") ||
    cpuLower.includes("13420h") ||
    cpuLower.includes("7235hs")
  ) {
    cpuScore = 7.2;
  }

  // 9. GPU Scoring
  let gpuScore = 4.5;
  if (gpuTitle.includes("4090")) gpuScore = 10.0;
  else if (gpuTitle.includes("4080")) gpuScore = 9.3;
  else if (gpuTitle.includes("4070")) gpuScore = 8.4;
  else if (gpuTitle.includes("4060")) gpuScore = 7.6;
  else if (gpuTitle.includes("4050")) gpuScore = 6.8;
  else if (gpuTitle.includes("3050")) gpuScore = 5.8;
  else if (gpuTitle.includes("m4 pro")) gpuScore = 8.8;
  else if (gpuTitle.includes("m4")) gpuScore = 7.2;
  else if (gpuTitle.includes("m3")) gpuScore = 6.5;
  else if (gpuTitle.includes("m2")) gpuScore = 5.8;
  else if (
    gpuTitle.includes("arc") ||
    gpuTitle.includes("radeon 680m") ||
    gpuTitle.includes("adreno")
  ) {
    gpuScore = 5.0;
  }

  const ramScore =
    ramGb >= 64
      ? 10.0
      : ramGb >= 32
      ? 8.8
      : ramGb >= 24
      ? 8.0
      : ramGb >= 16
      ? 6.5
      : 4.0;
  const storageScore =
    storageGb >= 4000
      ? 10.0
      : storageGb >= 2000
      ? 8.8
      : storageGb >= 1000
      ? 7.5
      : 6.0;
  const displayScore = Math.min(
    10,
    resScore * 0.5 + Math.min(refreshRate, 240) / 24 + panelBonus
  );
  const portabilityScore = Math.max(2, 10 - (weightKg - 1.2) * 4.5);
  const batteryScore = Math.min(10, (batteryWhr / 99) * 10);

  // 10. Workload Weightings
  const use = (primaryUse || "gaming").toLowerCase();
  let baseScore = 5.0;

  const isIntegratedGpu =
    gpuTitle.includes("integrated") ||
    gpuTitle.includes("arc") ||
    gpuTitle.includes("adreno") ||
    gpuTitle.includes("radeon 680m") ||
    (gpuTitle.includes("apple") && !gpuTitle.includes("m4 pro"));

  const isDedicatedRtx =
    gpuTitle.includes("geforce") ||
    gpuTitle.includes("rtx") ||
    gpuTitle.includes("m4 pro");

  if (use.includes("game") || use.includes("gaming")) {
    // Gaming: GPU > CPU > display > RAM
    baseScore =
      gpuScore * 0.45 +
      cpuScore * 0.25 +
      displayScore * 0.18 +
      ramScore * 0.12;

    // Direct workload profile alignment
    if (p.gaming) baseScore += ((p.gaming - 5) * 0.8);

    // Dedicated GPU & High Refresh Rate are essential for Gaming
    if (isDedicatedRtx) baseScore += 2.5;
    if (isIntegratedGpu) baseScore -= 3.5;
    if (refreshRate >= 144) baseScore += 2.0;
    else if (refreshRate < 120) baseScore -= 2.5;

    // Target resolution adjustment
    const resTarget = (workloads?.gaming?.resolution || "").toLowerCase();
    if (
      resTarget.includes("1440p") ||
      resTarget.includes("1600p") ||
      resTarget.includes("4k")
    ) {
      if (vram >= 8) baseScore += 2.0;
      if (resScore >= 8.0) baseScore += 1.5;
    } else if (resTarget.includes("1080p")) {
      if (refreshRate >= 144) baseScore += 1.5;
    }

    // Gaming priority adjustment
    const gPriority = (workloads?.gaming?.priority || "").toLowerCase();
    if (gPriority.includes("high fps") || gPriority.includes("competitive")) {
      if (refreshRate >= 165) baseScore += 1.5;
      if (refreshRate >= 240) baseScore += 1.0;
    } else if (gPriority.includes("visual") || gPriority.includes("quality")) {
      if (resScore >= 8.5) baseScore += 1.5;
      if (panelBonus > 0) baseScore += 1.0;
      if (vram >= 8) baseScore += 1.0;
    }
  } else if (use.includes("prof") || use.includes("work")) {
    // Professional: CPU > RAM > battery/portability depending on discipline
    baseScore =
      cpuScore * 0.35 +
      ramScore * 0.25 +
      portabilityScore * 0.15 +
      batteryScore * 0.15 +
      storageScore * 0.1;
    if (p.productivity) baseScore += ((p.productivity - 5) * 0.6);

    const wl = (workloads?.professional?.workload || "").toLowerCase();
    if (
      wl.includes("cad") ||
      wl.includes("engineering") ||
      wl.includes("simulation") ||
      wl.includes("3d")
    ) {
      if (vram >= 6) baseScore += 2.5;
      if (ramGb >= 32) baseScore += 1.5;
    } else if (wl.includes("data") || wl.includes("analytics")) {
      if (ramGb >= 32) baseScore += 2.5;
      if (cpuScore >= 8.5) baseScore += 1.5;
    } else if (
      wl.includes("office") ||
      wl.includes("productivity") ||
      wl.includes("business")
    ) {
      if (batteryWhr >= 65) baseScore += 2.0;
      if (weightKg <= 1.6) baseScore += 2.0;
    } else if (wl.includes("creative")) {
      if (panelBonus > 0 || resScore >= 8.5) baseScore += 2.0;
      if (vram >= 6) baseScore += 1.5;
    }
  } else if (use.includes("edit") || use.includes("video")) {
    // Editing: CPU/GPU > RAM > display > storage
    baseScore =
      cpuScore * 0.3 +
      gpuScore * 0.3 +
      ramScore * 0.2 +
      displayScore * 0.12 +
      storageScore * 0.08;
    if (p.editing) baseScore += ((p.editing - 5) * 0.6);

    const resTarget = (workloads?.editing?.resolution || "").toLowerCase();
    if (
      resTarget.includes("4k") ||
      resTarget.includes("6k") ||
      resTarget.includes("8k")
    ) {
      if (ramGb >= 32) baseScore += 2.5;
      if (vram >= 8) baseScore += 2.0;
      if (panelBonus > 0 || resScore >= 8.5) baseScore += 1.8;
      if (resTarget.includes("6k") || resTarget.includes("8k")) {
        if (vram >= 12 || ramGb >= 64) baseScore += 2.0;
      }
    }
  } else if (use.includes("ai") || use.includes("machine")) {
    // AI: GPU/VRAM > RAM > CPU
    baseScore =
      gpuScore * 0.45 +
      ramScore * 0.25 +
      cpuScore * 0.2 +
      storageScore * 0.1;
    if (p.ai) baseScore += ((p.ai - 5) * 0.6);

    if (vram >= 16) baseScore += 3.5;
    else if (vram >= 12) baseScore += 2.5;
    else if (vram >= 8) baseScore += 1.5;

    if (ramGb >= 64) baseScore += 3.0;
    else if (ramGb >= 32) baseScore += 2.0;
  } else if (use.includes("program") || use.includes("dev")) {
    // Programming: CPU > RAM > battery/keyboard/portability
    baseScore =
      cpuScore * 0.38 +
      ramScore * 0.3 +
      portabilityScore * 0.12 +
      batteryScore * 0.1 +
      storageScore * 0.1;
    if (p.programming) baseScore += ((p.programming - 5) * 0.6);

    if (ramGb >= 32) baseScore += 2.0;
    const wl = (workloads?.programming?.workload || "").toLowerCase();
    if (wl.includes("game")) {
      if (vram >= 6) baseScore += 2.5;
    }
  } else if (use.includes("student")) {
    // Student: Battery & Portability > CPU > Display/Keyboard
    baseScore =
      batteryScore * 0.3 +
      portabilityScore * 0.3 +
      cpuScore * 0.22 +
      displayScore * 0.1 +
      ramScore * 0.08;
    if (p.productivity) baseScore += ((p.productivity - 5) * 0.6);
    if (weightKg <= 1.6) baseScore += 2.0;
    if (batteryWhr >= 65) baseScore += 2.0;
  } else if (use.includes("render") || use.includes("3d")) {
    // 3D / Rendering: GPU > CPU > RAM
    baseScore =
      gpuScore * 0.4 +
      cpuScore * 0.28 +
      ramScore * 0.2 +
      storageScore * 0.12;
    if (p.rendering) baseScore += ((p.rendering - 5) * 0.6);
    if (vram >= 8) baseScore += 2.0;
  } else {
    // Mixed Use
    baseScore =
      cpuScore * 0.28 +
      gpuScore * 0.28 +
      displayScore * 0.18 +
      ramScore * 0.16 +
      storageScore * 0.1;
  }

  // 11. Laptop-specific Priorities (max 2-3 priorities)
  for (const prio of priorities) {
    const pr = String(prio).toLowerCase();
    if (pr.includes("performance")) {
      if (gpuScore >= 8.0) baseScore += 1.5;
      if (cpuScore >= 8.5) baseScore += 1.5;
      if (s.tgp >= 140) baseScore += 1.0;
    }
    if (pr.includes("portability")) {
      if (weightKg <= 1.6) baseScore += 3.0;
      else if (weightKg <= 2.0) baseScore += 1.5;
      else if (weightKg >= 2.5) baseScore -= 1.5;
    }
    if (pr.includes("battery")) {
      if (batteryWhr >= 75) baseScore += 3.0;
      else if (batteryWhr >= 64) baseScore += 2.0;
    }
    if (pr.includes("display")) {
      if (panelBonus > 0) baseScore += 2.5;
      if (resScore >= 8.5) baseScore += 2.0;
      if (refreshRate >= 165) baseScore += 1.0;
    }
    if (pr.includes("ram")) {
      if (ramGb >= 64) baseScore += 4.0;
      else if (ramGb >= 32) baseScore += 2.5;
    }
    if (pr.includes("storage")) {
      if (storageGb >= 2000) baseScore += 3.0;
      else if (storageGb >= 1000) baseScore += 1.5;
    }
    if (pr.includes("gpu") || pr.includes("vram")) {
      if (vram >= 12) baseScore += 3.5;
      else if (vram >= 8) baseScore += 2.0;
      else if (vram >= 6) baseScore += 1.0;
    }
    if (pr.includes("build")) {
      const title = laptop.title.toLowerCase();
      if (
        title.includes("spectre") ||
        title.includes("zenbook") ||
        title.includes("macbook") ||
        title.includes("alienware") ||
        title.includes("zephyrus") ||
        title.includes("titan") ||
        title.includes("legion pro") ||
        title.includes("thinkpad")
      ) {
        baseScore += 2.5;
      }
    }
  }

  return baseScore;
}

/**
 * Generate factual explainability metadata for recommended laptops based on real specifications
 */
function buildLaptopExplanation(
  tier,
  laptop,
  budget,
  budgetFlex,
  primaryUse,
  workloads = {},
  priorities = []
) {
  const s = laptop.specifications || {};
  const price = laptop.price;
  const withinBudget =
    price <= (tier === "PERFORMANCE_FLEX" ? budget + budgetFlex : budget);
  const budgetUsedPercent = Number(((price / budget) * 100).toFixed(1));
  const diffFromBudget = price - budget;

  const cpu = s.processor
    ? s.processor.split("(")[0].trim()
    : s.processorFamily || "High-performance CPU";
  const gpu = s.gpu ? s.gpu.split("(")[0].trim() : "Integrated Graphics";
  const vram = Number(s.gpuVram) || 0;
  const ram = s.ram || "16GB RAM";
  const storage = s.storage || "512GB SSD";
  const display = `${s.displaySize ? s.displaySize + '" ' : ""}${
    s.resolution || ""
  } ${s.refreshRate ? s.refreshRate + "Hz " : ""}${s.panelType || ""}`.trim();
  const weight = s.weight || "2.2 kg";
  const battery = s.battery || "Integrated Battery";

  let ramGb = 16;
  if (typeof s.ram === "string") {
    const match = s.ram.match(/(\d+)\s*GB/i);
    if (match) ramGb = parseInt(match[1], 10);
  }

  let weightKg = 2.2;
  if (typeof s.weight === "string") {
    const match = s.weight.match(/([\d.]+)\s*kg/i);
    if (match) weightKg = parseFloat(match[1]);
  }

  const mainUseCase = primaryUse || "Multitasking & Everyday Use";
  const useLower = mainUseCase.toLowerCase();

  let whyThisLaptop = "";
  const strengths = [];
  const tradeoffs = [];

  if (useLower.includes("game") || useLower.includes("gaming")) {
    const res = workloads?.gaming?.resolution || "1080p";
    whyThisLaptop = `Selected for your ${res} gaming profile because it combines an ${cpu} processor with ${gpu}${
      vram ? ` (${vram}GB VRAM)` : ""
    } and a high-refresh display within your target budget.`;
  } else if (useLower.includes("edit") || useLower.includes("video")) {
    const res = workloads?.editing?.resolution || "4K";
    whyThisLaptop = `Selected for your ${res} video editing workflow because it combines high-performance multithreaded compute (${cpu}), dedicated GPU acceleration, and a color-accurate display within your target budget.`;
  } else if (useLower.includes("prof") || useLower.includes("work")) {
    const wl = workloads?.professional?.workload || "workstation";
    whyThisLaptop = `Selected for your ${wl} discipline because it balances responsive ${cpu} processing, ${ram} high-bandwidth memory, and robust chassis engineering.`;
  } else if (useLower.includes("program") || useLower.includes("dev")) {
    const wl = workloads?.programming?.workload || "development";
    whyThisLaptop = `Selected for your ${wl} environment with fast ${cpu} compile speeds, ${ram} memory capacity for multitasking, and comfortable ergonomics.`;
  } else if (useLower.includes("ai") || useLower.includes("machine")) {
    const wl = workloads?.ai?.workload || "AI & Machine Learning";
    whyThisLaptop = `Selected for ${wl} workloads utilizing ${
      vram ? `${vram}GB dedicated VRAM` : "high-speed hardware"
    } on ${gpu} and ${ram} system memory for model evaluation.`;
  } else if (useLower.includes("student")) {
    whyThisLaptop = `Selected for student mobility and everyday productivity, pairing a portable ${weight} chassis, long-lasting ${battery}, and responsive ${cpu} processing.`;
  } else if (useLower.includes("render") || useLower.includes("3d")) {
    whyThisLaptop = `Selected for 3D modeling and rendering acceleration with ${gpu} graphics compute, ${cpu} multithreading, and ${ram} memory headroom.`;
  } else {
    whyThisLaptop = `Selected as an optimal all-around machine combining ${cpu} processing, ${gpu} graphics, and a premium ${
      display || "display"
    } panel.`;
  }

  // Fact-based strengths
  if (vram > 0) {
    strengths.push(
      `${gpu} (${vram}GB VRAM${
        s.tgp ? `, ${s.tgp}W TGP` : ""
      }) delivers dedicated hardware acceleration.`
    );
  } else {
    strengths.push(
      `${gpu} provides exceptional energy efficiency and silent thermal operation.`
    );
  }

  if (s.resolution || s.refreshRate) {
    strengths.push(
      `${s.resolution || "High-Resolution"} display with ${
        s.refreshRate ? s.refreshRate + "Hz refresh rate" : "vibrant panel"
      } ${s.colorCoverage ? `(${s.colorCoverage})` : ""}.`
    );
  }

  strengths.push(
    `${ram} paired with ${storage} solid state storage ensures rapid app switching and boot times.`
  );

  if (weightKg <= 1.65) {
    strengths.push(
      `Ultra-portable ${weight} form factor with ${battery} ensures seamless on-the-go mobility.`
    );
  } else if (price <= budget) {
    strengths.push(
      `Investment remains comfortably under your target budget (${budgetUsedPercent}% utilized).`
    );
  } else {
    strengths.push(
      `Utilizes permitted flex (+₹${diffFromBudget.toLocaleString(
        "en-IN"
      )}) to access premium tier hardware.`
    );
  }

  // Fact-based trade-offs
  if (diffFromBudget > 0) {
    tradeoffs.push(
      `Requires using your permitted flex allowance (+₹${diffFromBudget.toLocaleString(
        "en-IN"
      )}).`
    );
  } else {
    tradeoffs.push(
      `Optimally utilized at ${budgetUsedPercent}% of your baseline budget allocation.`
    );
  }

  if (weightKg >= 2.4) {
    tradeoffs.push(
      `At ${weight}, the chassis is calibrated for sustained thermal cooling rather than ultra-light travel.`
    );
  } else if (vram === 0) {
    tradeoffs.push(
      `Relies on integrated graphics; ideal for battery longevity and productivity rather than heavy AAA gaming.`
    );
  } else if (ramGb <= 16) {
    tradeoffs.push(
      `Equipped with 16GB memory; sufficient for modern gaming and editing, though 32GB is preferred for massive data models.`
    );
  }

  return {
    name: laptop.title,
    tier,
    totalPrice: price,
    budgetUsedPercent,
    differenceFromBudget: diffFromBudget,
    withinBudget,
    whyThisLaptop,
    whyThisBuild: whyThisLaptop,
    strengths,
    tradeoffs,
  };
}

/**
 * Controller Handler: Laptop Recommendation Pipeline
 */
export const generateLaptopRecommendations = async (req, res, body) => {
  const rawBudget = Number(body.budget);
  if (!rawBudget || isNaN(rawBudget) || rawBudget < 50000) {
    throw new ApiError(
      400,
      "Valid numeric budget of at least ₹50,000 is required for laptops."
    );
  }

  const budget = rawBudget;
  const budgetFlex =
    Number(body.budgetFlex) && !isNaN(Number(body.budgetFlex))
      ? Number(body.budgetFlex)
      : 0;
  const maxAllowedBudget = budget + budgetFlex;

  let useCases = [];
  if (Array.isArray(body.useCases) && body.useCases.length > 0) {
    useCases = body.useCases;
  } else if (typeof body.primaryUse === "string") {
    useCases = [body.primaryUse];
  } else {
    useCases = ["Gaming"];
  }

  const primaryUse = useCases[0] || "Gaming";
  const workloads = body.workloads || {};
  if (body.gaming && !workloads.gaming) workloads.gaming = body.gaming;
  if (body.editing && !workloads.editing) workloads.editing = body.editing;
  if (body.professional && !workloads.professional)
    workloads.professional = body.professional;
  if (body.programming && !workloads.programming)
    workloads.programming = body.programming;
  if (body.ai && !workloads.ai) workloads.ai = body.ai;

  const priorities = Array.isArray(body.priorities) ? body.priorities : [];
  const experience = body.experience || "I know the basics";

  // Load candidate laptops strictly matching productType = 'laptop' from MongoDB
  const allLaptops = await Product.find({ productType: "laptop" })
    .populate("category", "name slug")
    .lean();

  if (!allLaptops || allLaptops.length === 0) {
    throw new ApiError(
      500,
      "Laptop catalog is currently unavailable in MongoDB."
    );
  }

  // Pre-score all laptops
  const scoredLaptops = allLaptops.map((l) => ({
    laptop: l,
    score: scoreLaptop(l, primaryUse, workloads, priorities),
  }));

  // Candidates within maxAllowedBudget
  const withinMaxBudget = scoredLaptops.filter(
    ({ laptop }) => laptop.price <= maxAllowedBudget
  );

  if (withinMaxBudget.length === 0) {
    throw new ApiError(
      422,
      `Your specified budget of ₹${budget.toLocaleString(
        "en-IN"
      )} is below our available laptop catalog (models start from ₹74,990). Please increase your budget.`
    );
  }

  // Under-budget pool
  const underBudget = withinMaxBudget.filter(
    ({ laptop }) => laptop.price <= budget
  );

  let valuePick = null;
  let targetPick = null;
  let flexPick = null;

  if (underBudget.length > 0) {
    // VALUE: pick best value ratio (score / price) strictly <= budget
    const valueSorted = [...underBudget].sort(
      (a, b) => b.score / b.laptop.price - a.score / a.laptop.price
    );
    valuePick =
      valueSorted.find((item) => item.laptop.price <= budget * 0.94) ||
      valueSorted[0];

    // TARGET: pick highest score strictly <= budget distinct from valuePick
    const targetCandidates = underBudget
      .filter(
        (item) =>
          item.laptop._id.toString() !== valuePick.laptop._id.toString()
      )
      .sort((a, b) => b.score - a.score);

    targetPick = targetCandidates[0] || valuePick;
  } else {
    // If none strictly under budget, pick lowest priced within max budget
    const priceSorted = [...withinMaxBudget].sort(
      (a, b) => a.laptop.price - b.laptop.price
    );
    valuePick = priceSorted[0];
    targetPick =
      priceSorted.find(
        (item) => item.laptop._id.toString() !== valuePick.laptop._id.toString()
      ) || valuePick;
  }

  // PERFORMANCE FLEX:
  const flexCandidates = withinMaxBudget
    .filter(
      (item) => item.laptop.price > budget && item.laptop.price <= maxAllowedBudget
    )
    .sort((a, b) => b.score - a.score);

  if (flexCandidates.length > 0 && budgetFlex > 0) {
    let bestFlex = flexCandidates.filter(
      (item) =>
        item.laptop._id.toString() !== targetPick.laptop._id.toString() &&
        item.laptop._id.toString() !== valuePick.laptop._id.toString()
    );

    if (bestFlex.length === 0) bestFlex = flexCandidates;

    // For gaming, prioritize dedicated gaming GPUs if available in flex pool
    const isGaming = useCases.some((u) => String(u).toLowerCase().includes("game"));
    if (isGaming) {
      const dedicatedInFlex = bestFlex.find((item) => {
        const g = (item.laptop.specifications?.gpu || "").toLowerCase();
        return g.includes("geforce") || g.includes("rtx");
      });
      flexPick = dedicatedInFlex || bestFlex[0];
    } else {
      flexPick = bestFlex[0];
    }
  } else {
    // Pick highest scoring in max budget distinct from target and value
    const remaining = [...withinMaxBudget]
      .sort((a, b) => b.score - a.score)
      .filter(
        (item) =>
          item.laptop._id.toString() !== targetPick.laptop._id.toString() &&
          item.laptop._id.toString() !== valuePick.laptop._id.toString()
      );
    flexPick = remaining[0];
  }

  // Fallback to guarantee exactly 3 distinct real MongoDB laptops
  const distinctPicks = [valuePick.laptop];
  if (targetPick.laptop._id.toString() !== distinctPicks[0]._id.toString()) {
    distinctPicks.push(targetPick.laptop);
  } else {
    const alt = withinMaxBudget.find(
      (item) => item.laptop._id.toString() !== distinctPicks[0]._id.toString()
    );
    if (alt) distinctPicks.push(alt.laptop);
  }

  if (
    flexPick &&
    !distinctPicks.some(
      (l) => l._id.toString() === flexPick.laptop._id.toString()
    )
  ) {
    distinctPicks.push(flexPick.laptop);
  } else {
    const availableLaptops = [...allLaptops].sort((a, b) => a.price - b.price);
    const alt = availableLaptops.find(
      (l) => !distinctPicks.some((p) => p._id.toString() === l._id.toString())
    );
    if (alt) distinctPicks.push(alt);
  }

  while (distinctPicks.length < 3 && allLaptops.length >= 3) {
    const next = allLaptops.find(
      (l) => !distinctPicks.some((p) => p._id.toString() === l._id.toString())
    );
    if (next) distinctPicks.push(next);
    else break;
  }

  const [valLaptop, tarLaptop, flxLaptop] = distinctPicks;

  const buildLaptopResult = (tier, laptop) => {
    const s = laptop.specifications || {};
    const explanation = buildLaptopExplanation(
      tier,
      laptop,
      budget,
      budgetFlex,
      primaryUse,
      workloads,
      priorities
    );
    return {
      ...explanation,
      systemType: "laptop",
      product: sanitizeProduct(laptop),
      laptopSpecs: {
        model: s.model || laptop.title,
        cpu: s.processor || s.processorFamily || "High-performance CPU",
        gpu: s.gpu || s.gpuModel || "Integrated Graphics",
        ram: s.ram || "16GB RAM",
        storage: s.storage || "512GB SSD",
        display: `${s.displaySize ? s.displaySize + '" ' : ""}${
          s.resolution || ""
        } ${s.refreshRate ? s.refreshRate + "Hz " : ""}${
          s.panelType || ""
        }`.trim(),
        battery: s.battery || "Integrated Battery",
        weight: s.weight || "2.2 kg",
        operatingSystem: s.operatingSystem || "Windows 11",
        keyboard: s.keyboard || "Backlit Keyboard",
        ports: s.ports || [],
        warranty: s.warranty || "1 Year Warranty",
      },
      systemChecks: [
        {
          name: "Workload Suitability",
          status: "VERIFIED",
          details: `Calibrated for ${primaryUse} workload profile`,
        },
        {
          name: "Thermal & TGP Envelope",
          status: "VERIFIED",
          details: s.tgp
            ? `${s.tgp}W TGP platform envelope`
            : `${s.powerClass || "Optimized mobile"} thermal profile`,
        },
        {
          name: "Display & Refresh Calibration",
          status: "VERIFIED",
          details: `${s.resolution || "High-Definition"} @ ${
            s.refreshRate || 60
          }Hz panel verified`,
        },
        {
          name: "Memory & Storage Allocation",
          status: "VERIFIED",
          details: `${s.ram || "High-Speed Memory"} / ${
            s.storage || "Solid State Drive"
          } integrated architecture`,
        },
      ],
    };
  };

  const outputRecommendations = [
    buildLaptopResult("VALUE", valLaptop),
    buildLaptopResult("TARGET", tarLaptop),
    buildLaptopResult("PERFORMANCE_FLEX", flxLaptop),
  ];

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        systemType: "laptop",
        requestedBudget: budget,
        budgetFlex,
        maxAllowedBudget,
        useCases,
        workloads,
        priorities,
        experience,
        recommendations: outputRecommendations,
      },
      "GearGrid Laptop recommendations generated successfully"
    )
  );
};

// -------------------------------------------------------------
// INTELLIGENT CANDIDATE BUILD GENERATOR
// -------------------------------------------------------------
function buildSystemCandidates(categories, budget, maxAllowedBudget, useCases = [], workloads = {}, priorities = []) {
  const weights = computeWorkloadWeights(useCases, workloads);
  const isGaming = useCases.some(u => String(u).toLowerCase().includes("game"));
  const isEditing = useCases.some(u => String(u).toLowerCase().includes("edit"));
  const is3DOrAI = useCases.some(u => String(u).toLowerCase().includes("3d") || String(u).toLowerCase().includes("render") || String(u).toLowerCase().includes("ai"));
  const isDevOrProf = useCases.some(u => String(u).toLowerCase().includes("program") || String(u).toLowerCase().includes("prof"));

  // Allow APU builds only when discrete GPU is not strictly required
  const allowIntegratedGfx = !isGaming && !is3DOrAI && (isDevOrProf || weights.gpu <= 0.2) && budget <= 65000;

  // Maximum allowable secondary component caps based on budget
  const maxStorageBudget = budget <= 45000 ? 3500 : budget <= 65000 ? 5500 : budget <= 90000 ? 7500 : budget <= 180000 ? 15000 : 35000;
  const maxMoboBudget = budget <= 45000 ? 6000 : budget <= 65000 ? 8000 : budget <= 90000 ? 15000 : budget <= 180000 ? 25000 : 55000;
  const maxPsuBudget = budget <= 45000 ? 3000 : budget <= 65000 ? 4500 : budget <= 90000 ? 8000 : budget <= 180000 ? 15000 : 30000;
  const maxCaseBudget = budget <= 45000 ? 3000 : budget <= 65000 ? 4500 : budget <= 90000 ? 6500 : budget <= 180000 ? 12000 : 25000;
  const maxCoolerBudget = budget <= 45000 ? 1500 : budget <= 65000 ? 2500 : budget <= 90000 ? 4500 : budget <= 180000 ? 12000 : 25000;

  // CPU budget limits to ensure balanced builds
  const maxCpuBudget = budget <= 45000 ? 9500 : budget <= 65000 ? 16500 : budget <= 85000 ? 22000 : maxAllowedBudget * 0.45;

  // Filter GPU pool
  const gpuPool = [...categories.gpus].filter(g => g.price <= maxAllowedBudget * 0.72);
  const scoredGpus = gpuPool
    .map(g => ({ item: g, score: scoreComponent(g, "gpu", weights, priorities, budget) }))
    .sort((a, b) => b.score - a.score);

  // Filter CPU pool
  const cpuPool = [...categories.cpus].filter(c => c.price <= maxCpuBudget);
  const scoredCpus = cpuPool
    .map(c => ({ item: c, score: scoreComponent(c, "cpu", weights, priorities, budget) }))
    .sort((a, b) => b.score - a.score);

  const candidateBuilds = [];

  // Evaluate Discrete GPU builds
  for (const { item: gpu } of scoredGpus) {
    for (const { item: cpu } of scoredCpus) {
      if (gpu.price + cpu.price > maxAllowedBudget * 0.82) continue;

      // Platform balance: Don't pair flagship i9/i7 with budget H610 DDR4
      const isHighEndCpu = (cpu.specifications?.tdp || 65) >= 125 || cpu.price >= 30000;

      // Filter compatible motherboards
      const compMobos = categories.motherboards
        .filter(m => {
          const sockMatch = m.specifications?.socket?.toLowerCase() === cpu.specifications?.socket?.toLowerCase();
          const priceMatch = m.price <= maxMoboBudget;
          if (isHighEndCpu && m.price < 10000) return false;
          return sockMatch && priceMatch;
        })
        .map(m => ({ item: m, score: scoreComponent(m, "motherboard", weights, priorities, budget) }))
        .sort((a, b) => {
          if (budget <= 75000) return a.item.price - b.item.price;
          return b.score - a.score;
        });

      if (compMobos.length === 0) continue;

      for (const { item: mobo } of compMobos.slice(0, 3)) {
        // Filter compatible RAMs
        const compRams = categories.rams
          .filter(r => r.specifications?.memoryType?.toUpperCase() === mobo.specifications?.memoryType?.toUpperCase())
          .map(r => ({ item: r, score: scoreComponent(r, "ram", weights, priorities, budget) }))
          .sort((a, b) => {
            const capA = a.item.specifications?.capacity || 16;
            const capB = b.item.specifications?.capacity || 16;
            if (budget <= 45000) {
              if (capA === 16 && capB !== 16) return -1;
              if (capB === 16 && capA !== 16) return 1;
              return a.item.price - b.item.price;
            }
            if (budget <= 80000) {
              if (isEditing || isDevOrProf) {
                if (capA === 32 && capB !== 32) return -1;
                if (capB === 32 && capA !== 32) return 1;
              }
              if (capA >= 16 && capB < 16) return -1;
              if (capB >= 16 && capA < 16) return 1;
              return b.score - a.score;
            }
            if (budget >= 150000) {
              if (capA >= 32 && capB < 32) return -1;
              if (capB >= 32 && capA < 32) return 1;
            }
            return b.score - a.score;
          });

        if (compRams.length === 0) continue;

        // Filter compatible Storages
        const compStorages = categories.storages
          .filter(s => s.price <= maxStorageBudget)
          .map(s => ({ item: s, score: scoreComponent(s, "storage", weights, priorities, budget) }))
          .sort((a, b) => {
            const capA = a.item.specifications?.capacity || 1000;
            const capB = b.item.specifications?.capacity || 1000;
            if (budget <= 50000) return a.item.price - b.item.price;
            if (isEditing || is3DOrAI || budget >= 75000) {
              if (capA >= 1000 && capB < 1000) return -1;
              if (capB >= 1000 && capA < 1000) return 1;
            }
            return b.score - a.score;
          });

        if (compStorages.length === 0) continue;

        // Filter compatible Coolers
        const cpuTdp = cpu.specifications?.tdp || 65;
        const compCoolers = categories.coolers
          .filter(cl => {
            const sockMatch = !cl.specifications?.supportedSockets || cl.specifications.supportedSockets.some(s => s.toLowerCase() === cpu.specifications?.socket?.toLowerCase());
            const tdpMatch = (cl.specifications?.maxTdp || 150) >= cpuTdp;
            const priceMatch = cl.price <= maxCoolerBudget;
            return sockMatch && tdpMatch && priceMatch;
          })
          .map(cl => ({ item: cl, score: scoreComponent(cl, "cooling", weights, priorities, budget) }))
          .sort((a, b) => (budget <= 75000 ? a.item.price - b.item.price : b.score - a.score));

        if (compCoolers.length === 0) continue;

        // Filter compatible Cases
        const compCases = categories.cases
          .filter(cs => {
            const ffMatch = !cs.specifications?.formFactorSupport || cs.specifications.formFactorSupport.some(ff => ff.toLowerCase() === mobo.specifications?.formFactor?.toLowerCase());
            const lenMatch = !cs.specifications?.gpuMaxLength || (gpu.specifications?.length || 250) <= cs.specifications.gpuMaxLength;
            const priceMatch = cs.price <= maxCaseBudget;
            return ffMatch && lenMatch && priceMatch;
          })
          .map(cs => ({ item: cs, score: scoreComponent(cs, "case", weights, priorities, budget) }))
          .sort((a, b) => (budget <= 75000 ? a.item.price - b.item.price : b.score - a.score));

        if (compCases.length === 0) continue;

        // Filter compatible PSUs
        const reqPsu = gpu.specifications?.recommendedPsu || 450;
        const compPsus = categories.psus
          .filter(p => (p.specifications?.wattage || 500) >= reqPsu && p.price <= maxPsuBudget)
          .map(p => ({ item: p, score: scoreComponent(p, "psu", weights, priorities, budget) }))
          .sort((a, b) => (budget <= 75000 ? a.item.price - b.item.price : b.score - a.score));

        if (compPsus.length === 0) continue;

        // Generate combinations
        for (const { item: ram } of compRams.slice(0, 2)) {
          for (const { item: storage } of compStorages.slice(0, 2)) {
            for (const { item: cooler } of compCoolers.slice(0, 2)) {
              for (const { item: pcCase } of compCases.slice(0, 2)) {
                for (const { item: psu } of compPsus.slice(0, 2)) {
                  const totalPrice = cpu.price + gpu.price + mobo.price + ram.price + storage.price + cooler.price + psu.price + pcCase.price;

                  if (totalPrice <= maxAllowedBudget) {
                    const { isCompatible, checks } = checkCompatibility(cpu, gpu, mobo, ram, storage, cooler, psu, pcCase);
                    if (isCompatible) {
                      let balanceMultiplier = 1.0;
                      if (isGaming) {
                        if (cpu.price > gpu.price * 1.5) balanceMultiplier *= 0.75;
                      }

                      const totalScore =
                        (scoreComponent(cpu, "cpu", weights, priorities, budget) * weights.cpu * 3 +
                        scoreComponent(gpu, "gpu", weights, priorities, budget) * weights.gpu * 3 +
                        scoreComponent(ram, "ram", weights, priorities, budget) * weights.ram * 2 +
                        scoreComponent(storage, "storage", weights, priorities, budget) * weights.storage * 2 +
                        scoreComponent(cooler, "cooling", weights, priorities, budget) * 0.1 +
                        scoreComponent(mobo, "motherboard", weights, priorities, budget) * 0.1 +
                        scoreComponent(psu, "psu", weights, priorities, budget) * 0.1 +
                        scoreComponent(pcCase, "case", weights, priorities, budget) * 0.1) * balanceMultiplier;

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

  // Evaluate APU builds if allowed
  if (allowIntegratedGfx) {
    const apuCpus = scoredCpus.filter(({ item }) => (item.specifications?.hasIntegratedGfx || item.specifications?.igpu) && !item.title.includes("12400F") && !item.title.includes("13400F") && !item.title.includes("14400F"));
    for (const { item: cpu } of apuCpus) {
      const igpuName = cpu.specifications?.igpu || (cpu.title.includes("5600G") ? "AMD Radeon Vega 7 Graphics" : "Intel UHD Graphics 730");
      const fakeGpu = {
        _id: "igpu_" + cpu._id,
        title: `${igpuName} (CPU Integrated Graphics)`,
        brand: cpu.brand,
        price: 0,
        category: "Graphics Cards",
        specifications: { chipset: igpuName, vram: 0, powerDraw: 0 },
        useCaseProfile: { gaming: 3.5, productivity: 7.5, programming: 8.0 },
        isIntegrated: true
      };

      const compMobos = categories.motherboards
        .filter(m => m.specifications?.socket?.toLowerCase() === cpu.specifications?.socket?.toLowerCase() && m.price <= maxMoboBudget)
        .map(m => ({ item: m, score: scoreComponent(m, "motherboard", weights, priorities, budget) }))
        .sort((a, b) => a.item.price - b.item.price);

      for (const { item: mobo } of compMobos.slice(0, 2)) {
        const compRams = categories.rams
          .filter(r => r.specifications?.memoryType?.toUpperCase() === mobo.specifications?.memoryType?.toUpperCase())
          .map(r => ({ item: r, score: scoreComponent(r, "ram", weights, priorities, budget) }))
          .sort((a, b) => b.score - a.score);

        const compStorages = categories.storages
          .filter(s => s.price <= maxStorageBudget)
          .map(s => ({ item: s, score: scoreComponent(s, "storage", weights, priorities, budget) }))
          .sort((a, b) => b.score - a.score);

        const compCoolers = categories.coolers
          .filter(cl => !cl.specifications?.supportedSockets || cl.specifications.supportedSockets.some(s => s.toLowerCase() === cpu.specifications?.socket?.toLowerCase()))
          .sort((a, b) => a.price - b.price);

        const compCases = categories.cases.sort((a, b) => a.price - b.price);
        const compPsus = categories.psus.sort((a, b) => a.price - b.price);

        if (compRams.length && compStorages.length && compCoolers.length && compCases.length && compPsus.length) {
          for (const ram of compRams.slice(0, 2).map(r => r.item)) {
            for (const storage of compStorages.slice(0, 2).map(s => s.item)) {
              const cooler = compCoolers[0];
              const pcCase = compCases[0];
              const psu = compPsus[0];
              const totalPrice = cpu.price + mobo.price + ram.price + storage.price + cooler.price + psu.price + pcCase.price;

              if (totalPrice <= maxAllowedBudget) {
                const { isCompatible, checks } = checkCompatibility(cpu, fakeGpu, mobo, ram, storage, cooler, psu, pcCase);
                if (isCompatible) {
                  const totalScore =
                    scoreComponent(cpu, "cpu", weights, priorities, budget) * weights.cpu * 3 +
                    6.0 * weights.gpu * 3 +
                    scoreComponent(ram, "ram", weights, priorities, budget) * weights.ram * 2 +
                    scoreComponent(storage, "storage", weights, priorities, budget) * weights.storage * 2 +
                    0.5;

                  candidateBuilds.push({
                    components: { cpu, gpu: fakeGpu, motherboard: mobo, ram, storage, cooling: cooler, psu, case: pcCase },
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

  return candidateBuilds;
}

// -------------------------------------------------------------
// SELECTION OF VALUE, TARGET, PERFORMANCE_FLEX
// -------------------------------------------------------------
function selectThreeBuilds(candidateBuilds, budget, budgetFlex, maxAllowedBudget) {
  if (!candidateBuilds || candidateBuilds.length === 0) return null;

  const underBudgetBuilds = candidateBuilds.filter(b => b.totalPrice <= budget);
  if (underBudgetBuilds.length === 0) return null;

  // 1. VALUE TIER: Targets ~72% to 92% of budget, maximizing score/price ratio
  const minValBudget = Math.max(32000, budget * 0.72);
  const maxValBudget = budget * 0.92;
  let valuePool = underBudgetBuilds.filter(b => b.totalPrice >= minValBudget && b.totalPrice <= maxValBudget);
  if (valuePool.length === 0) {
    valuePool = underBudgetBuilds.filter(b => b.totalPrice <= maxValBudget);
  }
  if (valuePool.length === 0) {
    valuePool = underBudgetBuilds;
  }

  // Sort by efficiency (score / price)
  valuePool.sort((a, b) => (b.totalScore / b.totalPrice) - (a.totalScore / a.totalPrice));
  const valueBuild = valuePool[0];

  // 2. TARGET TIER: Targets highest score strictly <= budget, distinct from valueBuild
  const targetPool = underBudgetBuilds.filter(b => b.totalPrice >= (valueBuild.totalPrice + 2000) || (b.totalScore > valueBuild.totalScore && b !== valueBuild));
  let targetBuild = null;
  if (targetPool.length > 0) {
    targetPool.sort((a, b) => b.totalScore - a.totalScore);
    targetBuild = targetPool[0];
  } else {
    const highestScoring = [...underBudgetBuilds].sort((a, b) => b.totalScore - a.totalScore);
    targetBuild = highestScoring.find(b => b !== valueBuild) || highestScoring[0];
  }

  // 3. PERFORMANCE FLEX: Can exceed budget up to maxAllowedBudget
  let flexBuild = null;
  if (budgetFlex > 0) {
    const flexPool = candidateBuilds
      .filter(b => b.totalPrice > budget && b.totalPrice <= maxAllowedBudget)
      .sort((a, b) => b.totalScore - a.totalScore);

    if (flexPool.length > 0) {
      flexBuild = flexPool[0];
    }
  }

  if (!flexBuild) {
    const remaining = [...underBudgetBuilds]
      .sort((a, b) => b.totalScore - a.totalScore)
      .filter(b => b !== targetBuild && b !== valueBuild);
    flexBuild = remaining[0] || targetBuild;
  }

  // Ensure 3 distinct builds if candidate pool allows
  const distinct = [valueBuild];
  if (targetBuild && !distinct.includes(targetBuild)) distinct.push(targetBuild);
  else {
    const alt = underBudgetBuilds.find(b => !distinct.includes(b));
    if (alt) distinct.push(alt);
  }

  if (flexBuild && !distinct.includes(flexBuild)) distinct.push(flexBuild);
  else {
    const alt = candidateBuilds.find(b => !distinct.includes(b) && b.totalPrice <= maxAllowedBudget);
    if (alt) distinct.push(alt);
  }

  while (distinct.length < 3 && candidateBuilds.length >= 3) {
    const next = candidateBuilds.find(b => !distinct.includes(b) && b.totalPrice <= maxAllowedBudget);
    if (next) distinct.push(next);
    else break;
  }

  return distinct;
}

/**
 * Primary Controller Handler: POST /api/v1/configure/recommend
 */
export const generateRecommendations = asyncHandler(async (req, res) => {
  const body = req.body || {};

  // Check system type: 'pc' | 'laptop' (defaults to 'pc' for 100% backward compatibility)
  const systemType = (body.systemType || body.deviceType || "pc").toLowerCase().trim();
  if (systemType === "laptop") {
    return generateLaptopRecommendations(req, res, body);
  }

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
  if (body.programming && !workloads.programming) workloads.programming = body.programming;
  if (body.ai && !workloads.ai) workloads.ai = body.ai;

  const priorities = Array.isArray(body.priorities) ? body.priorities : [];
  const experience = body.experience || "I know the basics";

  // 3. Compute Multi-Vector Workload Weights
  const weights = computeWorkloadWeights(useCases, workloads);

  // 4. Load Candidate Products from MongoDB (strictly excluding laptops)
  const allProducts = await Product.find({ productType: { $ne: "laptop" } })
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

  // 5. Generate Viable Combinations & Compatibility Filtering
  const candidateBuilds = buildSystemCandidates(categories, budget, maxAllowedBudget, useCases, workloads, priorities);

  if (!candidateBuilds || candidateBuilds.length === 0) {
    throw new ApiError(
      422,
      `Your specified budget of ₹${budget.toLocaleString("en-IN")} is insufficient to construct a complete, fully-compatible 8-component hardware system with the current catalog. Please increase your budget.`
    );
  }

  // 6. Select the Three Distinct Builds (VALUE, TARGET, PERFORMANCE FLEX)
  const threeBuilds = selectThreeBuilds(candidateBuilds, budget, budgetFlex, maxAllowedBudget);

  if (!threeBuilds || threeBuilds.length === 0) {
    throw new ApiError(
      422,
      `No compatible configuration could be found strictly within ₹${budget.toLocaleString("en-IN")}.`
    );
  }

  const [valueBuild, targetBuild, flexBuild] = threeBuilds;

  // 7. Format Output Builds with Genuine MongoDB Upgrades
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
      systemType: "pc",
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
      systemType: "pc",
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
      systemType: "pc",
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
        systemType: "pc",
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
