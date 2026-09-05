import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, ShieldCheck, Zap, Truck, ChevronDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroFrameAnimation from './HeroFrameAnimation';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroTrackRef = useRef(null);
  const headerBlockRef = useRef(null);
  const actionsBlockRef = useRef(null);
  const scrollHintRef = useRef(null);

  useEffect(() => {
    if (!heroTrackRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Fade out the "Scroll to Disassemble" hint early in scroll
      if (scrollHintRef.current) {
        gsap.to(scrollHintRef.current, {
          opacity: 0,
          y: 20,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroTrackRef.current,
            start: 'top top',
            end: 'top -15%',
            scrub: true,
          },
        });
      }

      // 2. Editorial typography and action controls cleanly fade out as disassembly begins
      if (headerBlockRef.current) {
        gsap.to(headerBlockRef.current, {
          opacity: 0,
          y: -30,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroTrackRef.current,
            start: 'top top',
            end: 'top -22%',
            scrub: true,
          },
        });
      }

      if (actionsBlockRef.current) {
        gsap.to(actionsBlockRef.current, {
          opacity: 0,
          y: 30,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: heroTrackRef.current,
            start: 'top top',
            end: 'top -22%',
            scrub: true,
          },
        });
      }
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero-scroll-track" ref={heroTrackRef}>
      {/* Sticky Fullscreen Cinematic Hero Viewport */}
      <div className="hero-sticky-viewport">
        
        {/* Fullscreen 96-Frame Canvas Product Animation */}
        <div className="hero-canvas-zone">
          <HeroFrameAnimation scrollTriggerRef={heroTrackRef} />
        </div>

        {/* 1. TOP BLOCK: Eyebrow + Heading + Supporting Copy */}
        <div className="hero-header-block" ref={headerBlockRef}>
          <div className="hero-tag-pill">
            <span className="hero-dot"></span>
            <span>NEXT-GENERATION HARDWARE</span>
          </div>

          <h1 className="hero-heading">
            <span className="hero-heading-line">BUILD THE MACHINE.</span>
            <span className="hero-heading-line hero-heading-accent">POWER THE EXPERIENCE.</span>
          </h1>

          <p className="hero-description hero-description-desktop">
            Engineered for pure performance and zero compromises. Discover verified flagship graphics cards, high-bandwidth processors, and precision-built custom battlestations.
          </p>
          <p className="hero-description hero-description-mobile">
            Engineered for pure performance. Flagship GPUs, high-speed processors, and custom rigs.
          </p>
        </div>

        {/* 2. ACTIONS BLOCK: Buttons + Trust Highlights */}
        <div className="hero-actions-block" ref={actionsBlockRef}>
          <div className="hero-actions-row">
            <Link to="/shop" className="btn-primary hero-btn">
              <span>EXPLORE HARDWARE</span>
              <ArrowRight size={17} />
            </Link>

            <Link to="/build" className="btn-secondary hero-btn">
              <Wrench size={17} />
              <span>BUILD YOUR RIG</span>
            </Link>
          </div>

          {/* Value Highlights */}
          <div className="hero-highlights-list">
            <div className="hero-highlight-item">
              <ShieldCheck size={14} className="highlight-icon" />
              <span>Official Warranty</span>
            </div>
            <div className="hero-highlight-divider"></div>
            <div className="hero-highlight-item">
              <Zap size={14} className="highlight-icon" />
              <span>RTX 50 & Ryzen 9000</span>
            </div>
            <div className="hero-highlight-divider"></div>
            <div className="hero-highlight-item">
              <Truck size={14} className="highlight-icon" />
              <span>Insured Shipping</span>
            </div>
          </div>
        </div>

        {/* 3. Subtle Bottom Scroll Hint */}
        <div className="hero-scroll-hint" ref={scrollHintRef}>
          <div className="hero-scroll-mouse">
            <div className="hero-scroll-wheel"></div>
          </div>
          <span className="hero-scroll-hint-text">SCROLL TO DISASSEMBLE</span>
          <ChevronDown size={14} className="hero-scroll-chevron" />
        </div>

      </div>
    </section>
  );
}
