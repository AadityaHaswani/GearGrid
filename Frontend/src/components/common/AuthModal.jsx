import { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Zap, 
  AlertCircle,
  ShieldCheck 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './AuthModal.css';

export default function AuthModal() {
  const { 
    isAuthOpen, 
    setIsAuthOpen, 
    loginUser, 
    authPromptMessage, 
    pendingAuthAction,
    setPendingAuthAction,
    setAuthPromptMessage 
  } = useShop();

  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  if (!isAuthOpen) return null;

  const handleClose = () => {
    setIsAuthOpen(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide all required credentials.');
      return;
    }

    if (tab === 'register') {
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

      loginUser(newUser);
      return;
    }

    // Login mode
    const loggedUser = {
      id: `usr_demo_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
      email: email.trim(),
      avatar: null,
      role: 'Builder Pro'
    };

    loginUser(loggedUser);
  };

  const handleDemoSignIn = () => {
    setError('');
    const demoUser = {
      id: 'usr_demo_88',
      name: 'Alex Miller',
      email: 'alex.miller@geargrid.io',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      role: 'Master Builder'
    };

    setEmail(demoUser.email);
    setPassword('••••••••••••');
    
    setTimeout(() => {
      loginUser(demoUser);
    }, 350);
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal-window" onClick={(e) => e.stopPropagation()}>
        
        {/* Background Visual Inside Modal */}
        <div className="auth-modal-backdrop-img" />
        <div className="auth-modal-backdrop-overlay" />

        <div className="auth-modal-content">
          
          {/* Top Bar with Close */}
          <div className="auth-modal-topbar">
            <div className="auth-modal-brand-badge">
              <span className="auth-brand-dot" />
              <span>GEARGRID // AUTHENTICATION</span>
            </div>
            <button 
              type="button" 
              className="auth-modal-close-btn"
              onClick={handleClose}
              aria-label="Close authentication modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Heading */}
          <div className="auth-modal-header-block">
            <h3 className="auth-modal-title">
              {tab === 'login' ? 'ACCESS YOUR RIG STATION' : 'CREATE YOUR ACCOUNT'}
            </h3>
            <p className="auth-modal-subtitle">
              {tab === 'login'
                ? 'Sign in to configure custom liquid-cooled systems and save builds.'
                : 'Join the GearGrid engineering platform for high-performance builds.'}
            </p>
          </div>

          {/* Protected Action Info Banner */}
          {(authPromptMessage || pendingAuthAction) && (
            <div className="auth-modal-prompt-notice">
              <AlertCircle size={15} className="modal-prompt-icon" />
              <div className="modal-prompt-text">
                <strong>Authentication Required</strong>
                <span>{authPromptMessage || 'Sign in to continue with your selected hardware.'}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="auth-modal-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Auth Tab Switcher */}
          <div className="auth-modal-tabs">
            <button
              type="button"
              className={`auth-modal-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError(''); }}
            >
              SIGN IN
            </button>
            <button
              type="button"
              className={`auth-modal-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setError(''); }}
            >
              REGISTER
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-modal-form">
            
            {tab === 'register' && (
              <div className="modal-field-group">
                <label className="modal-field-label" htmlFor="modal-name">Full Name</label>
                <div className="modal-input-wrap">
                  <User size={16} className="modal-field-icon" />
                  <input
                    id="modal-name"
                    type="text"
                    required
                    className="modal-input-field"
                    placeholder="e.g. Alex Miller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="modal-field-group">
              <label className="modal-field-label" htmlFor="modal-email">Email Address</label>
              <div className="modal-input-wrap">
                <Mail size={16} className="modal-field-icon" />
                <input
                  id="modal-email"
                  type="email"
                  required
                  className="modal-input-field"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-field-group">
              <div className="modal-label-row">
                <label className="modal-field-label" htmlFor="modal-password">Password</label>
                {tab === 'login' && (
                  <button
                    type="button"
                    className="modal-forgot-btn"
                    onClick={() => alert('Password reset verification link has been sent to your email.')}
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="modal-input-wrap">
                <Lock size={16} className="modal-field-icon" />
                <input
                  id="modal-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="modal-input-field"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="modal-visibility-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {tab === 'register' && (
              <div className="modal-field-group">
                <label className="modal-field-label" htmlFor="modal-confirm-pass">Confirm Password</label>
                <div className="modal-input-wrap">
                  <Lock size={16} className="modal-field-icon" />
                  <input
                    id="modal-confirm-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="modal-input-field"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            )}

            {tab === 'login' && (
              <div className="modal-options-row">
                <label className="modal-remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember this workstation</span>
                </label>
              </div>
            )}

            {/* Primary Submit */}
            <button type="submit" className="btn-primary auth-modal-submit-btn">
              <span>{tab === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
              <ArrowRight size={15} />
            </button>

            {/* Demo Access Button */}
            <button
              type="button"
              className="btn-outline auth-modal-demo-btn"
              onClick={handleDemoSignIn}
            >
              <Zap size={13} className="modal-demo-icon" />
              <span>Sign In as Demo Builder</span>
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}
