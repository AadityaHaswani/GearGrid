import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Float, ContactShadows, Clone } from '@react-three/drei';
import * as THREE from 'three';
import './HeroPCScene.css';

function Model() {
  const { scene } = useGLTF('/pc_gamer_-_low_poly.glb');

  return (
    <Center>
      <Clone object={scene} scale={0.00165} />
    </Center>
  );
}

useGLTF.preload('/pc_gamer_-_low_poly.glb');

function RigScene() {
  const groupRef = useRef();
  const baseRotationY = useRef(0.25);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const safeDelta = Math.min(delta, 0.05);
    baseRotationY.current += safeDelta * 0.22;

    const targetY = baseRotationY.current + state.pointer.x * 0.45;
    const targetX = -state.pointer.y * 0.22 + 0.08;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 2.5, safeDelta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 2.5, safeDelta);
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      <Model />
    </group>
  );
}

export default function HeroPCScene() {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '150px 0px 150px 0px', threshold: 0 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pc-scene-viewport" ref={containerRef}>
      <Canvas
        camera={{ position: [3.2, 0.8, 3.8], fov: 36 }}
        dpr={[1, 1.5]}
        frameloop={isVisible ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>

          <ambientLight intensity={1.2} />

          <directionalLight
            position={[5, 5, 3]}
            intensity={3.2}
            color="#F59E0B"
          />

          <directionalLight
            position={[-4, 6, -2]}
            intensity={2.2}
            color="#FFFFFF"
          />

          <directionalLight
            position={[1, 2, 5]}
            intensity={1.8}
            color="#F4F4F5"
          />

          <pointLight
            position={[0.1, 0.2, 0.2]}
            intensity={2.4}
            distance={3.5}
            color="#F59E0B"
          />

          <Float
            speed={1.4}
            rotationIntensity={0.1}
            floatIntensity={0.2}
            floatingRange={[-0.03, 0.03]}
          >
            <RigScene />
          </Float>

          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.82}
            scale={8.5}
            blur={2.4}
            far={3.8}
            frames={1}
            resolution={256}
            color="#000000"
          />

        </Suspense>
      </Canvas>
    </div>
  );
}
