import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Cpu, Layers, Monitor, CheckCircle2 } from 'lucide-react';
import './BenchmarkSection.css';

const MISSIONS = [
  {
    id: '4k-ultra',
    tabName: '4K ULTRA',
    tabSub: 'Enthusiast Fidelity',
    tag: 'PEAK PERFORMANCE',
    title: '4K Ultra & Ray Tracing',
    target: '4K 120Hz+ · Maximum Settings',
    bestFor: 'Engineered for uncompromising visual immersion in Cyberpunk 2077, Alan Wake 2, and Black Myth: Wukong with full ray tracing on native 4K QD-OLED displays.',
    gpu: 'GeForce RTX 5090 / 4090',
    gpuNote: '32GB / 24GB GDDR7 · 512-bit',
    cpu: 'AMD Ryzen 7 7800X3D / i9 14900K',
    cpuNote: '8 Cores 3D V-Cache · 5.0 GHz',
    ram: '64GB DDR5-6000',
    ramNote: 'Low-latency dual-channel kit',
    resolution: '3840 × 2160 (4K UHD)',
    fidelityScore: '99%',
    frameScore: '94%',
    headroomScore: '98%'
  },
  {
    id: 'high-refresh',
    tabName: 'HIGH REFRESH',
    tabSub: '1440p Sweet Spot',
    tag: 'OPTIMAL BALANCE',
    title: '1440p High Refresh Rate',
    target: '1440p 165Hz–240Hz · Ultra Settings',
    bestFor: 'The enthusiast sweet spot for fluid high-framerate gameplay in modern AAA titles, fast-paced action games, and dual-monitor streaming workloads.',
    gpu: 'GeForce RTX 4080 Super / 4070 Ti',
    gpuNote: '16GB GDDR6X · Ada Lovelace',
    cpu: 'AMD Ryzen 7 7800X3D / Ryzen 7 7700X',
    cpuNote: '8 Cores / 16 Threads',
    ram: '32GB DDR5-6000',
    ramNote: 'Ultra-low latency kit',
    resolution: '2560 × 1440 (QHD)',
    fidelityScore: '88%',
    frameScore: '98%',
    headroomScore: '92%'
  },
  {
    id: 'esports',
    tabName: 'ESPORTS',
    tabSub: 'Competitive Value',
    tag: 'MINIMUM LATENCY',
    title: 'Competitive Esports',
    target: '1080p / 1440p 240Hz+ · Esports Settings',
    bestFor: 'Tailored for tournament frame delivery and near-zero input latency in Counter-Strike 2, Valorant, Apex Legends, and Overwatch 2.',
    gpu: 'GeForce RTX 4070 Super / 4060 Ti',
    gpuNote: '12GB / 8GB GDDR6',
    cpu: 'AMD Ryzen 5 7600X / Core i5 14600K',
    cpuNote: 'High single-core IPC',
    ram: '32GB DDR5-5600',
    ramNote: 'Performance dual-channel kit',
    resolution: '1920 × 1080 / 1440p',
    fidelityScore: '75%',
    frameScore: '100%',
    headroomScore: '86%'
  }
];

export default function BenchmarkSection() {
  const [activeTab, setActiveTab] = useState(0);
  const currentMission = MISSIONS[activeTab];

  return (
    <section className="mission-section">
      <div className="container">
        
        {/* Editorial Section Header */}
        <div className="mission-header">
          <span className="mission-label">HARDWARE SELECTION GUIDE</span>
          <h2 className="mission-heading">CHOOSE YOUR MISSION</h2>
          <p className="mission-subtitle">
            Select your target performance tier to preview optimal component configurations and verified hardware pairings.
          </p>
        </div>

        {/* 3 Compact Mission Selector Tabs */}
        <div className="mission-tabs-bar">
          {MISSIONS.map((mission, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={mission.id}
                type="button"
                className={`mission-tab-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveTab(idx)}
              >
                <div className="tab-text-group">
                  <span className="tab-main-name">{mission.tabName}</span>
                  <span className="tab-sub-name">{mission.tabSub}</span>
                </div>
                <div className="tab-active-indicator" />
              </button>
            );
          })}
        </div>

        {/* Large Active Configuration Showcase */}
        <div className="mission-showcase" key={currentMission.id}>
          
          {/* Left Column: Mission Narrative & Performance Meters */}
          <div className="showcase-overview-col">
            <div className="showcase-meta-row">
              <span className="mission-tag-pill">{currentMission.tag}</span>
              <span className="mission-target-text">{currentMission.target}</span>
            </div>

            <h3 className="showcase-title">{currentMission.title}</h3>
            <p className="showcase-desc">{currentMission.bestFor}</p>

            {/* Refined Visual Performance Meters */}
            <div className="mission-meters-box">
              <div className="meter-item">
                <div className="meter-header">
                  <span className="meter-name">Visual Fidelity Target</span>
                  <span className="meter-val">{currentMission.fidelityScore}</span>
                </div>
                <div className="meter-track">
                  <div 
                    className="meter-fill" 
                    style={{ width: currentMission.fidelityScore }} 
                  />
                </div>
              </div>

              <div className="meter-item">
                <div className="meter-header">
                  <span className="meter-name">Frame Throughput</span>
                  <span className="meter-val">{currentMission.frameScore}</span>
                </div>
                <div className="meter-track">
                  <div 
                    className="meter-fill" 
                    style={{ width: currentMission.frameScore }} 
                  />
                </div>
              </div>

              <div className="meter-item">
                <div className="meter-header">
                  <span className="meter-name">Thermal & System Headroom</span>
                  <span className="meter-val">{currentMission.headroomScore}</span>
                </div>
                <div className="meter-track">
                  <div 
                    className="meter-fill" 
                    style={{ width: currentMission.headroomScore }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Recommended Core Components & CTA */}
          <div className="showcase-specs-col">
            
            <div className="specs-card-header">
              <span className="specs-card-title">RECOMMENDED CONFIGURATION</span>
              <span className="specs-res-tag">{currentMission.resolution}</span>
            </div>

            <div className="specs-rows-list">
              
              {/* GPU Row */}
              <div className="spec-item-row">
                <div className="spec-icon-wrap">
                  <Zap size={18} />
                </div>
                <div className="spec-text-wrap">
                  <span className="spec-category">RECOMMENDED GRAPHICS</span>
                  <span className="spec-hardware-name">{currentMission.gpu}</span>
                  <span className="spec-hardware-sub">{currentMission.gpuNote}</span>
                </div>
              </div>

              {/* CPU Row */}
              <div className="spec-item-row">
                <div className="spec-icon-wrap">
                  <Cpu size={18} />
                </div>
                <div className="spec-text-wrap">
                  <span className="spec-category">RECOMMENDED PROCESSOR</span>
                  <span className="spec-hardware-name">{currentMission.cpu}</span>
                  <span className="spec-hardware-sub">{currentMission.cpuNote}</span>
                </div>
              </div>

              {/* RAM Row */}
              <div className="spec-item-row">
                <div className="spec-icon-wrap">
                  <Layers size={18} />
                </div>
                <div className="spec-text-wrap">
                  <span className="spec-category">RECOMMENDED MEMORY</span>
                  <span className="spec-hardware-name">{currentMission.ram}</span>
                  <span className="spec-hardware-sub">{currentMission.ramNote}</span>
                </div>
              </div>

            </div>

            {/* Direct Configurator Action */}
            <div className="showcase-action-footer">
              <Link to="/build" className="btn-primary showcase-build-btn">
                <span>CONFIGURE THIS BUILD</span>
                <ArrowRight size={17} />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
