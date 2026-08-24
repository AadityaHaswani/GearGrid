import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Zap, Wind, ShieldCheck, ShoppingCart, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/hardwareData';
import './RigSpotlight.css';

const RIG_FEATURES = [
  {
    id: 'cooling',
    title: 'Custom Liquid Cooling',
    icon: Wind,
    stat: 'Quiet & Cool',
    desc: 'Premium AIO and custom distribution loops ensuring low operating temperatures under heavy gaming loads.'
  },
  {
    id: 'gpu',
    title: 'RTX 5090 Flagship Graphics',
    icon: Zap,
    stat: '32GB GDDR7',
    desc: 'Paired with high-wattage ATX 3.0 power delivery to provide smooth 4K high-refresh gameplay.'
  },
  {
    id: 'cpu',
    title: 'AMD Ryzen 7 7800X3D + 64GB DDR5',
    icon: Cpu,
    stat: '96MB 3D V-Cache',
    desc: 'Optimized memory sub-timings and low-latency architecture for high, consistent 1% low frame rates.'
  },
  {
    id: 'build',
    title: 'Precision Craftsmanship',
    icon: ShieldCheck,
    stat: 'Clean Routing',
    desc: 'Hand-routed custom sleeved cables, decoupled vibration dampening, and acoustic tuning.'
  }
];

export default function RigSpotlight() {
  const { addToCart } = useShop();
  const [activeFeature, setActiveFeature] = useState(0);

  const rigProduct = PRODUCTS.find(p => p.id === 'rig-monolith') || PRODUCTS[2];

  return (
    <section className="spotlight-section">
      <div className="container">
        
        <div className="spotlight-card">
          
          <div className="spotlight-content-col">
            <span className="section-subtitle">CUSTOM BATTLESTATION</span>
            <h2 className="spotlight-heading">GEARGRID APEX HORIZON</h2>
            
            <p className="spotlight-text">
              Hand-built by experienced hardware technicians. Every custom system is configured with genuine components, balanced airflow, and comprehensive testing.
            </p>

            {/* Interactive Feature Accordion/Selector */}
            <div className="spotlight-features-list">
              {RIG_FEATURES.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = activeFeature === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`spotlight-item-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setActiveFeature(idx)}
                  >
                    <div className="item-icon-box">
                      <Icon size={18} />
                    </div>
                    <div className="item-details">
                      <div className="item-title-row">
                        <span className="item-title">{item.title}</span>
                        <span className="item-stat-badge">{item.stat}</span>
                      </div>
                      <p className="item-desc">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="spotlight-cta-row">
              <button
                type="button"
                className="btn-primary"
                onClick={() => addToCart(rigProduct)}
              >
                <ShoppingCart size={17} />
                <span>Buy Preconfigured (${rigProduct.price.toLocaleString()})</span>
              </button>

              <Link to="/build" className="btn-secondary">
                <span>Configure in PC Builder</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div className="spotlight-media-col">
            <div className="spotlight-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1000&q=80"
                alt="GearGrid Apex Horizon Custom Gaming PC"
                className="spotlight-img"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
