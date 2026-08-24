import { Link } from 'react-router-dom';
import { Zap, Cpu, Monitor, Keyboard, Fan, Server, ArrowRight } from 'lucide-react';
import './CategoryGrid.css';

const CATEGORIES = [
  { id: 'gpus', title: 'Graphics Cards', count: '14 Products', icon: Zap, desc: 'RTX 50 & 40 Series, Radeon 7000' },
  { id: 'cpus', title: 'Processors', count: '18 Products', icon: Cpu, desc: 'AMD Ryzen 7000 & Intel Core 14th Gen' },
  { id: 'prebuilt', title: 'Custom Gaming PCs', count: '8 Systems', icon: Server, desc: 'Hand-crafted liquid-cooled battlestations' },
  { id: 'monitors', title: 'Gaming Displays', count: '12 Displays', icon: Monitor, desc: 'QD-OLED & high refresh rate monitors' },
  { id: 'peripherals', title: 'Keyboards & Peripherals', count: '24 Devices', icon: Keyboard, desc: 'Hall-Effect magnetic switch keyboards' },
  { id: 'cooling', title: 'Cooling & Cases', count: '16 Kits', icon: Fan, desc: 'Quiet AIO liquid coolers and airflow cases' }
];

export default function CategoryGrid() {
  return (
    <section className="cat-section">
      <div className="container">
        
        {/* Header */}
        <div className="cat-header-row">
          <div>
            <span className="section-subtitle">EXPLORE BY CATEGORY</span>
            <h2 className="section-title">HARDWARE ARSENAL</h2>
          </div>
          <Link to="/shop" className="btn-outline cat-all-link">
            <span>View All Categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="clean-cat-grid">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link 
                to={`/shop?category=${cat.id}`} 
                key={cat.id} 
                className="clean-cat-card"
              >
                <div className="cat-top-row">
                  <div className="cat-icon-container">
                    <Icon size={22} />
                  </div>
                  <span className="cat-product-count">{cat.count}</span>
                </div>

                <div className="cat-bottom-content">
                  <h3 className="cat-card-name">{cat.title}</h3>
                  <p className="cat-card-subtitle">{cat.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
