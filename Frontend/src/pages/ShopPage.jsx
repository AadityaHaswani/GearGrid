import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HARDWARE_CATEGORIES } from '../data/hardwareData';
import { getProducts } from '../services/product.api';
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
  Server,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './ShopPage.css';

const ITEMS_PER_PAGE = 8;

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

const matchesCategory = (item, catId) => {
  if (!catId || catId === 'all') return true;
  const itemCatSlug = (item.category?.slug || '').toLowerCase();
  const itemCatName = (item.category?.name || '').toLowerCase();
  const itemCatRaw = typeof item.category === 'string' ? item.category.toLowerCase() : '';
  const cat = catId.toLowerCase();

  if (itemCatSlug === cat || itemCatName === cat || itemCatRaw === cat) return true;
  if (itemCatSlug.includes(cat) || cat.includes(itemCatSlug)) return true;

  if (cat === 'peripherals') {
    const peripheralTypes = ['keyboard', 'mouse', 'headphone', 'audio', 'headset', 'mic', 'peripheral'];
    return peripheralTypes.some(t => itemCatSlug.includes(t) || itemCatName.includes(t));
  }
  if (cat === 'gpus') {
    return itemCatSlug.includes('gpu') || itemCatSlug.includes('graphic') || itemCatName.includes('gpu') || itemCatName.includes('graphic');
  }
  if (cat === 'cpus') {
    return itemCatSlug.includes('cpu') || itemCatSlug.includes('processor') || itemCatName.includes('cpu') || itemCatName.includes('processor');
  }
  if (cat === 'cooling') {
    return itemCatSlug.includes('cool') || itemCatSlug.includes('case') || itemCatSlug.includes('fan');
  }
  if (cat === 'prebuilt') {
    return itemCatSlug.includes('system') || itemCatSlug.includes('prebuilt') || itemCatSlug.includes('pc') || itemCatSlug.includes('desktop');
  }

  return false;
};

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const fetchProductsList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getProducts({ page: 1, limit: 8 });
      const productList = res.data?.data?.products || res.data?.data || [];
      setProducts(productList);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load products from server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  const handleCategorySelect = (categoryId) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCat = matchesCategory(item, activeCategory);
      const q = searchQuery.toLowerCase().trim();
      const title = (item.title || item.name || '').toLowerCase();
      const catLabel = (item.category?.name || item.categoryLabel || '').toLowerCase();
      const brand = (item.brand || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      const specs = item.specs || [];
      const matchesSearch = q === '' || (
        title.includes(q) ||
        catLabel.includes(q) ||
        brand.includes(q) ||
        desc.includes(q) ||
        specs.some(s => s.toLowerCase().includes(q))
      );
      return matchesCat && matchesSearch;
    }).sort((a, b) => {
      const priceA = (a.discountPrice && a.discountPrice < a.price ? a.discountPrice : a.price) || 0;
      const priceB = (b.discountPrice && b.discountPrice < b.price ? b.discountPrice : b.price) || 0;
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return ratingB - ratingA;
      return 0;
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE) || 1;

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const heroImage = products[0]?.images?.[0]?.url || products[0]?.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';

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
                <span>{products.length} PRODUCTS AVAILABLE</span>
              </div>
              <div className="shop-hero-connector"></div>
            </div>
          </div>

          {/* Right Column: Editorial Hardware Visual */}
          <div className="shop-hero-visual-wrapper">
            <div className="shop-hero-visual-frame">
              <img
                src={heroImage}
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
              Showing <strong>{filteredAndSortedProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}</strong> - <strong>{Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedProducts.length)}</strong> of <strong>{filteredAndSortedProducts.length}</strong> products
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

          {/* Catalog Content States */}
          {loading ? (
            <div className="shop-loading-state">
              <div className="shop-loading-spinner" />
              <span className="shop-loading-text">Loading catalog...</span>
            </div>
          ) : error && products.length === 0 ? (
            <div className="shop-error-state">
              <AlertCircle size={32} className="shop-error-icon" />
              <h3 className="shop-error-title">Unable to load catalog</h3>
              <p className="shop-error-desc">{error}</p>
              <button
                type="button"
                className="btn-primary shop-retry-btn"
                onClick={fetchProductsList}
              >
                Retry Connection
              </button>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="shop-no-results">
              <h3>No products found</h3>
              <p>Try adjusting your category selection or search keywords.</p>
              <button
                type="button"
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
            <>
              <div className="shop-products-grid">
                {paginatedProducts.map((product, index) => (
                  <ProductCard 
                    key={product._id || product.id} 
                    product={product} 
                    index={(currentPage - 1) * ITEMS_PER_PAGE + index} 
                    onQuickView={setQuickViewProduct} 
                  />
                ))}
              </div>

              {/* Clean Pagination Controls */}
              {totalPages > 1 && (
                <div className="shop-pagination-wrapper">
                  <div className="shop-pagination-controls">
                    <button
                      type="button"
                      className="shop-pagination-nav-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </button>

                    <div className="shop-pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          className={`shop-pagination-page-btn ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                          aria-label={`Page ${pageNum}`}
                          aria-current={currentPage === pageNum ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="shop-pagination-nav-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      aria-label="Next page"
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <span className="shop-pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
              )}
            </>
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
