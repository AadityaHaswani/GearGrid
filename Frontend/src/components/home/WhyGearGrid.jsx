import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Truck, 
  Lock, 
  Headphones, 
  ArrowRight, 
  Wrench 
} from 'lucide-react';
import './WhyGearGrid.css';

const TRUST_POINTS = [
  {
    number: '01',
    title: 'Official Warranty',
    description: '100% genuine hardware backed by direct brand warranties and hassle-free RMA routing.',
    icon: ShieldCheck
  },
  {
    number: '02',
    title: 'Verified Components',
    description: 'Zero grey-market units. Every SKU is verified for silicon stability, bios integrity, and thermal headroom.',
    icon: CheckCircle2
  },
  {
    number: '03',
    title: 'Reliable Shipping',
    description: 'Heavily armored packaging with end-to-end parcel tracking and full transit insurance.',
    icon: Truck
  },
  {
    number: '04',
    title: 'Secure Checkout',
    description: 'Encrypted payment processing, transparent pricing, and instant digital invoice generation.',
    icon: Lock
  },
  {
    number: '05',
    title: 'Custom PC Support',
    description: 'Dedicated technical assistance from experienced hardware technicians throughout your build lifecycle.',
    icon: Headphones
  }
];

export default function WhyGearGrid() {
  return (
    <section className="why-section">
      
      {/* Low-Opacity Hardware Detail Background */}
      <div className="why-bg-layer" />

      <div className="container">
        
        {/* Section Header Statement */}
        <div className="why-header">
          <span className="why-label">WHY GEARGRID?</span>
          <h2 className="why-statement">
            PRECISION HARDWARE. VERIFIED COMPATIBILITY. BUILT FOR SERIOUS BUILDERS.
          </h2>
          <p className="why-description">
            We eliminate the friction of building high-end systems. Every component in our catalog is hand-selected for uncompromising build quality, verified for architectural synergy, and backed by authentic manufacturer coverage.
          </p>
        </div>

        {/* Horizontal Editorial Trust Points Grid with Line Dividers */}
        <div className="why-trust-row">
          {TRUST_POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.number} className="why-trust-item">
                <div className="trust-top-meta">
                  <span className="trust-number">{point.number}</span>
                  <Icon size={18} className="trust-icon" />
                </div>
                <h3 className="trust-title">{point.title}</h3>
                <p className="trust-desc">{point.description}</p>
              </div>
            );
          })}
        </div>

        {/* Centered Final CTA */}
        <div className="why-cta-block">
          <div className="cta-amber-line" />
          <h3 className="cta-heading">READY TO BUILD YOUR MACHINE?</h3>
          <p className="cta-sub">
            Explore verified flagship hardware components or configure your custom battlestation step-by-step.
          </p>

          <div className="cta-buttons-row">
            <Link to="/shop" className="btn-primary cta-btn">
              <span>EXPLORE HARDWARE</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/build" className="btn-secondary cta-btn">
              <Wrench size={16} />
              <span>BUILD YOUR RIG</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
