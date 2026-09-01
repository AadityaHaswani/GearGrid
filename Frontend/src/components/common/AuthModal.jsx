import { useState, useEffect } from 'react';
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
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { authAPI } from '../../services/api';
import './AuthModal.css';

export default function AuthModal() {
  const { 
    isAuthOpen, 
    setIsAuthOpen, 
    loginUser, 
    authPromptMessage, 
    pendingAuthAction,
  } = useShop();

  // Tab: 'login' | 'register' | 'verify_email' | 'forgot' | 'verify_reset'
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isAuthOpen) return null;

  const handleClose = () => {
    setIsAuthOpen(false);
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      // 1. REGISTER
      if (tab === 'register') {
        if (!name.trim()) {
          setError('Please enter your full name.');
          setIsSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setIsSubmitting(false);
          return;
        }
        if (password.length < 8) {
          setError('Password must contain at least 8 characters.');
          setIsSubmitting(false);
          return;
        }

        const username = name.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || email.split('@')[0];
        const res = await authAPI.register({
          username,
          email: email.trim().toLowerCase(),
          password,
        });

        setSuccessMsg(res.data?.message || 'Verification passcode sent to your email.');
        setTab('verify_email');
        setResendCooldown(60);
        setIsSubmitting(false);
        return;
      }

      // 2. VERIFY EMAIL OTP
      if (tab === 'verify_email') {
        if (!otp || otp.trim().length !== 6) {
          setError('Please enter the 6-digit verification OTP.');
          setIsSubmitting(false);
          return;
        }

        const res = await authAPI.verifyEmailOtp({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        });

        const responseData = res.data?.data;
        if (responseData?.accessToken) {
          localStorage.setItem('geargrid_token', responseData.accessToken);
        }

        const backendUser = responseData?.user;
        const loggedUser = {
          id: backendUser?._id || `usr_${Date.now()}`,
          name: backendUser?.username || email.split('@')[0],
          email: backendUser?.email || email.trim(),
          avatar: backendUser?.avatar?.url || null,
          role: backendUser?.role || 'builder',
        };

        loginUser(loggedUser);
        setIsAuthOpen(false);
        setIsSubmitting(false);
        return;
      }

      // 3. FORGOT PASSWORD
      if (tab === 'forgot') {
        if (!email) {
          setError('Please enter your station email address.');
          setIsSubmitting(false);
          return;
        }

        const res = await authAPI.forgotPassword({
          email: email.trim().toLowerCase(),
        });

        setSuccessMsg(res.data?.message || 'Password reset OTP sent to your email.');
        setTab('verify_reset');
        setResendCooldown(60);
        setIsSubmitting(false);
        return;
      }

      // 4. RESET PASSWORD WITH OTP
      if (tab === 'verify_reset') {
        if (!otp || otp.trim().length !== 6) {
          setError('Please enter the 6-digit recovery code.');
          setIsSubmitting(false);
          return;
        }
        if (!newPassword || newPassword.length < 8) {
          setError('New password must be at least 8 characters.');
          setIsSubmitting(false);
          return;
        }

        const res = await authAPI.resetPassword({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword,
        });

        setSuccessMsg(res.data?.message || 'Password reset successfully! Please sign in.');
        setTab('login');
        setPassword('');
        setOtp('');
        setIsSubmitting(false);
        return;
      }

      // 5. LOGIN
      if (!email || !password) {
        setError('Please provide all required credentials.');
        setIsSubmitting(false);
        return;
      }

      const res = await authAPI.login({
        email: email.trim().toLowerCase(),
        password,
      });

      const responseData = res.data?.data;
      if (responseData?.accessToken) {
        localStorage.setItem('geargrid_token', responseData.accessToken);
      }

      const backendUser = responseData?.user;
      const loggedUser = {
        id: backendUser?._id || `usr_${Date.now()}`,
        name: backendUser?.username || email.split('@')[0],
        email: backendUser?.email || email.trim(),
        avatar: backendUser?.avatar?.url || null,
        role: backendUser?.role || (email.trim().toLowerCase().includes('admin') ? 'admin' : 'builder'),
      };

      loginUser(loggedUser);
      setIsAuthOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email) return;
    setError('');
    try {
      if (tab === 'verify_email') {
        await authAPI.resendEmailOtp({ email: email.trim().toLowerCase() });
        setSuccessMsg('New verification passcode sent to your email.');
      } else {
        await authAPI.forgotPassword({ email: email.trim().toLowerCase() });
        setSuccessMsg('New recovery passcode sent to your email.');
      }
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend passcode.');
    }
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
    
    setTimeout(() => {
      loginUser(demoUser);
      setIsAuthOpen(false);
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
              <span>
                {tab === 'login' && 'GEARGRID // AUTHENTICATION'}
                {tab === 'register' && 'GEARGRID // NEW ACCOUNT'}
                {tab === 'verify_email' && 'GEARGRID // OTP VERIFICATION'}
                {tab === 'forgot' && 'GEARGRID // RECOVERY'}
                {tab === 'verify_reset' && 'GEARGRID // PASSWORD RESET'}
              </span>
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
              {tab === 'login' && 'ACCESS YOUR RIG STATION'}
              {tab === 'register' && 'CREATE YOUR ACCOUNT'}
              {tab === 'verify_email' && 'VERIFY EMAIL ADDRESS'}
              {tab === 'forgot' && 'RESET STATION PASSWORD'}
              {tab === 'verify_reset' && 'ENTER RECOVERY OTP'}
            </h3>
            <p className="auth-modal-subtitle">
              {tab === 'login' && 'Sign in to configure custom liquid-cooled systems and save builds.'}
              {tab === 'register' && 'Join the GearGrid engineering platform for high-performance builds.'}
              {tab === 'verify_email' && `Enter the 6-digit passcode sent to ${email}`}
              {tab === 'forgot' && 'Enter your station email to receive a 6-digit recovery code.'}
              {tab === 'verify_reset' && `Enter the 6-digit recovery code sent to ${email} and your new password.`}
            </p>
          </div>

          {/* Protected Action Info Banner */}
          {(authPromptMessage || pendingAuthAction) && tab === 'login' && (
            <div className="auth-modal-prompt-notice">
              <AlertCircle size={15} className="modal-prompt-icon" />
              <div className="modal-prompt-text">
                <strong>Authentication Required</strong>
                <span>{authPromptMessage || 'Sign in to continue with your selected hardware.'}</span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="auth-modal-error">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="auth-success-banner">
              <CheckCircle2 size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Auth Tab Switcher */}
          {(tab === 'login' || tab === 'register') && (
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
          )}

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

            {(tab === 'login' || tab === 'register' || tab === 'forgot') && (
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
            )}

            {(tab === 'verify_email' || tab === 'verify_reset') && (
              <div className="modal-field-group">
                <label className="modal-field-label" htmlFor="modal-otp">6-Digit Passcode</label>
                <div className="modal-input-wrap">
                  <input
                    id="modal-otp"
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    className="modal-input-field modal-otp-input"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>
                <div className="modal-resend-row">
                  <span className="modal-resend-text">Didn't receive passcode?</span>
                  <button
                    type="button"
                    className="modal-resend-btn"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            )}

            {tab === 'verify_reset' && (
              <div className="modal-field-group">
                <label className="modal-field-label" htmlFor="modal-new-password">New Password (Min. 8 characters)</label>
                <div className="modal-input-wrap">
                  <Lock size={16} className="modal-field-icon" />
                  <input
                    id="modal-new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="modal-input-field"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
            )}

            {(tab === 'login' || tab === 'register') && (
              <div className="modal-field-group">
                <div className="modal-label-row">
                  <label className="modal-field-label" htmlFor="modal-password">Password</label>
                  {tab === 'login' && (
                    <button
                      type="button"
                      className="modal-forgot-btn"
                      onClick={() => {
                        setTab('forgot');
                        setError('');
                        setSuccessMsg('');
                      }}
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
            )}

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
            <button type="submit" className="btn-primary auth-modal-submit-btn" disabled={isSubmitting}>
              <span>
                {isSubmitting ? 'PROCESSING...' : (
                  tab === 'login' ? 'SIGN IN' :
                  tab === 'register' ? 'CREATE ACCOUNT & SEND OTP' :
                  tab === 'verify_email' ? 'VERIFY & ENTER STATION' :
                  tab === 'forgot' ? 'SEND RECOVERY CODE' :
                  'RESET PASSWORD & SIGN IN'
                )}
              </span>
              <ArrowRight size={15} />
            </button>

            {/* Back to sign in link for OTP / Forgot views */}
            {(tab === 'verify_email' || tab === 'forgot' || tab === 'verify_reset') && (
              <button
                type="button"
                className="modal-forgot-btn modal-back-btn"
                onClick={() => {
                  setTab('login');
                  setError('');
                  setSuccessMsg('');
                }}
              >
                Back to Sign In
              </button>
            )}

            {/* Demo Access Button (only in login) */}
            {tab === 'login' && (
              <button
                type="button"
                className="btn-outline auth-modal-demo-btn"
                onClick={handleDemoSignIn}
              >
                <Zap size={13} className="modal-demo-icon" />
                <span>Sign In as Demo Builder</span>
              </button>
            )}

          </form>

        </div>

      </div>
    </div>
  );
}
