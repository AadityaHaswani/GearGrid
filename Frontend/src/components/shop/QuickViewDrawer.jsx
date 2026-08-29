import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingCart, Star, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
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

  const isWishlisted = isInWishlist(product.id);

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
    navigate(`/product/${product.id}`);
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
        aria-label={`Quick view of ${product.name}`}
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
              src={product.image} 
              alt={product.name} 
              className="quickview-image" 
            />
            <div className="quickview-media-overlay" />
          </div>

          {/* Product Details Section */}
          <div className="quickview-body">
            
            {/* Category & Rating Row */}
            <div className="quickview-meta-row">
              <span className="quickview-category">{product.categoryLabel}</span>
              <div className="quickview-rating">
                <Star size={13} fill="#F59E0B" className="star-amber" />
                <span>{product.rating}</span>
                {product.reviews && (
                  <span className="quickview-reviews">({product.reviews} reviews)</span>
                )}
              </div>
            </div>

            {/* Title & Wishlist Header */}
            <div className="quickview-title-wrap">
              <h2 className="quickview-title">{product.name}</h2>
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
                ${(product.price * quantity).toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="quickview-old-price">
                  ${(product.originalPrice * quantity).toLocaleString()}
                </span>
              )}
              {quantity > 1 && (
                <span className="quickview-unit-price">
                  (${product.price.toLocaleString()} each)
                </span>
              )}
            </div>

            {/* Key Specifications (3-4 specs) */}
            {product.specs && product.specs.length > 0 && (
              <div className="quickview-specs-box">
                <h4 className="quickview-specs-title">Hardware Specifications</h4>
                <div className="quickview-specs-list">
                  {product.specs.slice(0, 4).map((spec, idx) => (
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
                <span>ADD TO CART • ${(product.price * quantity).toLocaleString()}</span>
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
