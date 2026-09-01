import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Heart, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Sliders, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatCurrency';
import './CartPage.css';

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    cartCount, 
    toggleWishlist, 
    isInWishlist,
    showToast 
  } = useShop();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');

    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError('Please enter a voucher code.');
      return;
    }

    if (code === 'GEARGRID10' || code === 'BUILDLAB' || code === 'AMBER10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      showToast('10% hardware discount applied to manifest.', 'amber');
    } else if (code === 'TITAN50') {
      setDiscountPercent(15);
      setPromoApplied(true);
      showToast('15% enthusiast discount applied to manifest.', 'amber');
    } else {
      setPromoError('Invalid code. Try "GEARGRID10".');
    }
  };

  const handleMoveToWishlist = (product) => {
    const pId = product._id || product.id;
    if (!isInWishlist(pId)) {
      toggleWishlist(product);
    }
    removeFromCart(pId);
    const pName = (product.title || product.name || 'Component').split('(')[0].trim();
    showToast(`Moved ${pName} to Wishlist`, 'amber');
  };

  const handleRemoveItem = (productId) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeFromCart(productId);
      setRemovingId(null);
    }, 240);
  };

  const discountAmount = Math.round((cartTotal * discountPercent) / 100);
  const finalTotal = Math.max(0, cartTotal - discountAmount);

  // Empty State
  if (cart.length === 0) {
    return (
      <div className="manifest-page-root">
        <div className="manifest-page-container">
          
          <div className="manifest-empty-wrapper">
            <div className="manifest-empty-visual">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="hardware-silhouette-svg">
                <rect x="2" y="2" width="20" height="20" rx="2" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.2" strokeDasharray="3 3"/>
                <path d="M6 18h12M6 14h12M6 10h12M6 6h12" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3" stroke="var(--accent-amber)" strokeWidth="1.5"/>
              </svg>
            </div>

            <span className="manifest-eyebrow">GEARGRID // BUILD MANIFEST</span>
            <h1 className="manifest-empty-heading">YOUR BUILD IS EMPTY.</h1>
            <p className="manifest-empty-sub">
              Start with the hardware that defines your machine.
            </p>

            <div className="manifest-empty-actions">
              <Link to="/shop" className="btn-primary manifest-cta-btn">
                <span>EXPLORE HARDWARE</span>
                <ArrowRight size={15} />
              </Link>
              <Link to="/build" className="btn-outline manifest-secondary-cta">
                <Sliders size={15} />
                <span>OPEN BUILD LAB</span>
              </Link>
            </div>

            <div className="manifest-empty-guarantees">
              <span>3-Year Hardware Warranty</span>
              <span className="guarantee-dot">•</span>
              <span>Complimentary Insured Freight</span>
              <span className="guarantee-dot">•</span>
              <span>100% Component Verification</span>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="manifest-page-root">
      <div className="manifest-page-container">
        
        {/* Manifest Header */}
        <header className="manifest-header">
          <div className="manifest-header-content">
            <span className="manifest-eyebrow">GEARGRID / BUILD MANIFEST</span>
            <div className="manifest-title-row">
              <h1 className="manifest-title">YOUR BUILD.</h1>
              <span className="manifest-item-count">
                [{cartCount.toString().padStart(2, '0')} {cartCount === 1 ? 'COMPONENT' : 'COMPONENTS'}]
              </span>
            </div>
          </div>

          <Link to="/shop" className="manifest-continue-link">
            <span>CONTINUE SHOPPING</span>
            <ArrowRight size={14} />
          </Link>
        </header>

        {/* 2-Column Engineering Layout */}
        <div className="manifest-layout-grid">
          
          {/* Left Column: Sequence of Hardware Manifest Rows */}
          <main className="manifest-items-column" aria-label="Hardware Manifest Sequence">
            <div className="manifest-items-sequence">
              
              {/* Continuous Accent Line */}
              <div className="manifest-sequence-line" />

              {cart.map(({ product, quantity }, index) => {
                const productId = product._id || product.id;
                const title = product.title || product.name || 'Hardware Component';
                const categoryLabel = product.category?.name || product.categoryLabel || product.brand || 'HARDWARE COMPONENT';
                const price = product.price || 0;
                const image = (product.images && product.images[0]?.url) || product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';
                const itemTotal = price * quantity;
                const isRemoving = removingId === productId;
                const indexStr = (index + 1).toString().padStart(2, '0');

                return (
                  <article 
                    key={productId} 
                    className={`manifest-item-row ${isRemoving ? 'removing' : ''}`}
                  >
                    
                    {/* Index Node */}
                    <div className="manifest-index-node">
                      <span className="node-marker" />
                      <span className="node-number">{indexStr}</span>
                    </div>

                    {/* Dominant Hardware Visual */}
                    <Link to={`/product/${productId}`} className="manifest-visual-container">
                      <img 
                        src={image} 
                        alt={title} 
                        className="manifest-product-image"
                        loading="lazy"
                      />
                      <div className="manifest-image-vignette" />
                    </Link>

                    {/* Product Specifications & Details */}
                    <div className="manifest-item-content">
                      
                      <div className="manifest-item-meta">
                        <span className="manifest-cat-label">
                          {categoryLabel}
                        </span>
                        
                        <Link to={`/product/${productId}`} className="manifest-name-link">
                          <h2 className="manifest-item-title">{title}</h2>
                        </Link>

                        {product.specs && product.specs.length > 0 && (
                          <p className="manifest-specs-line">
                            {product.specs.slice(0, 2).join(' • ')}
                            {product.wattage ? ` • ${product.wattage}W TDP` : ''}
                          </p>
                        )}
                      </div>

                      {/* Quantity & Pricing Row */}
                      <div className="manifest-controls-row">
                        
                        {/* Compact Quantity Selector */}
                        <div className="manifest-qty-control" aria-label="Adjust quantity">
                          <button 
                            type="button" 
                            className="manifest-qty-btn"
                            onClick={() => updateQuantity(productId, quantity - 1)}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          
                          <span className="manifest-qty-number" aria-live="polite">
                            {quantity}
                          </span>
                          
                          <button 
                            type="button" 
                            className="manifest-qty-btn"
                            onClick={() => updateQuantity(productId, quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Price Presentation */}
                        <div className="manifest-price-stack">
                          <span className="manifest-current-price">
                            {formatPrice(itemTotal)}
                          </span>
                          {product.originalPrice && product.originalPrice > price && (
                            <span className="manifest-original-price">
                              {formatPrice(product.originalPrice * quantity)}
                            </span>
                          )}
                        </div>

                      </div>

                      {/* Secondary Item Actions */}
                      <div className="manifest-item-actions">
                        <button 
                          type="button"
                          className="manifest-action-link"
                          onClick={() => handleMoveToWishlist(product)}
                        >
                          <Heart size={13} className={isInWishlist(productId) ? 'action-active-heart' : ''} />
                          <span>Move to Wishlist</span>
                        </button>

                        <span className="manifest-action-divider">/</span>

                        <button 
                          type="button"
                          className="manifest-action-link remove-link"
                          onClick={() => handleRemoveItem(productId)}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

            {/* Return Link */}
            <div className="manifest-bottom-nav">
              <Link to="/shop" className="manifest-back-link">
                <ArrowLeft size={14} />
                <span>STAGE ADDITIONAL HARDWARE</span>
              </Link>
            </div>
          </main>

          {/* Right Column: Sticky Purchase Manifest Summary */}
          <aside className="manifest-summary-column">
            <div className="manifest-summary-panel">
              
              <div className="summary-header">
                <span className="summary-eyebrow">ORDER RECONCILIATION</span>
                <h3 className="summary-title">PURCHASE MANIFEST</h3>
              </div>

              {/* Line Items */}
              <div className="summary-items-list">
                <div className="summary-data-row">
                  <span className="data-row-label">Hardware Subtotal</span>
                  <span className="data-row-value">{formatPrice(cartTotal)}</span>
                </div>

                <div className="summary-data-row">
                  <span className="data-row-label">Insured Freight Dispatch</span>
                  <span className="data-row-value highlight-amber">COMPLIMENTARY</span>
                </div>

                <div className="summary-data-row">
                  <span className="data-row-label">Component Verification</span>
                  <span className="data-row-value highlight-amber">INCLUDED</span>
                </div>

                {promoApplied && (
                  <div className="summary-data-row discount-row">
                    <span className="data-row-label">Builder Voucher ({discountPercent}%)</span>
                    <span className="data-row-value discount-text">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="manifest-promo-form">
                <div className="manifest-promo-wrapper">
                  <Tag size={14} className="manifest-promo-icon" />
                  <input 
                    type="text" 
                    placeholder="VOUCHER (e.g. GEARGRID10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="manifest-promo-input"
                    disabled={promoApplied}
                  />
                  <button 
                    type="submit" 
                    className="manifest-promo-btn"
                    disabled={promoApplied}
                  >
                    {promoApplied ? 'APPLIED' : 'APPLY'}
                  </button>
                </div>
                {promoError && <p className="manifest-promo-error">{promoError}</p>}
                {promoApplied && (
                  <p className="manifest-promo-success">
                    <CheckCircle2 size={12} /> {discountPercent}% discount active on order manifest
                  </p>
                )}
              </form>

              {/* Prominent Total Block */}
              <div className="manifest-total-block">
                <div className="total-header-line">
                  <span className="total-text-label">TOTAL</span>
                  <span className="total-duty-note">All freight & calibration included</span>
                </div>
                <div className="total-number-display">
                  {formatPrice(finalTotal)}
                </div>
              </div>

              {/* Primary Checkout Action */}
              <button 
                type="button" 
                className="btn-primary manifest-checkout-btn"
                onClick={() => {
                  navigate('/checkout');
                }}
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={16} />
              </button>

              {/* Reassurance Stack */}
              <div className="manifest-reassurance-stack">
                <div className="reassurance-row">
                  <ShieldCheck size={15} className="reassurance-icon" />
                  <span>3-Year Comprehensive Hardware Warranty</span>
                </div>
                <div className="reassurance-row">
                  <Truck size={15} className="reassurance-icon" />
                  <span>Insured Priority Freight Dispatch</span>
                </div>
              </div>

            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
