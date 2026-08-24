import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Grid,
  Layers,
  Wrench,
  HelpCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setIsAuthOpen
  } = useShop();

  // Glassmorphic solidifying on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="brand-title">Gear<span className="brand-accent">Grid</span></span>
        </Link>

        {/* Center Navigation */}
        <nav className="navbar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>

          <NavLink 
            to="/shop" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Shop
          </NavLink>

          <NavLink 
            to="/build" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            PC Builder
          </NavLink>

          <NavLink 
            to="/about" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            About
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          
          {/* Quick Search */}
          <button 
            type="button"
            className="action-icon-btn search-btn"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search products"
            title="Search (Ctrl+K)"
          >
            <Search size={18} />
          </button>

          {/* Wishlist */}
          <button 
            type="button"
            className="action-icon-btn"
            onClick={() => setIsWishlistOpen(true)}
            aria-label="View Wishlist"
            title="Wishlist"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="action-badge badge-wishlist-count">{wishlistCount}</span>
            )}
          </button>

          {/* Cart */}
          <button 
            type="button"
            className="action-icon-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="View Shopping Cart"
            title="Shopping Cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="action-badge badge-cart-count">{cartCount}</span>
            )}
          </button>

          {/* Sign In */}
          <button 
            type="button"
            className="signin-btn"
            onClick={() => setIsAuthOpen(true)}
          >
            <User size={16} />
            <span>Sign In</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          <div className="mobile-nav-links">
            <NavLink to="/" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`} end>
              <Grid size={18} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <Layers size={18} />
              <span>Hardware Shop</span>
            </NavLink>
            <NavLink to="/build" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <Wrench size={18} />
              <span>Custom PC Builder</span>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <HelpCircle size={18} />
              <span>About GearGrid</span>
            </NavLink>
          </div>

          <div className="mobile-nav-footer">
            <button 
              className="btn-primary mobile-signin-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAuthOpen(true);
              }}
            >
              <User size={18} />
              <span>Sign In / Create Account</span>
            </button>
            <div className="mobile-quick-row">
              <button onClick={() => { setMobileMenuOpen(false); setIsSearchOpen(true); }} className="mobile-sub-action">
                <Search size={16} /> Search
              </button>
              <button onClick={() => { setMobileMenuOpen(false); setIsWishlistOpen(true); }} className="mobile-sub-action">
                <Heart size={16} /> Wishlist ({wishlistCount})
              </button>
              <button onClick={() => { setMobileMenuOpen(false); setIsCartOpen(true); }} className="mobile-sub-action">
                <ShoppingCart size={16} /> Cart ({cartCount})
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
