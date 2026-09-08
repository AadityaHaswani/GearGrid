import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import path from 'path';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

import '../src/models/category.models.js';
import { Product } from '../src/models/product.models.js';

// -------------------------------------------------------------
// WORKLOAD WEIGHTS & LOGIC
// -------------------------------------------------------------
const BASE_USECASE_WEIGHTS = {
  gaming: { cpu: 0.30, gpu: 0.48, ram: 0.12, storage: 0.10 },
  editing: { cpu: 0.32, gpu: 0.30, ram: 0.22, storage: 0.16 },
  rendering: { cpu: 0.28, gpu: 0.38, ram: 0.20, storage: 0.14 },
  programming: { cpu: 0.42, gpu: 0.08, ram: 0.30, storage: 0.20 },
  ai: { cpu: 0.18, gpu: 0.50, ram: 0.22, storage: 0.10 },
  professional: { cpu: 0.35, gpu: 0.18, ram: 0.27, storage: 0.20 },
  streaming: { cpu: 0.35, gpu: 0.35, ram: 0.18, storage: 0.12 },
  mixed: { cpu: 0.30, gpu: 0.30, ram: 0.20, storage: 0.20 },
};

const RESOLUTION_MODIFIERS = {
  "1080p": { cpu: 0.34, gpu: 0.42, ram: 0.12, storage: 0.12 },
  "1440p": { cpu: 0.26, gpu: 0.48, ram: 0.13, storage: 0.13 },
  "4k": { cpu: 0.18, gpu: 0.56, ram: 0.14, storage: 0.12 },
  "6k / 8k": { cpu: 0.20, gpu: 0.50, ram: 0.18, storage: 0.12 },
};

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
      details: match ? `${cpuSocket} matches ${moboSocket} socket architecture` : `CPU socket ${cpuSocket} cannot fit motherboard socket ${moboSocket}`,
    });
    if (!match) isCompatible = false;
  }

  // 2. Motherboard Memory Type ↔ RAM Memory Type
  const moboMem = mobo?.specifications?.memoryType;
  const ramMem = ram?.specifications?.memoryType;
  if (moboMem && ramMem) {
    const match = moboMem.toUpperCase() === ramMem.toUpperCase();
    checks.push({
      name: "Motherboard Memory ↔ RAM",
      status: match ? "VERIFIED" : "INCOMPATIBLE",
      details: match ? `${ramMem} memory standard supported by motherboard` : `Motherboard requires ${moboMem} but RAM is ${ramMem}`,
    });
    if (!match) isCompatible = false;
  }

  // 3. Motherboard Form Factor ↔ Case Support
  const moboFf = mobo?.specifications?.formFactor;
  const caseFfSupport = pcCase?.specifications?.formFactorSupport;
  if (moboFf && Array.isArray(caseFfSupport) && caseFfSupport.length > 0) {
    const match = caseFfSupport.some(ff => ff.toLowerCase() === moboFf.toLowerCase());
    checks.push({
      name: "Motherboard ↔ Case Form Factor",
      status: match ? "VERIFIED" : "INCOMPATIBLE",
      details: match ? `${moboFf} motherboard fits case form factor envelope` : `Case supports [${caseFfSupport.join(", ")}] but motherboard is ${moboFf}`,
    });
    if (!match) isCompatible = false;
  }

  // 4. GPU Length ↔ Case GPU Clearance
  const gpuLen = gpu?.specifications?.length || 0;
  const caseGpuMax = pcCase?.specifications?.gpuMaxLength || 320;
  if (!gpu?.isIntegrated && gpuLen > 0 && caseGpuMax > 0) {
    const match = gpuLen <= caseGpuMax;
    checks.push({
      name: "GPU Clearance in Case",
      status: match ? "VERIFIED" : "INCOMPATIBLE",
      details: match ? `GPU length (${gpuLen}mm) within case clearance (${caseGpuMax}mm)` : `GPU length (${gpuLen}mm) exceeds case max length (${caseGpuMax}mm)`,
    });
    if (!match) isCompatible = false;
  }

  // 5. Cooler ↔ CPU Socket & Thermal TDP Adequacy
  const coolerSockets = cooler?.specifications?.supportedSockets;
  if (cpuSocket && Array.isArray(coolerSockets) && coolerSockets.length > 0) {
    const socketMatch = coolerSockets.some(s => s.toLowerCase() === cpuSocket.toLowerCase());
    const coolerMaxTdp = cooler?.specifications?.maxTdp || 150;
    const cpuTdp = cpu?.specifications?.tdp || 65;
    const tdpMatch = coolerMaxTdp >= cpuTdp;
    const match = socketMatch && tdpMatch;
    checks.push({
      name: "Cooler ↔ CPU Socket & Thermal Envelope",
      status: match ? "VERIFIED" : "INCOMPATIBLE",
      details: match ? `Cooler supports ${cpuSocket} (Cooler ${coolerMaxTdp}W >= CPU ${cpuTdp}W TDP)` : `Cooler inadequate for CPU socket ${cpuSocket} or TDP ${cpuTdp}W`,
    });
    if (!match) isCompatible = false;
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
    details: powerAdequate ? `${psuWattage}W PSU exceeds recommended ${gpuRecPsu}W (est. peak ${Math.round(estPeak)}W)` : `${psuWattage}W PSU insufficient for ${gpuRecPsu}W requirement`,
  });
  if (!powerAdequate) isCompatible = false;

  return { isCompatible, checks };
}

// -------------------------------------------------------------
// INTELLIGENT CANDIDATE BUILD GENERATOR
// -------------------------------------------------------------
export function buildSystemCandidates(categories, budget, maxAllowedBudget, useCases = [], workloads = {}, priorities = []) {
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
          if (isHighEndCpu && m.price < 10000) return false; // High TDP CPUs require robust VRM boards
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
export function selectThreeBuilds(candidateBuilds, budget, budgetFlex, maxAllowedBudget) {
  if (!candidateBuilds || candidateBuilds.length === 0) return null;

  const underBudgetBuilds = candidateBuilds.filter(b => b.totalPrice <= budget);
  if (underBudgetBuilds.length === 0) return null;

  // 1. VALUE TIER: Targets ~75% to 92% of budget, maximizing score/price ratio
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

async function runPrototypeTests() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const allProducts = await Product.find({ productType: { $ne: "laptop" } })
    .populate("category", "name slug")
    .lean();

  const categories = {
    cpus: [],
    gpus: [],
    motherboards: [],
    rams: [],
    storages: [],
    coolers: [],
    cases: [],
    psus: []
  };

  for (const p of allProducts) {
    const catName = p.category?.name || "";
    if (catName === "Processors") categories.cpus.push(p);
    else if (catName === "Graphics Cards") categories.gpus.push(p);
    else if (catName === "Motherboards") categories.motherboards.push(p);
    else if (catName === "Memory / RAM") categories.rams.push(p);
    else if (catName === "Storage") categories.storages.push(p);
    else if (catName === "Power Supplies") categories.psus.push(p);
    else if (catName === "Cooling & Cases") {
      if (p.specifications?.coolerType || p.title.toLowerCase().includes("cooler")) {
        categories.coolers.push(p);
      } else {
        categories.cases.push(p);
      }
    }
  }

  const scenarios = [
    { name: '1. ₹40,000 Gaming', budget: 40000, budgetFlex: 5000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1080p' } } },
    { name: '2. ₹50,000 Gaming', budget: 50000, budgetFlex: 5000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1080p' } } },
    { name: '3. ₹60,000 Gaming', budget: 60000, budgetFlex: 10000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1080p' } } },
    { name: '4. ₹75,000 Gaming', budget: 75000, budgetFlex: 10000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1080p' } } },
    { name: '5. ₹50,000 Programming', budget: 50000, budgetFlex: 5000, useCases: ['Programming'] },
    { name: '6. ₹60,000 Professional', budget: 60000, budgetFlex: 10000, useCases: ['Professional'] },
    { name: '7. ₹75,000 Video Editing', budget: 75000, budgetFlex: 10000, useCases: ['Video Editing'], workloads: { editing: { resolution: '4K' } } },
    { name: '8. ₹1,50,000 Premium Gaming', budget: 150000, budgetFlex: 20000, useCases: ['Gaming'], workloads: { gaming: { resolution: '1440p' } } },
    { name: '9. ₹3,50,000 Enthusiast AI / 3D', budget: 350000, budgetFlex: 50000, useCases: ['3D / Rendering', 'AI / ML'] }
  ];

  for (const s of scenarios) {
    console.log(`\n======================================================`);
    console.log(`TESTING: ${s.name}`);
    console.log(`======================================================`);
    const candidates = buildSystemCandidates(categories, s.budget, s.budget + s.budgetFlex, s.useCases, s.workloads, s.priorities);
    console.log(`Total viable candidate builds: ${candidates.length}`);

    const builds = selectThreeBuilds(candidates, s.budget, s.budgetFlex, s.budget + s.budgetFlex);
    if (!builds || builds.length < 3) {
      console.error(`FAILED for ${s.name}`);
      continue;
    }

    const tiers = ['VALUE', 'TARGET', 'PERFORMANCE_FLEX'];
    builds.forEach((b, idx) => {
      const tierName = tiers[idx];
      console.log(`\n  Tier: ${tierName} | Total: ₹${b.totalPrice.toLocaleString('en-IN')} (Budget: ₹${s.budget.toLocaleString('en-IN')})`);
      console.log(`    CPU : ${b.components.cpu.title} (₹${b.components.cpu.price})`);
      console.log(`    GPU : ${b.components.gpu.title} (₹${b.components.gpu.price})`);
      console.log(`    MB  : ${b.components.motherboard.title} (₹${b.components.motherboard.price})`);
      console.log(`    RAM : ${b.components.ram.title} (₹${b.components.ram.price})`);
      console.log(`    SSD : ${b.components.storage.title} (₹${b.components.storage.price})`);
      console.log(`    PSU : ${b.components.psu.title} (₹${b.components.psu.price})`);
      console.log(`    CASE: ${b.components.case.title} (₹${b.components.case.price})`);
      console.log(`    COOL: ${b.components.cooling.title} (₹${b.components.cooling.price})`);
    });
  }

  await mongoose.disconnect();
}

runPrototypeTests();
