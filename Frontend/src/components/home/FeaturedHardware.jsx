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
    getProducts({ limit: 4 })
      .then((res) => {
        if (isMounted && res.data?.data?.products?.length > 0) {
          setItems(res.data.data.products);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
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
              <ProductCard key={product.id} product={product} variant="compact" />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
