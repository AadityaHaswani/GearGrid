import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SEO from '../components/common/SEO';
import './AboutPage.css';

const PRINCIPLES = [
  {
    num: '01',
    title: 'PRECISION',
    tagline: 'Zero tolerance for loose tolerances.',
    description: 'Every component is selected based on measured thermal efficiency, VRM stability, and signal integrity. We do not stock filler parts or speculative hardware—only components proven to perform under sustained load.',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=900&q=80',
    alt: 'Precision electronics architecture and PCB engineering'
  },
  {
    num: '02',
    title: 'COMPATIBILITY',
    tagline: 'Architectural harmony across every subsystem.',
    description: 'PCIe 5.0 lanes, DDR5 memory topologies, and ATX 3.0 transient responses must harmonize. Our configuration matrix guarantees clean power delivery, clearance tolerances, and zero bottlenecking between CPU and GPU.',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80',
    alt: 'High-performance processor socket and memory pairing'
  },
  {
    num: '03',
    title: 'PERFORMANCE',
    tagline: 'Sustained throughput over synthetic peaks.',
    description: 'Peak benchmark numbers mean nothing if thermal throttling kicks in thirty minutes into a session. We tune fan curves, balance positive case pressure, and validate thermal headroom so performance never degrades over time.',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80',
    alt: 'Thermal dissipation heatsinks and cooling dynamics'
  },
  {
    num: '04',
    title: 'CRAFT',
    tagline: 'Assembly as an industrial discipline.',
    description: 'From individualized cable combs and tensioned wiring runs to BIOS flashing and memory subtiming validation, every custom machine leaves our bench as a functional piece of engineering ready for deployment.',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=900&q=80',
    alt: 'Meticulous desktop assembly and clean cable routing'
  }
];

const BUILD_STEPS = [
  {
    step: '01',
    name: 'SELECT',
    detail: 'Targeted hardware curation curated for specific gaming and compute profiles.'
  },
  {
    step: '02',
    name: 'VERIFY',
    detail: 'Rigorous compatibility validation covering power draw, socket clearances, and bandwidth.'
  },
  {
    step: '03',
    name: 'CONFIGURE',
    detail: 'Real-time 3D simulation with power budget and thermal headroom calculation.'
  },
  {
    step: '04',
    name: 'BUILD',
    detail: 'Hand-assembly, custom cable management, BIOS flashing, and thermal stress testing.'
  },
  {
    step: '05',
    name: 'DELIVER',
    detail: 'Reinforced custom chassis packaging, transit insurance, and comprehensive warranty.'
  }
];

export default function AboutPage() {
  return (
    <div className="about-manifesto-root">
      <SEO
        title="About GearGrid — Premium PC Hardware & Custom Builds"
        description="Learn about GearGrid's engineering standards, thermal stress validation, component curation, and commitment to zero-compromise PC hardware."
        canonical="https://geargrid-delta.vercel.app/about"
      />

      {/* Section 1: Hero */}
      <section className="manifesto-hero-section">
        <div className="container">
          <div className="manifesto-hero-grid">
            
            <div className="manifesto-hero-text">
              <span className="manifesto-hero-tag">GEARGRID / THE STANDARD</span>
              <h1 className="manifesto-hero-headline">
                BUILT FOR PEOPLE WHO CARE WHAT THEY BUILD.
              </h1>
              <p className="manifesto-hero-lead">
                We believe exceptional gaming systems are not mass-produced commodities. 
                They are precision-engineered machines built from carefully verified 
                flagship components, optimized for thermal efficiency, and tailored to the 
                exacting demands of competitive gamers and hardware enthusiasts.
              </p>
              <div className="manifesto-hero-actions">
                <Link to="/build" className="btn-primary manifesto-primary-btn">
                  <span>Open Build Lab</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/shop" className="btn-outline manifesto-secondary-btn">
                  <span>Browse Components</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>

            <div className="manifesto-hero-visual">
              <div className="manifesto-hero-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85"
                  alt="Cinematic high performance custom gaming desktop"
                  className="manifesto-hero-img"
                />
                <div className="manifesto-hero-img-overlay" />
                <div className="manifesto-img-badge">
                  <span className="img-badge-indicator" />
                  <span>BENCHMARK GRADE // ZERO COMPROMISE</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section 2: Manifesto Statement */}
      <section className="manifesto-statement-section">
        <div className="container">
          <div className="manifesto-statement-container">
            <span className="manifesto-section-num">THE PHILOSOPHY</span>
            <h2 className="manifesto-statement-quote">
              HARDWARE ISN’T JUST SOMETHING YOU BUY. IT’S SOMETHING YOU BUILD AROUND.
            </h2>
            
            <div className="manifesto-editorial-body">
              <p className="editorial-lead">
                Every frame rendered, every computation executed, and every thermal curve sustained traces directly back to the physical architecture beneath your desk.
              </p>
              <p>
                In an industry crowded with pre-built shortcuts, generic spec sheets, and proprietary corners cut, GearGrid exists to defend the standard of uncompromised desktop computing. We verify every silicon revision, test memory timings, and stress-test power rails because we care as much about the build as you do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: The GearGrid Standard (Editorial Principles) */}
      <section className="manifesto-principles-section">
        <div className="container">
          
          <div className="principles-header">
            <span className="manifesto-section-num">CORE DISCIPLINE</span>
            <h2 className="principles-section-title">THE GEARGRID STANDARD</h2>
          </div>

          <div className="principles-editorial-list">
            {PRINCIPLES.map((item, idx) => (
              <article key={item.num} className={`principle-row ${idx % 2 === 1 ? 'reversed' : ''}`}>
                <div className="principle-content-col">
                  <span className="principle-number">{item.num}</span>
                  <h3 className="principle-heading">{item.title}</h3>
                  <p className="principle-tagline">{item.tagline}</p>
                  <p className="principle-desc">{item.description}</p>
                </div>

                <div className="principle-media-col">
                  <div className="principle-image-frame">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="principle-img"
                      loading="lazy"
                    />
                    <div className="principle-image-border" />
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* Section 4: How We Build */}
      <section className="manifesto-process-section">
        <div className="container">
          
          <div className="process-header">
            <span className="manifesto-section-num">METHODOLOGY</span>
            <h2 className="process-section-title">HOW WE BUILD</h2>
            <p className="process-section-sub">
              From individual component validation to white-glove packaging, our 5-phase execution workflow.
            </p>
          </div>

          <div className="process-flow-track">
            {BUILD_STEPS.map((step, idx) => (
              <div key={step.step} className="process-flow-node">
                <div className="process-node-top">
                  <span className="process-step-idx">{step.step}</span>
                  {idx < BUILD_STEPS.length - 1 && (
                    <div className="process-connector-line">
                      <span className="process-connector-dot" />
                    </div>
                  )}
                </div>
                <h4 className="process-node-title">{step.name}</h4>
                <p className="process-node-detail">{step.detail}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Section 5: Final Brand Statement */}
      <section className="manifesto-closing-section">
        <div className="container">
          <div className="manifesto-closing-card">
            <span className="manifesto-hero-tag">ENTER THE LAB</span>
            <h2 className="manifesto-closing-headline">
              BUILD YOUR RIG. DEFINE YOUR POWER.
            </h2>
            <p className="manifesto-closing-sub">
              Start with our real-time 3D PC Builder or explore individual verified hardware components.
            </p>
            
            <div className="manifesto-closing-actions">
              <Link to="/shop" className="btn-outline manifesto-closing-btn">
                <span>EXPLORE HARDWARE</span>
                <ArrowRight size={15} />
              </Link>
              <Link to="/build" className="btn-primary manifesto-closing-btn primary">
                <span>BUILD YOUR RIG</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
