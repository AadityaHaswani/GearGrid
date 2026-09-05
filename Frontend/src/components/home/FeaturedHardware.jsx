import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/hardwareData';
import { getProducts } from '../../services/product.api';
import ProductCard from '../shop/ProductCard';
import { ArrowRight } from 'lucide-react';
import './FeaturedHardware.css';

export default function FeaturedHardware() {
  const [items, setItems] = useState(PRODUCTS);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedHardware = async () => {
      try {
        let products = [];

        // Primary query: Fetch systems and workstations category
        const catRes = await getProducts({ category: 'custom-systems-workstations', limit: 12 });
        if (catRes.data?.data?.products?.length > 0) {
          products = catRes.data.data.products;
        } else {
          // Fallback query if category slug differs
          const allRes = await getProducts({ limit: 40 });
          if (allRes.data?.data?.products?.length > 0) {
            products = allRes.data.data.products;
          }
        }

        if (!isMounted || products.length === 0) return;

        // Identify gaming configuration product vs workstation / professional systems
        const isGamingProduct = (p) => {
          const title = (p.title || p.name || '').toLowerCase();
          const desc = (p.description || '').toLowerCase();
          return (
            title.includes('gaming rig') ||
            title.includes('gaming pc') ||
            title.includes('gaming configuration') ||
            title.includes('apex gaming') ||
            desc.includes('gaming battle station') ||
            (title.includes('gaming') && !title.includes('monitor') && !title.includes('mouse') && !title.includes('keyboard'))
          );
        };

        const gamingSystem = products.find(isGamingProduct);
        const workstationSystems = products.filter((p) => !isGamingProduct(p));

        if (gamingSystem && workstationSystems.length >= 2) {
          // Showcase balanced between professional/workstation and gaming hardware:
          // Visual selection: 2 professional/workstation systems + exactly 1 gaming configuration
          // Left side (flagship): Primary professional workstation
          // Right side (supporting): Gaming configuration + secondary professional workstation
          setItems([workstationSystems[0], gamingSystem, workstationSystems[1]]);
        } else if (products.length >= 3) {
          setItems(products.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load featured hardware products:', err);
      }
    };

    fetchFeaturedHardware();

    return () => {
      isMounted = false;
    };
  }, []);

  const flagshipProduct = items[0] || PRODUCTS[0];
  const supportingProducts = items.slice(1, 3);

  return (
    <section className="featured-hardware-section">
      <div className="container">
        
        {/* Section Header */}
        <div className="featured-section-header">
          <div className="featured-header-info">
            <span className="featured-section-label">FEATURED HARDWARE</span>
            <h2 className="featured-main-heading">ENGINEERED TO PERFORM.</h2>
            <p className="featured-sub-heading">
              Hand-selected flagship components built for relentless stability, ultra-fast clock speeds, and extreme visual fidelity.
            </p>
          </div>

          <Link to="/shop" className="featured-header-link">
            <span>Explore All Hardware</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Editorial Showcase Layout: 1 Flagship + 2 Supporting */}
        <div className="featured-editorial-grid">
          
          {/* Flagship Hero Product */}
          <div className="featured-flagship-slot">
            <ProductCard product={flagshipProduct} variant="flagship" />
          </div>

          {/* Supporting Products Stack */}
          <div className="featured-supporting-stack">
            {supportingProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} variant="compact" />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
