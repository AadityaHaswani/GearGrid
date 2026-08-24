import { X, Trash2, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import './WishlistDrawer.css';

export default function WishlistDrawer() {
  const { 
    wishlist, 
    isWishlistOpen, 
    setIsWishlistOpen, 
    toggleWishlist, 
    addToCart,
    wishlistCount 
  } = useShop();

  if (!isWishlistOpen) return null;

  return (
    <div className="drawer-overlay" onClick={() => setIsWishlistOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h3 className="drawer-title">Saved Items</h3>
            <span className="drawer-count">{wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}</span>
          </div>
          <button 
            type="button"
            className="drawer-close-btn" 
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
          >
            <X size={20} />
          </button>
        </div>

        {/* Item List */}
        <div className="drawer-body">
          {wishlist.length === 0 ? (
            <div className="drawer-empty">
              <Heart size={44} className="empty-icon" />
              <h4>No Saved Items</h4>
              <p>Bookmark hardware components to quickly compare prices and specs.</p>
              <Link 
                to="/shop" 
                className="btn-secondary empty-action"
                onClick={() => setIsWishlistOpen(false)}
              >
                Explore Catalog
              </Link>
            </div>
          ) : (
            <div className="wishlist-item-list">
              {wishlist.map((product) => (
                <div key={product.id} className="wishlist-item-card">
                  <img src={product.image} alt={product.name} className="wishlist-item-thumb" />
                  
                  <div className="wishlist-item-info">
                    <span className="wishlist-item-cat">{product.categoryLabel}</span>
                    <h5 className="wishlist-item-name">{product.name}</h5>
                    <div className="wishlist-item-price">${product.price.toLocaleString()}</div>
                    
                    <div className="wishlist-actions-row">
                      <button 
                        onClick={() => {
                          addToCart(product);
                          toggleWishlist(product);
                        }}
                        className="btn-primary wishlist-move-btn"
                      >
                        <ShoppingCart size={14} />
                        <span>Move to Cart</span>
                      </button>

                      <button 
                        onClick={() => toggleWishlist(product)}
                        className="wishlist-remove-btn"
                        title="Remove from saved"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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
