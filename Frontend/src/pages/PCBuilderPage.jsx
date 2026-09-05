import { useState } from 'react';
import { BUILDER_SLOTS } from '../data/hardwareData';
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
  Sliders,
  ChevronRight
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

export default function PCBuilderPage() {
  const { addToCart, showToast } = useShop();

  const [activeCategory, setActiveCategory] = useState('cpu');

  const [selectedBuild, setSelectedBuild] = useState({
    cpu: BUILDER_SLOTS[0].options[0],
    gpu: BUILDER_SLOTS[1].options[0],
    motherboard: BUILDER_SLOTS[2].options[0],
    ram: BUILDER_SLOTS[3].options[0],
    storage: BUILDER_SLOTS[4].options[0],
    cooling: BUILDER_SLOTS[5].options[0],
    psu: BUILDER_SLOTS[6].options[0]
  });

  const handleSelectOption = (slotKey, option) => {
    setSelectedBuild((prev) => ({
      ...prev,
      [slotKey]: option
    }));
    showToast(`Configured: ${option.name.split('(')[0]}`, 'amber');
  };

  const handleReset = () => {
    setSelectedBuild({
      cpu: BUILDER_SLOTS[0].options[0],
      gpu: BUILDER_SLOTS[1].options[0],
      motherboard: BUILDER_SLOTS[2].options[0],
      ram: BUILDER_SLOTS[3].options[0],
      storage: BUILDER_SLOTS[4].options[0],
      cooling: BUILDER_SLOTS[5].options[0],
      psu: BUILDER_SLOTS[6].options[0]
    });
    setActiveCategory('cpu');
    showToast('Reset to baseline configuration', 'amber');
  };

  const totalPrice = Object.values(selectedBuild).reduce((acc, curr) => acc + curr.price, 0);
  const totalWattage = Object.values(selectedBuild).reduce((acc, curr) => acc + curr.wattage, 0);
  const recommendedPsu = Math.round((totalWattage * 1.35) / 50) * 50;

  const handleDeployCustomRig = () => {
    const customRigProduct = {
      id: `custom-rig-${Date.now()}`,
      name: `Custom PC Build [${selectedBuild.cpu.name.split(' ')[1] || 'CPU'} + ${selectedBuild.gpu.name.split(' ')[2] || 'GPU'}]`,
      category: 'prebuilt',
      categoryLabel: 'Custom Configured PC',
      price: totalPrice,
      rating: 5.0,
      reviews: 1,
      badge: 'Custom Build',
      specs: [
        selectedBuild.cpu.name.split('(')[0].trim(),
        selectedBuild.gpu.name.split('(')[0].trim(),
        selectedBuild.ram.name.split('(')[0].trim(),
        selectedBuild.cooling.name.split('(')[0].trim()
      ],
      wattage: totalWattage,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
      description: 'Custom-configured gaming PC assembled and verified in the Build Lab.'
    };

    addToCart(customRigProduct);
  };

  const currentSlotGroup = BUILDER_SLOTS.find(s => s.slot === activeCategory) || BUILDER_SLOTS[0];
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
                        {equippedOption ? equippedOption.name.split(' ')[0] : 'Select'}
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
                <div className="equipped-card-name">{currentEquipped?.name}</div>
                <div className="equipped-card-specs">
                  {currentEquipped?.wattage > 0 && (
                    <span className="equipped-spec-item">
                      <Zap size={12} /> {currentEquipped.wattage}W TDP
                    </span>
                  )}
                  <span className="equipped-spec-item verified">
                    <Check size={12} /> 100% Compatible
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
                    {currentSlotGroup.options.length} Verified Options
                  </span>
                </div>

                <div className="buildlab-options-list">
                  {currentSlotGroup.options.map((opt) => {
                    const isSelected = currentEquipped?.id === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`buildlab-option-row ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectOption(activeCategory, opt)}
                      >
                        <div className="option-select-marker">
                          {isSelected ? <Check size={14} /> : <div className="marker-radio-dot" />}
                        </div>

                        <div className="option-details">
                          <span className="option-name-text">{opt.name}</span>
                          {opt.wattage > 0 && (
                            <span className="option-spec-badge">
                              <Zap size={11} /> {opt.wattage}W TDP
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
                  })}
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
                <div className="console-compat-tag">
                  <ShieldCheck size={14} />
                  <span>100% COMPATIBLE</span>
                </div>
              </div>

              {/* Power & Thermal Calibration Meter */}
              <div className="console-power-module">
                <div className="power-module-header">
                  <div className="power-label-group">
                    <Zap size={14} />
                    <span className="power-label-title">ESTIMATED SYSTEM DRAW</span>
                  </div>
                  <span className="power-total-val">{totalWattage} W</span>
                </div>

                <div className="power-track-bar">
                  <div
                    className="power-fill-bar"
                    style={{ width: `${Math.min((totalWattage / 850) * 100, 100)}%` }}
                  />
                </div>

                <div className="power-module-footer">
                  <span className="power-rec-text">
                    Recommended PSU: <strong>{recommendedPsu}W+ ATX 3.0</strong>
                  </span>
                  <span className="power-headroom-text">
                    {Math.max(0, 1000 - totalWattage)}W Headroom
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
                          {part?.name.split('(')[0].trim() || 'Not Configured'}
                        </span>
                        <span className="manifest-part-price">{formatPrice(part?.price)}</span>
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
                  >
                    <ShoppingCart size={17} />
                    <span>ADD BUILD TO CART</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-outline buildlab-reset-btn"
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
