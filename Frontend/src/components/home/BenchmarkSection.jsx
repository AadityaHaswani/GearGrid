import { Link } from 'react-router-dom';
import { Monitor, Cpu, Sparkles, ArrowRight } from 'lucide-react';
import './BenchmarkSection.css';

const TIERS = [
  {
    tier: 'TIER 01 // ENTHUSIAST',
    title: '4K Ultra & Ray Tracing',
    target: '4K 120Hz+ · Maximum Settings',
    gpu: 'GeForce RTX 5090 / 4090',
    cpu: 'AMD Ryzen 7 7800X3D / i9 14900K',
    ram: '64GB DDR5-6000',
    bestFor: 'Cyberpunk 2077, Alan Wake 2, Black Myth Wukong with full ray tracing and 4K displays.',
    tag: 'Peak Performance'
  },
  {
    tier: 'TIER 02 // PERFORMANCE',
    title: '1440p High Refresh Rate',
    target: '1440p 165Hz–240Hz · Ultra Settings',
    gpu: 'GeForce RTX 4080 Super / 4070 Ti',
    cpu: 'AMD Ryzen 7 7800X3D / Ryzen 7 7700X',
    ram: '32GB DDR5-6000',
    bestFor: 'High frame-rate AAA gaming, OLED displays, and streaming workloads.',
    tag: 'Sweet Spot'
  },
  {
    tier: 'TIER 03 // COMPETITIVE',
    title: 'Competitive Esports',
    target: '1080p / 1440p 240Hz+ · Esports Settings',
    gpu: 'GeForce RTX 4070 Super / 4060 Ti',
    cpu: 'AMD Ryzen 5 7600X / Core i5 14600K',
    ram: '32GB DDR5-5600',
    bestFor: 'Counter-Strike 2, Valorant, Apex Legends, Overwatch 2 with lowest frame latency.',
    tag: 'Competitive Value'
  }
];

export default function BenchmarkSection() {
  return (
    <section className="bench-section">
      <div className="container">
        
        {/* Header */}
        <div className="bench-header-center">
          <span className="section-subtitle">HARDWARE SELECTION GUIDE</span>
          <h2 className="section-title">CHOOSE YOUR PERFORMANCE TIER</h2>
          <p className="bench-sub">
            Find the optimal component configuration tailored to your target resolution and favorite titles.
          </p>
        </div>

        {/* Tier Cards Grid */}
        <div className="tiers-grid">
          {TIERS.map((tier, idx) => (
            <div key={idx} className="tier-card">
              <div className="tier-card-header">
                <span className="tier-label">{tier.tier}</span>
                <span className="tier-tag">{tier.tag}</span>
              </div>

              <h3 className="tier-title">{tier.title}</h3>
              <span className="tier-target">{tier.target}</span>

              <div className="tier-specs-box">
                <div className="tier-spec-row">
                  <span className="spec-name">Recommended GPU</span>
                  <span className="spec-value">{tier.gpu}</span>
                </div>
                <div className="tier-spec-row">
                  <span className="spec-name">Recommended CPU</span>
                  <span className="spec-value">{tier.cpu}</span>
                </div>
                <div className="tier-spec-row">
                  <span className="spec-name">Recommended Memory</span>
                  <span className="spec-value">{tier.ram}</span>
                </div>
              </div>

              <p className="tier-best-for">{tier.bestFor}</p>

              <div className="tier-card-footer">
                <Link to="/build" className="btn-secondary tier-btn">
                  <span>Configure Tier in Builder</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
