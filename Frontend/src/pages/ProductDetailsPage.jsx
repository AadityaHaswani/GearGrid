import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingCart, 
  Check, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Zap,
  Cpu,
  Layers,
  Thermometer,
  Sparkles
} from 'lucide-react';
import { PRODUCTS } from '../data/hardwareData';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/shop/ProductCard';
import QuickViewDrawer from '../components/shop/QuickViewDrawer';
import './ProductDetailsPage.css';

const getProductGallery = (product) => {
  if (!product) return [];

  const galleryPresets = {
    'gpu-5090': [
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80'
    ],
    'cpu-7800x3d': [
      'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=1200&q=80'
    ],
    'rig-monolith': [
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80'
    ],
    'monitor-oled-360': [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ]
  };

  if (galleryPresets[product.id]) {
    return galleryPresets[product.id];
  }

  return [
    product.image,
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
  ];
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const railRef = useRef(null);
  const gallery = getProductGallery(product);
  const isWishlisted = isInWishlist(product.id);

  // Scroll to top on id change
  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveImageIndex(0);
    setQuantity(1);
    setIsAdded(false);
  }, [id]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const scrollRail = (direction) => {
    if (railRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      railRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Related products in the same or adjacent categories
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id);

  return (
    <div className="product-lab-page">
      
      {/* Top Breadcrumbs & Back Navigation */}
      <div className="product-lab-nav-bar">
        <div className="container product-lab-nav-container">
          <Link to="/shop" className="product-lab-back-link">
            <ArrowLeft size={16} />
            <span>Back to Arsenal</span>
          </Link>
          
          <div className="product-lab-breadcrumbs">
            <span>GEARGRID LAB</span>
            <span className="crumb-divider">/</span>
            <span>{product.categoryLabel.toUpperCase()}</span>
            <span className="crumb-divider">/</span>
            <span className="crumb-current">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Showcase Section */}
      <section className="product-lab-main-section">
        <div className="container product-lab-grid-container">
          
          {/* Left Column: Immersive Gallery */}
          <div className="product-lab-gallery-col">
            
            {/* Vertical Thumbnail Rail */}
            <div className="product-lab-thumbnail-rail">
              {gallery.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  className={`product-lab-thumb-btn ${activeImageIndex === index ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(index)}
                  aria-label={`Select product image view ${index + 1}`}
                >
                  <img src={imgUrl} alt={`${product.name} view ${index + 1}`} />
                  <span className="thumb-index-tag">0{index + 1}</span>
                </button>
              ))}
            </div>

            {/* Main Image Stage */}
            <div className="product-lab-main-stage">
              <div className="stage-image-wrapper">
                <img 
                  src={gallery[activeImageIndex]} 
                  alt={product.name} 
                  className="product-lab-hero-image"
                />
                <div className="stage-ambient-glow" />
              </div>

              {/* Minimal Gallery Arrow Controls */}
              <button 
                type="button" 
                className="gallery-nav-btn btn-left" 
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>

              <button 
                type="button" 
                className="gallery-nav-btn btn-right" 
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>

              {/* Index indicator */}
              <div className="stage-index-badge">
                <span>0{activeImageIndex + 1}</span>
                <span className="badge-slash">/</span>
                <span>0{gallery.length}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Lab Information & Purchase Config */}
          <div className="product-lab-info-col">
            
            {/* Category Eyebrow & Rating */}
            <div className="product-lab-meta-row">
              <span className="product-lab-eyebrow">{product.categoryLabel}</span>
              <div className="product-lab-rating">
                <Star size={13} fill="#F59E0B" className="star-amber" />
                <span>{product.rating}</span>
                <span className="rating-count">({product.reviews} benchmark reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="product-lab-title">{product.name}</h1>

            {/* Price Section */}
            <div className="product-lab-price-row">
              <span className="product-lab-current-price">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="product-lab-old-price">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                  <span className="product-lab-save-badge">
                    Save ${product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Stock Availability */}
            <div className="product-lab-stock-indicator">
              <span className="stock-glow-dot" />
              <span>In Stock • Ready for Certified Insured Dispatch</span>
            </div>

            {/* Short Product Description */}
            <p className="product-lab-description">
              {product.description}
            </p>

            {/* Refined 2-Column Hardware Metric Grid */}
            <div className="product-lab-metrics-grid">
              <div className="metric-box">
                <span className="metric-label">Architecture / Core</span>
                <span className="metric-value">{product.specs ? product.specs[0] : 'Enthusiast Grade'}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Memory & Bandwidth</span>
                <span className="metric-value">{product.specs && product.specs[1] ? product.specs[1] : 'High Bandwidth'}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Power & Thermal TDP</span>
                <span className="metric-value">{product.wattage ? `${product.wattage}W Certified` : 'Efficiency Tuned'}</span>
              </div>
              <div className="metric-box">
                <span className="metric-label">Warranty & Tier</span>
                <span className="metric-value">3-Year Full Coverage</span>
              </div>
            </div>

            {/* Purchase Row: Quantity + Add to Cart + Wishlist */}
            <div className="product-lab-actions-group">
              
              <div className="product-lab-qty-selector">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => quantity < 10 && setQuantity((q) => q + 1)}
                  disabled={quantity >= 10}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Large Amber ADD TO CART Button */}
              <button
                type="button"
                className={`product-lab-cart-btn ${isAdded ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {isAdded ? (
                  <>
                    <Check size={18} />
                    <span>ADDED TO ARSENAL</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>ADD TO CART • ${(product.price * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                className={`product-lab-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={isWishlisted ? "var(--accent-red)" : "none"} />
              </button>

            </div>

            {/* Hardware Guarantees Strip */}
            <div className="product-lab-guarantees">
              <div className="guarantee-item">
                <ShieldCheck size={16} className="guarantee-icon" />
                <span>3-Year Direct Warranty</span>
              </div>
              <div className="guarantee-item">
                <Truck size={16} className="guarantee-icon" />
                <span>Insured Fragile Courier</span>
              </div>
              <div className="guarantee-item">
                <RotateCcw size={16} className="guarantee-icon" />
                <span>30-Day Evaluation Window</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Section 1: FULL SPECIFICATIONS */}
      <section className="product-lab-section specs-section">
        <div className="container">
          
          <div className="section-header-wrap">
            <span className="section-eyebrow">TECHNICAL MATRIX</span>
            <h2 className="section-title">FULL SPECIFICATIONS</h2>
          </div>

          <div className="specs-editorial-table">
            
            <div className="specs-group">
              <h3 className="specs-group-title">
                <Zap size={16} className="group-icon" />
                <span>General Architecture</span>
              </h3>
              <div className="specs-rows">
                <div className="spec-row">
                  <span className="spec-name">Product Model</span>
                  <span className="spec-data">{product.name}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Category</span>
                  <span className="spec-data">{product.categoryLabel}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Manufacturing Architecture</span>
                  <span className="spec-data">{product.specs ? product.specs[0] : 'Enthusiast TSMC Process'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Launch Generation</span>
                  <span className="spec-data">Current Gen Flagship (2026 Edition)</span>
                </div>
              </div>
            </div>

            <div className="specs-group">
              <h3 className="specs-group-title">
                <Cpu size={16} className="group-icon" />
                <span>Performance & Computing</span>
              </h3>
              <div className="specs-rows">
                <div className="spec-row">
                  <span className="spec-name">Memory Configuration</span>
                  <span className="spec-data">{product.specs && product.specs[1] ? product.specs[1] : 'High Speed Interface'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Bus Interface</span>
                  <span className="spec-data">{product.specs && product.specs[2] ? product.specs[2] : 'PCIe 5.0 High Bandwidth'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Hardware Acceleration</span>
                  <span className="spec-data">{product.specs && product.specs[3] ? product.specs[3] : 'DirectX 12 Ultimate / Vulkan'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Performance Rating</span>
                  <span className="spec-data">{product.rating} / 5.0 Verified Score</span>
                </div>
              </div>
            </div>

            <div className="specs-group">
              <h3 className="specs-group-title">
                <Thermometer size={16} className="group-icon" />
                <span>Thermal, Power & Form Factor</span>
              </h3>
              <div className="specs-rows">
                <div className="spec-row">
                  <span className="spec-name">Thermal Design Power (TDP)</span>
                  <span className="spec-data">{product.wattage ? `${product.wattage} Watts` : 'Optimized Thermal Envelope'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Recommended Power Supply</span>
                  <span className="spec-data">{product.wattage ? `${product.wattage + 350}W 80+ Gold` : '750W 80+ Gold'}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Cooling Solution</span>
                  <span className="spec-data">Vapor Chamber & Custom Heatsink</span>
                </div>
                <div className="spec-row">
                  <span className="spec-name">Form Factor</span>
                  <span className="spec-data">Standard ATX / Chassis Compatible</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Section 2: ABOUT THIS HARDWARE */}
      <section className="product-lab-section about-hardware-section">
        <div className="container">
          
          <div className="about-hardware-grid">
            
            <div className="about-hardware-left">
              <span className="section-eyebrow">ENGINEERING SPOTLIGHT</span>
              <h2 className="about-hardware-headline">
                CRAFTED FOR UNCOMPROMISED PEAK PERFORMANCE.
              </h2>
              <p className="about-hardware-lead">
                Every component distributed by GearGrid undergoes strict multi-point stress testing, 
                verifying signal integrity, clock stability, and thermal efficiency before dispatch.
              </p>
            </div>

            <div className="about-hardware-right">
              
              <div className="about-feature-card">
                <div className="feature-header">
                  <Sparkles size={18} className="feature-icon" />
                  <h4>Precision Thermal Architecture</h4>
                </div>
                <p>
                  Engineered with continuous high-conductivity contact surfaces and aerodynamically 
                  optimized fin arrays, maintaining sub-70°C operating temperatures under heavy compute loads.
                </p>
              </div>

              <div className="about-feature-card">
                <div className="feature-header">
                  <Layers size={18} className="feature-icon" />
                  <h4>Signal Integrity & Clean Power</h4>
                </div>
                <p>
                  Multi-layer PCB engineering with dense copper traces minimizes electromagnetic interference, 
                  delivering flat voltage curves to maximize overclocking headroom and silicon lifespan.
                </p>
              </div>

              <div className="about-feature-card">
                <div className="feature-header">
                  <ShieldCheck size={18} className="feature-icon" />
                  <h4>GearGrid Certified Compatibility</h4>
                </div>
                <p>
                  100% verified compatibility with the GearGrid Custom PC Builder architecture, ensuring 
                  instant zero-conflict BIOS recognition and optimal bandwidth utilization.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Section 3: YOU MAY ALSO LIKE (Horizontal Product Rail) */}
      <section className="product-lab-section related-rail-section">
        <div className="container">
          
          <div className="related-rail-header">
            <div>
              <span className="section-eyebrow">COMPATIBLE HARDWARE</span>
              <h2 className="section-title">YOU MAY ALSO LIKE</h2>
            </div>

            <div className="rail-nav-controls">
              <button 
                type="button" 
                className="rail-nav-btn" 
                onClick={() => scrollRail('left')}
                aria-label="Scroll related hardware left"
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                type="button" 
                className="rail-nav-btn" 
                onClick={() => scrollRail('right')}
                aria-label="Scroll related hardware right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Track */}
          <div className="related-rail-track" ref={railRef}>
            {relatedProducts.map((relProduct, index) => (
              <div key={relProduct.id} className="related-rail-item">
                <ProductCard 
                  product={relProduct} 
                  index={index} 
                  onQuickView={setQuickViewProduct} 
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Quick View Side-Over Drawer */}
      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

    </div>
  );
}
