import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatCurrency';
import './ProductCard.css';

const getImageForProduct = (prod) => {
  if (prod.images && prod.images.length > 0 && prod.images[0]?.url) {
    return prod.images[0].url;
  }
  if (prod.image) return prod.image;
  const cat = (prod.category?.slug || prod.category?.name || prod.category || prod.title || '').toLowerCase();
  if (cat.includes('headphone') || cat.includes('audio') || cat.includes('sony')) {
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('keyboard') || cat.includes('keychron') || cat.includes('g413')) {
    return 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('mouse') || cat.includes('deathadder') || cat.includes('superlight')) {
    return 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('monitor') || cat.includes('display') || cat.includes('oled')) {
    return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('gpu') || cat.includes('rtx') || cat.includes('geforce')) {
    return 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('cpu') || cat.includes('ryzen') || cat.includes('intel')) {
    return 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80';
  }
  return 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';
};

export default function ProductCard({ product, index, variant = 'standard', onQuickView }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  
  if (!product) return null;

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);
  const indexNumber = typeof index === 'number' ? String(index + 1).padStart(2, '0') : '01';

  const title = product.title || product.name || 'Hardware Component';
  const categoryLabel = product.category?.name || product.categoryLabel || product.brand || 'Hardware';
  const price = typeof product.price === 'number' ? product.price : 0;
  const originalPrice = product.originalPrice || (product.discountPrice && product.discountPrice < product.price ? product.price : null);
  const displayPrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : price;
  const rating = product.rating || 4.8;
  const reviews = product.numReviews ?? product.reviews;
  const description = product.description || '';
  const specs = product.specs && product.specs.length > 0
    ? product.specs
    : [product.brand, product.category?.name, product.stock ? `${product.stock} in stock` : 'In Stock'].filter(Boolean);
  const image = getImageForProduct(product);

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
          <img src={image} alt={title} className="product-card-image" loading="lazy" />
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
            <span className="product-card-category">{categoryLabel}</span>
            <div className="product-card-rating">
              <Star size={13} fill="#F59E0B" className="star-amber" />
              <span>{rating}</span>
              {reviews ? <span className="product-card-reviews">({reviews} reviews)</span> : null}
            </div>
          </div>

          <h3 className="product-card-title flagship-title">{title}</h3>
          {description && <p className="product-card-desc">{description}</p>}

          {specs && specs.length > 0 && (
            <div className="product-card-specs">
              {specs.slice(0, 3).map((spec, i) => (
                <div key={i} className="product-card-spec-item">
                  <span className="spec-dot">•</span>
                  <span className="spec-text">{spec}</span>
                </div>
              ))}
            </div>
          )}

          <div className="product-card-footer">
            <div className="product-card-price-wrap">
              <span className="product-card-price">{formatPrice(displayPrice)}</span>
              {originalPrice && (
                <span className="product-card-old-price">{formatPrice(originalPrice)}</span>
              )}
            </div>

            <button
              type="button"
              className="product-card-cart-btn"
              onClick={handleAddToCartClick}
              aria-label={`Add ${title} to cart`}
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
          <img src={image} alt={title} className="product-card-image" loading="lazy" />
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
            <span className="product-card-category">{categoryLabel}</span>
            <div className="product-card-rating">
              <Star size={12} fill="#F59E0B" className="star-amber" />
              <span>{rating}</span>
            </div>
          </div>

          <h4 className="product-card-title compact-title">{title}</h4>

          {specs && specs.length > 0 && (
            <div className="product-card-specs compact-specs">
              {specs.slice(0, 2).map((spec, i) => (
                <div key={i} className="product-card-spec-item">
                  <span className="spec-dot">•</span>
                  <span className="spec-text">{spec}</span>
                </div>
              ))}
            </div>
          )}

          <div className="product-card-footer compact-footer">
            <span className="product-card-price compact-price">{formatPrice(displayPrice)}</span>
            <button
              type="button"
              className="product-card-cart-btn compact-btn"
              onClick={handleAddToCartClick}
              aria-label={`Add ${title} to cart`}
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
          src={image} 
          alt={title} 
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
            aria-label={`Quick view ${title}`}
          >
            <span>QUICK VIEW</span>
          </button>

          <button
            type="button"
            className="product-card-action-btn action-details"
            onClick={handleNavigateToDetails}
            aria-label={`View details for ${title}`}
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
          <span className="product-card-category">{categoryLabel}</span>
          <div className="product-card-rating">
            <Star size={12} fill="#F59E0B" className="star-amber" />
            <span>{rating}</span>
            {reviews ? <span className="product-card-reviews">({reviews})</span> : null}
          </div>
        </div>

        {/* Product Title (Navigates to /product/:id) */}
        <h3 className="product-card-title" onClick={handleNavigateToDetails}>
          {title}
        </h3>

        {/* 2 Concise Key Specifications */}
        {specs && specs.length > 0 && (
          <div className="product-card-specs">
            {specs.slice(0, 2).map((spec, i) => (
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
            <span className="product-card-price">{formatPrice(displayPrice)}</span>
            {originalPrice && (
              <span className="product-card-old-price">{formatPrice(originalPrice)}</span>
            )}
          </div>

          <button
            type="button"
            className="product-card-cart-btn"
            onClick={handleAddToCartClick}
            aria-label={`Add ${title} to cart`}
          >
            <ShoppingCart size={14} />
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  );
}
