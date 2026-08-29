import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  AlertCircle,
  Zap,
  CheckCircle2,
  ShoppingCart,
  Heart
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './LoginPage.css';

export default function LoginPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, user, pendingAuthAction } = useShop();

  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Synchronize mode when navigating between /login and /register routes
  useEffect(() => {
    setMode(initialMode);
    setError('');
    setSuccessMsg('');
  }, [initialMode, location.pathname]);

  // Destination to return after authenticating
  const returnPath = location.state?.from || pendingAuthAction?.from || '/';

  // If already authenticated, show quick status
  if (user) {
    return (
      <div className="login-page-root">
        <div className="login-backdrop-image" />
        <div className="login-backdrop-overlay" />
        
        <header className="login-fullscreen-topbar">
          <Link to="/" className="login-topbar-brand">
            <div className="topbar-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="topbar-brand-title">Gear<span className="brand-accent">Grid</span></span>
          </Link>

          <Link to="/" className="login-return-link">
            <ArrowLeft size={15} />
            <span>Return to Store</span>
          </Link>
        </header>

        <div className="login-page-container">
          <div className="login-panel already-authenticated-panel">
            <div className="auth-brand-badge">
              <span className="auth-brand-dot" />
              <span>GEARGRID // ACTIVE SESSION</span>
            </div>
            <div className="auth-user-preview">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="auth-avatar-img" />
              ) : (
                <div className="auth-avatar-initials">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              <h2 className="auth-welcome-name">Logged in as {user.name}</h2>
              <p className="auth-user-email">{user.email}</p>
            </div>
            <div className="auth-action-buttons">
              <button 
                type="button" 
                className="btn-primary auth-submit-btn"
                onClick={() => navigate(returnPath)}
              >
                <span>Continue to Workstation</span>
                <ArrowRight size={16} />
              </button>
              <Link to="/build" className="btn-outline auth-secondary-action-btn">
                <span>Open PC Configurator</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !password) {
      setError('Please provide all required credentials.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must contain at least 6 characters.');
        return;
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        avatar: null,
        role: 'Builder Pro'
      };

      loginUser(newUser, returnPath);
      return;
    }

    // Login mode
    const isAdmin = email.trim().toLowerCase().includes('admin');
    const loggedUser = {
      id: `usr_demo_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
      email: email.trim(),
      avatar: null,
      role: isAdmin ? 'admin' : 'builder'
    };

    loginUser(loggedUser, isAdmin && returnPath === '/' ? '/admin' : returnPath);
  };

  const handleDemoSignIn = () => {
    setError('');
    const demoUser = {
      id: 'usr_demo_88',
      name: 'Alex Miller',
      email: 'alex.miller@geargrid.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'builder'
    };

    setEmail(demoUser.email);
    setPassword('••••••••••••');
    setSuccessMsg('Authenticating verified demo account...');
    
    setTimeout(() => {
      loginUser(demoUser, returnPath);
    }, 400);
  };

  const handleAdminSignIn = () => {
    setError('');
    const adminUser = {
      id: 'usr_admin_01',
      name: 'Valen Drake',
      email: 'admin@geargrid.io',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      role: 'admin'
    };

    setEmail(adminUser.email);
    setPassword('••••••••••••');
    setSuccessMsg('Authenticating verified Administrator console...');
    
    setTimeout(() => {
      loginUser(adminUser, '/admin');
    }, 400);
  };

  return (
    <div className="login-page-root">
      
      {/* Full-screen Cinematic Hardware Background (Fixed Viewport Layer) */}
      <div className="login-backdrop-image" />
      <div className="login-backdrop-overlay" />

      {/* Standalone Topbar Navigation */}
      <header className="login-fullscreen-topbar">
        <Link to="/" className="login-topbar-brand">
          <div className="topbar-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="topbar-brand-title">Gear<span className="brand-accent">Grid</span></span>
        </Link>

        <Link to={returnPath} className="login-return-link">
          <ArrowLeft size={15} />
          <span>Return to Store</span>
        </Link>
      </header>

      <div className="login-page-container">
        
        {/* Left Side: Brand Narrative (visible on wide desktop) */}
        <div className="login-brand-narrative">
          <span className="narrative-tag">
            {mode === 'login' ? 'GEARGRID // STATION ACCESS' : 'GEARGRID // BUILDER REGISTRATION'}
          </span>
          <h1 className="narrative-heading">
            POWER YOUR BUILD.<br />
            MANAGE YOUR RIG.
          </h1>
          <p className="narrative-desc">
            {mode === 'login' 
              ? 'Sign in to configure custom liquid-cooled machines, save hardware manifests, and sync verified parts directly with the Build Lab.'
              : 'Create your builder profile to save custom PC builds, manage hardware orders, and access real-time thermal calculations.'}
          </p>

          <div className="narrative-perks-list">
            <div className="narrative-perk-item">
              <ShieldCheck size={16} className="perk-icon" />
              <span>100% Verified Hardware Compatibility Matrix</span>
            </div>
            <div className="narrative-perk-item">
              <Zap size={16} className="perk-icon" />
              <span>Real-time Thermal & Power Draw Calibration</span>
            </div>
          </div>
        </div>

        {/* Right Side: Refined Compact Auth Panel */}
        <div className={`login-panel ${mode === 'register' ? 'register-mode-panel' : ''}`}>
          
          {/* Header Brand */}
          <div className="login-panel-header">
            <div className="auth-brand-badge">
              <span className="auth-brand-dot" />
              <span>{mode === 'login' ? 'GEARGRID // AUTHENTICATION' : 'GEARGRID // NEW ACCOUNT'}</span>
            </div>
            <h2 className="login-panel-title">
              {mode === 'login' ? 'ACCESS YOUR RIG STATION' : 'CREATE YOUR ACCOUNT'}
            </h2>
            <p className="login-panel-subtitle">
              {mode === 'login' 
                ? 'Enter your credentials to manage your builds and hardware orders.'
                : 'Join the GearGrid engineering platform for high-performance builds.'}
            </p>
          </div>

          {/* Preserved Pending Action Notice */}
          {pendingAuthAction && pendingAuthAction.product && (
            <div className="auth-prompt-notice">
              {pendingAuthAction.type === 'cart' ? (
                <ShoppingCart size={15} className="prompt-notice-icon" />
              ) : (
                <Heart size={15} className="prompt-notice-icon" />
              )}
              <div className="prompt-notice-text">
                <strong>Authentication Required</strong>
                <span>
                  Sign in to {pendingAuthAction.type === 'cart' ? 'add' : 'save'} "{pendingAuthAction.product.name.split('(')[0].trim()}" to your {pendingAuthAction.type === 'cart' ? 'cart' : 'wishlist'}.
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="auth-error-banner" role="alert">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Success / Loading Message */}
          {successMsg && (
            <div className="auth-success-banner">
              <CheckCircle2 size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className={`login-form-body ${mode === 'register' ? 'compact-register-form' : ''}`}>
            
            {mode === 'register' && (
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="register-name">Full Name</label>
                <div className="auth-input-wrapper">
                  <User size={16} className="auth-field-icon" />
                  <input
                    id="register-name"
                    type="text"
                    required
                    className="auth-text-field"
                    placeholder="e.g. Alex Miller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="auth-input-group">
              <label className="auth-label" htmlFor="login-email">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-field-icon" />
                <input
                  id="login-email"
                  type="email"
                  required
                  className="auth-text-field"
                  placeholder="your.name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-input-group">
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="login-password">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={() => alert('Password reset verification link has been sent to your email.')}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-field-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="auth-text-field"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="auth-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="register-confirm">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-field-icon" />
                  <input
                    id="register-confirm"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="auth-text-field"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="auth-options-row">
                <label className="auth-remember-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember this workstation</span>
                </label>
              </div>
            )}

            {/* Primary Action Button */}
            <button type="submit" className="btn-primary auth-submit-btn">
              <span>{mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
              <ArrowRight size={15} />
            </button>

            {/* Quick Demo Access Buttons */}
            <div className="auth-divider">
              <span>OR INSTANT PREVIEW</span>
            </div>

            <div className="auth-demo-grid">
              <button
                type="button"
                className="btn-outline auth-demo-btn"
                onClick={handleDemoSignIn}
              >
                <Zap size={13} className="demo-btn-icon" />
                <span>Sign In as Builder</span>
              </button>

              <button
                type="button"
                className="btn-outline auth-demo-btn admin-demo-btn"
                onClick={handleAdminSignIn}
                style={{ borderColor: 'rgba(245, 158, 11, 0.35)', color: 'var(--accent-amber)' }}
              >
                <ShieldCheck size={13} className="demo-btn-icon text-amber" />
                <span>Admin Operations</span>
              </button>
            </div>

          </form>

          {/* Toggle Mode Footer */}
          <div className="login-panel-footer">
            {mode === 'login' ? (
              <p className="auth-switch-text">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                >
                  CREATE ACCOUNT
                </button>
              </p>
            ) : (
              <p className="auth-switch-text">
                Already registered?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                >
                  SIGN IN
                </button>
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
