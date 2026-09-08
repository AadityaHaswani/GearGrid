import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Gamepad2, 
  Briefcase, 
  Film, 
  Box, 
  Code2, 
  Cpu, 
  Radio, 
  Layers, 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Sliders, 
  ShieldCheck, 
  RotateCcw, 
  ArrowRight, 
  Monitor, 
  Zap, 
  VolumeX, 
  HardDrive, 
  Award,
  Sparkles,
  Info,
  ShoppingCart,
  Share2,
  ExternalLink,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  SlidersHorizontal,
  RefreshCw,
  SlidersVertical,
  CheckCheck,
  Laptop,
  GraduationCap,
  Battery
} from 'lucide-react';
import configureAPI from '../services/configure.api';
import { useShop } from '../context/ShopContext';
import './ConfigurePage.css';

// -------------------------------------------------------------
// QUESTIONNAIRE METADATA & CONSTANTS
// -------------------------------------------------------------

const PRIMARY_USE_CASES_PC = [
  {
    id: 'gaming',
    label: 'Gaming',
    desc: 'Esports, competitive shooters, immersive AAA titles & ray-traced visuals',
    icon: Gamepad2,
  },
  {
    id: 'professional',
    label: 'Professional Work',
    desc: 'CAD, engineering, architecture, simulation & multi-monitor office suites',
    icon: Briefcase,
  },
  {
    id: 'editing',
    label: 'Video Editing',
    desc: 'Premiere Pro, DaVinci Resolve, 4K/8K timeline scrubbing & color grading',
    icon: Film,
  },
  {
    id: 'rendering',
    label: '3D / Rendering',
    desc: 'Blender, Maya, Cinema 4D, Unreal Engine 5 viewport & heavy compute',
    icon: Box,
  },
  {
    id: 'programming',
    label: 'Programming',
    desc: 'Full-stack development, mobile apps, Docker containers & compilation',
    icon: Code2,
  },
  {
    id: 'ai',
    label: 'AI / Machine Learning',
    desc: 'Local LLMs, stable diffusion, PyTorch model training & CUDA acceleration',
    icon: Cpu,
  },
  {
    id: 'streaming',
    label: 'Streaming',
    desc: 'High-bitrate OBS, AV1 encoding, dual-monitor broadcasts & audience capture',
    icon: Radio,
  },
  {
    id: 'mixed',
    label: 'Mixed Use',
    desc: 'Balanced everyday workstation: multi-tasking, content consumption & gaming',
    icon: Layers,
  },
];

const PRIMARY_USE_CASES_LAPTOP = [
  {
    id: 'gaming',
    label: 'Gaming',
    desc: 'AAA high-refresh gaming, dedicated RTX ray tracing & competitive esports on the go',
    icon: Gamepad2,
  },
  {
    id: 'professional',
    label: 'Professional Work',
    desc: 'CAD, engineering, data analysis, multi-tasking & enterprise workstation workflows',
    icon: Briefcase,
  },
  {
    id: 'editing',
    label: 'Video Editing',
    desc: 'Premiere Pro, DaVinci Resolve, 4K/8K timeline scrubbing & wide color gamut display',
    icon: Film,
  },
  {
    id: 'rendering',
    label: '3D / Rendering',
    desc: 'Blender, Maya, Unreal Engine 5 viewport, GPU CUDA compute & 3D visualization',
    icon: Box,
  },
  {
    id: 'programming',
    label: 'Programming',
    desc: 'Full-stack development, mobile apps, container virtualization & fast local compile',
    icon: Code2,
  },
  {
    id: 'ai',
    label: 'AI / Machine Learning',
    desc: 'Local LLM inference, PyTorch, CUDA tensor compute & dedicated VRAM models',
    icon: Cpu,
  },
  {
    id: 'student',
    label: 'Student / Productivity',
    desc: 'All-day battery life, lightweight chassis, office suites, research & lecture note-taking',
    icon: GraduationCap,
  },
  {
    id: 'mixed',
    label: 'Mixed Use',
    desc: 'Balanced mobile daily driver: office suites, media streaming, web & casual gaming',
    icon: Layers,
  },
];

// Fallback alias for backward compatibility
const PRIMARY_USE_CASES = PRIMARY_USE_CASES_PC;

const BUDGET_PRESETS_PC = [
  { label: '₹50,000', value: 50000, desc: 'Entry gaming & home productivity' },
  { label: '₹75,000', value: 75000, desc: 'High-FPS 1080p esports & editing' },
  { label: '₹1,00,000', value: 100000, desc: 'Sweet spot 1440p gaming & creator build' },
  { label: '₹1,50,000', value: 150000, desc: 'Enthusiast 1440p high-refresh & heavy compute' },
  { label: '₹2,00,000', value: 200000, desc: '4K Ultra gaming, 3D viewport & AI inference' },
  { label: '₹3,00,000+', value: 300000, desc: 'Halo tier — Blackwell RTX 5090 / 9950X3D' },
];

const BUDGET_PRESETS_LAPTOP = [
  { label: '₹75,000', value: 75000, desc: 'Entry RTX gaming & agile mobile multitasking' },
  { label: '₹1,00,000', value: 100000, desc: 'Sweet spot RTX 4050 / Core Ultra / MacBook Air' },
  { label: '₹1,50,000', value: 150000, desc: 'Enthusiast RTX 4060/4070 & creator color display' },
  { label: '₹2,00,000', value: 200000, desc: 'High-end RTX 4070 / MacBook Pro M4 / OLED Workstation' },
  { label: '₹2,50,000', value: 250000, desc: 'Premium RTX 4080 / MacBook Pro M4 Pro' },
  { label: '₹3,50,000+', value: 350000, desc: 'Flagship SCAR 18 / Legion 9i / Titan RTX 4090' },
];

const BUDGET_FLEX_OPTIONS = [
  {
    id: 'strict',
    label: 'Strict Budget',
    value: 0,
    desc: 'Do not exceed my baseline budget under any condition.',
  },
  {
    id: 'flex_5k',
    label: 'Up to +₹5,000',
    value: 5000,
    desc: 'Allow minor headroom if it upgrades a crucial tier (e.g. 1TB to 2TB SSD).',
  },
  {
    id: 'flex_10k',
    label: 'Up to +₹10,000',
    value: 10000,
    desc: 'Strongly recommended for GPU/CPU generational leaps or double RAM.',
  },
];

const PRIORITY_OPTIONS_PC = [
  { id: 'max_perf', label: 'Maximum Performance', icon: Zap, desc: 'Highest FPS and render throughput per Rupee' },
  { id: 'best_val', label: 'Best Value', icon: Award, desc: 'Optimized price-to-performance sweet spots' },
  { id: 'quiet_op', label: 'Quiet Operation', icon: VolumeX, desc: 'Acoustic dampening, low-RPM fans & zero-dB modes' },
  { id: 'upgradeable', label: 'Future Upgradeability', icon: Sliders, desc: 'Robust VRMs, high-wattage PSU & PCIe 5.0 headroom' },
  { id: 'more_storage', label: 'More Storage', icon: HardDrive, desc: 'High-capacity NVMe SSDs for sprawling libraries' },
  { id: 'more_ram', label: 'More RAM', icon: Cpu, desc: '32GB / 64GB+ for heavy virtualization and multi-tasking' },
  { id: 'low_power', label: 'Low Power Consumption', icon: ShieldCheck, desc: 'Thermal efficiency and optimized wattage draws' },
  { id: 'premium_parts', label: 'Premium Components', icon: Sparkles, desc: 'Tier-1 heatsinks, branded PSU, and clean aesthetic' },
];

const PRIORITY_OPTIONS_LAPTOP = [
  { id: 'perf', label: 'Performance', icon: Zap, desc: 'Maximum sustained CPU/GPU compute and high TGP wattage' },
  { id: 'portability', label: 'Portability', icon: Box, desc: 'Slim chassis under 1.6kg for effortless daily travel' },
  { id: 'battery', label: 'Battery Life', icon: Battery, desc: 'High-capacity 65–90Whr battery for all-day unplugged runtime' },
  { id: 'display', label: 'Display Quality', icon: Monitor, desc: 'OLED / Mini-LED, 2.5K+ resolution, 100% DCI-P3 color accuracy' },
  { id: 'ram', label: 'RAM', icon: Cpu, desc: '32GB / 64GB memory for heavy datasets and virtualization' },
  { id: 'storage', label: 'Storage', icon: HardDrive, desc: '1TB / 2TB+ PCIe Gen4 NVMe for expansive local libraries' },
  { id: 'gpu_vram', label: 'GPU/VRAM', icon: Award, desc: 'Dedicated GeForce RTX graphics with high VRAM for gaming & AI' },
  { id: 'build', label: 'Build Quality', icon: Sparkles, desc: 'CNC aluminum unibody, premium hinges, and robust tactile deck' },
];

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    label: "I don't know much about hardware",
    desc: 'We will keep explanations crystal-clear, reliable, and free of unnecessary jargon.',
  },
  {
    id: 'intermediate',
    label: 'I know the basics',
    desc: 'We will highlight key specifications, architectural tiers, and bottleneck balances.',
  },
  {
    id: 'enthusiast',
    label: "I'm an enthusiast",
    desc: 'Deep dive breakdown: VRM power stages, thermal wattage envelopes, and bandwidth margins.',
  },
];

export default function ConfigurePage() {
  // System Type State ('pc' | 'laptop')
  const [systemType, setSystemType] = useState('pc');

  // Form State
  const [useCases, setUseCases] = useState([]);
  
  // Workload details state
  const [workloads, setWorkloads] = useState({
    gaming: {
      resolution: '1440p',
      priority: 'Balanced',
      refreshRate: '120–165Hz',
    },
    professional: {
      workload: 'CAD / Engineering',
      priority: 'CPU performance',
    },
    editing: {
      resolution: '4K',
      software: 'Premiere Pro',
      priority: 'Timeline performance',
    },
    rendering: {
      software: 'Blender',
      priority: 'GPU rendering',
    },
    programming: {
      workload: 'Full-stack / Web Development',
      priority: 'RAM & Multi-core CPU',
    },
    ai: {
      workload: 'Local AI / LLMs',
      priority: 'GPU / VRAM capacity',
    },
    streaming: {
      setup: 'Single-PC Gaming & High-Bitrate Broadcast',
      priority: 'Hardware NVENC / AV1 Encoding',
    },
    student: {
      focus: 'General Studies',
      priority: 'All-day Battery Life',
    },
    mixed: {
      focus: 'Performance & Work Balance',
      priority: 'Smooth everyday responsiveness & longevity',
    }
  });

  const [budgetType, setBudgetType] = useState('preset'); // 'preset' | 'custom'
  const [budgetPreset, setBudgetPreset] = useState(100000);
  const [customBudgetInput, setCustomBudgetInput] = useState('125000');
  const [budgetFlex, setBudgetFlex] = useState(5000);
  const [priorities, setPriorities] = useState(['Maximum Performance', 'Best Value']);
  const [experience, setExperience] = useState('I know the basics');

  // UI Flow State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [validationError, setValidationError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Shop Context for Cart Operations & Toasts
  const { addToCart, addBuildToCart, showToast } = useShop();

  // Recommendation Engine & Results State
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [activeBuilds, setActiveBuilds] = useState({});
  const [appliedUpgrades, setAppliedUpgrades] = useState({});
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [addingTierToCart, setAddingTierToCart] = useState(null);
  const [expandedUpgrades, setExpandedUpgrades] = useState({});

  // Active Context-Aware Metadata Collections
  const activePrimaryUseCases = systemType === 'laptop' ? PRIMARY_USE_CASES_LAPTOP : PRIMARY_USE_CASES_PC;
  const activePriorityOptions = systemType === 'laptop' ? PRIORITY_OPTIONS_LAPTOP : PRIORITY_OPTIONS_PC;
  const activeBudgetPresets = systemType === 'laptop' ? BUDGET_PRESETS_LAPTOP : BUDGET_PRESETS_PC;

  // Compute Active Steps dynamically based on selected system type and use cases
  const steps = useMemo(() => {
    const list = [
      { id: 'system-type', title: 'System Type', subtitle: 'What are you looking for?' },
      { 
        id: 'primary-use', 
        title: 'Primary Use', 
        subtitle: systemType === 'laptop' ? 'What will you use your Laptop for?' : 'What will you use your PC for?' 
      },
    ];

    // Conditional steps for each selected use case that requires detailed specs
    if (useCases.includes('gaming')) {
      list.push({ 
        id: 'workload-gaming', 
        title: 'Gaming Calibration', 
        subtitle: systemType === 'laptop' ? 'Target resolution & gaming priority' : 'Tune your target resolution & frame-rate requirements' 
      });
    }
    if (useCases.includes('professional')) {
      list.push({ 
        id: 'workload-professional', 
        title: 'Professional Workload', 
        subtitle: systemType === 'laptop' ? 'Primary professional workload & hardware focus' : 'Specify your core workstation discipline' 
      });
    }
    if (useCases.includes('editing')) {
      list.push({ 
        id: 'workload-editing', 
        title: 'Video Editing Specs', 
        subtitle: systemType === 'laptop' ? 'Target video resolution & editing workflow' : 'Timeline resolution & creative suite workflow' 
      });
    }
    if (useCases.includes('rendering')) {
      list.push({ 
        id: 'workload-rendering', 
        title: '3D & Rendering Engine', 
        subtitle: 'Primary 3D modeling tool & render priority' 
      });
    }
    if (useCases.includes('programming')) {
      list.push({ 
        id: 'workload-programming', 
        title: 'Development Environment', 
        subtitle: systemType === 'laptop' ? 'Primary development domain & compile requirements' : 'Compile workloads, virtualization & code bases' 
      });
    }
    if (useCases.includes('ai')) {
      list.push({ 
        id: 'workload-ai', 
        title: 'AI & Machine Learning', 
        subtitle: systemType === 'laptop' ? 'Primary AI workload & hardware requirements' : 'Neural workloads, tensor cores & VRAM constraints' 
      });
    }
    if (systemType === 'laptop' && useCases.includes('student')) {
      list.push({ 
        id: 'workload-student', 
        title: 'Student & Productivity', 
        subtitle: 'Academic focus & daily campus requirements' 
      });
    }

    // Common standard steps
    list.push(
      { 
        id: 'budget', 
        title: 'Target Investment', 
        subtitle: systemType === 'laptop' ? 'What is your target budget for this laptop?' : 'What is your target budget for this build?' 
      },
      { id: 'flexibility', title: 'Budget Flexibility', subtitle: 'Can you stretch for a pivotal performance leap?' },
      { 
        id: 'priorities', 
        title: systemType === 'laptop' ? 'Laptop Priorities' : 'System Priorities', 
        subtitle: 'Select up to 3 qualities that matter most to you' 
      },
      { 
        id: 'experience', 
        title: 'Hardware Profile', 
        subtitle: systemType === 'laptop' ? 'How comfortable are you evaluating laptop hardware?' : 'How comfortable are you choosing PC hardware?' 
      },
      { id: 'review', title: 'Consultation Manifest', subtitle: 'Review your calibrated requirements before staging' }
    );

    return list;
  }, [systemType, useCases]);

  // Keep step index within bounds if useCases change
  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      setCurrentStepIndex(steps.length - 1);
    }
  }, [steps.length, currentStepIndex]);

  // Auto-scroll to questionnaire top on step transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setValidationError('');
  }, [currentStepIndex]);

  const activeStep = steps[currentStepIndex] || steps[0];

  // Resolve Effective Budget Number
  const effectiveBudget = useMemo(() => {
    if (budgetType === 'preset') return budgetPreset;
    const parsed = parseInt(String(customBudgetInput).replace(/[^0-9]/g, ''), 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [budgetType, budgetPreset, customBudgetInput]);

  // Intentional Mode Selection Switcher
  const handleSelectSystemType = (type) => {
    setValidationError('');
    if (systemType !== type) {
      setSystemType(type);
      setUseCases([]);
      if (type === 'laptop') {
        setPriorities(['Performance', 'Display Quality']);
        setBudgetPreset(100000);
      } else {
        setPriorities(['Maximum Performance', 'Best Value']);
        setBudgetPreset(100000);
      }
    }
  };

  // Toggle Use Case in Multi-Select
  const toggleUseCase = (id) => {
    setValidationError('');
    setUseCases((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Toggle Priorities (Max 3)
  const togglePriority = (label) => {
    setValidationError('');
    setPriorities((prev) => {
      if (prev.includes(label)) {
        return prev.filter((p) => p !== label);
      }
      if (prev.length >= 3) {
        setValidationError('You can select up to 3 priorities to ensure a focused recommendation.');
        return prev;
      }
      return [...prev, label];
    });
  };

  // Validate Active Step before advancing
  const handleContinue = () => {
    setValidationError('');

    if (activeStep.id === 'system-type') {
      if (!systemType) {
        setValidationError('Please select whether you are looking for a PC or a Laptop.');
        return;
      }
    }

    if (activeStep.id === 'primary-use') {
      if (useCases.length === 0) {
        setValidationError(`Please select at least one primary use case for your ${systemType === 'laptop' ? 'laptop' : 'PC'}.`);
        return;
      }
    }

    if (activeStep.id === 'budget') {
      if (budgetType === 'custom') {
        const minBudget = systemType === 'laptop' ? 50000 : 35000;
        if (!effectiveBudget || effectiveBudget < minBudget) {
          setValidationError(`Please enter a sensible budget of at least ₹${minBudget.toLocaleString('en-IN')}.`);
          return;
        }
        if (effectiveBudget > 2000000) {
          setValidationError('Budget exceeds supported limits. Please enter an amount under ₹20,00,000.');
          return;
        }
      }
    }

    if (activeStep.id === 'priorities') {
      if (priorities.length === 0) {
        setValidationError('Please select at least 1 priority that matters to you.');
        return;
      }
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setValidationError('');
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Format INR currency
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Component Manifest Order for PC builds
  const COMPONENT_MANIFEST_ORDER = [
    { key: 'cpu', label: 'Processor (CPU)', icon: Cpu },
    { key: 'gpu', label: 'Graphics Card (GPU)', icon: Monitor },
    { key: 'motherboard', label: 'Motherboard', icon: Layers },
    { key: 'ram', label: 'System Memory (RAM)', icon: Zap },
    { key: 'storage', label: 'Solid State Storage', icon: HardDrive },
    { key: 'cooling', label: 'Thermal Cooling', icon: VolumeX },
    { key: 'psu', label: 'Power Supply Unit', icon: Award },
    { key: 'case', label: 'Chassis / Case', icon: Box },
  ];

  // Loading Phases Definition
  const LOADING_PHASES_PC = [
    { title: "ANALYZING YOUR REQUIREMENTS", desc: "Parsing primary workloads, resolution targets, and compute bottlenecks..." },
    { title: "MATCHING REAL HARDWARE", desc: "Evaluating current stock across 8 categories in MongoDB..." },
    { title: "CHECKING COMPATIBILITY", desc: "Verifying CPU socket, RAM generation, GPU clearance, and PSU headroom..." },
    { title: "OPTIMIZING YOUR BUDGET", desc: "Balancing price-to-performance across Value, Target, and Flex tiers..." },
  ];

  const LOADING_PHASES_LAPTOP = [
    { title: "ANALYZING YOUR REQUIREMENTS", desc: "Parsing mobile workloads, resolution targets, and thermal margins..." },
    { title: "MATCHING REAL LAPTOPS", desc: "Evaluating genuine laptop catalog stock in MongoDB..." },
    { title: "EVALUATING SYSTEM CALIBRATION", desc: "Reviewing TGP envelopes, display resolution, and battery architecture..." },
    { title: "OPTIMIZING YOUR BUDGET", desc: "Balancing price-to-performance across Value, Target, and Flex laptop models..." },
  ];

  const LOADING_PHASES = systemType === 'laptop' ? LOADING_PHASES_LAPTOP : LOADING_PHASES_PC;

  // Helper to format component spec summary (PC only)
  const getComponentSpecString = (item, category) => {
    if (!item || !item.specifications) return item?.brand || 'Verified Authentic Component';
    const s = item.specifications;
    switch (category) {
      case 'cpu':
        return `${s.cores || 6} Cores / ${s.threads || 12} Threads • Boost ${s.boostClock || 4.5}GHz • ${s.socket || 'AM5'}`;
      case 'gpu':
        return `${s.vram || 8}GB ${s.vramType || 'GDDR6'} • ${s.chipset || item.brand} • ${s.length || 280}mm Length`;
      case 'motherboard':
        return `${s.socket || 'Socket'} • ${s.memoryType || 'DDR5'} • ${s.formFactor || 'ATX'} Form Factor`;
      case 'ram':
        return `${s.capacity || 16}GB Kit • ${s.memoryType || 'DDR5'}-${s.speed || 5200} CL${s.casLatency || 40}`;
      case 'storage':
        return `${s.capacity || 1000}GB NVMe M.2 • PCIe ${s.interface || 'Gen4'} • Up to ${s.readSpeed || 5000}MB/s`;
      case 'cooling':
        return `${s.coolerType || 'Air Cooler'} • ${s.fans || 2} Fans • ${s.tdpRating || 200}W TDP`;
      case 'psu':
        return `${s.wattage || 650}W Output • ${s.efficiency || '80+ Bronze'} Efficiency`;
      case 'case':
        return `${s.formFactor || 'Mid-Tower'} • Max GPU ${s.gpuMaxLength || 360}mm • High Airflow`;
      default:
        return item.brand || 'Authentic Hardware';
    }
  };

  // Final Staging & Execution of Recommendation Engine
  const handleFinalBuild = async () => {
    setIsGenerating(true);
    setApiError(null);
    setLoadingPhase(0);

    const activePool = systemType === 'laptop' ? PRIMARY_USE_CASES_LAPTOP : PRIMARY_USE_CASES_PC;

    const consultationPayload = {
      systemType,
      useCases: useCases.map((id) => {
        const found = activePool.find((c) => c.id === id);
        return found ? found.label : id;
      }),
      workloads: {
        gaming: useCases.includes('gaming') ? workloads.gaming : null,
        professional: useCases.includes('professional') ? workloads.professional : null,
        editing: useCases.includes('editing') ? workloads.editing : null,
        rendering: useCases.includes('rendering') ? workloads.rendering : null,
        programming: useCases.includes('programming') ? workloads.programming : null,
        ai: useCases.includes('ai') ? workloads.ai : null,
        student: useCases.includes('student') ? workloads.student : null,
        streaming: useCases.includes('streaming') ? workloads.streaming : null,
        mixed: useCases.includes('mixed') ? workloads.mixed : null,
      },
      budget: effectiveBudget,
      budgetFlex: budgetFlex,
      priorities,
      experience,
    };

    // Staging to localStorage for session durability
    try {
      localStorage.setItem('geargrid_configure_request', JSON.stringify(consultationPayload));
    } catch {}

    // Advance loading phases to visually reflect the engineering pipeline
    const timer1 = setTimeout(() => setLoadingPhase(1), 500);
    const timer2 = setTimeout(() => setLoadingPhase(2), 1000);
    const timer3 = setTimeout(() => setLoadingPhase(3), 1500);

    try {
      const res = await configureAPI.getRecommendations(consultationPayload);
      const recs = res.data?.data?.recommendations || [];
      if (!recs || recs.length === 0) {
        throw new Error("Unable to synthesize recommendations within the specified parameters.");
      }

      // Allow phases to complete for deliberate, premium calibration feel
      setTimeout(() => {
        setRecommendations(recs);
        const initialActive = {};
        recs.forEach((r) => {
          initialActive[r.tier] = r;
        });
        setActiveBuilds(initialActive);
        setAppliedUpgrades({});
        setIsGenerating(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1900);
    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsGenerating(false);
      const errMsg = err.response?.data?.message || err.message || "Unable to generate a configuration right now.";
      setApiError(errMsg);
    }
  };

  // Restart questionnaire from beginning
  const handleStartOver = () => {
    setRecommendations(null);
    setActiveBuilds({});
    setAppliedUpgrades({});
    setApiError(null);
    setCurrentStepIndex(0);
    setIsCompareOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Adjust parameters (returns to review step)
  const handleAdjustRequirements = () => {
    setRecommendations(null);
    setApiError(null);
    setCurrentStepIndex(steps.length - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add all 8 verified build components to cart (PC mode)
  const handleAddBuildToCart = async (tier) => {
    const currentBuild = activeBuilds[tier];
    if (!currentBuild || !currentBuild.components) return;
    setAddingTierToCart(tier);
    try {
      await addBuildToCart(currentBuild.components);
    } catch (err) {
      showToast('Error adding build components to cart.', 'red');
    } finally {
      setAddingTierToCart(null);
    }
  };

  // Add recommended laptop product to cart (Laptop mode)
  const handleAddLaptopToCart = async (tier) => {
    const currentRec = activeBuilds[tier] || recommendations?.find(r => r.tier === tier);
    if (!currentRec || !currentRec.product) return;
    setAddingTierToCart(tier);
    try {
      await addToCart(currentRec.product);
      showToast(`Added ${currentRec.product.title.split('(')[0].trim()} to cart!`, 'amber');
    } catch (err) {
      showToast('Error adding laptop to cart.', 'red');
    } finally {
      setAddingTierToCart(null);
    }
  };

  // Share PC build manifest summary to clipboard
  const handleShareBuild = (tier) => {
    const b = activeBuilds[tier];
    if (!b) return;
    const comps = b.components || {};
    const text = [
      `🖥️ GEARGRID CONFIGURE — ${b.name.toUpperCase()}`,
      `💰 Total Investment: ${formatINR(b.totalPrice)} (Budget: ${formatINR(effectiveBudget)})`,
      `📊 Budget Utilization: ${b.budgetUsedPercent}% (${b.differenceFromBudget <= 0 ? `Saved ${formatINR(Math.abs(b.differenceFromBudget))}` : `+${formatINR(b.differenceFromBudget)} Flex`})`,
      `--- Verified Hardware Manifest ---`,
      `⚡ CPU: ${comps.cpu?.title || 'Selected Processor'}`,
      `🎮 GPU: ${comps.gpu?.title || 'Selected Graphics Card'}`,
      `🧩 Motherboard: ${comps.motherboard?.title || 'Selected Motherboard'}`,
      `🧠 RAM: ${comps.ram?.title || 'Selected Memory'}`,
      `💾 Storage: ${comps.storage?.title || 'Selected Storage'}`,
      `❄️ Cooling: ${comps.cooling?.title || 'Selected Cooler'}`,
      `🔌 PSU: ${comps.psu?.title || 'Selected Power Supply'}`,
      `📦 Case: ${comps.case?.title || 'Selected Chassis'}`,
      `----------------------------------`,
      `Engineered with GearGrid Configure: ${window.location.origin}/configure`
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Build manifest copied to clipboard!', 'amber');
      }).catch(() => {
        showToast('Manifest copied to clipboard', 'amber');
      });
    } else {
      showToast('Build manifest generated', 'amber');
    }
  };

  // Share Laptop manifest summary to clipboard
  const handleShareLaptop = (tier) => {
    const b = activeBuilds[tier] || recommendations?.find(r => r.tier === tier);
    if (!b) return;
    const s = b.laptopSpecs || {};
    const text = [
      `💻 GEARGRID CONFIGURE — ${b.name.toUpperCase()}`,
      `💰 Investment: ${formatINR(b.totalPrice)} (Budget: ${formatINR(effectiveBudget)})`,
      `📊 Budget Utilization: ${b.budgetUsedPercent}% (${b.differenceFromBudget <= 0 ? `Saved ${formatINR(Math.abs(b.differenceFromBudget))}` : `+${formatINR(b.differenceFromBudget)} Flex`})`,
      `--- Laptop Specifications ---`,
      `⚡ Processor: ${s.cpu}`,
      `🎮 Graphics: ${s.gpu}`,
      `🧠 Memory: ${s.ram}`,
      `💾 Storage: ${s.storage}`,
      `🖥️ Display: ${s.display}`,
      `🔋 Battery: ${s.battery}`,
      `⚖️ Weight: ${s.weight}`,
      `-----------------------------`,
      `Engineered with GearGrid Configure: ${window.location.origin}/configure`
    ].join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Laptop manifest copied to clipboard!', 'amber');
      }).catch(() => {
        showToast('Manifest copied to clipboard', 'amber');
      });
    } else {
      showToast('Laptop manifest generated', 'amber');
    }
  };

  // Interactive component upgrade swap
  const handleApplyUpgrade = (tier, upgradeItem) => {
    const currentBuild = activeBuilds[tier];
    if (!currentBuild) return;

    const category = upgradeItem.category;
    const upgradedProd = upgradeItem.upgrade;

    const newComponents = {
      ...currentBuild.components,
      [category]: upgradedProd,
    };

    const newTotalPrice = Object.values(newComponents).reduce((sum, item) => sum + (item.price || 0), 0);
    const diffFromBudget = newTotalPrice - effectiveBudget;
    const budgetUsedPercent = Number(((newTotalPrice / effectiveBudget) * 100).toFixed(1));

    setActiveBuilds((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        components: newComponents,
        totalPrice: newTotalPrice,
        budgetUsedPercent,
        differenceFromBudget: diffFromBudget,
      },
    }));

    setAppliedUpgrades((prev) => ({
      ...prev,
      [tier]: {
        ...(prev[tier] || {}),
        [category]: upgradeItem,
      },
    }));

    showToast(`Upgraded to ${upgradedProd.title.split('(')[0].trim()}`, 'amber');
  };

  // Revert upgraded component to originally calibrated part
  const handleRevertUpgrade = (tier, category) => {
    const originalBuild = recommendations.find((r) => r.tier === tier);
    if (!originalBuild) return;

    const originalProd = originalBuild.components[category];
    const currentBuild = activeBuilds[tier];

    const newComponents = {
      ...currentBuild.components,
      [category]: originalProd,
    };

    const newTotalPrice = Object.values(newComponents).reduce((sum, item) => sum + (item.price || 0), 0);
    const diffFromBudget = newTotalPrice - effectiveBudget;
    const budgetUsedPercent = Number(((newTotalPrice / effectiveBudget) * 100).toFixed(1));

    setActiveBuilds((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        components: newComponents,
        totalPrice: newTotalPrice,
        budgetUsedPercent,
        differenceFromBudget: diffFromBudget,
      },
    }));

    setAppliedUpgrades((prev) => {
      const tierUpgrades = { ...(prev[tier] || {}) };
      delete tierUpgrades[category];
      return {
        ...prev,
        [tier]: tierUpgrades,
      };
    });

    showToast(`Reverted to original calibrated ${category.toUpperCase()}`, 'amber');
  };

  const toggleUpgradeExpand = (tier) => {
    setExpandedUpgrades((prev) => ({
      ...prev,
      [tier]: !prev[tier],
    }));
  };

  // -------------------------------------------------------------
  // RENDER: LOADING EXPERIENCE (4-Phase Engineering Calibration)
  // -------------------------------------------------------------
  if (isGenerating) {
    const activePhase = LOADING_PHASES[loadingPhase] || LOADING_PHASES[0];
    return (
      <div className="configure-page-root">
        <div className="configure-container">
          <div className="configure-loading-container">
            <div className="loading-engineering-ring">
              <div className="ring-pulse" />
              <Cpu className="ring-icon text-amber animate-pulse" size={44} />
            </div>

            <div className="loading-phase-content">
              <div className="loading-eyebrow">
                <span className="eyebrow-dot" />
                <span>GEARGRID RECOMMENDATION ENGINE</span>
              </div>
              <h2 className="loading-phase-title">{activePhase.title}</h2>
              <p className="loading-phase-desc">{activePhase.desc}</p>
            </div>

            <div className="loading-pipeline-steps">
              {LOADING_PHASES.map((p, idx) => (
                <div 
                  key={p.title} 
                  className={`pipeline-step-chip ${idx === loadingPhase ? 'active' : idx < loadingPhase ? 'completed' : ''}`}
                >
                  <div className="chip-indicator">
                    {idx < loadingPhase ? <Check size={12} /> : idx + 1}
                  </div>
                  <span className="chip-text">{p.title.split(' ')[0]}</span>
                </div>
              ))}
            </div>

            <div className="loading-subnotice">
              <span>Evaluating physical clearances, TDP envelopes, and socket topologies across genuine MongoDB catalog stock.</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: ERROR EXPERIENCE
  // -------------------------------------------------------------
  if (apiError) {
    return (
      <div className="configure-page-root">
        <div className="configure-container">
          <div className="configure-error-container">
            <div className="error-icon-box">
              <AlertCircle size={48} className="text-red-500" />
            </div>
            <h2 className="error-title">Unable to Generate Configuration</h2>
            <p className="error-message">{apiError}</p>
            
            <div className="error-actions">
              <button 
                type="button" 
                onClick={handleFinalBuild} 
                className="btn-configure-primary"
              >
                <RefreshCw size={16} />
                <span>TRY AGAIN</span>
              </button>
              <button 
                type="button" 
                onClick={handleAdjustRequirements} 
                className="btn-configure-outline"
              >
                <RotateCcw size={16} />
                <span>ADJUST REQUIREMENTS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: RESULTS EXPERIENCE (3 Authentic Configurations)
  // -------------------------------------------------------------
  if (recommendations && recommendations.length > 0) {
    const totalCeiling = effectiveBudget + budgetFlex;
    const valueBuild = activeBuilds['VALUE'] || recommendations.find(r => r.tier === 'VALUE');
    const targetBuild = activeBuilds['TARGET'] || recommendations.find(r => r.tier === 'TARGET');
    const flexBuild = activeBuilds['PERFORMANCE_FLEX'] || recommendations.find(r => r.tier === 'PERFORMANCE_FLEX');
    const displayBuilds = [valueBuild, targetBuild, flexBuild].filter(Boolean);
    const isLaptopMode = systemType === 'laptop' || recommendations[0]?.systemType === 'laptop';

    return (
      <div className="configure-page-root">
        <div className="configure-container results-container">
          
          {/* RESULTS HEADER */}
          <header className="results-hero">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              <span>GEARGRID CONFIGURE — {isLaptopMode ? 'LAPTOP CONSULTATION' : 'PC DESKTOP CONSULTATION'}</span>
            </div>
            <h1 className="hero-title">
              {isLaptopMode ? (
                <>Your laptop, <span className="hero-accent">calibrated for performance & mobility.</span></>
              ) : (
                <>Your machine, <span className="hero-accent">engineered around your needs.</span></>
              )}
            </h1>
            <p className="hero-subtitle">
              {isLaptopMode 
                ? 'Three calibrated laptop systems synthesized strictly from verified MongoDB stock, evaluated for sustained performance, thermal stability, and battery runtime.'
                : 'Three calibrated desktop systems synthesized strictly from real MongoDB stock with verified physical clearances, memory topology, and electrical headroom.'}
            </p>

            {/* USER CONSULTATION REQUIREMENTS SUMMARY BAR */}
            <div className="requirements-summary-bar">
              <div className="summary-chip">
                <span className="summary-chip-label">Type</span>
                <div className="summary-chip-val text-amber">
                  {isLaptopMode ? 'Laptop' : 'Custom PC'}
                </div>
              </div>

              <div className="summary-chip">
                <span className="summary-chip-label">Use</span>
                <div className="summary-chip-val">
                  {useCases.map(id => {
                    const found = (isLaptopMode ? PRIMARY_USE_CASES_LAPTOP : PRIMARY_USE_CASES_PC).find(c => c.id === id);
                    return found?.label || id;
                  }).join(' + ')}
                </div>
              </div>

              {useCases.includes('gaming') && (
                <div className="summary-chip">
                  <span className="summary-chip-label">Target</span>
                  <div className="summary-chip-val">
                    {workloads.gaming.resolution} • {workloads.gaming.priority}
                  </div>
                </div>
              )}

              {useCases.includes('editing') && (
                <div className="summary-chip">
                  <span className="summary-chip-label">Editing</span>
                  <div className="summary-chip-val">
                    {workloads.editing.resolution} • {workloads.editing.software}
                  </div>
                </div>
              )}

              {isLaptopMode && useCases.includes('student') && (
                <div className="summary-chip">
                  <span className="summary-chip-label">Student</span>
                  <div className="summary-chip-val">
                    {workloads.student.focus} • {workloads.student.priority}
                  </div>
                </div>
              )}

              <div className="summary-chip">
                <span className="summary-chip-label">Budget</span>
                <div className="summary-chip-val text-amber">{formatINR(effectiveBudget)}</div>
              </div>

              <div className="summary-chip">
                <span className="summary-chip-label">Flex</span>
                <div className="summary-chip-val">
                  {budgetFlex > 0 ? `+${formatINR(budgetFlex)} (${formatINR(totalCeiling)})` : 'Strict'}
                </div>
              </div>

              <div className="summary-chip-actions">
                <button 
                  type="button" 
                  onClick={() => setIsCompareOpen(true)}
                  className="btn-summary-compare"
                  id="btn-open-compare"
                >
                  <SlidersHorizontal size={15} />
                  <span>Compare {isLaptopMode ? 'Laptops' : 'Builds'}</span>
                </button>
                <button 
                  type="button" 
                  onClick={handleStartOver}
                  className="btn-summary-restart"
                  id="btn-configure-start-over"
                >
                  <RotateCcw size={15} />
                  <span>Start Over</span>
                </button>
              </div>
            </div>
          </header>

          {/* THREE ENGINEERED RECOMMENDATION OPTIONS */}
          <section className="results-builds-grid" aria-label={isLaptopMode ? "Calibrated Laptops" : "Calibrated Builds"}>
            {displayBuilds.map((b) => {
              const tier = b.tier;
              const isValue = tier === 'VALUE';
              const isTarget = tier === 'TARGET';
              const isFlex = tier === 'PERFORMANCE_FLEX';

              const tierBadgeClass = isValue ? 'badge-value' : isTarget ? 'badge-target' : 'badge-flex';
              const cardBorderClass = isValue ? 'border-value' : isTarget ? 'border-target' : 'border-flex';
              const tierLabel = isLaptopMode 
                ? (isValue ? 'LAPTOP 01 — VALUE' : isTarget ? 'LAPTOP 02 — TARGET' : 'LAPTOP 03 — PERFORMANCE FLEX')
                : (isValue ? 'BUILD 01 — VALUE' : isTarget ? 'BUILD 02 — TARGET' : 'BUILD 03 — PERFORMANCE FLEX');
              const tierSubtitle = isValue 
                ? (isLaptopMode ? 'Best mobile value while staying under budget' : 'Best value while staying under budget')
                : isTarget 
                ? (isLaptopMode ? 'Best balanced laptop match around requested budget' : 'Best overall match around requested budget')
                : (isLaptopMode ? 'Highest performance laptop within stretch budget' : 'Highest meaningful performance within stretch');

              const comps = b.components || {};
              const upgrades = b.upgrades || [];
              const isExpanded = !!expandedUpgrades[tier];
              const isAdding = addingTierToCart === tier;

              // LAPTOP RESULT CARD
              if (isLaptopMode) {
                const specs = b.laptopSpecs || {};
                const prod = b.product || {};
                const imageUrl = prod.images?.[0]?.url || prod.image || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80';

                return (
                  <article key={tier} className={`build-card laptop-card ${cardBorderClass}`}>
                    {/* TIER BADGE & HIGHLIGHT */}
                    <div className="build-card-header">
                      <div className="header-badges-row">
                        <span className={`tier-pill ${tierBadgeClass}`}>{tierLabel}</span>
                        {isTarget && <span className="featured-pill">OPTIMAL MATCH</span>}
                      </div>
                      <h2 className="build-name">{b.name}</h2>
                      <p className="build-purpose">{tierSubtitle}</p>
                    </div>

                    {/* PRICE & BUDGET DELTA BOX */}
                    <div className="build-price-box">
                      <div className="price-primary">
                        <span className="price-currency">₹</span>
                        <span className="price-figure">{Number(b.totalPrice).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="price-budget-context">
                        <span className="budget-target-label">Budget: {formatINR(effectiveBudget)}</span>
                        <span className={`budget-delta-badge ${b.differenceFromBudget <= 0 ? 'delta-saved' : 'delta-flex'}`}>
                          {b.differenceFromBudget <= 0
                            ? `Saved ${formatINR(Math.abs(b.differenceFromBudget))} (${b.budgetUsedPercent}%)`
                            : `+${formatINR(b.differenceFromBudget)} Flex (${b.budgetUsedPercent}%)`}
                        </span>
                      </div>
                    </div>

                    {/* LAPTOP HERO PREVIEW & LINK */}
                    <div className="laptop-preview-container">
                      <div className="laptop-image-wrapper">
                        <img 
                          src={imageUrl} 
                          alt={prod.title || b.name} 
                          className="laptop-card-image" 
                          loading="lazy" 
                        />
                        <span className="laptop-brand-pill">{prod.brand || 'Authentic Laptop'}</span>
                      </div>
                      <div className="laptop-title-wrapper">
                        <Link 
                          to={`/product/${prod._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="laptop-product-title-link"
                          id={`laptop-link-${tier.toLowerCase()}`}
                          title="View full laptop specifications on product page"
                        >
                          <span>{prod.title || b.name}</span>
                          <ExternalLink size={14} className="link-icon" />
                        </Link>
                      </div>
                    </div>

                    {/* LAPTOP SPECIFICATIONS GRID */}
                    <div className="laptop-specs-section">
                      <div className="section-label-row">
                        <Cpu size={15} className="text-amber" />
                        <span>HARDWARE SPECIFICATIONS</span>
                      </div>
                      <div className="laptop-specs-grid">
                        <div className="laptop-spec-item">
                          <span className="spec-label">Processor</span>
                          <span className="spec-val" title={specs.cpu}>{specs.cpu}</span>
                        </div>
                        <div className="laptop-spec-item">
                          <span className="spec-label">Graphics (GPU)</span>
                          <span className="spec-val" title={specs.gpu}>{specs.gpu}</span>
                        </div>
                        <div className="laptop-spec-item">
                          <span className="spec-label">Memory (RAM)</span>
                          <span className="spec-val">{specs.ram}</span>
                        </div>
                        <div className="laptop-spec-item">
                          <span className="spec-label">Storage</span>
                          <span className="spec-val">{specs.storage}</span>
                        </div>
                        <div className="laptop-spec-item">
                          <span className="spec-label">Display</span>
                          <span className="spec-val" title={specs.display}>{specs.display}</span>
                        </div>
                        <div className="laptop-spec-item">
                          <span className="spec-label">Battery</span>
                          <span className="spec-val">{specs.battery}</span>
                        </div>
                        <div className="laptop-spec-item">
                          <span className="spec-label">Weight</span>
                          <span className="spec-val">{specs.weight}</span>
                        </div>
                        <div className="laptop-spec-item">
                          <span className="spec-label">GPU Thermal Limit</span>
                          <span className="spec-val text-amber">{specs.tgp || 'Balanced TDP'}</span>
                        </div>
                      </div>
                    </div>

                    {/* WHY THIS LAPTOP */}
                    <div className="build-why-section">
                      <div className="section-label-row">
                        <Sparkles size={15} className="text-amber" />
                        <span>WHY THIS LAPTOP</span>
                      </div>
                      <p className="why-content">{b.whyThisLaptop || b.whyThisBuild}</p>
                    </div>

                    {/* STRENGTHS & TRADE-OFFS */}
                    <div className="build-pros-cons-grid">
                      <div className="pros-block">
                        <span className="block-title text-emerald-400">STRENGTHS</span>
                        <ul className="pros-list">
                          {(b.strengths || []).map((s, idx) => (
                            <li key={idx} className="pro-item">
                              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="cons-block">
                        <span className="block-title text-amber">TRADE-OFFS</span>
                        <ul className="cons-list">
                          {(b.tradeoffs || []).map((t, idx) => (
                            <li key={idx} className="con-item">
                              <AlertCircle size={14} className="text-amber shrink-0" />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* SYSTEM COMPATIBILITY / CHECKS */}
                    <div className="build-compatibility-section">
                      <div className="section-label-row">
                        <ShieldCheck size={15} className="text-emerald-400" />
                        <span>SYSTEM CALIBRATION CHECK</span>
                      </div>
                      <div className="compatibility-matrix">
                        {(b.compatibility?.checks || []).map((c, idx) => {
                          const isOk = c.status === 'VERIFIED';
                          return (
                            <div key={idx} className={`compat-item ${isOk ? 'ok' : 'neutral'}`} title={c.details}>
                              <span className="compat-icon">{isOk ? '✓' : '•'}</span>
                              <span className="compat-name">{c.name}</span>
                              <span className={`compat-badge ${isOk ? 'badge-ok' : 'badge-neutral'}`}>
                                {isOk ? 'VERIFIED' : 'CALIBRATED'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CARD ACTIONS */}
                    <div className="build-card-actions">
                      <button 
                        type="button" 
                        onClick={() => handleAddLaptopToCart(tier)}
                        className="btn-build-add-cart"
                        id={`btn-add-laptop-${tier.toLowerCase()}`}
                        disabled={isAdding}
                      >
                        <ShoppingCart size={18} />
                        <span>{isAdding ? 'ADDING LAPTOP TO CART...' : 'ADD LAPTOP TO CART'}</span>
                      </button>

                      <div className="card-sub-actions">
                        <Link 
                          to={`/product/${prod._id}`}
                          className="btn-build-share"
                          id={`btn-view-laptop-${tier.toLowerCase()}`}
                        >
                          <ExternalLink size={16} />
                          <span>View Details</span>
                        </Link>

                        <button 
                          type="button" 
                          onClick={() => handleShareLaptop(tier)}
                          className="btn-build-share"
                          title="Copy laptop specifications to clipboard"
                        >
                          <Share2 size={16} />
                          <span>Share</span>
                        </button>

                        <button 
                          type="button" 
                          onClick={() => setIsCompareOpen(true)}
                          className="btn-build-compare-link"
                        >
                          <SlidersHorizontal size={16} />
                          <span>Compare</span>
                        </button>
                      </div>
                    </div>

                  </article>
                );
              }

              // PC DESKTOP RESULT CARD
              return (
                <article key={tier} className={`build-card ${cardBorderClass}`}>
                  
                  {/* TIER BADGE & HIGHLIGHT */}
                  <div className="build-card-header">
                    <div className="header-badges-row">
                      <span className={`tier-pill ${tierBadgeClass}`}>{tierLabel}</span>
                      {isTarget && <span className="featured-pill">OPTIMAL MATCH</span>}
                    </div>
                    <h2 className="build-name">{b.name}</h2>
                    <p className="build-purpose">{tierSubtitle}</p>
                  </div>

                  {/* PRICE & BUDGET DELTA BOX */}
                  <div className="build-price-box">
                    <div className="price-primary">
                      <span className="price-currency">₹</span>
                      <span className="price-figure">{Number(b.totalPrice).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-budget-context">
                      <span className="budget-target-label">Budget: {formatINR(effectiveBudget)}</span>
                      <span className={`budget-delta-badge ${b.differenceFromBudget <= 0 ? 'delta-saved' : 'delta-flex'}`}>
                        {b.differenceFromBudget <= 0
                          ? `Saved ${formatINR(Math.abs(b.differenceFromBudget))} (${b.budgetUsedPercent}%)`
                          : `+${formatINR(b.differenceFromBudget)} Flex (${b.budgetUsedPercent}%)`}
                      </span>
                    </div>
                  </div>

                  {/* WHY THIS BUILD */}
                  <div className="build-why-section">
                    <div className="section-label-row">
                      <Sparkles size={15} className="text-amber" />
                      <span>WHY THIS BUILD</span>
                    </div>
                    <p className="why-content">{b.whyThisBuild}</p>
                  </div>

                  {/* STRENGTHS & TRADE-OFFS */}
                  <div className="build-pros-cons-grid">
                    <div className="pros-block">
                      <span className="block-title text-emerald-400">STRENGTHS</span>
                      <ul className="pros-list">
                        {(b.strengths || []).map((s, idx) => (
                          <li key={idx} className="pro-item">
                            <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="cons-block">
                      <span className="block-title text-amber">TRADE-OFFS</span>
                      <ul className="cons-list">
                        {(b.tradeoffs || []).map((t, idx) => (
                          <li key={idx} className="con-item">
                            <AlertCircle size={14} className="text-amber shrink-0" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* SYSTEM COMPATIBILITY STATUS */}
                  <div className="build-compatibility-section">
                    <div className="section-label-row">
                      <ShieldCheck size={15} className="text-emerald-400" />
                      <span>SYSTEM CHECK</span>
                    </div>
                    <div className="compatibility-matrix">
                      {(b.compatibility?.checks || []).map((c, idx) => {
                        const isOk = c.status === 'VERIFIED';
                        return (
                          <div key={idx} className={`compat-item ${isOk ? 'ok' : 'neutral'}`} title={c.details}>
                            <span className="compat-icon">{isOk ? '✓' : '•'}</span>
                            <span className="compat-name">{c.name.split('↔')[0].trim()}</span>
                            <span className={`compat-badge ${isOk ? 'badge-ok' : 'badge-neutral'}`}>
                              {isOk ? 'VERIFIED' : 'UNAVAILABLE'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* COMPONENT MANIFEST */}
                  <div className="build-manifest-section">
                    <div className="section-label-row">
                      <Layers size={15} className="text-amber" />
                      <span>COMPONENT MANIFEST (8 VERIFIED PARTS)</span>
                    </div>

                    <div className="manifest-components-list">
                      {COMPONENT_MANIFEST_ORDER.map(({ key, label, icon: CatIcon }) => {
                        const item = comps[key];
                        if (!item) return null;
                        const isUpgraded = !!appliedUpgrades[tier]?.[key];

                        return (
                          <div key={key} className={`manifest-part-card ${isUpgraded ? 'part-upgraded' : ''}`}>
                            <div className="part-thumbnail-wrap">
                              <img 
                                src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80'} 
                                alt={item.title} 
                                className="part-thumbnail"
                                loading="lazy"
                              />
                            </div>

                            <div className="part-details">
                              <div className="part-cat-row">
                                <span className="part-cat-pill">{label.split('(')[0].trim()}</span>
                                <span className="part-brand-text">{item.brand}</span>
                                {isUpgraded && <span className="upgraded-pill">UPGRADED</span>}
                              </div>

                              <Link 
                                to={`/product/${item._id}`} 
                                className="part-title-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Inspect product specifications on product page"
                              >
                                <span>{item.title}</span>
                                <ExternalLink size={12} className="link-icon" />
                              </Link>

                              <div className="part-spec-snippet">
                                {getComponentSpecString(item, key)}
                              </div>
                            </div>

                            <div className="part-price-column">
                              <span className="part-price">{formatINR(item.price)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* COMPONENT UPGRADE EXPLORATION */}
                  {upgrades.length > 0 && (
                    <div className="build-upgrades-section">
                      <button 
                        type="button" 
                        onClick={() => toggleUpgradeExpand(tier)}
                        className="btn-toggle-upgrades"
                      >
                        <div className="toggle-left">
                          <TrendingUp size={15} className="text-amber" />
                          <span>Component Upgrade Exploration ({upgrades.length} available)</span>
                        </div>
                        <span className="toggle-arrow">{isExpanded ? '▲ Hide' : '▼ View Options'}</span>
                      </button>

                      {isExpanded && (
                        <div className="upgrades-dropdown-panel">
                          {upgrades.map((u, uIdx) => {
                            const isCurrentActive = appliedUpgrades[tier]?.[u.category]?.upgrade?._id === u.upgrade._id;

                            return (
                              <div key={uIdx} className={`upgrade-candidate-card ${isCurrentActive ? 'candidate-active' : ''}`}>
                                <div className="candidate-header">
                                  <span className="candidate-cat">{u.categoryName}</span>
                                  <span className="candidate-delta">+{formatINR(u.priceDifference)}</span>
                                </div>

                                <div className="candidate-swap-row">
                                  <span className="swap-from">{u.current.title.split('(')[0].trim()}</span>
                                  <span className="swap-arrow">→</span>
                                  <span className="swap-to">{u.upgrade.title.split('(')[0].trim()}</span>
                                </div>

                                <p className="candidate-benefit">{u.benefit}</p>

                                <div className="candidate-action">
                                  {isCurrentActive ? (
                                    <button 
                                      type="button" 
                                      onClick={() => handleRevertUpgrade(tier, u.category)}
                                      className="btn-candidate-revert"
                                    >
                                      <span>Revert to Calibrated</span>
                                    </button>
                                  ) : (
                                    <button 
                                      type="button" 
                                      onClick={() => handleApplyUpgrade(tier, u)}
                                      className="btn-candidate-apply"
                                    >
                                      <span>Preview Upgrade (+{formatINR(u.priceDifference)})</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* CARD ACTIONS */}
                  <div className="build-card-actions">
                    <button 
                      type="button" 
                      onClick={() => handleAddBuildToCart(tier)}
                      className="btn-build-add-cart"
                      disabled={isAdding}
                    >
                      <ShoppingCart size={18} />
                      <span>{isAdding ? 'ADDING 8 PARTS...' : 'ADD ENTIRE BUILD TO CART'}</span>
                    </button>

                    <div className="card-sub-actions">
                      <button 
                        type="button" 
                        onClick={() => handleShareBuild(tier)}
                        className="btn-build-share"
                        title="Copy configuration manifest to clipboard"
                      >
                        <Share2 size={16} />
                        <span>Share Manifest</span>
                      </button>

                      <button 
                        type="button" 
                        onClick={() => setIsCompareOpen(true)}
                        className="btn-build-compare-link"
                      >
                        <SlidersHorizontal size={16} />
                        <span>Compare</span>
                      </button>
                    </div>
                  </div>

                </article>
              );
            })}
          </section>

          {/* BOTTOM GLOBAL ACTIONS */}
          <div className="results-bottom-actions">
            <button 
              type="button" 
              onClick={handleStartOver}
              className="btn-configure-outline"
            >
              <RotateCcw size={16} />
              <span>START OVER (NEW CONSULTATION)</span>
            </button>
            <button 
              type="button" 
              onClick={() => setIsCompareOpen(true)}
              className="btn-configure-primary"
            >
              <SlidersHorizontal size={16} />
              <span>OPEN SIDE-BY-SIDE COMPARISON</span>
            </button>
          </div>

          {/* COMPARE BUILDS / LAPTOPS MODAL */}
          {isCompareOpen && (
            <div className="compare-modal-backdrop" onClick={() => setIsCompareOpen(false)}>
              <div className="compare-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="compare-modal-header">
                  <div>
                    <h3 className="modal-title">{isLaptopMode ? 'Laptop Comparison' : 'Engineering Comparison'}</h3>
                    <p className="modal-subtitle">Value vs Target vs Performance Flex</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setIsCompareOpen(false)}
                    className="btn-modal-close"
                    aria-label="Close comparison"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="compare-table-wrapper">
                  {isLaptopMode ? (
                    <table className="compare-table">
                      <thead>
                        <tr>
                          <th className="th-spec-label">Hardware Parameter</th>
                          <th className="th-tier th-value">LAPTOP 01 — VALUE</th>
                          <th className="th-tier th-target th-highlight">LAPTOP 02 — TARGET</th>
                          <th className="th-tier th-flex">LAPTOP 03 — FLEX</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="td-label">Total Investment</td>
                          <td className="td-val font-semibold text-emerald-400">{formatINR(valueBuild.totalPrice)}</td>
                          <td className="td-val font-semibold text-amber td-highlight">{formatINR(targetBuild.totalPrice)}</td>
                          <td className="td-val font-semibold text-cyan-400">{formatINR(flexBuild.totalPrice)}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Budget Delta</td>
                          <td className="td-val text-emerald-400">Saved {formatINR(Math.abs(valueBuild.differenceFromBudget))}</td>
                          <td className="td-val td-highlight">{targetBuild.differenceFromBudget <= 0 ? `Saved ${formatINR(Math.abs(targetBuild.differenceFromBudget))}` : `+${formatINR(targetBuild.differenceFromBudget)}`}</td>
                          <td className="td-val text-cyan-400">+{formatINR(flexBuild.differenceFromBudget)}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Laptop Model</td>
                          <td className="td-val font-medium">{valueBuild.name}</td>
                          <td className="td-val font-medium td-highlight">{targetBuild.name}</td>
                          <td className="td-val font-medium">{flexBuild.name}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Processor (CPU)</td>
                          <td className="td-val">{valueBuild.laptopSpecs?.cpu}</td>
                          <td className="td-val td-highlight">{targetBuild.laptopSpecs?.cpu}</td>
                          <td className="td-val">{flexBuild.laptopSpecs?.cpu}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Graphics (GPU)</td>
                          <td className="td-val">{valueBuild.laptopSpecs?.gpu}</td>
                          <td className="td-val td-highlight">{targetBuild.laptopSpecs?.gpu}</td>
                          <td className="td-val">{flexBuild.laptopSpecs?.gpu}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Display Panel</td>
                          <td className="td-val">{valueBuild.laptopSpecs?.display}</td>
                          <td className="td-val td-highlight">{targetBuild.laptopSpecs?.display}</td>
                          <td className="td-val">{flexBuild.laptopSpecs?.display}</td>
                        </tr>
                        <tr>
                          <td className="td-label">System Memory (RAM)</td>
                          <td className="td-val">{valueBuild.laptopSpecs?.ram}</td>
                          <td className="td-val td-highlight">{targetBuild.laptopSpecs?.ram}</td>
                          <td className="td-val">{flexBuild.laptopSpecs?.ram}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Solid State Storage</td>
                          <td className="td-val">{valueBuild.laptopSpecs?.storage}</td>
                          <td className="td-val td-highlight">{targetBuild.laptopSpecs?.storage}</td>
                          <td className="td-val">{flexBuild.laptopSpecs?.storage}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Battery Runtime</td>
                          <td className="td-val">{valueBuild.laptopSpecs?.battery}</td>
                          <td className="td-val td-highlight">{targetBuild.laptopSpecs?.battery}</td>
                          <td className="td-val">{flexBuild.laptopSpecs?.battery}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Chassis Weight</td>
                          <td className="td-val">{valueBuild.laptopSpecs?.weight}</td>
                          <td className="td-val td-highlight">{targetBuild.laptopSpecs?.weight}</td>
                          <td className="td-val">{flexBuild.laptopSpecs?.weight}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Action</td>
                          <td className="td-val">
                            <button 
                              type="button" 
                              onClick={() => handleAddLaptopToCart('VALUE')}
                              className="btn-modal-add-cart"
                            >
                              Add Value to Cart
                            </button>
                          </td>
                          <td className="td-val td-highlight">
                            <button 
                              type="button" 
                              onClick={() => handleAddLaptopToCart('TARGET')}
                              className="btn-modal-add-cart highlight"
                            >
                              Add Target to Cart
                            </button>
                          </td>
                          <td className="td-val">
                            <button 
                              type="button" 
                              onClick={() => handleAddLaptopToCart('PERFORMANCE_FLEX')}
                              className="btn-modal-add-cart"
                            >
                              Add Flex to Cart
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <table className="compare-table">
                      <thead>
                        <tr>
                          <th className="th-spec-label">Hardware Parameter</th>
                          <th className="th-tier th-value">BUILD 01 — VALUE</th>
                          <th className="th-tier th-target th-highlight">BUILD 02 — TARGET</th>
                          <th className="th-tier th-flex">BUILD 03 — FLEX</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="td-label">Total Investment</td>
                          <td className="td-val font-semibold text-emerald-400">{formatINR(valueBuild.totalPrice)}</td>
                          <td className="td-val font-semibold text-amber td-highlight">{formatINR(targetBuild.totalPrice)}</td>
                          <td className="td-val font-semibold text-cyan-400">{formatINR(flexBuild.totalPrice)}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Budget Delta</td>
                          <td className="td-val text-emerald-400">Saved {formatINR(Math.abs(valueBuild.differenceFromBudget))}</td>
                          <td className="td-val td-highlight">{targetBuild.differenceFromBudget <= 0 ? `Saved ${formatINR(Math.abs(targetBuild.differenceFromBudget))}` : `+${formatINR(targetBuild.differenceFromBudget)}`}</td>
                          <td className="td-val text-cyan-400">+{formatINR(flexBuild.differenceFromBudget)}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Performance Focus</td>
                          <td className="td-val">{valueBuild.tagline || 'Maximum Value'}</td>
                          <td className="td-val td-highlight">{targetBuild.tagline || 'Target Balance'}</td>
                          <td className="td-val">{flexBuild.tagline || 'Overclock Tier'}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Processor (CPU)</td>
                          <td className="td-val">{valueBuild.components?.cpu?.title?.split('(')[0]}</td>
                          <td className="td-val td-highlight">{targetBuild.components?.cpu?.title?.split('(')[0]}</td>
                          <td className="td-val">{flexBuild.components?.cpu?.title?.split('(')[0]}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Graphics Card (GPU)</td>
                          <td className="td-val">{valueBuild.components?.gpu?.title?.split('(')[0]} ({valueBuild.components?.gpu?.specifications?.vram || 8}GB)</td>
                          <td className="td-val td-highlight">{targetBuild.components?.gpu?.title?.split('(')[0]} ({targetBuild.components?.gpu?.specifications?.vram || 12}GB)</td>
                          <td className="td-val">{flexBuild.components?.gpu?.title?.split('(')[0]} ({flexBuild.components?.gpu?.specifications?.vram || 16}GB)</td>
                        </tr>
                        <tr>
                          <td className="td-label">Memory (RAM)</td>
                          <td className="td-val">{valueBuild.components?.ram?.specifications?.capacity || 16}GB {valueBuild.components?.ram?.specifications?.memoryType || 'DDR5'}</td>
                          <td className="td-val td-highlight">{targetBuild.components?.ram?.specifications?.capacity || 32}GB {targetBuild.components?.ram?.specifications?.memoryType || 'DDR5'}</td>
                          <td className="td-val">{flexBuild.components?.ram?.specifications?.capacity || 32}GB {flexBuild.components?.ram?.specifications?.memoryType || 'DDR5'}</td>
                        </tr>
                        <tr>
                          <td className="td-label">Solid State Drive</td>
                          <td className="td-val">{valueBuild.components?.storage?.specifications?.capacity || 500}GB NVMe</td>
                          <td className="td-val td-highlight">{targetBuild.components?.storage?.specifications?.capacity || 1000}GB NVMe</td>
                          <td className="td-val">{flexBuild.components?.storage?.specifications?.capacity || 1000}GB NVMe</td>
                        </tr>
                        <tr>
                          <td className="td-label">Power Supply</td>
                          <td className="td-val">{valueBuild.components?.psu?.specifications?.wattage || 650}W</td>
                          <td className="td-val td-highlight">{targetBuild.components?.psu?.specifications?.wattage || 750}W</td>
                          <td className="td-val">{flexBuild.components?.psu?.specifications?.wattage || 850}W</td>
                        </tr>
                        <tr>
                          <td className="td-label">Action</td>
                          <td className="td-val">
                            <button 
                              type="button" 
                              onClick={() => handleAddBuildToCart('VALUE')}
                              className="btn-modal-add-cart"
                            >
                              Add Value to Cart
                            </button>
                          </td>
                          <td className="td-val td-highlight">
                            <button 
                              type="button" 
                              onClick={() => handleAddBuildToCart('TARGET')}
                              className="btn-modal-add-cart highlight"
                            >
                              Add Target to Cart
                            </button>
                          </td>
                          <td className="td-val">
                            <button 
                              type="button" 
                              onClick={() => handleAddBuildToCart('PERFORMANCE_FLEX')}
                              className="btn-modal-add-cart"
                            >
                              Add Flex to Cart
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RENDER: INTERACTIVE QUESTIONNAIRE FLOW
  // -------------------------------------------------------------
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="configure-page-root">
      <div className="configure-container">
        
        {/* HERO SECTION */}
        <header className="configure-hero">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            <span>GEARGRID CONFIGURE</span>
          </div>
          <h1 className="hero-title">
            Tell us what you need.{' '}
            <span className="hero-accent">We'll engineer the right machine.</span>
          </h1>
          <p className="hero-subtitle">
            GearGrid analyzes your workload demands, budget boundary, and hardware priorities to recommend custom desktop PC builds or authentic laptops matched to your requirements.
          </p>
        </header>

        {/* PROGRESS TRACKER */}
        <div className="configure-progress-wrap">
          <div className="progress-meta">
            <span className="progress-step-badge">
              STEP 0{currentStepIndex + 1} OF 0{steps.length}
            </span>
            <span className="progress-step-title">{activeStep.title}</span>
            <span className="progress-percentage">{progressPercent}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>

        {/* QUESTION CARD WRAPPER */}
        <main className="configure-card-surface">
          <div className="step-header">
            <h2 className="step-headline">{activeStep.subtitle}</h2>
            {activeStep.id === 'system-type' && (
              <p className="step-hint">Select whether you are looking for a custom PC build or a high-performance laptop.</p>
            )}
            {activeStep.id === 'primary-use' && (
              <p className="step-hint">Select one or more categories that reflect your daily {systemType === 'laptop' ? 'laptop' : 'PC'} use.</p>
            )}
            {activeStep.id === 'priorities' && (
              <p className="step-hint">Pick up to 3 core factors ({priorities.length} / 3 selected).</p>
            )}
          </div>

          {/* VALIDATION ERROR BANNER */}
          {validationError && (
            <div className="validation-error-banner" role="alert">
              <span className="error-dot" />
              <span>{validationError}</span>
            </div>
          )}

          {/* STEP 0: WHAT ARE YOU LOOKING FOR? (PC VS LAPTOP) */}
          {activeStep.id === 'system-type' && (
            <div className="system-type-selection-container">
              <div className="system-type-grid">
                <button
                  type="button"
                  className={`system-type-card ${systemType === 'pc' ? 'selected' : ''}`}
                  onClick={() => handleSelectSystemType('pc')}
                  id="mode-select-pc"
                  aria-pressed={systemType === 'pc'}
                >
                  <div className="system-type-card-header">
                    <div className="system-type-icon-wrapper">
                      <Monitor size={32} />
                    </div>
                    <div className={`system-type-indicator ${systemType === 'pc' ? 'active' : ''}`}>
                      {systemType === 'pc' && <Check size={16} />}
                    </div>
                  </div>
                  <div className="system-type-badge-row">
                    <span className="system-type-badge pc-badge">CUSTOM DESKTOP</span>
                  </div>
                  <h3 className="system-type-name">PC</h3>
                  <p className="system-type-desc">
                    Custom desktop build with 8 verified authentic components, socket compatibility, thermal headroom & modular upgradeability.
                  </p>
                  <div className="system-type-features">
                    <span className="st-feat-pill">8 Modular Parts</span>
                    <span className="st-feat-pill">Socket & PSU Verified</span>
                    <span className="st-feat-pill">Interactive Upgrades</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`system-type-card ${systemType === 'laptop' ? 'selected' : ''}`}
                  onClick={() => handleSelectSystemType('laptop')}
                  id="mode-select-laptop"
                  aria-pressed={systemType === 'laptop'}
                >
                  <div className="system-type-card-header">
                    <div className="system-type-icon-wrapper">
                      <Laptop size={32} />
                    </div>
                    <div className={`system-type-indicator ${systemType === 'laptop' ? 'active' : ''}`}>
                      {systemType === 'laptop' && <Check size={16} />}
                    </div>
                  </div>
                  <div className="system-type-badge-row">
                    <span className="system-type-badge laptop-badge">PORTABLE MACHINE</span>
                  </div>
                  <h3 className="system-type-name">Laptop</h3>
                  <p className="system-type-desc">
                    Pre-configured portable gaming laptop or mobile workstation calibrated for your workload, TGP thermal limits, display & battery endurance.
                  </p>
                  <div className="system-type-features">
                    <span className="st-feat-pill">Genuine MongoDB Stock</span>
                    <span className="st-feat-pill">TGP & Display Calibration</span>
                    <span className="st-feat-pill">Direct Add to Cart</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: PRIMARY USE CASES */}
          {activeStep.id === 'primary-use' && (
            <div className="options-grid-usecases">
              {activePrimaryUseCases.map((item) => {
                const IconComponent = item.icon;
                const isSelected = useCases.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`usecase-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleUseCase(item.id)}
                    aria-pressed={isSelected}
                  >
                    <div className="usecase-card-header">
                      <div className="usecase-icon-box">
                        <IconComponent size={22} />
                      </div>
                      <div className={`selection-indicator ${isSelected ? 'active' : ''}`}>
                        {isSelected && <Check size={14} />}
                      </div>
                    </div>
                    <div className="usecase-content">
                      <span className="usecase-title">{item.label}</span>
                      <span className="usecase-desc">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* CONDITIONAL STEP: GAMING CALIBRATION */}
          {activeStep.id === 'workload-gaming' && (
            <div className="sub-questions-stack">
              <div className="sub-question-block">
                <label className="sub-q-label">Target Gaming Resolution</label>
                <div className="button-group-row">
                  {(systemType === 'laptop' ? ['1080p', '1440p', '1600p+', 'Not sure'] : ['1080p', '1440p', '4K']).map((res) => (
                    <button
                      key={res}
                      type="button"
                      className={`choice-pill-btn ${workloads.gaming.resolution === res ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, gaming: { ...workloads.gaming, resolution: res } })}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sub-question-block">
                <label className="sub-q-label">Gaming Priority</label>
                <div className="button-group-row">
                  {['Competitive / High FPS', 'Balanced', 'Maximum Visual Quality'].map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      className={`choice-pill-btn ${workloads.gaming.priority === prio ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, gaming: { ...workloads.gaming, priority: prio } })}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sub-question-block">
                <label className="sub-q-label">Refresh Rate Target (Optional)</label>
                <div className="button-group-row">
                  {(systemType === 'laptop' ? ['120–165Hz', '240Hz+', '60Hz', 'Not sure'] : ['60Hz', '120–165Hz', '240Hz+', 'Not sure']).map((hz) => (
                    <button
                      key={hz}
                      type="button"
                      className={`choice-pill-btn ${workloads.gaming.refreshRate === hz ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, gaming: { ...workloads.gaming, refreshRate: hz } })}
                    >
                      {hz}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONAL STEP: PROFESSIONAL WORK */}
          {activeStep.id === 'workload-professional' && (
            <div className="sub-questions-stack">
              <div className="sub-question-block">
                <label className="sub-q-label">Primary Discipline</label>
                <div className="button-group-row wrap">
                  {(systemType === 'laptop' 
                    ? ['Programming', 'Office / Productivity', 'CAD / Engineering', 'Business / Consulting', 'Data Science / Analytics', 'Creative Work'] 
                    : ['Office / Productivity', 'Programming', 'CAD / Engineering', 'Data Science', 'Simulation', 'Architecture']
                  ).map((wl) => (
                    <button
                      key={wl}
                      type="button"
                      className={`choice-pill-btn ${workloads.professional.workload === wl ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, professional: { ...workloads.professional, workload: wl } })}
                    >
                      {wl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sub-question-block">
                <label className="sub-q-label">Hardware Focus</label>
                <div className="button-group-row wrap">
                  {(systemType === 'laptop' 
                    ? ['CPU performance', 'RAM capacity', 'Battery endurance', 'Portability', 'GPU acceleration', 'Balanced'] 
                    : ['CPU performance', 'Memory capacity', 'Storage', 'GPU acceleration', 'Balanced']
                  ).map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      className={`choice-pill-btn ${workloads.professional.priority === prio ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, professional: { ...workloads.professional, priority: prio } })}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONAL STEP: VIDEO EDITING */}
          {activeStep.id === 'workload-editing' && (
            <div className="sub-questions-stack">
              <div className="sub-question-block">
                <label className="sub-q-label">Primary Resolution</label>
                <div className="button-group-row">
                  {['1080p', '4K', '6K / 8K'].map((res) => (
                    <button
                      key={res}
                      type="button"
                      className={`choice-pill-btn ${workloads.editing.resolution === res ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, editing: { ...workloads.editing, resolution: res } })}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sub-question-block">
                <label className="sub-q-label">Creative Software Suite</label>
                <div className="button-group-row wrap">
                  {(systemType === 'laptop' 
                    ? ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Final Cut Pro / Mixed'] 
                    : ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Mixed Suite']
                  ).map((sw) => (
                    <button
                      key={sw}
                      type="button"
                      className={`choice-pill-btn ${workloads.editing.software === sw ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, editing: { ...workloads.editing, software: sw } })}
                    >
                      {sw}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sub-question-block">
                <label className="sub-q-label">Editing Priority</label>
                <div className="button-group-row wrap">
                  {(systemType === 'laptop' 
                    ? ['Timeline performance', 'Color-Accurate Display', 'Export & Render Speed', 'Balanced'] 
                    : ['Timeline performance', 'Rendering speed', 'High-speed Storage', 'Balanced']
                  ).map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      className={`choice-pill-btn ${workloads.editing.priority === prio ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, editing: { ...workloads.editing, priority: prio } })}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONAL STEP: 3D & RENDERING */}
          {activeStep.id === 'workload-rendering' && (
            <div className="sub-questions-stack">
              <div className="sub-question-block">
                <label className="sub-q-label">Primary 3D Software</label>
                <div className="button-group-row wrap">
                  {['Blender', 'Maya', '3ds Max', 'Cinema 4D', 'Unreal Engine 5', 'Mixed'].map((sw) => (
                    <button
                      key={sw}
                      type="button"
                      className={`choice-pill-btn ${workloads.rendering.software === sw ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, rendering: { ...workloads.rendering, software: sw } })}
                    >
                      {sw}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sub-question-block">
                <label className="sub-q-label">Render Acceleration Preference</label>
                <div className="button-group-row wrap">
                  {['GPU rendering', 'CPU rendering', 'Massive VRAM', 'Balanced'].map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      className={`choice-pill-btn ${workloads.rendering.priority === prio ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, rendering: { ...workloads.rendering, priority: prio } })}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONAL STEP: PROGRAMMING */}
          {activeStep.id === 'workload-programming' && (
            <div className="sub-questions-stack">
              <div className="sub-question-block">
                <label className="sub-q-label">Primary Development Domain</label>
                <div className="button-group-row wrap">
                  {(systemType === 'laptop' 
                    ? ['Web / App Development', 'Software Engineering', 'Android / iOS Mobile', 'Game Development', 'General Programming'] 
                    : ['Web / App Development', 'Software Development', 'Android / Mobile', 'Game Development', 'General Programming']
                  ).map((wl) => (
                    <button
                      key={wl}
                      type="button"
                      className={`choice-pill-btn ${workloads.programming.workload === wl ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, programming: { ...workloads.programming, workload: wl } })}
                    >
                      {wl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sub-question-block">
                <label className="sub-q-label">Resource Focus</label>
                <div className="button-group-row wrap">
                  {(systemType === 'laptop' 
                    ? ['RAM & Fast Compile', 'Battery & Portability', 'High-Speed NVMe Storage', 'Balanced'] 
                    : ['RAM & Multi-core CPU', 'High-Speed NVMe Storage', 'GPU Compute', 'Balanced']
                  ).map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      className={`choice-pill-btn ${workloads.programming.priority === prio ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, programming: { ...workloads.programming, priority: prio } })}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONAL STEP: AI / MACHINE LEARNING */}
          {activeStep.id === 'workload-ai' && (
            <div className="sub-questions-stack">
              <div className="sub-question-block">
                <label className="sub-q-label">Primary AI Workload</label>
                <div className="button-group-row wrap">
                  {['Local AI / LLMs', 'Machine Learning', 'Computer Vision', 'AI Development', 'Mixed'].map((wl) => (
                    <button
                      key={wl}
                      type="button"
                      className={`choice-pill-btn ${workloads.ai.workload === wl ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, ai: { ...workloads.ai, workload: wl } })}
                    >
                      {wl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sub-question-block">
                <label className="sub-q-label">Hardware Bottleneck Focus</label>
                <div className="button-group-row wrap">
                  {(systemType === 'laptop' 
                    ? ['GPU / VRAM capacity', 'High System RAM', 'CPU Compute', 'Balanced'] 
                    : ['GPU / VRAM capacity', 'CPU compute', 'System RAM (64GB+)', 'High-speed Storage']
                  ).map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      className={`choice-pill-btn ${workloads.ai.priority === prio ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, ai: { ...workloads.ai, priority: prio } })}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONDITIONAL STEP: STUDENT & PRODUCTIVITY (LAPTOP ONLY) */}
          {activeStep.id === 'workload-student' && (
            <div className="sub-questions-stack">
              <div className="sub-question-block">
                <label className="sub-q-label">Academic & Daily Focus</label>
                <div className="button-group-row wrap">
                  {['Engineering / CS', 'Business / Management', 'Design / Arts', 'General Studies / Humanities', 'Medical / Science'].map((foc) => (
                    <button
                      key={foc}
                      type="button"
                      className={`choice-pill-btn ${workloads.student.focus === foc ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, student: { ...workloads.student, focus: foc } })}
                    >
                      {foc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sub-question-block">
                <label className="sub-q-label">Campus Priority</label>
                <div className="button-group-row wrap">
                  {['All-day Battery Life', 'Lightweight Portability', 'Fast Multitasking', 'Budget Value'].map((prio) => (
                    <button
                      key={prio}
                      type="button"
                      className={`choice-pill-btn ${workloads.student.priority === prio ? 'active' : ''}`}
                      onClick={() => setWorkloads({ ...workloads, student: { ...workloads.student, priority: prio } })}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP: BUDGET */}
          {activeStep.id === 'budget' && (
            <div className="budget-selection-container">
              <div className="budget-presets-grid">
                {activeBudgetPresets.map((item) => {
                  const isSelected = budgetType === 'preset' && budgetPreset === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      className={`budget-preset-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setBudgetType('preset');
                        setBudgetPreset(item.value);
                      }}
                    >
                      <span className="preset-amount">{item.label}</span>
                      <span className="preset-desc">{item.desc}</span>
                      <div className={`preset-indicator ${isSelected ? 'active' : ''}`}>
                        {isSelected && <Check size={14} />}
                      </div>
                    </button>
                  );
                })}

                {/* Custom Budget Selector Option */}
                <button
                  type="button"
                  className={`budget-preset-card custom-card ${budgetType === 'custom' ? 'selected' : ''}`}
                  onClick={() => setBudgetType('custom')}
                >
                  <span className="preset-amount">Custom Budget</span>
                  <span className="preset-desc">Specify exact INR allocation</span>
                  <div className={`preset-indicator ${budgetType === 'custom' ? 'active' : ''}`}>
                    {budgetType === 'custom' && <Check size={14} />}
                  </div>
                </button>
              </div>

              {/* Custom Input Field if Custom Budget Selected */}
              {budgetType === 'custom' && (
                <div className="custom-budget-input-box">
                  <label htmlFor="custom-budget-input" className="custom-input-label">
                    Enter Exact Budget (INR)
                  </label>
                  <div className="input-currency-wrapper">
                    <span className="currency-symbol">₹</span>
                    <input
                      id="custom-budget-input"
                      type="text"
                      className="custom-budget-field"
                      value={customBudgetInput}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setCustomBudgetInput(raw);
                      }}
                      placeholder="e.g. 1,25,000"
                    />
                  </div>
                  <span className="custom-input-helper">
                    Formatted:{' '}
                    <strong className="text-amber">
                      {formatINR(effectiveBudget || 0)}
                    </strong>{' '}
                    (minimum {systemType === 'laptop' ? '₹50,000' : '₹35,000'})
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP: BUDGET FLEXIBILITY */}
          {activeStep.id === 'flexibility' && (
            <div className="flex-options-stack">
              {BUDGET_FLEX_OPTIONS.map((item) => {
                const isSelected = budgetFlex === item.value;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`flex-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setBudgetFlex(item.value)}
                  >
                    <div className="flex-card-left">
                      <div className={`flex-radio-circle ${isSelected ? 'active' : ''}`}>
                        {isSelected && <div className="radio-dot" />}
                      </div>
                      <div>
                        <span className="flex-title">{item.label}</span>
                        <p className="flex-desc">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex-card-right">
                      <span className="flex-pill-badge">
                        Ceiling:{' '}
                        <strong>{formatINR(effectiveBudget + item.value)}</strong>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP: PRIORITIES */}
          {activeStep.id === 'priorities' && (
            <div className="priorities-grid">
              {activePriorityOptions.map((item) => {
                const IconComp = item.icon;
                const isSelected = priorities.includes(item.label);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`priority-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => togglePriority(item.label)}
                  >
                    <div className="priority-card-header">
                      <div className="priority-icon-wrap">
                        <IconComp size={20} />
                      </div>
                      <div className={`priority-check ${isSelected ? 'active' : ''}`}>
                        {isSelected && <Check size={14} />}
                      </div>
                    </div>
                    <span className="priority-name">{item.label}</span>
                    <span className="priority-desc">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP: EXPERIENCE LEVEL */}
          {activeStep.id === 'experience' && (
            <div className="experience-stack">
              {EXPERIENCE_LEVELS.map((item) => {
                const isSelected = experience === item.label;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`experience-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setExperience(item.label)}
                  >
                    <div className={`exp-radio-indicator ${isSelected ? 'active' : ''}`}>
                      {isSelected && <div className="radio-dot" />}
                    </div>
                    <div className="exp-content">
                      <span className="exp-label">{item.label}</span>
                      <span className="exp-desc">{item.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP: FINAL REVIEW MANIFEST */}
          {activeStep.id === 'review' && (
            <div className="manifest-container">
              <div className="manifest-card">
                <div className="manifest-header">
                  <div>
                    <span className="manifest-tag">GEARGRID CONFIGURE CONSULTATION</span>
                    <h3 className="manifest-title">Ready for Recommendation Engine</h3>
                  </div>
                  <div className="manifest-status-badge">
                    <span className="status-dot" />
                    <span>VALIDATED</span>
                  </div>
                </div>

                <div className="manifest-rows">
                  <div className="manifest-row">
                    <span className="row-key">System Type</span>
                    <span className="row-val-highlight text-amber">
                      {systemType === 'laptop' ? 'Laptop (Portable Workstation)' : 'PC (Custom Desktop Build)'}
                    </span>
                  </div>

                  <div className="manifest-row">
                    <span className="row-key">Primary Use Cases</span>
                    <div className="row-value-pills">
                      {useCases.map((id) => {
                        const item = activePrimaryUseCases.find((c) => c.id === id);
                        return <span key={id} className="summary-pill">{item?.label || id}</span>;
                      })}
                    </div>
                  </div>

                  {useCases.includes('gaming') && (
                    <div className="manifest-row">
                      <span className="row-key">Gaming Target</span>
                      <span className="row-val-highlight">
                        {workloads.gaming.resolution} • {workloads.gaming.priority} ({workloads.gaming.refreshRate})
                      </span>
                    </div>
                  )}

                  {useCases.includes('editing') && (
                    <div className="manifest-row">
                      <span className="row-key">Editing Target</span>
                      <span className="row-val-highlight">
                        {workloads.editing.resolution} • {workloads.editing.software} ({workloads.editing.priority})
                      </span>
                    </div>
                  )}

                  {useCases.includes('rendering') && (
                    <div className="manifest-row">
                      <span className="row-key">3D Rendering</span>
                      <span className="row-val-highlight">
                        {workloads.rendering.software} • {workloads.rendering.priority}
                      </span>
                    </div>
                  )}

                  {useCases.includes('programming') && (
                    <div className="manifest-row">
                      <span className="row-key">Development Domain</span>
                      <span className="row-val-highlight">
                        {workloads.programming.workload} • {workloads.programming.priority}
                      </span>
                    </div>
                  )}

                  {useCases.includes('ai') && (
                    <div className="manifest-row">
                      <span className="row-key">AI & Machine Learning</span>
                      <span className="row-val-highlight">
                        {workloads.ai.workload} • {workloads.ai.priority}
                      </span>
                    </div>
                  )}

                  {systemType === 'laptop' && useCases.includes('student') && (
                    <div className="manifest-row">
                      <span className="row-key">Student Focus</span>
                      <span className="row-val-highlight">
                        {workloads.student.focus} • {workloads.student.priority}
                      </span>
                    </div>
                  )}

                  <div className="manifest-row">
                    <span className="row-key">Base Budget</span>
                    <span className="row-val-currency">{formatINR(effectiveBudget)}</span>
                  </div>

                  <div className="manifest-row">
                    <span className="row-key">Budget Flexibility</span>
                    <span className="row-val-currency text-amber">
                      {budgetFlex > 0 ? `+${formatINR(budgetFlex)} (Ceiling: ${formatINR(effectiveBudget + budgetFlex)})` : 'Strict Budget (No overflow)'}
                    </span>
                  </div>

                  <div className="manifest-row">
                    <span className="row-key">Priorities</span>
                    <div className="row-value-pills">
                      {priorities.map((p) => (
                        <span key={p} className="summary-pill amber">{p}</span>
                      ))}
                    </div>
                  </div>

                  <div className="manifest-row">
                    <span className="row-key">Hardware Comfort</span>
                    <span className="row-val-simple">{experience}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM NAVIGATION CONTROLS */}
          <div className="configure-nav-controls">
            {currentStepIndex > 0 ? (
              <button
                type="button"
                className="btn-configure-back"
                onClick={handleBack}
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>
            ) : (
              <div className="nav-spacer" />
            )}

            {currentStepIndex < steps.length - 1 ? (
              <button
                type="button"
                className="btn-configure-continue"
                onClick={handleContinue}
              >
                <span>Continue</span>
                <ChevronRight size={18} />
              </button>
            ) : (
              <button
                type="button"
                className="btn-configure-build"
                onClick={handleFinalBuild}
              >
                <span>{systemType === 'laptop' ? 'FIND MY LAPTOP' : 'BUILD MY CONFIGURATION'}</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
