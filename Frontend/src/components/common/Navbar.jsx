import { useState, useEffect, useRef } from 'react';
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
  HelpCircle,
  LogOut,
  Package,
  Sliders,
  ShieldAlert,
  Cpu
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import GearGridLogo from './GearGridLogo';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  
  const location = useLocation();

  const {
    user,
    logoutUser,
    cartCount,
    wishlistCount,
    setIsSearchOpen,
    showToast
  } = useShop();

  // Optimized passive scroll listener with RAF & change-only dispatch
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const nextScrolled = window.scrollY > 20;
          if (nextScrolled !== isScrolledRef.current) {
            isScrolledRef.current = nextScrolled;
            setIsScrolled(nextScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  // Click outside to close account menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };

    if (accountMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [accountMenuOpen]);

  const handleLogout = () => {
    setAccountMenuOpen(false);
    logoutUser();
  };

  const getUserInitials = (name) => {
    if (!name) return 'GG';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo-icon">
            <GearGridLogo size={22} />
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
            to="/configure" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            title="GearGrid Configure — Intelligent System Recommendation"
          >
            Configure
          </NavLink>

          <NavLink 
            to="/about" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            About
          </NavLink>

          {/* Admin link only visible when user.role === 'admin' */}
          {user && user.role === 'admin' && (
            <NavLink 
              to="/admin" 
              className={({ isActive }) => `nav-link admin-nav-tag ${isActive ? 'active' : ''}`}
            >
              Admin
            </NavLink>
          )}
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

          {/* Wishlist / My Arsenal */}
          <Link 
            to="/wishlist"
            className="action-icon-btn wishlist-nav-btn"
            aria-label="View My Arsenal"
            title="My Arsenal (Wishlist)"
          >
            <Heart size={18} />
            {wishlistCount > 0 && (
              <span className="action-badge badge-wishlist-count">{wishlistCount}</span>
            )}
          </Link>

          {/* Cart / Your Build */}
          <Link 
            to="/cart"
            className="action-icon-btn cart-nav-btn"
            aria-label="View Your Staged Build"
            title="Your Build (Cart)"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="action-badge badge-cart-count">{cartCount}</span>
            )}
          </Link>

          {/* Authentication Slot: Unauthenticated vs Authenticated Profile */}
          {!user ? (
            <Link 
              to="/login"
              className="signin-btn"
              title="Sign In / Register"
            >
              <User size={15} />
              <span>Sign In</span>
            </Link>
          ) : (
            <div className="account-dropdown-wrapper" ref={accountMenuRef}>
              <button
                type="button"
                className={`user-avatar-btn ${accountMenuOpen ? 'active' : ''}`}
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                aria-label="User Account Menu"
                title={`Account: ${user.name}`}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="user-avatar-image" />
                ) : (
                  <div className="user-avatar-fallback">
                    {getUserInitials(user.name)}
                  </div>
                )}
                <span className="user-status-indicator" />
              </button>

              {/* Compact Premium Account Menu */}
              {accountMenuOpen && (
                <div className="account-menu-dropdown">
                  
                  {/* Account Header */}
                  <div className="account-menu-header">
                    <div className="account-menu-user-row">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="dropdown-avatar-sm" />
                      ) : (
                        <div className="dropdown-avatar-fallback-sm">
                          {getUserInitials(user.name)}
                        </div>
                      )}
                      <div className="account-user-meta">
                        <span className="account-meta-name">{user.name}</span>
                        <span className="account-meta-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="account-role-badge">
                      <span className="role-badge-dot" />
                      <span>{user.role ? user.role.toUpperCase() : 'VERIFIED BUILDER'}</span>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="account-menu-links">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="account-menu-item admin-highlight"
                        onClick={() => setAccountMenuOpen(false)}
                      >
                        <ShieldAlert size={15} className="menu-item-icon text-amber" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    <Link
                      to="/wishlist"
                      className="account-menu-item"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <Heart size={15} className="menu-item-icon" />
                      <span>My Hardware Arsenal ({wishlistCount})</span>
                    </Link>

                    <Link
                      to="/cart"
                      className="account-menu-item"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <ShoppingCart size={15} className="menu-item-icon" />
                      <span>Your Build Cart ({cartCount})</span>
                    </Link>

                    <Link
                      to="/build"
                      className="account-menu-item"
                      onClick={() => setAccountMenuOpen(false)}
                    >
                      <Sliders size={15} className="menu-item-icon" />
                      <span>Custom PC Configurator</span>
                    </Link>

                    <button
                      type="button"
                      className="account-menu-item"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        showToast('Order manifest: No active pending shipments.', 'amber');
                      }}
                    >
                      <Package size={15} className="menu-item-icon" />
                      <span>Hardware Orders & Tracking</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="account-menu-divider" />

                  {/* Logout Button */}
                  <button
                    type="button"
                    className="account-menu-logout-btn"
                    onClick={handleLogout}
                  >
                    <LogOut size={15} className="logout-icon" />
                    <span>Sign Out</span>
                  </button>

                </div>
              )}
            </div>
          )}

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
            <NavLink to="/configure" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <Cpu size={18} />
              <span>GearGrid Configure</span>
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
              <HelpCircle size={18} />
              <span>About GearGrid</span>
            </NavLink>
            
            {user && user.role === 'admin' && (
              <NavLink to="/admin" className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
                <ShieldAlert size={18} />
                <span>Admin Operations</span>
              </NavLink>
            )}
          </div>

          <div className="mobile-nav-footer">
            {!user ? (
              <Link 
                to="/login"
                className="btn-primary mobile-signin-btn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={18} />
                <span>Sign In / Create Account</span>
              </Link>
            ) : (
              <div className="mobile-authenticated-block">
                <div className="mobile-user-card">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="mobile-user-avatar" />
                  ) : (
                    <div className="mobile-avatar-fallback">
                      {getUserInitials(user.name)}
                    </div>
                  )}
                  <div className="mobile-user-info">
                    <span className="mobile-user-name">{user.name}</span>
                    <span className="mobile-user-email">{user.email}</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  className="btn-outline mobile-logout-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            <div className="mobile-quick-row">
              <button onClick={() => { setMobileMenuOpen(false); setIsSearchOpen(true); }} className="mobile-sub-action">
                <Search size={16} /> Search
              </button>
              <Link 
                to="/wishlist" 
                onClick={() => setMobileMenuOpen(false)} 
                className="mobile-sub-action"
              >
                <Heart size={16} /> Arsenal ({wishlistCount})
              </Link>
              <Link 
                to="/cart" 
                onClick={() => setMobileMenuOpen(false)} 
                className="mobile-sub-action"
              >
                <ShoppingCart size={16} /> Cart ({cartCount})
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
