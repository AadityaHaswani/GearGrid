import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HARDWARE_CATEGORIES, PRODUCTS } from '../data/hardwareData';
import ProductCard from '../components/shop/ProductCard';
import QuickViewDrawer from '../components/shop/QuickViewDrawer';
import {
  Search,
  ArrowUpDown,
  LayoutGrid,
  Zap,
  Cpu,
  Layers,
  Monitor,
  Keyboard,
  Fan,
  Server
} from 'lucide-react';
import './ShopPage.css';

const getCategoryIcon = (id) => {
  switch (id) {
    case 'all': return <LayoutGrid size={15} className="category-item-icon" />;
    case 'gpus': return <Zap size={15} className="category-item-icon" />;
    case 'cpus': return <Cpu size={15} className="category-item-icon" />;
    case 'motherboards': return <Layers size={15} className="category-item-icon" />;
    case 'monitors': return <Monitor size={15} className="category-item-icon" />;
    case 'peripherals': return <Keyboard size={15} className="category-item-icon" />;
    case 'cooling': return <Fan size={15} className="category-item-icon" />;
    case 'prebuilt': return <Server size={15} className="category-item-icon" />;
    default: return <LayoutGrid size={15} className="category-item-icon" />;
  }
};

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCat = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' || (
        item.name.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.specs.some(s => s.toLowerCase().includes(q))
      );
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="shop-page-root">

      {/* Hardware Arsenal Hero Header */}
      <section className="shop-hero-header">
        <div className="container shop-hero-container">

          {/* Left Column: Editorial Headline & Details */}
          <div className="shop-hero-content">
            <div className="shop-hero-eyebrow">
              <span className="shop-hero-accent-mark"></span>
              <span>GEARGRID / HARDWARE CATALOG</span>
            </div>

            <h1 className="shop-hero-title">
              ENGINEER YOUR NEXT MACHINE.
            </h1>

            <p className="shop-hero-description">
              Explore our curated inventory of enthusiast-grade graphics cards, elite processors, precision peripherals, and custom systems engineered for peak performance.
            </p>

            <div className="shop-hero-meta">
              <div className="shop-catalog-indicator">
                <span className="indicator-dot"></span>
                <span>{PRODUCTS.length} PRODUCTS AVAILABLE</span>
              </div>
              <div className="shop-hero-connector"></div>
            </div>
          </div>

          {/* Right Column: Editorial Hardware Visual */}
          <div className="shop-hero-visual-wrapper">
            <div className="shop-hero-visual-frame">
              <img
                src={PRODUCTS[0].image}
                alt="Enthusiast Gaming Hardware"
                className="shop-hero-image"
              />
              <div className="shop-hero-image-overlay"></div>
              <div className="shop-hero-visual-accent"></div>
            </div>
          </div>

        </div>
      </section>

      {/* Catalog Section */}
      <section className="shop-catalog-section">
        <div className="container">

          {/* Segmented Hardware Category Selector */}
          <nav className="shop-category-nav" aria-label="Hardware Categories">
            <div className="shop-category-track">
              {HARDWARE_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-item-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat.id)}
                  >
                    {getCategoryIcon(cat.id)}
                    <span className="category-item-label">{cat.label}</span>
                    {isActive && <span className="category-active-line" />}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Controls Bar */}
          <div className="shop-controls-bar">

            {/* Filter Tools */}
            <div className="shop-filter-tools">

              <div className="shop-search-wrapper">
                <Search size={16} className="shop-search-icon" />
                <input
                  type="text"
                  placeholder="Search in catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="shop-search-input"
                />
              </div>

              <div className="shop-sort-wrapper">
                <ArrowUpDown size={14} className="shop-sort-icon" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="shop-sort-select"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

            </div>

          </div>

          {/* Results Status */}
          <div className="shop-results-status">
            <span className="results-count">
              Showing <strong>{filteredAndSortedProducts.length}</strong> products
            </span>
            {activeCategory !== 'all' && (
              <button
                className="clear-cat-btn"
                onClick={() => handleCategorySelect('all')}
              >
                Clear filter ×
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="shop-no-results">
              <h3>No products found</h3>
              <p>Try adjusting your category selection or search keywords.</p>
              <button
                className="btn-outline"
                onClick={() => {
                  setSearchQuery('');
                  handleCategorySelect('all');
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="shop-products-grid">
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  index={index} 
                  onQuickView={setQuickViewProduct} 
                />
              ))}
            </div>
          )}

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
