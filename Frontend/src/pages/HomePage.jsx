import Hero from '../components/home/Hero';
import FeaturedHardware from '../components/home/FeaturedHardware';
import CategoryGrid from '../components/home/CategoryGrid';
import RigSpotlight from '../components/home/RigSpotlight';
import BenchmarkSection from '../components/home/BenchmarkSection';
import WhyGearGrid from '../components/home/WhyGearGrid';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page-root">
      {/* Main Home Page Sections */}
      <Hero />
      <FeaturedHardware />
      <CategoryGrid />
      <RigSpotlight />
      <BenchmarkSection />
      <WhyGearGrid />
    </div>
  );
}
