import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PRODUCTS } from '../../data/hardwareData';
import { useShop } from '../../context/ShopContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  ShoppingCart, 
  Star, 
  Heart 
} from 'lucide-react';
import './ArsenalShowroom.css';

const ARSENAL_CATEGORIES = [
  { id: 'all', label: 'All Arsenal' },
  { id: 'gpus', label: 'GPUs' },
  { id: 'cpus', label: 'CPUs' },
  { id: 'monitors', label: 'Displays' },
  { id: 'peripherals', label: 'Peripherals' },
  { id: 'prebuilt', label: 'Systems' }
];

export default function ArsenalShowroom() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const stageRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const filteredProducts = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === activeCategory);

  const total = filteredProducts.length;

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const currentProduct = filteredProducts[currentIndex] || filteredProducts[0];
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;
  const prevProduct = filteredProducts[prevIndex];
  const nextProduct = filteredProducts[nextIndex];

  const isWishlisted = currentProduct ? isInWishlist(currentProduct.id) : false;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  if (!currentProduct) return null;

  return (
    <section className="arsenal-showroom-section">
      <div className="container">
        
        {/* Editorial Section Header */}
        <div className="arsenal-header">
          <div className="arsenal-title-group">
            <h2 className="arsenal-main-title">THE ARSENAL</h2>
            <p className="arsenal-subtitle">HARDWARE SELECTED FOR THE OBSESSED.</p>
          </div>

          {/* Category Selector Tabs */}
          <div className="arsenal-categories">
            {ARSENAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`arsenal-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cinematic Showroom Stage */}
        <div 
          className="arsenal-stage"
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Subtle Mouse-following Spotlight */}
          <div 
            className={`arsenal-spotlight ${isHovered ? 'active' : ''}`}
            style={{
              background: `radial-gradient(circle 380px at ${mousePos.x}% ${mousePos.y}%, rgba(245, 158, 11, 0.12) 0%, transparent 80%)`
            }}
          />

          {/* Previous Product Peek */}
          {total > 1 && (
            <button 
              type="button" 
              className="arsenal-peek-card peek-prev"
              onClick={handlePrev}
              aria-label={`Previous: ${prevProduct.name}`}
            >
              <img src={prevProduct.image} alt={prevProduct.name} className="peek-image" />
              <div className="peek-overlay">
                <ChevronLeft size={22} />
              </div>
            </button>
          )}

          {/* Active Product Showcase Core */}
          <div className="arsenal-active-showcase">
            
            {/* Massive Hero Product Visual */}
            <div className="arsenal-visual-box">
              <div className="arsenal-img-container">
                <img 
                  key={currentProduct.id} 
                  src={currentProduct.image} 
                  alt={currentProduct.name} 
                  className="arsenal-main-image"
                />
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                className={`arsenal-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(currentProduct)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={isWishlisted ? "var(--accent-red)" : "none"} />
              </button>
            </div>

            {/* Editorial Product Information Column */}
            <div className="arsenal-info-column" key={`info-${currentProduct.id}`}>
              <div className="arsenal-meta-line">
                <span className="arsenal-cat-label">{currentProduct.categoryLabel}</span>
                <div className="arsenal-rating-badge">
                  <Star size={13} fill="#F59E0B" className="star-amber" />
                  <span>{currentProduct.rating}</span>
                  {currentProduct.reviews && (
                    <span className="rating-review-count">({currentProduct.reviews} reviews)</span>
                  )}
                </div>
              </div>

              <h3 className="arsenal-product-title">{currentProduct.name}</h3>

              {currentProduct.description && (
                <p className="arsenal-product-desc">{currentProduct.description}</p>
              )}

              {/* Minimalist Key Specs */}
              {currentProduct.specs && (
                <div className="arsenal-specs-list">
                  {currentProduct.specs.map((spec, idx) => (
                    <div key={idx} className="arsenal-spec-item">
                      <span className="spec-dot">•</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Price & Dual Action Bar */}
              <div className="arsenal-action-bar">
                <div className="arsenal-price-group">
                  <span className="arsenal-price">${currentProduct.price.toLocaleString()}</span>
                  {currentProduct.originalPrice && (
                    <span className="arsenal-old-price">${currentProduct.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                <div className="arsenal-buttons-group">
                  <Link 
                    to={`/shop?category=${currentProduct.category}`}
                    className="btn-primary arsenal-view-btn"
                  >
                    <span>VIEW PRODUCT</span>
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    type="button"
                    className="btn-secondary arsenal-cart-btn"
                    onClick={() => addToCart(currentProduct)}
                    aria-label={`Add ${currentProduct.name} to cart`}
                  >
                    <ShoppingCart size={15} />
                    <span>ADD TO CART</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Next Product Peek */}
          {total > 1 && (
            <button 
              type="button" 
              className="arsenal-peek-card peek-next"
              onClick={handleNext}
              aria-label={`Next: ${nextProduct.name}`}
            >
              <img src={nextProduct.image} alt={nextProduct.name} className="peek-image" />
              <div className="peek-overlay">
                <ChevronRight size={22} />
              </div>
            </button>
          )}

        </div>

        {/* Progress & Showroom Controls Footer */}
        <div className="arsenal-footer-controls">
          <div className="arsenal-counter">
            <span className="current-num">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="divider">/</span>
            <span className="total-num">{String(total).padStart(2, '0')}</span>
          </div>

          <div className="arsenal-progress-track">
            <div 
              className="arsenal-progress-fill"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>

          <div className="arsenal-nav-arrows">
            <button 
              type="button" 
              className="nav-arrow-btn"
              onClick={handlePrev}
              aria-label="Previous product"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              type="button" 
              className="nav-arrow-btn"
              onClick={handleNext}
              aria-label="Next product"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
