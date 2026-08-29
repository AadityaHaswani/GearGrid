import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import './CategoryGrid.css';

const VAULT_CATEGORIES = [
  {
    id: 'gpus',
    title: 'Graphics Cards',
    count: '14 Products',
    desc: 'Flagship RTX 50 & 40 Series, Radeon 7000 with custom triple-fan cooling and high VRAM throughput.',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    gridClass: 'vault-panel-dominant'
  },
  {
    id: 'cpus',
    title: 'Processors',
    count: '18 Products',
    desc: 'Next-generation AMD Ryzen 9000 & Intel Core 14th Gen unlocked CPUs with 3D V-Cache.',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    gridClass: 'vault-panel-regular'
  },
  {
    id: 'prebuilt',
    title: 'Custom Gaming PCs',
    count: '8 Systems',
    desc: 'Hand-crafted liquid-cooled battlestations featuring clean cable routing and stress-tested overclocks.',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    gridClass: 'vault-panel-regular'
  },
  {
    id: 'monitors',
    title: 'Gaming Displays',
    count: '12 Displays',
    desc: 'QD-OLED & 360Hz ultra-low latency tournament displays with true black HDR contrast.',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80',
    gridClass: 'vault-panel-regular'
  },
  {
    id: 'peripherals',
    title: 'Keyboards & Peripherals',
    count: '24 Devices',
    desc: 'Magnetic Hall-Effect switches, rapid trigger actuation, and lightweight wireless mice.',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=800&q=80',
    gridClass: 'vault-panel-regular'
  },
  {
    id: 'cooling',
    title: 'Cooling & Cases',
    count: '16 Kits',
    desc: 'Quiet 360mm AIO liquid loops, high-airflow mesh chassis, and custom thermal management.',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
    gridClass: 'vault-panel-wide'
  }
];

export default function CategoryGrid() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="vault-section">
      <div className="container">

        {/* Section Header */}
        <div className="vault-header">
          <div className="vault-header-text">
            <h2 className="vault-title">EXPLORE BY CATEGORY</h2>
            <p className="vault-subtitle">Everything you need to engineer your next machine.</p>
          </div>

          <Link to="/shop" className="vault-view-all-link">
            <span>View All Categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Asymmetric Hardware Display Wall */}
        <div className="vault-display-wall">
          {VAULT_CATEGORIES.map((cat, index) => {
            const isHovered = hoveredId === cat.id;
            const isAnyHovered = hoveredId !== null;
            const isDimmed = isAnyHovered && !isHovered;

            return (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className={`vault-panel ${cat.gridClass} ${isHovered ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}`}
                onMouseEnter={() => setHoveredId(cat.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={`Explore ${cat.title}`}
              >
                {/* Hardware Background Image & Lighting */}
                <div className="vault-image-container">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="vault-bg-image"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="vault-gradient-overlay" />
                  <div className="vault-amber-glow" />
                </div>

                {/* Panel Content */}
                <div className="vault-content">
                  <div className="vault-meta-top">
                    <span className="vault-count-tag">{cat.count}</span>
                    <div className="vault-arrow-circle">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <div className="vault-info-bottom">
                    <h3 className="vault-cat-name">{cat.title}</h3>
                    <p className="vault-cat-desc">{cat.desc}</p>

                    <div className="vault-action-row">
                      <span className="vault-explore-text">EXPLORE CATEGORY</span>
                      <ArrowRight size={14} className="vault-explore-arrow" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
