import { useRef, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero3DScene.css';

gsap.registerPlugin(ScrollTrigger);

const MODEL_PATH = '/models/GearGrid_HeroRig.glb';

// Preload the GLB model for instant caching
useGLTF.preload(MODEL_PATH);

/**
 * PC Model component with direct node bindings to the 8 engineered groups:
 * GG_CASE, GG_COOLING, GG_CPU, GG_GPU, GG_MOTHERBOARD, GG_PSU, GG_RAM, GG_STORAGE
 */
function PCModel({ scrollTriggerRef, isMobile }) {
  const { scene } = useGLTF(MODEL_PATH);

  // Group refs
  const spinGroupRef = useRef(null);
  // 2.5 rad (~145 deg) perfectly faces the glass showcase window, GPU fans & RGB cooler to the camera
  const baseRotationY = useRef(2.45);
  const pointerOffset = useRef({ x: 0, y: 0 });
  const timelineRef = useRef(null);

  // Find all named component groups in the hierarchy
  const nodes = useMemo(() => {
    return {
      pcRoot: scene.getObjectByName('GearGrid_PC'),
      caseGroup: scene.getObjectByName('GG_CASE'),
      coolingGroup: scene.getObjectByName('GG_COOLING'),
      cpuGroup: scene.getObjectByName('GG_CPU'),
      gpuGroup: scene.getObjectByName('GG_GPU'),
      moboGroup: scene.getObjectByName('GG_MOTHERBOARD'),
      psuGroup: scene.getObjectByName('GG_PSU'),
      ramGroup: scene.getObjectByName('GG_RAM'),
      storageGroup: scene.getObjectByName('GG_STORAGE'),
    };
  }, [scene]);

  // Adjust material properties for rich cinematic metal & acrylic finish
  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        obj.castShadow = true;
        obj.receiveShadow = true;

        if (obj.material.roughness !== undefined) {
          obj.material.roughness = Math.max(0.18, Math.min(obj.material.roughness, 0.65));
        }
        if (obj.material.metalness !== undefined) {
          obj.material.metalness = Math.max(0.3, obj.material.metalness);
        }
      }
    });
  }, [scene]);

  // GSAP ScrollTrigger timeline controlling assembly -> exploded view
  useEffect(() => {
    if (!scrollTriggerRef?.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const offsetMult = prefersReducedMotion ? 0.05 : isMobile ? 0.45 : 0.85;

    // Reset initial positions
    const groups = [
      nodes.caseGroup,
      nodes.coolingGroup,
      nodes.cpuGroup,
      nodes.gpuGroup,
      nodes.moboGroup,
      nodes.psuGroup,
      nodes.ramGroup,
      nodes.storageGroup,
    ];

    groups.forEach((g) => {
      if (g) {
        g.position.set(0, 0, 0);
        g.rotation.set(0, 0, 0);
      }
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scrollTriggerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1, // Smooth scrubbing directly follows scroll
          invalidateOnRefresh: true,
        },
      });

      timelineRef.current = tl;

      // 0% -> 15%: CASE REVEAL
      // Case/side panel subtly opens or shifts outward. Internal components become visible.
      if (nodes.caseGroup) {
        tl.to(
          nodes.caseGroup.position,
          {
            x: 0.22 * offsetMult,
            y: 0.04 * offsetMult,
            z: -0.16 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0
        ).to(
          nodes.caseGroup.rotation,
          {
            y: 0.10 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0
        );
      }

      // 15% -> 30%: GPU SEPARATION
      // GG_GPU slowly moves outward from its natural position (slightly toward camera / right)
      if (nodes.gpuGroup) {
        tl.to(
          nodes.gpuGroup.position,
          {
            x: -0.26 * offsetMult,
            y: -0.06 * offsetMult,
            z: -0.20 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.15
        );
      }

      // 30% -> 45%: RAM SEPARATION
      // GG_RAM moves outward slightly (slightly upward / right), grouped together
      if (nodes.ramGroup) {
        tl.to(
          nodes.ramGroup.position,
          {
            x: -0.14 * offsetMult,
            y: 0.20 * offsetMult,
            z: -0.08 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.30
        );
      }

      // 45% -> 60%: CPU + COOLING
      // GG_CPU (upward / forward) and GG_COOLING (upward / backward) separate from motherboard
      if (nodes.cpuGroup) {
        tl.to(
          nodes.cpuGroup.position,
          {
            x: 0.08 * offsetMult,
            y: 0.22 * offsetMult,
            z: -0.18 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.45
        );
      }

      if (nodes.coolingGroup) {
        tl.to(
          nodes.coolingGroup.position,
          {
            x: 0.12 * offsetMult,
            y: 0.24 * offsetMult,
            z: 0.18 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.45
        );
      }

      // 60% -> 75%: MOTHERBOARD + PSU
      // GG_MOTHERBOARD (slightly backward) and GG_PSU (downward / backward) separate
      if (nodes.moboGroup) {
        tl.to(
          nodes.moboGroup.position,
          {
            x: 0.06 * offsetMult,
            y: 0.00,
            z: 0.16 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.60
        );
      }

      if (nodes.psuGroup) {
        tl.to(
          nodes.psuGroup.position,
          {
            x: -0.02 * offsetMult,
            y: -0.22 * offsetMult,
            z: 0.12 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.60
        );
      }

      // 75% -> 90%: FULL EXPLODED VIEW
      // All groups expand into final balanced engineering configuration
      if (nodes.caseGroup) {
        tl.to(
          nodes.caseGroup.position,
          {
            x: 0.30 * offsetMult,
            y: 0.06 * offsetMult,
            z: -0.22 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.75
        );
      }

      if (nodes.gpuGroup) {
        tl.to(
          nodes.gpuGroup.position,
          {
            x: -0.34 * offsetMult,
            y: -0.08 * offsetMult,
            z: -0.26 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.75
        );
      }

      if (nodes.ramGroup) {
        tl.to(
          nodes.ramGroup.position,
          {
            x: -0.18 * offsetMult,
            y: 0.26 * offsetMult,
            z: -0.12 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.75
        );
      }

      if (nodes.cpuGroup) {
        tl.to(
          nodes.cpuGroup.position,
          {
            x: 0.11 * offsetMult,
            y: 0.28 * offsetMult,
            z: -0.22 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.75
        );
      }

      if (nodes.coolingGroup) {
        tl.to(
          nodes.coolingGroup.position,
          {
            x: 0.16 * offsetMult,
            y: 0.30 * offsetMult,
            z: 0.24 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.75
        );
      }

      if (nodes.moboGroup) {
        tl.to(
          nodes.moboGroup.position,
          {
            x: 0.09 * offsetMult,
            y: 0.00,
            z: 0.22 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.75
        );
      }

      if (nodes.psuGroup) {
        tl.to(
          nodes.psuGroup.position,
          {
            x: -0.03 * offsetMult,
            y: -0.28 * offsetMult,
            z: 0.16 * offsetMult,
            duration: 0.15,
            ease: 'power1.inOut',
          },
          0.75
        );
      }

      // 90% -> 100%: Hold the complete exploded configuration
      tl.to({}, { duration: 0.10 }, 0.90);
    });

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, [nodes, scrollTriggerRef, isMobile]);

  // Continuous independent slow rotation + subtle pointer parallax in useFrame
  useFrame((state, delta) => {
    if (!spinGroupRef.current) return;

    const safeDelta = Math.min(delta, 0.05);

    // Continuous slow rotation (independent of scroll timeline)
    baseRotationY.current += safeDelta * 0.16;

    // Subtle pointer parallax (restrained, non-intrusive)
    const targetX = -state.pointer.y * 0.08 + 0.04;
    const targetY = baseRotationY.current + state.pointer.x * 0.14;

    pointerOffset.current.x = THREE.MathUtils.damp(pointerOffset.current.x, targetX, 2.5, safeDelta);
    pointerOffset.current.y = THREE.MathUtils.damp(pointerOffset.current.y, targetY, 2.5, safeDelta);

    spinGroupRef.current.rotation.x = pointerOffset.current.x;
    spinGroupRef.current.rotation.y = pointerOffset.current.y;
  });

  const modelScale = isMobile ? 1.35 : 1.75;

  return (
    <group ref={spinGroupRef} position={[0, -0.05, 0]}>
      <Center>
        <primitive object={scene} scale={modelScale} />
      </Center>
    </group>
  );
}

/**
 * Fallback loader component for 3D PC rig
 */
function LoaderPlaceholder() {
  return (
    <div className="hero3d-loading-overlay">
      <div className="hero3d-loader-spinner"></div>
      <span className="hero3d-loader-text">INITIALIZING 3D RIG...</span>
    </div>
  );
}

export default function Hero3DScene({ scrollTriggerRef }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="hero3d-scene-container">
      <Suspense fallback={<LoaderPlaceholder />}>
        <Canvas
          className="hero3d-canvas"
          camera={{
            position: isMobile ? [1.4, 0.4, 2.3] : [1.6, 0.45, 2.2],
            fov: isMobile ? 38 : 33,
            near: 0.1,
            far: 50,
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
        >
          {/* Ambient Foundation Light */}
          <ambientLight intensity={1.3} color="#202028" />

          {/* Warm Amber Key Light */}
          <directionalLight
            position={[4.5, 4.0, 3.5]}
            intensity={4.2}
            color="#F59E0B"
            castShadow
          />

          {/* Neutral Cool Fill Light */}
          <directionalLight
            position={[-4.0, 4.5, -2.0]}
            intensity={2.6}
            color="#E2E8F0"
          />

          {/* Front Detail Light */}
          <directionalLight
            position={[0.5, 1.8, 4.0]}
            intensity={2.0}
            color="#FFFFFF"
          />

          {/* Back Edge / Rim Light */}
          <directionalLight
            position={[-2.5, -1, -3.5]}
            intensity={2.0}
            color="#FBBF24"
          />

          {/* Subtle Interior Glow */}
          <pointLight
            position={[0, 0.05, 0.05]}
            intensity={2.8}
            distance={3.5}
            color="#F59E0B"
          />

          {/* PC Rig with GSAP Timeline and Continuous Rotation */}
          <PCModel scrollTriggerRef={scrollTriggerRef} isMobile={isMobile} />

          {/* Soft Ground Contact Shadow */}
          <ContactShadows
            position={[0, -0.80, 0]}
            opacity={0.82}
            scale={7.0}
            blur={2.2}
            far={3.5}
            frames={1}
            resolution={512}
            color="#000000"
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
