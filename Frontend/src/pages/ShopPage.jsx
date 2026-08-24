import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HARDWARE_CATEGORIES, PRODUCTS } from '../data/hardwareData';
import ProductCard from '../components/shop/ProductCard';
import { Search, ArrowUpDown } from 'lucide-react';
import './ShopPage.css';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'

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
      
      {/* Header Banner */}
      <section className="shop-header-banner">
        <div className="container">
          <div className="shop-header-content">
            <span className="section-subtitle">HARDWARE CATALOG</span>
            <h1 className="shop-main-title">HARDWARE ARSENAL</h1>
            <p className="shop-subtitle">
              Explore genuine graphics cards, high-performance processors, and gaming peripherals with official brand warranty.
            </p>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section className="shop-catalog-section">
        <div className="container">
          
          {/* Controls Bar */}
          <div className="shop-controls-bar">
            
            {/* Category Pills */}
            <div className="shop-cat-tabs">
              {HARDWARE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`shop-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

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
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
