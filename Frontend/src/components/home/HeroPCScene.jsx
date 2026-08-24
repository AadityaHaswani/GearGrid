import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import './HeroPCScene.css';

function Model() {
  const { scene } = useGLTF('/gaming_pc_free_download.glb');

  return (
    <Center>
      <primitive object={scene} scale={0.0155} />
    </Center>
  );
}

useGLTF.preload('/gaming_pc_free_download.glb');

function RigScene() {
  const groupRef = useRef();
  const baseRotationY = useRef(0.25);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Slow continuous auto-rotation
    baseRotationY.current += delta * 0.22;

    // Smooth mouse-based parallax tilt
    const targetY = baseRotationY.current + state.pointer.x * 0.45;
    const targetX = -state.pointer.y * 0.22 + 0.08;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetY, 2.5, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetX, 2.5, delta);
  });

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      <Model />
    </group>
  );
}

export default function HeroPCScene() {
  return (
    <div className="pc-scene-viewport">
      <Canvas
        camera={{ position: [3.2, 0.8, 3.8], fov: 36 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          
          {/* Studio Ambient Fill */}
          <ambientLight intensity={1.2} />

          {/* Primary Amber Key Rim Light */}
          <directionalLight 
            position={[5, 5, 3]} 
            intensity={3.2} 
            color="#F59E0B" 
          />

          {/* Crisp Studio Neutral White Top Fill */}
          <directionalLight 
            position={[-4, 6, -2]} 
            intensity={2.2} 
            color="#FFFFFF" 
          />

          {/* Front Studio Soft Fill for Glass Clarity */}
          <directionalLight 
            position={[1, 2, 5]} 
            intensity={1.8} 
            color="#F4F4F5" 
          />

          {/* Warm Amber Accent Pointlight */}
          <pointLight 
            position={[0.1, 0.2, 0.2]} 
            intensity={2.4} 
            distance={3.5} 
            color="#F59E0B" 
          />

          {/* Floating breathing motion */}
          <Float 
            speed={1.4} 
            rotationIntensity={0.1} 
            floatIntensity={0.2} 
            floatingRange={[-0.03, 0.03]}
          >
            <RigScene />
          </Float>

          {/* Soft Ground Contact Shadow */}
          <ContactShadows 
            position={[0, -1.35, 0]} 
            opacity={0.82} 
            scale={8.5} 
            blur={2.4} 
            far={3.8} 
            color="#000000" 
          />

        </Suspense>
      </Canvas>
    </div>
  );
}
