import { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './AuthModal.css';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, showToast } = useShop();
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill out all fields.');
      return;
    }
    const displayName = name || email.split('@')[0];
    showToast(`Welcome back, ${displayName}!`, 'cyan');
    setIsAuthOpen(false);
  };

  const handleDemoAccess = () => {
    setEmail('alex.gamer@example.com');
    setPassword('••••••••••••');
    showToast('Signed in with Demo Account', 'cyan');
    setTimeout(() => {
      setIsAuthOpen(false);
    }, 500);
  };

  return (
    <div className="auth-modal-overlay" onClick={() => setIsAuthOpen(false)}>
      <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="auth-modal-header">
          <h3 className="auth-header-title">{tab === 'login' ? 'Sign In to GearGrid' : 'Create an Account'}</h3>
          <button 
            type="button" 
            className="auth-close-btn"
            onClick={() => setIsAuthOpen(false)}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Auth Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-icon-wrapper">
                <User size={17} className="input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="e.g. Alex Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={17} className="input-icon" />
              <input
                type="email"
                required
                className="auth-input"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Password</label>
              {tab === 'login' && (
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => alert('Password reset instructions sent to your email.')}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="input-icon-wrapper">
              <Lock size={17} className="input-icon" />
              <input
                type="password"
                required
                className="auth-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit-btn">
            <span>{tab === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight size={16} />
          </button>

          {/* Quick Demo Access Button */}
          <div className="demo-access-divider">
            <span>OR QUICK PREVIEW</span>
          </div>

          <button
            type="button"
            className="btn-secondary demo-quick-btn"
            onClick={handleDemoAccess}
          >
            Continue with Demo Account
          </button>
        </form>

      </div>
    </div>
  );
}
