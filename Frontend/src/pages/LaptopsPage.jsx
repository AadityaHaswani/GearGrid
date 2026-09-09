import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProducts } from '../services/product.api';
import ProductCard from '../components/shop/ProductCard';
import QuickViewDrawer from '../components/shop/QuickViewDrawer';
import SEO from '../components/common/SEO';
import {
  Laptop,
  Briefcase,
  Command,
  Gamepad2,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Cpu,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import './LaptopsPage.css';

const ITEMS_PER_PAGE = 8;

const LAPTOP_CATEGORIES = [
  { id: 'all', label: 'All Laptops', icon: Laptop, tag: 'Full Roster' },
  { id: 'professional', label: 'Professional', icon: Briefcase, tag: 'Mobile Workstations' },
  { id: 'mac', label: 'Mac', icon: Command, tag: 'Apple Silicon' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, tag: 'High Refresh & RTX' },
];

export const isLaptopProduct = (item) => {
  if (!item) return false;
  const slug = (item.category?.slug || '').toLowerCase();
  const name = (item.category?.name || '').toLowerCase();
  const rawCat = typeof item.category === 'string' ? item.category.toLowerCase() : '';
  const title = (item.title || item.name || '').toLowerCase();
  const type = (item.productType || '').toLowerCase();

  return (
    slug.includes('laptop') ||
    slug.includes('macbook') ||
    slug.includes('notebook') ||
    name.includes('laptop') ||
    name.includes('macbook') ||
    name.includes('notebook') ||
    rawCat.includes('laptop') ||
    rawCat.includes('macbook') ||
    type === 'laptop'
  );
};

const matchesLaptopCategory = (item, catId) => {
  if (!catId || catId === 'all') return true;

  const slug = (item.category?.slug || '').toLowerCase();
  const name = (item.category?.name || '').toLowerCase();
  const brand = (item.brand || '').toLowerCase();

  if (catId === 'mac') {
    return slug === 'mac' || name === 'mac' || brand === 'apple';
  }

  if (catId === 'gaming') {
    return slug === 'gaming-laptops' || name.includes('gaming');
  }

  if (catId === 'professional') {
    return slug === 'professional-laptops' || name.includes('professional');
  }

  return false;
};

export default function LaptopsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Debounce search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 whenever category, debounced search, or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, debouncedSearch, sortBy]);

  const fetchLaptopCatalog = useCallback(async (page = currentPage) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        productType: 'laptop',
        sort: sortBy
      };
      if (activeCategory && activeCategory !== 'all') {
        params.category = activeCategory;
      }
      if (debouncedSearch && debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      const res = await getProducts(params);
      const data = res.data?.data;
      const rawList = data?.products || [];
      const total = data?.totalProducts ?? rawList.length;
      const pages = data?.totalPages ?? (Math.ceil(total / ITEMS_PER_PAGE) || 1);

      setProducts(rawList);
      setTotalProducts(total);
      setTotalPages(Math.max(pages, 1));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to connect to GearGrid product catalog.');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, debouncedSearch, sortBy, currentPage]);

  useEffect(() => {
    fetchLaptopCatalog(currentPage);
  }, [fetchLaptopCatalog, currentPage]);

  const handleCategorySelect = (categoryId) => {
    setCurrentPage(1);
    if (categoryId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="laptops-page-root">
      <SEO
        title="Laptops — Professional, Mac & High-Performance Gaming Laptops | GearGrid"
        description="Explore GearGrid premium laptops engineered for professional engineering, creative masteries, competitive esports gaming, and ultra-dense high-performance computing."
        canonical="https://geargrid-delta.vercel.app/laptops"
      />

      {/* Hero Header Section */}
      <section className="laptops-hero-section">
        <div className="laptops-hero-glow" aria-hidden="true" />
        <div className="container laptops-hero-container">
          
          <div className="laptops-hero-content">
            <div className="laptops-hero-badge">
              <span className="badge-pulse-dot" />
              <Laptop size={14} className="badge-icon" />
              <span>GEARGRID / PORTABLE WORKSTATIONS & COMPUTING</span>
            </div>

            <h1 className="laptops-hero-title">
              LAPTOPS
            </h1>

            <p className="laptops-hero-lead">
              Engineered for elite mobility without compromise. Discover premium laptops precision-calibrated for professional work, creative work, competitive gaming, and high-performance computing.
            </p>

            {/* Segment Highlight Badges */}
            <div className="laptops-pillars-grid">
              <div className="pillar-item">
                <div className="pillar-icon-box">
                  <Briefcase size={16} />
                </div>
                <div className="pillar-info">
                  <span className="pillar-name">Professional Work</span>
                  <span className="pillar-sub">Enterprise reliability & endurance</span>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon-box">
                  <Sparkles size={16} />
                </div>
                <div className="pillar-info">
                  <span className="pillar-name">Creative Work</span>
                  <span className="pillar-sub">DCI-P3 color & GPU acceleration</span>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon-box">
                  <Gamepad2 size={16} />
                </div>
                <div className="pillar-info">
                  <span className="pillar-name">Esports & Gaming</span>
                  <span className="pillar-sub">240Hz+ panels & discrete RTX</span>
                </div>
              </div>

              <div className="pillar-item">
                <div className="pillar-icon-box">
                  <Zap size={16} />
                </div>
                <div className="pillar-info">
                  <span className="pillar-name">High-Performance Computing</span>
                  <span className="pillar-sub">Multi-threaded compilation & AI</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section className="laptops-catalog-section">
        <div className="container">
          
          {/* Category Filter Pills */}
          <nav className="laptops-category-nav" aria-label="Laptop Categories">
            <div className="laptops-category-track">
              {LAPTOP_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`laptops-category-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleCategorySelect(cat.id)}
                    aria-label={`Filter by ${cat.label}`}
                  >
                    <IconComponent size={16} className="category-icon" />
                    <span className="category-name">{cat.label}</span>
                    <span className="category-tag">{cat.tag}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Controls Bar: Search & Sort */}
          <div className="laptops-controls-bar">
            
            <div className="laptops-search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search laptops by processor, GPU, memory, or brand..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="laptops-search-input"
                aria-label="Search laptops"
              />
            </div>

            <div className="laptops-sort-wrapper">
              <ArrowUpDown size={14} className="sort-icon" />
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="laptops-sort-select"
                aria-label="Sort laptops"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

          </div>

          {/* Status Bar */}
          <div className="laptops-status-bar">
            <span className="status-results">
              {totalProducts > 0 ? (
                <>
                  Showing <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> - <strong>{Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)}</strong> of <strong>{totalProducts}</strong> laptops
                </>
              ) : (
                <>
                  <strong>{totalProducts}</strong> laptops matching criteria
                </>
              )}
            </span>
            {activeCategory !== 'all' && (
              <button
                type="button"
                className="clear-filter-btn"
                onClick={() => handleCategorySelect('all')}
              >
                Clear category filter ×
              </button>
            )}
          </div>

          {/* Catalog Content States */}
          {loading ? (
            <div className="laptops-loading-state">
              <div className="laptops-loading-spinner" />
              <span className="laptops-loading-text">Synchronizing laptop inventory from server...</span>
            </div>
          ) : error ? (
            <div className="laptops-error-state">
              <AlertCircle size={36} className="error-icon" />
              <h3 className="error-title">Unable to Connect to Product Server</h3>
              <p className="error-desc">{error}</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => fetchLaptopCatalog(currentPage)}
              >
                Retry Server Connection
              </button>
            </div>
          ) : products.length === 0 ? (
            /* Backend Ready / Zero Products Empty State */
            <div className="laptops-readiness-card">
              
              <div className="readiness-badge-row">
                <span className="readiness-sync-tag">
                  <span className="sync-pulse" />
                  MONGODB BACKEND READY
                </span>
                <span className="readiness-api-tag">API: /api/v1/products</span>
              </div>

              <div className="readiness-icon-halo">
                <Laptop size={44} className="readiness-icon" />
              </div>

              <h2 className="readiness-title">
                {totalProducts === 0 && !searchQuery && activeCategory === 'all' ? 'Laptop Arsenal Inbound' : 'No Matching Laptops Found'}
              </h2>

              <p className="readiness-description">
                {totalProducts === 0 && !searchQuery && activeCategory === 'all' ? (
                  <>
                    The GearGrid portable computing section is actively linked to our live MongoDB catalog. We are currently benchmarking and calibrating the upcoming lineup of premium professional, Mac, and gaming laptops. Once laptop records are added to MongoDB, they will stream directly into this interface.
                  </>
                ) : (
                  <>
                    No laptops in our active database match the search keyword <em>"{searchQuery}"</em> or category <em>"{activeCategory}"</em>. Try clearing filters to view all units.
                  </>
                )}
              </p>

              {/* Segment Readiness Cards */}
              <div className="readiness-segments-grid">
                <div className="segment-card" onClick={() => handleCategorySelect('professional')}>
                  <Briefcase size={20} className="segment-card-icon text-amber" />
                  <h4 className="segment-card-title">Professional Work</h4>
                  <p className="segment-card-desc">ThinkPad, Precision & XPS series calibrated for engineering, CAD, and executive mobility.</p>
                  <span className="segment-card-action">Select Category →</span>
                </div>

                <div className="segment-card" onClick={() => handleCategorySelect('mac')}>
                  <Command size={20} className="segment-card-icon text-amber" />
                  <h4 className="segment-card-title">Mac & Apple Silicon</h4>
                  <p className="segment-card-desc">MacBook Pro & Air configurations featuring M-series chips and Liquid Retina XDR displays.</p>
                  <span className="segment-card-action">Select Category →</span>
                </div>

                <div className="segment-card" onClick={() => handleCategorySelect('gaming')}>
                  <Gamepad2 size={20} className="segment-card-icon text-amber" />
                  <h4 className="segment-card-title">Esports & Gaming</h4>
                  <p className="segment-card-desc">ROG, Razer Blade, and Legion chassis with RTX 40/50 series GPUs and high-refresh OLED panels.</p>
                  <span className="segment-card-action">Select Category →</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="readiness-actions">
                {(searchQuery || activeCategory !== 'all') && (
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => {
                      setSearchQuery('');
                      handleCategorySelect('all');
                    }}
                  >
                    Reset Filter Criteria
                  </button>
                )}
                <Link to="/shop" className="btn-primary readiness-cta-btn">
                  <span>Browse Desktop PC Shop</span>
                  <ArrowRight size={16} />
                </Link>
                <Link to="/build" className="btn-outline readiness-secondary-btn">
                  <span>Custom PC Configurator</span>
                </Link>
              </div>

            </div>
          ) : (
            /* Active Laptop Products Grid (Reusing ProductCard) */
            <>
              <div className="laptops-products-grid">
                {products.map((laptop, index) => (
                  <ProductCard
                    key={laptop._id || laptop.id}
                    product={laptop}
                    index={(currentPage - 1) * ITEMS_PER_PAGE + index}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>

              {/* 8-Item Pagination Controls */}
              {totalPages > 1 && (
                <div className="laptops-pagination-wrapper">
                  <div className="laptops-pagination-controls">
                    <button
                      type="button"
                      className="laptops-pagination-nav-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </button>

                    <div className="laptops-pagination-pages">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          className={`laptops-pagination-page-btn ${currentPage === pageNum ? 'active' : ''}`}
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
                      className="laptops-pagination-nav-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      aria-label="Next page"
                    >
                      <span>Next</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <span className="laptops-pagination-info">
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
