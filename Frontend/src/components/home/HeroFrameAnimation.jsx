import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './HeroFrameAnimation.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 96;

/**
 * Returns formatted frame path: /heroSection/HerosectionFrames/ezgif-frame-001.jpg ... 096.jpg
 */
const getFramePath = (index) => {
  const pad = String(index + 1).padStart(3, '0');
  return `/heroSection/HerosectionFrames/ezgif-frame-${pad}.jpg`;
};

export default function HeroFrameAnimation({ scrollTriggerRef, isScrolling }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const loadedFramesRef = useRef(new Set());
  const progressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const lastRenderedIndexRef = useRef(-1);
  const idleIntensityRef = useRef(1);
  const animFrameIdRef = useRef(null);
  const lastScrollTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    // Initialize frame image cache
    imagesRef.current = new Array(TOTAL_FRAMES);

    let isMounted = true;

    // Helper to load a single frame
    const loadFrame = (index) => {
      if (imagesRef.current[index]) return;
      const img = new Image();
      img.src = getFramePath(index);
      img.onload = () => {
        if (!isMounted) return;
        loadedFramesRef.current.add(index);
        // If this is the initial frame or target frame, trigger immediate render
        if (index === 0 && lastRenderedIndexRef.current === -1) {
          drawFrame(0);
        }
      };
      imagesRef.current[index] = img;
    };

    // 1. Immediately load first 10 frames for instant display
    for (let i = 0; i < Math.min(10, TOTAL_FRAMES); i++) {
      loadFrame(i);
    }

    // 2. Progressively load remaining frames in background
    let nextBatch = 10;
    const loadNextBatch = () => {
      if (!isMounted || nextBatch >= TOTAL_FRAMES) return;
      const end = Math.min(nextBatch + 8, TOTAL_FRAMES);
      for (let i = nextBatch; i < end; i++) {
        loadFrame(i);
      }
      nextBatch = end;
      if (nextBatch < TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNextBatch, { timeout: 200 });
        } else {
          setTimeout(loadNextBatch, 50);
        }
      }
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadNextBatch, { timeout: 200 });
    } else {
      setTimeout(loadNextBatch, 50);
    }

    // Setup high-DPI canvas resolution
    const resizeCanvas = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Force repaint current frame
      if (lastRenderedIndexRef.current >= 0) {
        drawFrame(lastRenderedIndexRef.current, true);
      } else if (loadedFramesRef.current.has(0)) {
        drawFrame(0, true);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw frame onto canvas with contain fit and subtle idle float
    const drawFrame = (frameIndex, forceRepaint = false) => {
      if (!canvas || !ctx) return;

      // Find nearest loaded frame if current target isn't loaded yet
      let activeIndex = frameIndex;
      if (!loadedFramesRef.current.has(activeIndex)) {
        for (let i = activeIndex - 1; i >= 0; i--) {
          if (loadedFramesRef.current.has(i)) {
            activeIndex = i;
            break;
          }
        }
      }

      const img = imagesRef.current[activeIndex];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      lastRenderedIndexRef.current = activeIndex;

      const cw = canvas.width;
      const ch = canvas.height;

      // Pure black canvas background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, cw, ch);

      // Aspect ratio contain calculation to preserve natural proportions without cropping or stretching
      const imgAspect = img.naturalWidth / img.naturalHeight || 16 / 9;
      const canvasAspect = cw / ch;

      let drawW, drawH, drawX, drawY;

      if (canvasAspect > imgAspect) {
        // Canvas is wider than 16:9 (e.g. ultra-wide display)
        drawH = ch;
        drawW = ch * imgAspect;
        drawX = (cw - drawW) / 2;
        drawY = (ch - drawH) / 2;
      } else {
        // Canvas is narrower/taller than 16:9 (standard screen or mobile dedicated zone)
        drawW = cw;
        drawH = cw / imgAspect;
        drawX = (cw - drawW) / 2;
        drawY = (ch - drawH) / 2;
      }

      // Subtle vertical idle breathing when stationary (only at initial/rested state)
      const time = performance.now() * 0.0015;
      const idleOffset = Math.sin(time) * 4 * idleIntensityRef.current;
      drawY += idleOffset;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    // Render loop using requestAnimationFrame
    const renderLoop = () => {
      if (!isMounted) return;

      // Smooth progress interpolation (lerp)
      const diff = targetProgressRef.current - progressRef.current;
      if (Math.abs(diff) > 0.0001) {
        progressRef.current += diff * 0.22;
        lastScrollTimeRef.current = Date.now();
        // Decay idle intensity during active scroll
        idleIntensityRef.current = Math.max(0, idleIntensityRef.current - 0.1);
      } else {
        progressRef.current = targetProgressRef.current;
        // Smoothly restore idle breathing when stationary
        if (Date.now() - lastScrollTimeRef.current > 150) {
          idleIntensityRef.current = Math.min(1, idleIntensityRef.current + 0.03);
        }
      }

      const targetFrame = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.floor(progressRef.current * (TOTAL_FRAMES - 1)))
      );

      drawFrame(targetFrame);

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    // GSAP ScrollTrigger binding to hero scroll track
    let ctxScroll;
    if (scrollTriggerRef?.current) {
      ctxScroll = gsap.context(() => {
        ScrollTrigger.create({
          trigger: scrollTriggerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            targetProgressRef.current = self.progress;
            lastScrollTimeRef.current = Date.now();
            idleIntensityRef.current = 0;
          },
        });
      });
    }

    return () => {
      isMounted = false;
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (ctxScroll) ctxScroll.revert();
    };
  }, [scrollTriggerRef]);

  return (
    <div className="hero-frame-wrapper">
      <canvas ref={canvasRef} className="hero-frame-canvas" />
    </div>
  );
}
