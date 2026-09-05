import { useState, useEffect } from 'react';
import IntroVideo from '../home/IntroVideo';
import './IntroGate.css';

const SESSION_KEY = 'geargrid_intro_played';

export default function IntroGate({ children }) {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.location.search.includes('intro')) {
        return true;
      }
      return sessionStorage.getItem(SESSION_KEY) !== 'true';
    } catch {
      return false;
    }
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('intro')) {
      setShowIntro(true);
      setIsTransitioning(false);
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {}
    }
  }, []);

  const handleComplete = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // ignore
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setShowIntro(false);
      setIsTransitioning(false);
    }, 400);
  };

  if (showIntro) {
    return (
      <>
        {isTransitioning && <div className="intro-gate-content">{children}</div>}
        <div className={`intro-gate-container ${isTransitioning ? 'fade-out' : ''}`}>
          <IntroVideo onComplete={handleComplete} />
        </div>
      </>
    );
  }

  return <div className="intro-gate-content">{children}</div>;
}
