import SEO from '../components/common/SEO';
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
      <SEO
        title="GearGrid — Premium PC Hardware & Custom Builds"
        description="High-performance desktop graphics cards, high-bandwidth processors, OLED displays, and precision-engineered custom gaming rigs. Engineered for zero compromises."
        canonical="https://geargrid-delta.vercel.app/"
        ogImage="https://geargrid-delta.vercel.app/heroSection/heroPc.png"
      />
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
