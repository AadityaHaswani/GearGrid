import { Link } from 'react-router-dom';
import { Shield, Wrench, Truck, Headphones, ArrowRight } from 'lucide-react';
import GearGridLogo from './GearGridLogo';
import './Footer.css';

export default function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to GearGrid product announcements.');
  };

  return (
    <footer className="footer-root">
      
      {/* Real Ecommerce Value Propositions */}
      <div className="footer-props-bar">
        <div className="container">
          <div className="footer-props-grid">
            
            <div className="prop-box">
              <div className="prop-icon"><Shield size={20} /></div>
              <div>
                <span className="prop-title">Official Brand Warranty</span>
                <p className="prop-desc">100% genuine components with full manufacturer warranty coverage.</p>
              </div>
            </div>

            <div className="prop-box">
              <div className="prop-icon"><Wrench size={20} /></div>
              <div>
                <span className="prop-title">Expert PC Assembly</span>
                <p className="prop-desc">Custom systems hand-assembled with precision cable management.</p>
              </div>
            </div>

            <div className="prop-box">
              <div className="prop-icon"><Truck size={20} /></div>
              <div>
                <span className="prop-title">Insured Express Shipping</span>
                <p className="prop-desc">Heavy-duty armored packaging with end-to-end parcel tracking.</p>
              </div>
            </div>

            <div className="prop-box">
              <div className="prop-icon"><Headphones size={20} /></div>
              <div>
                <span className="prop-title">Hardware Support</span>
                <p className="prop-desc">Dedicated assistance for build compatibility and technical questions.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container footer-main">
        <div className="footer-columns-grid">
          
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GearGridLogo size={24} />
              <span className="footer-logo-text">Gear<span className="text-amber">Grid</span></span>
            </div>
            <p className="footer-about-text">
              High-performance gaming hardware and custom PC configurator. Built for competitive players, creators, and enthusiasts.
            </p>
          </div>

          {/* Shop Categories */}
          <div className="footer-col">
            <h5 className="footer-heading">Shop Hardware</h5>
            <ul className="footer-links-list">
              <li><Link to="/shop?category=gpus">Graphics Cards</Link></li>
              <li><Link to="/shop?category=cpus">Processors</Link></li>
              <li><Link to="/shop?category=prebuilt">Custom Gaming PCs</Link></li>
              <li><Link to="/shop?category=monitors">Gaming Monitors</Link></li>
              <li><Link to="/shop?category=peripherals">Keyboards & Mice</Link></li>
            </ul>
          </div>

          {/* Custom PC Builder */}
          <div className="footer-col">
            <h5 className="footer-heading">Custom Systems</h5>
            <ul className="footer-links-list">
              <li><Link to="/build">PC Configurator</Link></li>
              <li><Link to="/build">Power & Wattage Meter</Link></li>
              <li><Link to="/about">Assembly Standards</Link></li>
              <li><Link to="/about">Warranty & Returns</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col newsletter-col">
            <h5 className="footer-heading">Hardware Updates</h5>
            <p className="newsletter-desc">
              Subscribe for new product launches, stock alerts, and custom build showcases.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                <ArrowRight size={16} />
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} GearGrid Technologies Inc. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <Link to="/about">Privacy Policy</Link>
            <span>•</span>
            <Link to="/about">Terms of Service</Link>
            <span>•</span>
            <Link to="/about">Warranty Terms</Link>
          </div>
        </div>

      </div>

    </footer>
  );
}
