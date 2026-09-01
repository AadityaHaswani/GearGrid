import { X, Trash2, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatCurrency';
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
              {wishlist.map((product) => {
                const productId = product._id || product.id;
                const title = product.title || product.name || 'Hardware Component';
                const categoryLabel = product.category?.name || product.categoryLabel || product.brand || 'Hardware';
                const price = product.price || 0;
                const image = (product.images && product.images[0]?.url) || product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';

                return (
                  <div key={productId} className="wishlist-item-card">
                    <img src={image} alt={title} className="wishlist-item-thumb" />
                    
                    <div className="wishlist-item-info">
                      <span className="cart-item-cat">{categoryLabel}</span>
                      <h5 className="wishlist-item-name">{title}</h5>
                      <div className="wishlist-item-price">{formatPrice(price)}</div>
                      
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
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
