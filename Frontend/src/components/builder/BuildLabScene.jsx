import { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Center, OrbitControls, ContactShadows, Clone } from '@react-three/drei';
import * as THREE from 'three';
import { RotateCcw, Eye, Compass } from 'lucide-react';
import './BuildLabScene.css';

// Configurable 3D anchor coordinates for each component on the rig.
const ANCHORS = {
  cpu:         [0.08,  0.46,  0.28],
  gpu:         [0.06, -0.06,  0.38],
  motherboard: [-0.18, 0.28,  0.08],
  ram:         [0.36,  0.44,  0.28],
  storage:     [0.12,  0.14,  0.32],
  cooling:     [-0.02, 0.88,  0.12],
  psu:         [-0.18, -0.74, 0.22]
};

// Fixed viewport edge positions for external callout tags
const LABEL_SLOTS = {
  cooling:     { x: 3.5, y: 15 },
  motherboard: { x: 3.5, y: 38 },
  psu:         { x: 3.5, y: 64 },
  ram:         { x: 96.5, y: 15 },
  cpu:         { x: 96.5, y: 32 },
  storage:     { x: 96.5, y: 50 },
  gpu:         { x: 96.5, y: 68 }
};

const LABEL_NAMES = {
  cpu: 'CPU',
  gpu: 'GPU',
  ram: 'RAM',
  motherboard: 'MOTHERBOARD',
  storage: 'STORAGE',
  cooling: 'COOLING',
  psu: 'PSU'
};

const SLOT_IDS = ['cooling', 'motherboard', 'psu', 'ram', 'cpu', 'storage', 'gpu'];

function PCModel() {
  const { scene } = useGLTF('/gaming_pc_free_download.glb');

  return (
    <group position={[0, -0.05, 0]}>
      <Center>
        <Clone object={scene} scale={0.0155} />
      </Center>
    </group>
  );
}

useGLTF.preload('/gaming_pc_free_download.glb');

function StudioLighting({ activeSlot }) {
  const spotlightRef = useRef();
  const targetObjRef = useRef(new THREE.Object3D());
  const { scene } = useThree();

  useEffect(() => {
    scene.add(targetObjRef.current);
    return () => scene.remove(targetObjRef.current);
  }, [scene]);

  useFrame((_, delta) => {
    if (!spotlightRef.current || !targetObjRef.current) return;
    const pos = ANCHORS[activeSlot] || ANCHORS.cpu;
    const d = Math.min(delta, 0.05);
    targetObjRef.current.position.x = THREE.MathUtils.damp(targetObjRef.current.position.x, pos[0], 4, d);
    targetObjRef.current.position.y = THREE.MathUtils.damp(targetObjRef.current.position.y, pos[1], 4, d);
    targetObjRef.current.position.z = THREE.MathUtils.damp(targetObjRef.current.position.z, pos[2], 4, d);
    spotlightRef.current.target = targetObjRef.current;
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4.5, 4.5, 3]} intensity={3.0} color="#F59E0B" />
      <directionalLight position={[-4, 5, -3]} intensity={2.0} color="#E4E4E7" />
      <directionalLight position={[0, 2, 4.5]} intensity={1.6} color="#F4F4F5" />
      <spotLight
        ref={spotlightRef}
        position={[1.8, 2.2, 3.2]}
        intensity={4.5}
        color="#F59E0B"
        angle={0.45}
        penumbra={0.65}
        distance={7}
      />
      <pointLight position={[0.08, 0.1, 0.2]} intensity={2.2} distance={3.0} color="#F59E0B" />
    </>
  );
}

function AnchorProjector({ projectedRef }) {
  const { camera, size } = useThree();
  const vec = useRef(new THREE.Vector3());

  useFrame(() => {
    const result = {};
    for (const id of SLOT_IDS) {
      const a = ANCHORS[id];
      vec.current.set(a[0], a[1], a[2]);
      vec.current.project(camera);
      result[id] = {
        x: (vec.current.x * 0.5 + 0.5) * size.width,
        y: (-vec.current.y * 0.5 + 0.5) * size.height,
        visible: vec.current.z < 1
      };
    }
    projectedRef.current = result;
  });

  return null;
}

function CalloutOverlay({ activeSlot, projectedRef, containerRef, onSelectSlot }) {
  const [projected, setProjected] = useState({});
  const rafRef = useRef(null);
  const lastHash = useRef('');

  useEffect(() => {
    const sync = () => {
      if (projectedRef.current) {
        const entries = Object.entries(projectedRef.current);
        const hash = entries.map(([k, v]) => `${k}:${Math.round(v.x)},${Math.round(v.y)}`).join('|');
        if (hash !== lastHash.current) {
          lastHash.current = hash;
          setProjected({ ...projectedRef.current });
        }
      }
      rafRef.current = requestAnimationFrame(sync);
    };
    rafRef.current = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafRef.current);
  }, [projectedRef]);

  const rect = containerRef.current?.getBoundingClientRect();
  const cw = rect?.width || 1;
  const ch = rect?.height || 1;

  return (
    <div className="callout-overlay">
      <svg className="callout-svg" viewBox={`0 0 ${cw} ${ch}`} preserveAspectRatio="none">
        {SLOT_IDS.map((id) => {
          const anchor = projected[id];
          if (!anchor || !anchor.visible) return null;
          const slot = LABEL_SLOTS[id];
          const isActive = activeSlot === id;
          const isLeft = slot.x < 50;

          const lx = (slot.x / 100) * cw;
          const ly = (slot.y / 100) * ch;
          const ax = Math.max(12, Math.min(cw - 12, anchor.x));
          const ay = Math.max(12, Math.min(ch - 12, anchor.y));
          const elbowX = isLeft ? lx + 44 : lx - 44;

          return (
            <g key={id} className={`callout-connector-group ${isActive ? 'active' : ''}`}>
              <polyline
                points={`${lx},${ly} ${elbowX},${ly} ${ax},${ay}`}
                className={`callout-leader ${isActive ? 'active' : ''}`}
              />
              <circle
                cx={ax}
                cy={ay}
                r={isActive ? 3.5 : 2}
                className={`callout-dot ${isActive ? 'active' : ''}`}
              />
            </g>
          );
        })}
      </svg>

      {SLOT_IDS.map((id) => {
        const anchor = projected[id];
        if (!anchor || !anchor.visible) return null;
        const slot = LABEL_SLOTS[id];
        const isActive = activeSlot === id;
        const isLeft = slot.x < 50;

        return (
          <button
            key={id}
            type="button"
            className={`callout-tag ${isLeft ? 'left' : 'right'} ${isActive ? 'active' : ''}`}
            onClick={() => onSelectSlot(id)}
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
            aria-label={`Select ${LABEL_NAMES[id]} slot`}
          >
            {isLeft && <span className="callout-tag-label">{LABEL_NAMES[id]}</span>}
            <span className="callout-tag-chevron">{isLeft ? '›' : '‹'}</span>
            {!isLeft && <span className="callout-tag-label">{LABEL_NAMES[id]}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function BuildLabScene({ activeSlot, onSelectSlot }) {
  const controlsRef = useRef();
  const projectedRef = useRef({});
  const containerRef = useRef(null);

  const handleView = useCallback((preset) => {
    if (!controlsRef.current) return;
    const cam = controlsRef.current.object;
    if (preset === 'iso') cam.position.set(3.2, 0.8, 3.8);
    else if (preset === 'side') cam.position.set(4.6, 0.2, 0.5);
    else if (preset === 'front') cam.position.set(0.2, 0.4, 4.8);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, []);

  return (
    <div className="buildlab-viewport-container" ref={containerRef}>
      <div className="buildlab-viewport-topbar">
        <div className="buildlab-view-mode-badge">
          <span className="live-indicator-dot" />
          <span className="view-mode-title">RIG CALIBRATION STUDIO</span>
        </div>
        <div className="buildlab-controls-toolbar">
          <button type="button" className="buildlab-view-btn" onClick={() => handleView('iso')} title="Isometric Perspective">
            <Compass size={12} />
            <span>Isometric</span>
          </button>
          <button type="button" className="buildlab-view-btn" onClick={() => handleView('side')} title="Side Glass Angle">
            <Eye size={12} />
            <span>Side Glass</span>
          </button>
          <button type="button" className="buildlab-view-btn" onClick={() => handleView('front')} title="Front Perspective">
            <span>Front</span>
          </button>
          <button type="button" className="buildlab-view-btn icon-only" onClick={() => handleView('iso')} title="Reset Camera">
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <div className="buildlab-canvas-wrapper">
        <Canvas
          camera={{ position: [3.2, 0.8, 3.8], fov: 36 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <StudioLighting activeSlot={activeSlot} />
            <PCModel />
            <ContactShadows
              position={[0, -1.35, 0]}
              opacity={0.85}
              scale={8.5}
              blur={2.4}
              far={3.8}
              frames={1}
              resolution={256}
              color="#000000"
            />
            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableZoom={true}
              minDistance={2.4}
              maxDistance={6.0}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.95}
              dampingFactor={0.06}
              rotateSpeed={0.7}
              autoRotate={false}
            />
            <AnchorProjector projectedRef={projectedRef} />
          </Suspense>
        </Canvas>

        <CalloutOverlay
          activeSlot={activeSlot}
          projectedRef={projectedRef}
          containerRef={containerRef}
          onSelectSlot={onSelectSlot}
        />
      </div>

      <div className="buildlab-viewport-footer">
        <span className="buildlab-hint-text">
          Drag to inspect 360° · Select technical callouts to switch slot
        </span>
        <span className="buildlab-active-tag">
          ACTIVE SLOT: <strong>{activeSlot?.toUpperCase()}</strong>
        </span>
      </div>
    </div>
  );
}
