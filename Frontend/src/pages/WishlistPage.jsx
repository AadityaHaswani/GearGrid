import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Star, 
  Sliders, 
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/formatCurrency';
import SEO from '../components/common/SEO';
import './WishlistPage.css';

export default function WishlistPage() {
  const { 
    wishlist, 
    toggleWishlist, 
    addToCart, 
    wishlistCount, 
    showToast 
  } = useShop();

  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'price-desc', 'price-asc', 'category'
  const [removingId, setRemovingId] = useState(null);

  // Sorted list
  const sortedWishlist = useMemo(() => {
    const list = [...wishlist];
    if (sortBy === 'price-desc') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'price-asc') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'category') {
      return list.sort((a, b) => (a.categoryLabel || '').localeCompare(b.categoryLabel || ''));
    }
    return list; // 'recent'
  }, [wishlist, sortBy]);

  // Remove handler with smooth transition
  const handleRemove = (product) => {
    setRemovingId(product.id);
    setTimeout(() => {
      toggleWishlist(product);
      setRemovingId(null);
    }, 240);
  };

  // Move individual item to cart
  const handleMoveToCart = (product) => {
    const success = addToCart(product);
    if (success) {
      toggleWishlist(product);
    }
  };

  // Move all items to cart
  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    
    // Attempt moving all items
    wishlist.forEach((item) => {
      addToCart(item);
    });
    // Remove all from wishlist
    wishlist.forEach((item) => {
      toggleWishlist(item);
    });
    showToast(`Transferred all ${wishlist.length} items to your Build Cart`, 'amber');
  };

  // Empty State View
  if (wishlist.length === 0) {
    return (
      <div className="arsenal-page-root">
        <SEO
          title="My Hardware Arsenal | GearGrid"
          description="Your saved repository of enthusiast-grade PC components staged for upcoming configurations."
          noindex={true}
        />
        <div className="arsenal-page-container">
          
          <div className="arsenal-empty-wrapper">
            
            {/* Custom Abstract Hardware Blueprint Visual */}
            <div className="arsenal-empty-silhouette">
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" className="blueprint-svg">
                <path d="M4 4h16v16H4z" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1.2" strokeDasharray="3 3"/>
                <path d="M9 9h6v6H9z" stroke="var(--accent-amber)" strokeWidth="1.5"/>
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="1.5" fill="var(--accent-amber)" />
              </svg>
            </div>

            <span className="arsenal-eyebrow">GEARGRID // MY ARSENAL</span>
            <h1 className="arsenal-empty-heading">YOUR ARSENAL IS EMPTY.</h1>
            <p className="arsenal-empty-sub">
              Save the hardware you're planning to build around.
            </p>

            <div className="arsenal-empty-actions">
              <Link to="/shop" className="btn-primary arsenal-cta-btn">
                <span>EXPLORE HARDWARE</span>
                <ArrowRight size={15} />
              </Link>
              <Link to="/build" className="btn-outline arsenal-secondary-cta">
                <Sliders size={15} />
                <span>OPEN BUILD LAB</span>
              </Link>
            </div>

            <div className="arsenal-empty-reassurance">
              <span>Saved Configurations Stored to Session</span>
              <span className="arsenal-dot">•</span>
              <span>100% Real-time Stock Tracking</span>
              <span className="arsenal-dot">•</span>
              <span>Direct Build Lab Compatibility</span>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="arsenal-page-root">
      <SEO
        title="My Hardware Arsenal | GearGrid"
        description="Your saved repository of enthusiast-grade PC components staged for upcoming configurations."
        noindex={true}
      />
      <div className="arsenal-page-container">
        
        {/* Header Section */}
        <header className="arsenal-header">
          <div className="arsenal-header-main">
            <span className="arsenal-eyebrow">GEARGRID / MY ARSENAL</span>
            <h1 className="arsenal-title">HARDWARE WORTH COMING BACK FOR.</h1>
            <p className="arsenal-subtitle">
              Your curated repository of enthusiast-grade components staged for upcoming configurations.
            </p>
          </div>

          {/* Utility Row: Sort & Move All */}
          <div className="arsenal-utility-bar">
            <span className="arsenal-count-tag">
              [{wishlistCount.toString().padStart(2, '0')} {wishlistCount === 1 ? 'HARDWARE ITEM' : 'HARDWARE ITEMS'}]
            </span>

            <div className="arsenal-utility-actions">
              
              {/* Sort Selector */}
              <div className="arsenal-sort-wrapper">
                <span className="sort-label">SORT:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="arsenal-sort-select"
                  aria-label="Sort saved hardware"
                >
                  <option value="recent">Recently Added</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="category">Category</option>
                </select>
              </div>

              {/* Move All to Cart */}
              <button 
                type="button" 
                className="arsenal-move-all-btn"
                onClick={handleMoveAllToCart}
                title="Transfer all saved items to cart"
              >
                <ShoppingCart size={14} />
                <span>MOVE ALL TO CART</span>
              </button>

            </div>
          </div>
        </header>

        {/* Editorial Alternating Horizontal Rows Sequence */}
        <main className="arsenal-sequence-wrapper" aria-label="Saved Hardware Arsenal">
          
          {/* Continuous Amber Spine Line */}
          <div className="arsenal-sequence-spine" />

          <div className="arsenal-items-list">
            {sortedWishlist.map((product, index) => {
              const productId = product._id || product.id;
              const title = product.title || product.name || 'Hardware Component';
              const categoryLabel = product.category?.name || product.categoryLabel || product.brand || 'HARDWARE COMPONENT';
              const price = product.price || 0;
              const image = (product.images && product.images[0]?.url) || product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';
              const isEven = index % 2 === 1; // Alternating layout
              const indexStr = (index + 1).toString().padStart(2, '0');
              const isRemoving = removingId === productId;

              return (
                <article 
                  key={productId} 
                  className={`arsenal-editorial-row ${isEven ? 'row-reversed' : ''} ${isRemoving ? 'removing' : ''}`}
                >
                  
                  {/* Sequence Node Marker */}
                  <div className="arsenal-node-badge">
                    <span className="arsenal-node-dot" />
                    <span className="arsenal-node-index">{indexStr}</span>
                  </div>

                  {/* Dominant Product Visual */}
                  <div className="arsenal-visual-column">
                    <Link to={`/product/${productId}`} className="arsenal-image-box">
                      <img 
                        src={image} 
                        alt={title} 
                        className="arsenal-image"
                        loading="lazy"
                      />
                      <div className="arsenal-image-vignette" />
                    </Link>
                  </div>

                  {/* Editorial Details Column */}
                  <div className="arsenal-details-column">
                    
                    <div className="arsenal-meta-top">
                      <span className="arsenal-category-tag">
                        {categoryLabel}
                      </span>

                      {product.rating && (
                        <div className="arsenal-rating-pill">
                          <Star size={12} className="star-amber" fill="var(--accent-amber)" />
                          <span>{product.rating}</span>
                          {(product.reviews || product.numReviews) && <span className="reviews-count">({product.reviews || product.numReviews})</span>}
                        </div>
                      )}
                    </div>

                    <Link to={`/product/${productId}`} className="arsenal-title-link">
                      <h2 className="arsenal-product-title">{title}</h2>
                    </Link>

                    {/* Specifications */}
                    {product.specs && product.specs.length > 0 && (
                      <div className="arsenal-specs-row">
                        {product.specs.slice(0, 2).map((spec, sIdx) => (
                          <span key={sIdx} className="arsenal-spec-item">{spec}</span>
                        ))}
                        {product.wattage && (
                          <span className="arsenal-spec-item wattage-item">{product.wattage}W TDP</span>
                        )}
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="arsenal-price-row">
                      <span className="arsenal-price-val">
                        {formatPrice(price)}
                      </span>
                      {product.originalPrice && product.originalPrice > price && (
                        <span className="arsenal-orig-price">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Actions Strip */}
                    <div className="arsenal-actions-row">
                      
                      {/* Primary CTA */}
                      <button 
                        type="button" 
                        className="btn-primary arsenal-add-btn"
                        onClick={() => handleMoveToCart(product)}
                      >
                        <span>ADD TO CART</span>
                        <ArrowRight size={14} />
                      </button>

                      {/* View Details Link */}
                      <Link to={`/product/${productId}`} className="arsenal-details-link">
                        <span>VIEW DETAILS</span>
                        <ArrowUpRight size={14} />
                      </Link>

                      {/* Remove Button */}
                      <button 
                        type="button" 
                        className="arsenal-remove-btn"
                        onClick={() => handleRemove(product)}
                        title="Remove from Arsenal"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>

                    </div>

                  </div>

                </article>
              );
            })}
          </div>

          {/* Bottom Return Action */}
          <div className="arsenal-footer-nav">
            <Link to="/shop" className="arsenal-back-link">
              <ArrowLeft size={14} />
              <span>EXPLORE MORE HARDWARE</span>
            </Link>
          </div>

        </main>

      </div>
    </div>
  );
}
