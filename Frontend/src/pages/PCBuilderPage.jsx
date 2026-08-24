import { useState } from 'react';
import { BUILDER_SLOTS } from '../data/hardwareData';
import { useShop } from '../context/ShopContext';
import { 
  Wrench, 
  Zap, 
  ShieldCheck, 
  ShoppingCart, 
  RotateCcw, 
  Check, 
  Gauge
} from 'lucide-react';
import './PCBuilderPage.css';

export default function PCBuilderPage() {
  const { addToCart, showToast } = useShop();

  // Selected component per slot
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
    showToast(`Selected: ${option.name.split('(')[0]}`, 'amber');
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
    showToast('Reset to default configuration', 'red');
  };

  // Calculations
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
        selectedBuild.cpu.name.split('(')[0],
        selectedBuild.gpu.name.split('(')[0],
        selectedBuild.ram.name.split('(')[0],
        selectedBuild.cooling.name.split('(')[0]
      ],
      wattage: totalWattage,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
      description: 'Customer-configured custom gaming PC.'
    };

    addToCart(customRigProduct);
  };

  return (
    <div className="builder-page-root">
      
      {/* Header Banner */}
      <section className="builder-banner">
        <div className="container">
          <div className="builder-banner-content">
            <span className="section-subtitle">CUSTOM SYSTEM CONFIGURATOR</span>
            <h1 className="builder-title">PC CONFIGURATOR</h1>
            <p className="builder-sub">
              Select verified components, calculate system power requirements, and build your custom gaming desktop.
            </p>
          </div>
        </div>
      </section>

      {/* Main Builder Grid */}
      <section className="builder-main-section">
        <div className="container builder-layout-grid">
          
          {/* Left Column: Component Slots */}
          <div className="builder-slots-column">
            
            <div className="slots-header">
              <h3>Select Components</h3>
              <button 
                type="button" 
                onClick={handleReset} 
                className="btn-outline reset-btn"
              >
                <RotateCcw size={14} />
                <span>Reset Defaults</span>
              </button>
            </div>

            <div className="slots-list">
              {BUILDER_SLOTS.map((slotGroup) => {
                const currentSelected = selectedBuild[slotGroup.slot];
                return (
                  <div key={slotGroup.slot} className="slot-card">
                    <div className="slot-card-header">
                      <span className="slot-label">{slotGroup.name}</span>
                      <span className="slot-status-active">
                        <Check size={12} /> Selected
                      </span>
                    </div>

                    <div className="slot-options-grid">
                      {slotGroup.options.map((opt) => {
                        const isEquipped = currentSelected?.id === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            className={`slot-opt-btn ${isEquipped ? 'equipped' : ''}`}
                            onClick={() => handleSelectOption(slotGroup.slot, opt)}
                          >
                            <div className="opt-meta">
                              <span className="opt-name">{opt.name}</span>
                              {opt.wattage > 0 && (
                                <span className="opt-watt">
                                  <Zap size={11} /> {opt.wattage}W TDP
                                </span>
                              )}
                            </div>
                            <span className="opt-price">${opt.price.toLocaleString()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Sticky Summary */}
          <div className="builder-summary-column">
            <div className="sticky-summary-box">
              
              <div className="summary-box-header">
                <h4>System Summary</h4>
                <div className="compat-pill">
                  <ShieldCheck size={14} />
                  <span>Compatible</span>
                </div>
              </div>

              {/* Power Meter */}
              <div className="power-meter-hud">
                <div className="pm-header">
                  <div className="pm-title">
                    <Gauge size={15} />
                    <span>Estimated System Power</span>
                  </div>
                  <span className="pm-watt-val">{totalWattage} W</span>
                </div>

                <div className="pm-bar-track">
                  <div 
                    className="pm-bar-fill"
                    style={{ width: `${Math.min((totalWattage / 850) * 100, 100)}%` }}
                  ></div>
                </div>

                <div className="pm-footer">
                  <span>Recommended PSU: <strong>{recommendedPsu}W+</strong></span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="builder-parts-summary">
                {Object.entries(selectedBuild).map(([slotKey, part]) => (
                  <div key={slotKey} className="part-line">
                    <span className="part-slot-name">{slotKey.toUpperCase()}</span>
                    <span className="part-item-name">{part.name.split('(')[0]}</span>
                    <span className="part-item-price">${part.price}</span>
                  </div>
                ))}
              </div>

              {/* Total & Action */}
              <div className="summary-total-section">
                <div className="subtotal-row">
                  <span>Total Investment:</span>
                  <span className="total-digits">${totalPrice.toLocaleString()}</span>
                </div>

                <p className="summary-note">
                  Includes professional assembly, cable management, and 3-year warranty.
                </p>

                <button
                  type="button"
                  className="btn-primary deploy-build-btn"
                  onClick={handleDeployCustomRig}
                >
                  <ShoppingCart size={17} />
                  <span>Add Custom PC to Cart</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
