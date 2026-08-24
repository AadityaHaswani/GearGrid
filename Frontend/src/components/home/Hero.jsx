import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, ShieldCheck, Zap, Truck } from 'lucide-react';
import HeroPCScene from './HeroPCScene';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        {/* Left Column: Headline, Copy & CTAs */}
        <div className="hero-content">
          
          <div className="hero-tag-pill">
            <span className="hero-dot"></span>
            <span>NEXT-GENERATION HARDWARE</span>
          </div>

          <h1 className="hero-heading">
            <span className="hero-heading-line">BUILD THE MACHINE.</span>
            <span className="hero-heading-line hero-heading-accent">POWER THE EXPERIENCE.</span>
          </h1>

          <p className="hero-description">
            Engineered for pure performance and zero compromises. Discover verified flagship graphics cards, high-bandwidth processors, and precision-built custom battlestations.
          </p>

          <div className="hero-actions-row">
            <Link to="/shop" className="btn-primary hero-btn">
              <span>SHOP HARDWARE</span>
              <ArrowRight size={17} />
            </Link>

            <Link to="/build" className="btn-secondary hero-btn">
              <Wrench size={17} />
              <span>BUILD YOUR RIG</span>
            </Link>
          </div>

          {/* Value Highlights */}
          <div className="hero-highlights-list">
            <div className="hero-highlight-item">
              <ShieldCheck size={16} className="highlight-icon" />
              <span>Official Warranty</span>
            </div>
            <div className="hero-highlight-divider"></div>
            <div className="hero-highlight-item">
              <Zap size={16} className="highlight-icon" />
              <span>RTX 50 & Ryzen 9000</span>
            </div>
            <div className="hero-highlight-divider"></div>
            <div className="hero-highlight-item">
              <Truck size={16} className="highlight-icon" />
              <span>Insured Shipping</span>
            </div>
          </div>

        </div>

        {/* Right Column: 3D Interactive Gaming PC Rig */}
        <div className="hero-visual-column">
          <HeroPCScene />
        </div>

      </div>
    </section>
  );
}
