import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatCurrency';
import './CartDrawer.css';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    cartCount 
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <h3 className="drawer-title">Shopping Cart</h3>
            <span className="drawer-count">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
          </div>
          <button 
            type="button"
            className="drawer-close-btn" 
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Item List */}
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty">
              <ShoppingBag size={44} className="empty-icon" />
              <h4>Your Cart is Empty</h4>
              <p>Explore our selection of gaming hardware and custom systems.</p>
              <Link 
                to="/shop" 
                className="btn-primary empty-action"
                onClick={() => setIsCartOpen(false)}
              >
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="cart-item-list">
              {cart.map(({ product, quantity }) => {
                const productId = product._id || product.id;
                const title = product.title || product.name || 'Hardware Component';
                const categoryLabel = product.category?.name || product.categoryLabel || product.brand || 'Hardware';
                const price = product.price || 0;
                const image = (product.images && product.images[0]?.url) || product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80';

                return (
                  <div key={productId} className="cart-item-card">
                    <img src={image} alt={title} className="cart-item-thumb" />
                    
                    <div className="cart-item-info">
                      <span className="cart-item-cat">{categoryLabel}</span>
                      <h5 className="cart-item-name">{title}</h5>
                      <div className="cart-item-price">{formatPrice(price)}</div>
                      
                      <div className="cart-item-controls">
                        <div className="qty-picker">
                          <button 
                            onClick={() => updateQuantity(productId, quantity - 1)}
                            className="qty-btn"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="qty-value">{quantity}</span>
                          <button 
                            onClick={() => updateQuantity(productId, quantity + 1)}
                            className="qty-btn"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button 
                          onClick={() => removeFromCart(productId)}
                          className="cart-remove-btn"
                          title="Remove item"
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

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="summary-row">
              <span className="summary-label">Subtotal</span>
              <span className="summary-val">{formatPrice(cartTotal)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Standard Shipping</span>
              <span className="summary-val text-amber">Free</span>
            </div>
            <div className="summary-total-row">
              <span className="total-label">Estimated Total</span>
              <span className="total-val">{formatPrice(cartTotal)}</span>
            </div>

            <button 
              type="button" 
              className="btn-primary checkout-btn"
              onClick={() => {
                alert('Connecting to secure checkout...');
                setIsCartOpen(false);
              }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={17} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
