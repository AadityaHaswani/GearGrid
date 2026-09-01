import { useRef, useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Float, ContactShadows, Clone } from '@react-three/drei';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import * as THREE from 'three';
import { useShop } from '../../context/ShopContext';
import { PRODUCTS } from '../../data/hardwareData';
import { formatPrice } from '../../utils/formatCurrency';
import './RigSpotlight.css';

function MachineModel() {
  const { scene } = useGLTF('/gaming_pc_free_download.glb');

  return (
    <Center>
      <Clone object={scene} scale={0.0165} />
    </Center>
  );
}

useGLTF.preload('/gaming_pc_free_download.glb');

function MachineScene() {
  const groupRef = useRef();
  const baseRotationY = useRef(0.45);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const safeDelta = Math.min(delta, 0.05);
    baseRotationY.current += safeDelta * 0.18;

    const targetY = baseRotationY.current + state.pointer.x * 0.35;
    const targetX = -state.pointer.y * 0.18 + 0.06;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 2.5, safeDelta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 2.5, safeDelta);
  });

  return (
    <group ref={groupRef} position={[0, -0.04, 0]}>
      <MachineModel />
    </group>
  );
}

const MACHINE_SPECS = [
  {
    id: 'cpu',
    label: 'PROCESSOR',
    name: 'AMD Ryzen 7 7800X3D',
    detail: '8 Cores · 96MB 3D V-Cache · 5.0 GHz',
    position: 'top-left'
  },
  {
    id: 'cooling',
    label: 'COOLING',
    name: '360mm Liquid Loop',
    detail: 'Silent custom distribution · Sub-65°C load',
    position: 'mid-left'
  },
  {
    id: 'memory',
    label: 'MEMORY',
    name: '64GB DDR5-6000',
    detail: 'Low-latency dual-channel tuning',
    position: 'bottom-left'
  },
  {
    id: 'gpu',
    label: 'GRAPHICS',
    name: 'GeForce RTX 5090',
    detail: '32GB GDDR7 · 512-bit · Blackwell',
    position: 'top-right'
  },
  {
    id: 'storage',
    label: 'STORAGE',
    name: '4TB Gen5 NVMe SSD',
    detail: '14,000 MB/s sequential read throughput',
    position: 'bottom-right'
  }
];

export default function RigSpotlight() {
  const { addToCart } = useShop();
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const rigProduct = PRODUCTS.find(p => p.id === 'rig-monolith') || PRODUCTS[2];

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="machine-section" ref={containerRef}>
      <div className="container">
        
        {/* Editorial Header */}
        <div className="machine-header">
          <span className="machine-label">THE MACHINE</span>
          <h2 className="machine-title">BUILT FOR WHAT'S NEXT.</h2>
          <p className="machine-subtitle">
            Engineered by master builders for extreme thermal headroom, uncompromising frame pacing, and acoustic precision.
          </p>
        </div>

        {/* 3D Studio Showcase Canvas with Progressive Component Callouts */}
        <div className={`machine-stage ${isVisible ? 'in-view' : ''}`}>
          
          {/* Left Callouts Stack */}
          <div className="machine-callouts-col col-left">
            {MACHINE_SPECS.filter(s => s.position.includes('left')).map((spec) => (
              <div key={spec.id} className={`machine-callout-card callout-${spec.id}`}>
                <div className="callout-indicator-dot" />
                <div className="callout-text-group">
                  <span className="callout-label">{spec.label}</span>
                  <h4 className="callout-name">{spec.name}</h4>
                  <p className="callout-detail">{spec.detail}</p>
                </div>
                <div className="callout-connector-line line-right" />
              </div>
            ))}
          </div>

          {/* Central 3D Interactive Rig Viewport */}
          <div className="machine-canvas-wrapper">
            <Canvas
              camera={{ position: [3.2, 0.7, 3.8], fov: 36 }}
              dpr={[1, 1.25]}
              frameloop={isVisible ? 'always' : 'never'}
              gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={1.1} />

                {/* Amber Key Light */}
                <directionalLight
                  position={[5, 5, 3]}
                  intensity={3.2}
                  color="#F59E0B"
                />

                {/* Studio Neutral Top Fill */}
                <directionalLight
                  position={[-4, 6, -2]}
                  intensity={2.2}
                  color="#FFFFFF"
                />

                {/* Front Neutral Fill */}
                <directionalLight
                  position={[1, 2, 5]}
                  intensity={1.8}
                  color="#F4F4F5"
                />

                {/* Amber Internal Case Accent */}
                <pointLight
                  position={[0.1, 0.2, 0.2]}
                  intensity={2.4}
                  distance={3.5}
                  color="#F59E0B"
                />

                <Float
                  speed={1.2}
                  rotationIntensity={0.08}
                  floatIntensity={0.16}
                  floatingRange={[-0.02, 0.02]}
                >
                  <MachineScene />
                </Float>

                {/* Single-pass Ground Shadow */}
                <ContactShadows
                  position={[0, -1.35, 0]}
                  opacity={0.8}
                  scale={8.5}
                  blur={2.4}
                  far={3.8}
                  frames={1}
                  resolution={128}
                  color="#000000"
                />
              </Suspense>
            </Canvas>
          </div>

          {/* Right Callouts Stack */}
          <div className="machine-callouts-col col-right">
            {MACHINE_SPECS.filter(s => s.position.includes('right')).map((spec) => (
              <div key={spec.id} className={`machine-callout-card callout-${spec.id}`}>
                <div className="callout-connector-line line-left" />
                <div className="callout-indicator-dot" />
                <div className="callout-text-group">
                  <span className="callout-label">{spec.label}</span>
                  <h4 className="callout-name">{spec.name}</h4>
                  <p className="callout-detail">{spec.detail}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Editorial Action & Price Bar (Not in a card) */}
        <div className="machine-bottom-bar">
          <div className="machine-price-block">
            <span className="machine-config-tag">FLAGSHIP SPECIFICATION</span>
            <div className="machine-price-line">
              <span className="machine-price-value">{formatPrice(rigProduct.price)}</span>
              <span className="machine-price-note">Turnkey custom-assembled & stress-tested</span>
            </div>
          </div>

          <div className="machine-actions-group">
            <Link to="/build" className="btn-primary machine-build-btn">
              <span>BUILD THIS RIG</span>
              <ArrowRight size={17} />
            </Link>

            <button
              type="button"
              className="btn-secondary machine-cart-btn"
              onClick={() => addToCart(rigProduct)}
              aria-label="Add custom rig to cart"
            >
              <ShoppingCart size={16} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
