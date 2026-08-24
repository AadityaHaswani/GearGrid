import { useState, useEffect, useRef } from 'react';
import { FastForward } from 'lucide-react';
import './IntroVideo.css';

const SESSION_KEY = 'geargrid_intro_played';

export default function IntroVideo({ onComplete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if intro has already played in this session
    const hasPlayed = sessionStorage.getItem(SESSION_KEY);
    if (hasPlayed) {
      if (onComplete) onComplete();
      return;
    }

    setIsPlaying(true);

    // Attempt video playback
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback if browser autoplay policies block video
        handleFinish();
      });
    }
  }, []);

  const handleFinish = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setIsFading(true);

    setTimeout(() => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    }, 600);
  };

  if (!isPlaying) return null;

  return (
    <div className={`intro-video-overlay ${isFading ? 'fading' : ''}`}>
      <video
        ref={videoRef}
        src="/videos/geargird-intro.mp4"
        className="intro-video-element"
        autoPlay
        muted
        playsInline
        onEnded={handleFinish}
      />

      {/* Skip Intro Button */}
      <button 
        type="button" 
        className="intro-skip-btn"
        onClick={handleFinish}
        aria-label="Skip Intro"
      >
        <span>Skip Intro</span>
        <FastForward size={16} />
      </button>
    </div>
  );
}
