import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="product-item-card">
      
      {/* Media & Badges */}
      <div className="product-img-wrapper">
        <img src={product.image} alt={product.name} className="product-photo" loading="lazy" />
        
        {product.badge && (
          <span className="product-tag-badge">{product.badge}</span>
        )}

        <button
          type="button"
          className={`product-heart-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={isWishlisted ? "var(--accent-red)" : "none"} />
        </button>
      </div>

      {/* Content */}
      <div className="product-details">
        <div className="product-meta-row">
          <span className="product-category">{product.categoryLabel}</span>
          <div className="product-stars">
            <Star size={12} fill="#F59E0B" className="star-gold" />
            <span>{product.rating}</span>
            <span className="product-review-num">({product.reviews})</span>
          </div>
        </div>

        <h3 className="product-name">{product.name}</h3>

        {/* Specs */}
        <div className="product-specs-row">
          {product.specs.slice(0, 3).map((spec, i) => (
            <span key={i} className="product-spec-pill">{spec}</span>
          ))}
        </div>

        {/* Price & Cart CTA */}
        <div className="product-buy-row">
          <div className="product-price-block">
            <span className="current-price">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="old-price">${product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <button
            type="button"
            className="btn-primary product-cart-btn"
            onClick={() => addToCart(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={15} />
            <span>Add</span>
          </button>
        </div>

      </div>

    </div>
  );
}
