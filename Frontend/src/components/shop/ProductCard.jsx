import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './ProductCard.css';

export default function ProductCard({ product, index, variant = 'standard', onQuickView }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  
  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);
  const indexNumber = typeof index === 'number' ? String(index + 1).padStart(2, '0') : '01';

  const handleNavigateToDetails = (e) => {
    if (e) e.stopPropagation();
    navigate(`/product/${productId}`);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  if (variant === 'flagship') {
    return (
      <div className="product-card product-card-flagship" onClick={handleNavigateToDetails}>
        <div className="product-card-media flagship-media">
          <img src={product.image} alt={product.name} className="product-card-image" loading="lazy" />
          <button
            type="button"
            className={`product-card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} fill={isWishlisted ? "var(--accent-red)" : "none"} />
          </button>
        </div>

        <div className="product-card-body flagship-body">
          <div className="product-card-meta">
            <span className="product-card-category">{product.categoryLabel}</span>
            <div className="product-card-rating">
              <Star size={13} fill="#F59E0B" className="star-amber" />
              <span>{product.rating}</span>
              {product.reviews && <span className="product-card-reviews">({product.reviews} reviews)</span>}
            </div>
          </div>

          <h3 className="product-card-title flagship-title">{product.name}</h3>
          {product.description && <p className="product-card-desc">{product.description}</p>}

          {product.specs && product.specs.length > 0 && (
            <div className="product-card-specs">
              {product.specs.slice(0, 3).map((spec, i) => (
                <div key={i} className="product-card-spec-item">
                  <span className="spec-dot">•</span>
                  <span className="spec-text">{spec}</span>
                </div>
              ))}
            </div>
          )}

          <div className="product-card-footer">
            <div className="product-card-price-wrap">
              <span className="product-card-price">${product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="product-card-old-price">${product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <button
              type="button"
              className="product-card-cart-btn"
              onClick={handleAddToCartClick}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={15} />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="product-card product-card-compact" onClick={handleNavigateToDetails}>
        <div className="product-card-media compact-media">
          <img src={product.image} alt={product.name} className="product-card-image" loading="lazy" />
          <button
            type="button"
            className={`product-card-wishlist-btn compact-wishlist ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={14} fill={isWishlisted ? "var(--accent-red)" : "none"} />
          </button>
        </div>

        <div className="product-card-body compact-body">
          <div className="product-card-meta">
            <span className="product-card-category">{product.categoryLabel}</span>
            <div className="product-card-rating">
              <Star size={12} fill="#F59E0B" className="star-amber" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h4 className="product-card-title compact-title">{product.name}</h4>

          {product.specs && product.specs.length > 0 && (
            <div className="product-card-specs compact-specs">
              {product.specs.slice(0, 2).map((spec, i) => (
                <div key={i} className="product-card-spec-item">
                  <span className="spec-dot">•</span>
                  <span className="spec-text">{spec}</span>
                </div>
              ))}
            </div>
          )}

          <div className="product-card-footer compact-footer">
            <span className="product-card-price compact-price">${product.price.toLocaleString()}</span>
            <button
              type="button"
              className="product-card-cart-btn compact-btn"
              onClick={handleAddToCartClick}
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart size={13} />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-card product-card-standard" onClick={handleNavigateToDetails}>
      
      {/* Tiny vertical hardware index marker on left edge */}
      <span className="product-card-index" aria-hidden="true">{indexNumber}</span>

      {/* Edge-to-edge Product Image Stage */}
      <div className="product-card-media standard-media" onClick={handleNavigateToDetails}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-card-image" 
          loading="lazy" 
        />
        
        {/* Subtle Dark Cinematic Overlay */}
        <div className="product-card-overlay" />

        {/* Dual Actions on Hover over Image */}
        <div className="product-card-hover-actions">
          <button
            type="button"
            className="product-card-action-btn action-quickview"
            onClick={handleQuickViewClick}
            aria-label={`Quick view ${product.name}`}
          >
            <span>QUICK VIEW</span>
          </button>

          <button
            type="button"
            className="product-card-action-btn action-details"
            onClick={handleNavigateToDetails}
            aria-label={`View details for ${product.name}`}
          >
            <span>VIEW DETAILS</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Wishlist Button Floating over Image */}
        <button
          type="button"
          className={`product-card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={15} fill={isWishlisted ? "var(--accent-red)" : "none"} />
        </button>
      </div>

      {/* Hardware Spec Card Body */}
      <div className="product-card-body">
        
        {/* Minimal Category Label & Rating */}
        <div className="product-card-meta">
          <span className="product-card-category">{product.categoryLabel}</span>
          <div className="product-card-rating">
            <Star size={12} fill="#F59E0B" className="star-amber" />
            <span>{product.rating}</span>
            {product.reviews && <span className="product-card-reviews">({product.reviews})</span>}
          </div>
        </div>

        {/* Product Title (Navigates to /product/:id) */}
        <h3 className="product-card-title" onClick={handleNavigateToDetails}>
          {product.name}
        </h3>

        {/* 2 Concise Key Specifications */}
        {product.specs && product.specs.length > 0 && (
          <div className="product-card-specs">
            {product.specs.slice(0, 2).map((spec, i) => (
              <div key={i} className="product-card-spec-item">
                <span className="spec-dot">•</span>
                <span className="spec-text">{spec}</span>
              </div>
            ))}
          </div>
        )}

        {/* Price Hierarchy & Compact Amber CTA */}
        <div className="product-card-footer">
          <div className="product-card-price-wrap">
            <span className="product-card-price">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="product-card-old-price">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <button
            type="button"
            className="product-card-cart-btn"
            onClick={handleAddToCartClick}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={14} />
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  );
}
