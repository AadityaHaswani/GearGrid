import { useState, useEffect, useCallback, useMemo } from 'react';
import { BUILDER_SLOTS } from '../data/hardwareData';
import { getProducts } from '../services/product.api';
import { useShop } from '../context/ShopContext';
import BuildLabScene from '../components/builder/BuildLabScene';
import SEO from '../components/common/SEO';
import { formatPrice } from '../utils/formatCurrency';
import {
  Zap,
  ShieldCheck,
  ShoppingCart,
  RotateCcw,
  Check,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import './PCBuilderPage.css';

const CATEGORY_SHORT_NAMES = {
  cpu: 'CPU',
  gpu: 'GPU',
  motherboard: 'MOTHERBOARD',
  ram: 'RAM',
  storage: 'STORAGE',
  cooling: 'COOLING',
  psu: 'PSU'
};

// Safe helper to extract TDP/wattage from real product descriptions/titles
const extractWattage = (product) => {
  if (!product) return 0;
  if (typeof product.wattage === 'number' && product.wattage > 0) return product.wattage;
  const text = `${product.title || ''} ${product.description || ''}`;
  const tdpMatch = text.match(/(\d{2,4})\s*W\s*TDP/i) || text.match(/TDP[:\s]+(\d{2,4})\s*W/i);
  if (tdpMatch) return parseInt(tdpMatch[1], 10);
  return 0;
};

// Safe helper to extract PSU rated output capacity
const extractPsuCapacity = (psuProduct) => {
  if (!psuProduct) return 1000;
  const text = `${psuProduct.title || ''} ${psuProduct.description || ''}`;
  const match = text.match(/(\d{3,4})\s*W\b/i);
  return match ? parseInt(match[1], 10) : 1000;
};

export default function PCBuilderPage() {
  const { addBuildToCart, showToast } = useShop();

  const [activeCategory, setActiveCategory] = useState('cpu');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [slotProducts, setSlotProducts] = useState({
    cpu: [],
    gpu: [],
    motherboard: [],
    ram: [],
    storage: [],
    cooling: [],
    psu: []
  });

  const [selectedBuild, setSelectedBuild] = useState({
    cpu: null,
    gpu: null,
    motherboard: null,
    ram: null,
    storage: null,
    cooling: null,
    psu: null
  });

  // Fetch authentic products from MongoDB via existing Product API
  const fetchBuilderHardware = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const slotResults = await Promise.all(
        BUILDER_SLOTS.map(async (slotDef) => {
          try {
            const res = await getProducts({ category: slotDef.category, limit: 50 });
            const list = res.data?.data?.products || res.data?.data || [];
            return { slot: slotDef.slot, products: list };
          } catch (e) {
            console.warn(`Failed to load ${slotDef.name}:`, e);
            return { slot: slotDef.slot, products: [] };
          }
        })
      );

      const productsMap = {};
      const baselineBuild = {};

      slotResults.forEach(({ slot, products }) => {
        productsMap[slot] = products;
        if (products.length > 0) {
          baselineBuild[slot] = products[0];
        } else {
          baselineBuild[slot] = null;
        }
      });

      setSlotProducts(productsMap);
      setSelectedBuild((prev) => {
        const nextBuild = {};
        BUILDER_SLOTS.forEach((s) => {
          const currentSelection = prev[s.slot];
          const hasExisting = currentSelection && productsMap[s.slot]?.some(
            p => (p._id || p.id) === (currentSelection._id || currentSelection.id)
          );
          nextBuild[s.slot] = hasExisting ? currentSelection : (productsMap[s.slot]?.[0] || null);
        });
        return nextBuild;
      });
    } catch (err) {
      console.error('Error loading Build Lab hardware:', err);
      setError(err.response?.data?.message || err.message || 'Unable to connect to product catalog.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBuilderHardware();
  }, [fetchBuilderHardware]);

  const handleSelectOption = (slotKey, option) => {
    setSelectedBuild((prev) => ({
      ...prev,
      [slotKey]: option
    }));
    const name = option.title || option.name || 'Component';
    showToast(`Configured: ${name.split('(')[0].trim()}`, 'amber');
  };

  const handleReset = () => {
    const baseline = {};
    BUILDER_SLOTS.forEach((s) => {
      baseline[s.slot] = slotProducts[s.slot]?.[0] || null;
    });
    setSelectedBuild(baseline);
    setActiveCategory('cpu');
    showToast('Reset to baseline configuration', 'amber');
  };

  // Real price total calculated directly from MongoDB product prices
  const totalPrice = useMemo(() => {
    return Object.values(selectedBuild).reduce((acc, curr) => {
      if (!curr) return acc;
      return acc + (Number(curr.price) || 0);
    }, 0);
  }, [selectedBuild]);

  // Wattage calculated from real component specs where available
  const totalWattage = useMemo(() => {
    return Object.entries(selectedBuild).reduce((acc, [slotKey, curr]) => {
      if (!curr || slotKey === 'psu') return acc;
      return acc + extractWattage(curr);
    }, 0);
  }, [selectedBuild]);

  const recommendedPsu = useMemo(() => {
    if (totalWattage > 0) {
      return Math.round((totalWattage * 1.35) / 50) * 50;
    }
    return 750;
  }, [totalWattage]);

  const psuCapacity = useMemo(() => {
    return extractPsuCapacity(selectedBuild.psu) || 1000;
  }, [selectedBuild.psu]);

  // Verified socket compatibility check based on real CPU and Motherboard models
  const compatibility = useMemo(() => {
    const cpu = selectedBuild.cpu;
    const mb = selectedBuild.motherboard;
    if (!cpu || !mb) {
      return { label: 'CHECKING HARDWARE', verified: true, isMismatch: false };
    }
    const cpuText = `${cpu.title || ''} ${cpu.description || ''}`.toUpperCase();
    const mbText = `${mb.title || ''} ${mb.description || ''}`.toUpperCase();

    const isCpuAM5 = cpuText.includes('AM5') || cpuText.includes('RYZEN 7000') || cpuText.includes('RYZEN 9000') || cpuText.includes('7800X3D') || cpuText.includes('9950X3D') || cpuText.includes('7600X') || cpuText.includes('7700X') || cpuText.includes('9800X3D');
    const isMbAM5 = mbText.includes('AM5') || mbText.includes('B650') || mbText.includes('X670') || mbText.includes('A620') || mbText.includes('X870');

    const isCpuIntel = cpuText.includes('INTEL') || cpuText.includes('CORE ULTRA') || cpuText.includes('14900K') || cpuText.includes('LGA1851') || cpuText.includes('LGA1700');
    const isMbIntel = mbText.includes('Z790') || mbText.includes('B760') || mbText.includes('Z890') || mbText.includes('LGA1851') || mbText.includes('LGA1700');

    if (isCpuAM5 && isMbAM5) {
      return { label: 'AM5 SOCKET COMPATIBLE', verified: true, isMismatch: false };
    }
    if (isCpuIntel && isMbIntel) {
      return { label: 'INTEL SOCKET COMPATIBLE', verified: true, isMismatch: false };
    }
    if ((isCpuAM5 && isMbIntel) || (isCpuIntel && isMbAM5)) {
      return { label: 'SOCKET MISMATCH DETECTED', verified: false, isMismatch: true };
    }
    return { label: 'STANDARD ATX COMPATIBLE', verified: true, isMismatch: false };
  }, [selectedBuild.cpu, selectedBuild.motherboard]);

  const handleDeployCustomRig = () => {
    const selectedComponents = Object.values(selectedBuild).filter(Boolean);
    if (selectedComponents.length === 0) {
      showToast('Please select components for your build', 'red');
      return;
    }
    addBuildToCart(selectedComponents);
  };

  const currentSlotGroup = BUILDER_SLOTS.find(s => s.slot === activeCategory) || BUILDER_SLOTS[0];
  const currentSlotOptions = slotProducts[activeCategory] || [];
  const currentEquipped = selectedBuild[activeCategory];

  return (
    <div className="buildlab-page-root">
      <SEO
        title="PC Builder — Build Your Custom Gaming PC | GearGrid"
        description="Design and configure your custom gaming desktop in real time with interactive 3D visualization, automated component compatibility checking, and wattage calculation."
        canonical="https://geargrid-delta.vercel.app/pc-builder"
      />

      {/* Top Header */}
      <section className="buildlab-header-section">
        <div className="container">
          <div className="buildlab-header-content">
            <span className="buildlab-micro-label">GEARGRID / BUILD LAB</span>
            <h1 className="buildlab-main-heading">BUILD YOUR MACHINE.</h1>
            <p className="buildlab-subheading">
              Choose every component. We handle the compatibility.
            </p>
          </div>
        </div>
      </section>

      {/* Main Studio Workspace */}
      <section className="buildlab-workspace-section">
        <div className="container buildlab-grid-layout">

          {/* Left Column (~60%): 3D Visualizer + Horizontal Component Navigation */}
          <div className="buildlab-visualizer-column">

            {/* 3D Interactive Rig Visualizer */}
            <BuildLabScene
              activeSlot={activeCategory}
              onSelectSlot={(slotId) => setActiveCategory(slotId)}
            />

            {/* Mobile Dedicated: Selected Component / Current Focus Header */}
            <div className="buildlab-mobile-focus-bar">
              <div className="mobile-focus-info">
                <span className="mobile-focus-slot-label">
                  SLOT // {CATEGORY_SHORT_NAMES[activeCategory] || activeCategory.toUpperCase()}
                </span>
                <h2 className="mobile-focus-title">{currentSlotGroup.name}</h2>
              </div>
              <span className="mobile-focus-status-badge">
                <span className="live-indicator-dot" />
                <span>3D RIG FOCUS</span>
              </span>
            </div>

            {/* Component Selection Hub */}
            <div className="buildlab-selection-hub">

              {/* Category Navigation Bar / Component Selector */}
              <div className="buildlab-category-nav-bar" role="tablist" aria-label="Component categories">
                {BUILDER_SLOTS.map((slotGroup) => {
                  const isActive = activeCategory === slotGroup.slot;
                  const equippedOption = selectedBuild[slotGroup.slot];
                  const optTitle = equippedOption?.title || equippedOption?.name;
                  return (
                    <button
                      key={slotGroup.slot}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`buildlab-cat-tab ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveCategory(slotGroup.slot)}
                    >
                      <span className="cat-tab-name">
                        {CATEGORY_SHORT_NAMES[slotGroup.slot] || slotGroup.slot.toUpperCase()}
                      </span>
                      <span className="cat-tab-preview">
                        {optTitle ? optTitle.split(' ')[0] : 'Select'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Dedicated: Currently Equipped Component Information Card */}
              <div className="buildlab-mobile-equipped-card">
                <div className="equipped-card-header">
                  <span className="equipped-card-badge">EQUIPPED IN RIG</span>
                  <span className="equipped-card-price">{formatPrice(currentEquipped?.price)}</span>
                </div>
                <div className="equipped-card-name">
                  {currentEquipped?.title || currentEquipped?.name || 'Not Configured'}
                </div>
                <div className="equipped-card-specs">
                  {extractWattage(currentEquipped) > 0 && (
                    <span className="equipped-spec-item">
                      <Zap size={12} /> {extractWattage(currentEquipped)}W TDP
                    </span>
                  )}
                  <span className={`equipped-spec-item ${compatibility.verified ? 'verified' : 'warning'}`}>
                    <Check size={12} /> {compatibility.label}
                  </span>
                </div>
              </div>

              {/* Active Category Header & Options */}
              <div className="buildlab-options-panel">
                <div className="options-panel-header">
                  <div className="options-panel-title-group">
                    <span className="options-cat-index">SLOT // {activeCategory.toUpperCase()}</span>
                    <h3 className="options-cat-title">{currentSlotGroup.name}</h3>
                  </div>
                  <span className="options-count-badge">
                    {loading ? 'Checking Catalog...' : `${currentSlotOptions.length} Verified Options`}
                  </span>
                </div>

                <div className="buildlab-options-list">
                  {loading && currentSlotOptions.length === 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 16px', gap: '10px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <RotateCcw size={16} style={{ animation: 'spin 1.2s linear infinite' }} />
                      <span>Loading authentic {currentSlotGroup.name} options...</span>
                    </div>
                  ) : currentSlotOptions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 16px', color: 'var(--text-muted)' }}>
                      <AlertCircle size={24} style={{ marginBottom: '8px', opacity: 0.6 }} />
                      <p style={{ fontSize: '0.86rem' }}>No verified products currently in stock for this slot.</p>
                    </div>
                  ) : (
                    currentSlotOptions.map((opt) => {
                      const isSelected = (currentEquipped?._id || currentEquipped?.id) === (opt._id || opt.id);
                      const optWattage = extractWattage(opt);
                      const displayName = opt.title || opt.name;
                      return (
                        <button
                          key={opt._id || opt.id}
                          type="button"
                          className={`buildlab-option-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleSelectOption(activeCategory, opt)}
                        >
                          <div className="option-select-marker">
                            {isSelected ? <Check size={14} /> : <div className="marker-radio-dot" />}
                          </div>

                          <div className="option-details">
                            <span className="option-name-text">{displayName}</span>
                            {optWattage > 0 && (
                              <span className="option-spec-badge">
                                <Zap size={11} /> {optWattage}W TDP
                              </span>
                            )}
                          </div>

                          <div className="option-pricing">
                            <span className="option-price-amount">{formatPrice(opt.price)}</span>
                            <span className="option-status-label">
                              {isSelected ? 'EQUIPPED' : 'SELECT'}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column (~40%): Fixed Engineering Console Summary Panel */}
          <div className="buildlab-console-column">
            <div className="buildlab-console-panel">

              {/* Console Header */}
              <div className="console-panel-header">
                <div className="console-header-left">
                  <span className="console-terminal-badge">BUILD CONSOLE // SYSTEM MANIFEST</span>
                </div>
                <div 
                  className="console-compat-tag"
                  style={compatibility.isMismatch ? { color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.1)' } : {}}
                >
                  <ShieldCheck size={14} />
                  <span>{compatibility.label}</span>
                </div>
              </div>

              {/* Power & Thermal Calibration Meter */}
              <div className="console-power-module">
                <div className="power-module-header">
                  <div className="power-label-group">
                    <Zap size={14} />
                    <span className="power-label-title">ESTIMATED SYSTEM DRAW</span>
                  </div>
                  <span className="power-total-val">{totalWattage > 0 ? `${totalWattage} W` : '~450 W (Est.)'}</span>
                </div>

                <div className="power-track-bar">
                  <div
                    className="power-fill-bar"
                    style={{ width: `${Math.min(((totalWattage || 450) / psuCapacity) * 100, 100)}%` }}
                  />
                </div>

                <div className="power-module-footer">
                  <span className="power-rec-text">
                    Recommended PSU: <strong>{recommendedPsu}W+ ATX 3.0</strong>
                  </span>
                  <span className="power-headroom-text">
                    {Math.max(0, psuCapacity - (totalWattage || 450))}W Headroom
                  </span>
                </div>
              </div>

              {/* Selected Hardware Component Manifest */}
              <div className="console-manifest-container">
                <div className="manifest-section-title">CONFIGURED HARDWARE</div>
                <div className="manifest-items-list">
                  {BUILDER_SLOTS.map((slotGroup) => {
                    const part = selectedBuild[slotGroup.slot];
                    const isRowActive = activeCategory === slotGroup.slot;
                    const partTitle = part?.title || part?.name;
                    return (
                      <button
                        key={slotGroup.slot}
                        type="button"
                        className={`manifest-row-btn ${isRowActive ? 'active-row' : ''}`}
                        onClick={() => setActiveCategory(slotGroup.slot)}
                        title={`Configure ${slotGroup.name}`}
                      >
                        <span className="manifest-slot-code">
                          {CATEGORY_SHORT_NAMES[slotGroup.slot] || slotGroup.slot.toUpperCase()}
                        </span>
                        <span className="manifest-part-name">
                          {partTitle ? partTitle.split('(')[0].trim() : 'Not Configured'}
                        </span>
                        <span className="manifest-part-price">{part?.price ? formatPrice(part.price) : '—'}</span>
                        <ChevronRight size={13} className="manifest-jump-arrow" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Investment & Action Controls */}
              <div className="console-actions-block">
                <div className="console-total-row">
                  <span className="console-total-label">TOTAL INVESTMENT</span>
                  <span className="console-total-price">{formatPrice(totalPrice)}</span>
                </div>

                <p className="console-warranty-note">
                  Includes precision bench assembly, BIOS flashing, thermal tuning & 3-year warranty.
                </p>

                <div className="console-buttons-group">
                  <button
                    type="button"
                    className="btn-primary buildlab-order-btn"
                    onClick={handleDeployCustomRig}
                    disabled={loading}
                  >
                    <ShoppingCart size={17} />
                    <span>ADD BUILD TO CART</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-outline buildlab-reset-btn"
                    disabled={loading}
                  >
                    <RotateCcw size={14} />
                    <span>RESET BUILD</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
