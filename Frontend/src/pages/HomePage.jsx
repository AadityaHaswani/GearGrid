import Hero from '../components/home/Hero';
import CategoryGrid from '../components/home/CategoryGrid';
import FeaturedHardware from '../components/home/FeaturedHardware';
import RigSpotlight from '../components/home/RigSpotlight';
import BenchmarkSection from '../components/home/BenchmarkSection';
import IntroVideo from '../components/home/IntroVideo';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page-root">
      {/* Cinematic Opening Intro */}
      <IntroVideo />

      {/* Main Home Page Sections */}
      <Hero />
      <CategoryGrid />
      <FeaturedHardware />
      <RigSpotlight />
      <BenchmarkSection />
    </div>
  );
}
