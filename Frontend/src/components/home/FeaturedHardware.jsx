import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/hardwareData';
import { useShop } from '../../context/ShopContext';
import { ArrowRight, ShoppingCart, Star, Heart } from 'lucide-react';
import './FeaturedHardware.css';

export default function FeaturedHardware() {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  // Take first product as the large feature hero, and next 2 as the side stack
  const heroProduct = filtered[0] || PRODUCTS[0];
  const sideProducts = filtered.slice(1, 3);

  const isHeroWishlisted = isInWishlist(heroProduct.id);

  return (
    <section className="featured-section">
      <div className="container">
        
        {/* Header */}
        <div className="featured-header">
          <div>
            <span className="section-subtitle">CURATED SELECTION</span>
            <h2 className="section-title">FEATURED HARDWARE</h2>
          </div>

          {/* Filter Pills */}
          <div className="featured-category-pills">
            <button
              type="button"
              className={`pill-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Components
            </button>
            <button
              type="button"
              className={`pill-btn ${activeCategory === 'gpus' ? 'active' : ''}`}
              onClick={() => setActiveCategory('gpus')}
            >
              Graphics Cards
            </button>
            <button
              type="button"
              className={`pill-btn ${activeCategory === 'cpus' ? 'active' : ''}`}
              onClick={() => setActiveCategory('cpus')}
            >
              Processors
            </button>
            <button
              type="button"
              className={`pill-btn ${activeCategory === 'prebuilt' ? 'active' : ''}`}
              onClick={() => setActiveCategory('prebuilt')}
            >
              Custom PCs
            </button>
          </div>
        </div>

        {/* Asymmetric / Editorial Hardware Showcase */}
        <div className="editorial-showcase-grid">
          
          {/* Main Large Hero Feature Card */}
          <div className="editorial-hero-card">
            <div className="hero-card-media">
              <img src={heroProduct.image} alt={heroProduct.name} className="hero-product-img" />
              {heroProduct.badge && (
                <span className="editorial-badge">{heroProduct.badge}</span>
              )}
              <button
                type="button"
                className={`editorial-heart-btn ${isHeroWishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(heroProduct)}
                aria-label="Save to wishlist"
              >
                <Heart size={18} fill={isHeroWishlisted ? "var(--accent-red)" : "none"} />
              </button>
            </div>

            <div className="hero-card-body">
              <div className="hero-card-meta">
                <span className="hero-card-cat">{heroProduct.categoryLabel}</span>
                <div className="hero-card-rating">
                  <Star size={13} fill="#F59E0B" className="star-gold" />
                  <span>{heroProduct.rating}</span>
                  <span className="reviews-text">({heroProduct.reviews} reviews)</span>
                </div>
              </div>

              <h3 className="hero-card-heading">{heroProduct.name}</h3>
              <p className="hero-card-description">{heroProduct.description}</p>

              {/* Spec Chips */}
              <div className="hero-specs-wrapper">
                {heroProduct.specs.map((spec, i) => (
                  <span key={i} className="hero-spec-tag">{spec}</span>
                ))}
              </div>

              <div className="hero-bottom-row">
                <div className="hero-price-wrap">
                  <span className="hero-price">${heroProduct.price.toLocaleString()}</span>
                  {heroProduct.originalPrice && (
                    <span className="hero-old-price">${heroProduct.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                <button
                  type="button"
                  className="btn-primary hero-buy-btn"
                  onClick={() => addToCart(heroProduct)}
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Side Stack of Secondary Cards */}
          <div className="editorial-side-stack">
            {sideProducts.map((prod) => {
              const isSideWishlisted = isInWishlist(prod.id);
              return (
                <div key={prod.id} className="editorial-mini-card">
                  <div className="mini-card-thumb-wrap">
                    <img src={prod.image} alt={prod.name} className="mini-thumb-img" />
                  </div>

                  <div className="mini-card-content">
                    <div className="mini-card-meta">
                      <span className="mini-card-cat">{prod.categoryLabel}</span>
                      <div className="mini-card-rating">
                        <Star size={12} fill="#F59E0B" className="star-gold" />
                        <span>{prod.rating}</span>
                      </div>
                    </div>

                    <h4 className="mini-card-title">{prod.name}</h4>

                    <div className="mini-specs-list">
                      {prod.specs.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="mini-spec-pill">{s}</span>
                      ))}
                    </div>

                    <div className="mini-bottom-row">
                      <span className="mini-price">${prod.price.toLocaleString()}</span>
                      
                      <div className="mini-action-group">
                        <button
                          type="button"
                          className="mini-heart-btn"
                          onClick={() => toggleWishlist(prod)}
                          aria-label="Wishlist"
                        >
                          <Heart size={15} fill={isSideWishlisted ? "var(--accent-red)" : "none"} />
                        </button>
                        <button
                          type="button"
                          className="btn-secondary mini-add-btn"
                          onClick={() => addToCart(prod)}
                        >
                          <ShoppingCart size={14} />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Bottom CTA to Shop */}
        <div className="featured-explore-link">
          <Link to="/shop" className="btn-secondary">
            <span>View All Hardware in Shop</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
