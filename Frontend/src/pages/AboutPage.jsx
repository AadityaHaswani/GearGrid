import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Cpu, 
  Wind, 
  Wrench, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import './AboutPage.css';

const PILLARS = [
  {
    icon: Cpu,
    title: 'Curated Component Selection',
    desc: 'We select genuine components from industry-leading manufacturers, ensuring verified socket compatibility and optimal bandwidth pairings.'
  },
  {
    icon: Wind,
    title: 'Optimized Airflow & Cooling',
    desc: 'Every custom system is built with tuned fan curves and balanced positive pressure to minimize dust and sustain quiet acoustic profiles.'
  },
  {
    icon: Wrench,
    title: 'Clean Cable Routing & Assembly',
    desc: 'Our technicians hand-assemble every build with meticulous cable management for clean aesthetics and unobstructed internal airflow.'
  },
  {
    icon: ShieldCheck,
    title: 'Comprehensive Warranty Coverage',
    desc: 'All prebuilt systems and custom configured PCs include a 3-year hardware warranty with dedicated support for troubleshooting and repairs.'
  }
];

export default function AboutPage() {
  return (
    <div className="about-page-root">
      
      {/* Header Banner */}
      <section className="about-banner">
        <div className="container">
          <div className="about-banner-content">
            <span className="section-subtitle">ABOUT GEARGRID</span>
            <h1 className="about-title">ENGINEERED FOR GAMERS AND BUILDERS</h1>
            <p className="about-sub">
              GearGrid was founded by PC building enthusiasts dedicated to delivering top-tier gaming hardware, transparent advice, and expertly assembled custom battlestations.
            </p>
          </div>
        </div>
      </section>

      {/* Engineering Pillars */}
      <section className="about-pillars-section">
        <div className="container">
          
          <span className="section-subtitle">OUR STANDARDS</span>
          <h2 className="section-title" style={{ marginBottom: '36px' }}>HOW WE BUILD</h2>

          <div className="clean-pillars-grid">
            {PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="clean-pillar-card">
                  <div className="pillar-top-row">
                    <div className="pillar-icon-box">
                      <Icon size={22} />
                    </div>
                    <span className="pillar-step-number">0{idx + 1}</span>
                  </div>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <p className="pillar-desc">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* What We Guarantee */}
      <section className="about-guarantee-section">
        <div className="container">
          <div className="guarantee-box">
            <div className="guarantee-header">
              <span className="section-subtitle">THE GEARGRID PROMISE</span>
              <h2 className="section-title">WHAT YOU CAN EXPECT</h2>
            </div>

            <div className="guarantee-points-grid">
              <div className="guarantee-point">
                <CheckCircle2 size={20} className="text-amber" />
                <div>
                  <h4>100% Genuine Products</h4>
                  <p>All items sourced directly from authorized brand distributors.</p>
                </div>
              </div>

              <div className="guarantee-point">
                <CheckCircle2 size={20} className="text-amber" />
                <div>
                  <h4>Stress & Thermal Validation</h4>
                  <p>Every PC undergoes synthetic load tests to ensure system stability.</p>
                </div>
              </div>

              <div className="guarantee-point">
                <CheckCircle2 size={20} className="text-amber" />
                <div>
                  <h4>Secure Foam Packaging</h4>
                  <p>Internal expanding foam and heavy-duty double-boxing for transit safety.</p>
                </div>
              </div>

              <div className="guarantee-point">
                <CheckCircle2 size={20} className="text-amber" />
                <div>
                  <h4>Direct Customer Support</h4>
                  <p>Speak directly with PC building technicians for upgrades and help.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="about-cta-section">
        <div className="container">
          <div className="about-cta-card">
            <h2>Ready to build your next PC?</h2>
            <p>Use our interactive PC Configurator to customize your ideal gaming desktop.</p>
            <Link to="/build" className="btn-primary about-cta-btn">
              <span>Launch PC Builder</span>
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
