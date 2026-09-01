import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingCart, Star, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatCurrency';
import './QuickViewDrawer.css';

export default function QuickViewDrawer({ product, isOpen, onClose }) {
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [quantity, setQuantity] = useState(1);

  // Reset quantity whenever the selected product changes or drawer opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, product]);

  // Lock background scrolling and handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) {
    return null;
  }

  const productId = product._id || product.id;
  const isWishlisted = isInWishlist(productId);

  const title = product.title || product.name || 'Hardware Component';
  const categoryLabel = product.category?.name || product.categoryLabel || product.brand || 'Hardware';
  const price = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : (product.price || 0);
  const originalPrice = product.originalPrice || (product.discountPrice && product.discountPrice < product.price ? product.price : null);
  const rating = product.rating || 4.8;
  const reviews = product.numReviews ?? product.reviews;
  const specs = product.specs && product.specs.length > 0
    ? product.specs
    : [product.brand, product.category?.name, product.stock ? `${product.stock} in stock` : 'In Stock'].filter(Boolean);
  const image = (product.images && product.images.length > 0 && product.images[0]?.url)
    ? product.images[0].url
    : (product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80');

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < 10) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleViewFullProduct = () => {
    onClose();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="quickview-wrapper">
      {/* Backdrop overlay */}
      <div 
        className="quickview-backdrop" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      {/* Slide-over Panel */}
      <div 
        className="quickview-panel" 
        role="dialog" 
        aria-modal="true" 
        aria-label={`Quick view of ${title}`}
      >
        {/* Close Button */}
        <button 
          type="button" 
          className="quickview-close-btn" 
          onClick={onClose}
          aria-label="Close Quick View"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div className="quickview-content">
          
          {/* Top Product Image Stage */}
          <div className="quickview-media">
            <img 
              src={image} 
              alt={title} 
              className="quickview-image" 
            />
            <div className="quickview-media-overlay" />
          </div>

          {/* Product Details Section */}
          <div className="quickview-body">
            
            {/* Category & Rating Row */}
            <div className="quickview-meta-row">
              <span className="quickview-category">{categoryLabel}</span>
              <div className="quickview-rating">
                <Star size={13} fill="#F59E0B" className="star-amber" />
                <span>{rating}</span>
                {reviews ? (
                  <span className="quickview-reviews">({reviews} reviews)</span>
                ) : null}
              </div>
            </div>

            {/* Title & Wishlist Header */}
            <div className="quickview-title-wrap">
              <h2 className="quickview-title">{title}</h2>
              <button
                type="button"
                className={`quickview-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={isWishlisted ? "var(--accent-red)" : "none"} />
              </button>
            </div>

            {/* Stock Availability */}
            <div className="quickview-stock-indicator">
              <span className="stock-dot" />
              <span>In Stock • Ready for Same-Day Dispatch</span>
            </div>

            {/* Price Section */}
            <div className="quickview-price-section">
              <span className="quickview-current-price">
                {formatPrice(price * quantity)}
              </span>
              {originalPrice && (
                <span className="quickview-old-price">
                  {formatPrice(originalPrice * quantity)}
                </span>
              )}
              {quantity > 1 && (
                <span className="quickview-unit-price">
                  ({formatPrice(price)} each)
                </span>
              )}
            </div>

            {/* Key Specifications (3-4 specs) */}
            {specs && specs.length > 0 && (
              <div className="quickview-specs-box">
                <h4 className="quickview-specs-title">Hardware Specifications</h4>
                <div className="quickview-specs-list">
                  {specs.slice(0, 4).map((spec, idx) => (
                    <div key={idx} className="quickview-spec-item">
                      <span className="spec-amber-bullet">•</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="quickview-quantity-row">
              <span className="quantity-label">Quantity</span>
              <div className="quantity-controls">
                <button 
                  type="button" 
                  className="qty-btn" 
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={13} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  type="button" 
                  className="qty-btn" 
                  onClick={handleIncrease}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="quickview-actions">
              <button 
                type="button" 
                className="quickview-add-cart-btn"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={16} />
                <span>ADD TO CART • {formatPrice(price * quantity)}</span>
              </button>

              <button 
                type="button" 
                className="quickview-full-view-btn"
                onClick={handleViewFullProduct}
              >
                <span>VIEW FULL PRODUCT</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Hardware Guarantees Trust Badges */}
            <div className="quickview-trust-strip">
              <div className="quickview-trust-item">
                <ShieldCheck size={14} className="trust-icon" />
                <span>3-Year Hardware Warranty</span>
              </div>
              <div className="quickview-trust-item">
                <Truck size={14} className="trust-icon" />
                <span>Insured Fragile Transit</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
