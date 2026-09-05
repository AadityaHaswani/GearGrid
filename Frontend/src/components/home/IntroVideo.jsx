import { useRef, useEffect } from 'react';
import { FastForward } from 'lucide-react';
import './IntroVideo.css';

export default function IntroVideo({ onComplete }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playVideo = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    playVideo();
    video.addEventListener('loadeddata', playVideo);
    video.addEventListener('canplay', playVideo);

    return () => {
      video.removeEventListener('loadeddata', playVideo);
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="intro-video-wrapper">
      <video
        ref={videoRef}
        src="/videos/bro_enchance_its_quality_witho.mp4"
        className="intro-video-element"
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onEnded={onComplete}
      />

      <button 
        type="button" 
        className="intro-skip-btn"
        onClick={handleSkip}
        aria-label="Skip Intro"
      >
        <span>Skip Intro</span>
        <FastForward size={16} />
      </button>
    </div>
  );
}
