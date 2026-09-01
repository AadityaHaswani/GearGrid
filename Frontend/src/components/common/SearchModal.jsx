import { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingCart } from 'lucide-react';
import { PRODUCTS } from '../../data/hardwareData';
import { getProducts } from '../../services/product.api';
import { useShop, normalizeProduct } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatCurrency';
import './SearchModal.css';

const SUGGESTED_SEARCHES = ['RTX 5090', 'Ryzen 7 7800X3D', '360Hz OLED', 'DDR5-6000', 'Liquid Cooler', 'Sony WH-1000XM5'];

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart } = useShop();
  const [query, setQuery] = useState('');
  const [catalog, setCatalog] = useState(PRODUCTS);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      getProducts({ limit: 100 })
        .then((res) => {
          if (res.data?.data?.products?.length > 0) {
            setCatalog(res.data.data.products.map(normalizeProduct).filter(Boolean));
          }
        })
        .catch(() => {});
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === ''
    ? []
    : catalog.filter((item) => {
        const q = query.toLowerCase();
        const title = (item.title || item.name || '').toLowerCase();
        const cat = (item.category?.name || item.categoryLabel || '').toLowerCase();
        const specsMatch = Array.isArray(item.specs) && item.specs.some(s => typeof s === 'string' && s.toLowerCase().includes(q));
        return title.includes(q) || cat.includes(q) || specsMatch;
      });

  return (
    <div className="search-modal-overlay" onClick={() => setIsSearchOpen(false)}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Input Bar */}
        <div className="search-input-header">
          <Search size={20} className="search-box-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-main-input"
            placeholder="Search graphics cards, processors, displays, keyboards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button className="search-clear-btn" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
          <span className="search-esc-tag">ESC</span>
        </div>

        {/* Suggested Searches */}
        <div className="search-quick-tags">
          <span className="quick-tags-label">Popular Searches:</span>
          {SUGGESTED_SEARCHES.map((tag) => (
            <button
              key={tag}
              type="button"
              className="quick-tag-pill"
              onClick={() => setQuery(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="search-results-area">
          {query.trim() === '' ? (
            <div className="search-initial-hint">
              <p>Type keywords to search across the entire hardware catalog.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="search-empty-result">
              <p>No products matching "<strong>{query}</strong>" were found.</p>
            </div>
          ) : (
            <div className="search-result-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="search-result-card">
                  <img src={product.image} alt={product.name} className="search-res-img" />
                  <div className="search-res-info">
                    <span className="search-res-cat">{product.categoryLabel}</span>
                    <h5 className="search-res-name">{product.name}</h5>
                    <div className="search-res-specs">
                      {product.specs.slice(0, 2).map((s, idx) => (
                        <span key={idx} className="search-spec-chip">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="search-res-action">
                    <span className="search-res-price">{formatPrice(product.price)}</span>
                    <button
                      className="btn-primary search-add-btn"
                      onClick={() => {
                        addToCart(product);
                        setIsSearchOpen(false);
                      }}
                    >
                      <ShoppingCart size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
