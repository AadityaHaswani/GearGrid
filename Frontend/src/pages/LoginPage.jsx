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
  Heart,
  KeyRound,
  RotateCw
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { authAPI } from '../services/api';
import './LoginPage.css';

export default function LoginPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, user, pendingAuthAction } = useShop();

  // Mode: 'login' | 'register' | 'verify_email' | 'forgot' | 'verify_reset'
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend Cooldown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Synchronize mode when navigating
  useEffect(() => {
    if (initialMode === 'register') {
      setMode('register');
    } else if (initialMode === 'login' && mode !== 'verify_email' && mode !== 'verify_reset' && mode !== 'forgot') {
      setMode('login');
    }
    setError('');
    setSuccessMsg('');
  }, [initialMode, location.pathname]);

  const returnPath = location.state?.from || pendingAuthAction?.from || '/';

  // If already authenticated
  if (user) {
    return (
      <div className="login-page-root">
        <div className="login-backdrop-image" />
        <div className="login-backdrop-overlay" />

        <header className="login-fullscreen-topbar">
          <Link to="/" className="login-topbar-brand">
            <div className="topbar-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 17L12 22L22 17" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                  {(user.name || 'GG').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
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

  // Handle Form Submission based on mode
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      // 1. REGISTER MODE
      if (mode === 'register') {
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
        setMode('verify_email');
        setResendCooldown(60);
        setIsSubmitting(false);
        return;
      }

      // 2. VERIFY EMAIL OTP MODE
      if (mode === 'verify_email') {
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

        loginUser(loggedUser, returnPath);
        setIsSubmitting(false);
        return;
      }

      // 3. FORGOT PASSWORD MODE
      if (mode === 'forgot') {
        if (!email) {
          setError('Please enter your station email address.');
          setIsSubmitting(false);
          return;
        }

        const res = await authAPI.forgotPassword({
          email: email.trim().toLowerCase(),
        });

        setSuccessMsg(res.data?.message || 'Password reset OTP sent to your email.');
        setMode('verify_reset');
        setResendCooldown(60);
        setIsSubmitting(false);
        return;
      }

      // 4. RESET PASSWORD WITH OTP MODE
      if (mode === 'verify_reset') {
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
        setMode('login');
        setPassword('');
        setOtp('');
        setIsSubmitting(false);
        return;
      }

      // 5. LOGIN MODE
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
        id: backendUser?._id,
        name: backendUser?.username || backendUser?.name || email.split('@')[0],
        email: backendUser?.email || email.trim(),
        avatar: backendUser?.avatar?.url || null,
        role: backendUser?.role || 'user',
      };

      loginUser(loggedUser, loggedUser.role === 'admin' && returnPath === '/' ? '/admin' : returnPath);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP Action
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || !email) return;
    setError('');
    try {
      if (mode === 'verify_email') {
        await authAPI.resendEmailOtp({ email: email.trim().toLowerCase() });
        setSuccessMsg('New verification code sent to your email.');
      } else {
        await authAPI.forgotPassword({ email: email.trim().toLowerCase() });
        setSuccessMsg('New recovery code sent to your email.');
      }
      setResendCooldown(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code. Please wait.');
    }
  };



  return (
    <div className="login-page-root">

      {/* Full-screen Cinematic Hardware Background */}
      <div className="login-backdrop-image" />
      <div className="login-backdrop-overlay" />

      {/* Standalone Topbar Navigation */}
      <header className="login-fullscreen-topbar">
        <Link to="/" className="login-topbar-brand">
          <div className="topbar-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

        {/* Left Side: Brand Narrative */}
        <div className="login-brand-narrative">
          <span className="narrative-tag">
            {mode === 'login' && 'GEARGRID // STATION ACCESS'}
            {mode === 'register' && 'GEARGRID // BUILDER REGISTRATION'}
            {mode === 'verify_email' && 'GEARGRID // IDENTITY VERIFICATION'}
            {mode === 'forgot' && 'GEARGRID // STATION RECOVERY'}
            {mode === 'verify_reset' && 'GEARGRID // CREDENTIAL RESET'}
          </span>
          <h1 className="narrative-heading">
            POWER YOUR BUILD.<br />
            MANAGE YOUR RIG.
          </h1>
          <p className="narrative-desc">
            {mode === 'login' && 'Sign in to configure custom liquid-cooled machines, save hardware manifests, and sync verified parts directly with the Build Lab.'}
            {mode === 'register' && 'Create your builder profile to save custom PC builds, manage hardware orders, and access real-time thermal calculations.'}
            {mode === 'verify_email' && 'A 6-digit one-time passcode has been transmitted to your email to authenticate your station identity.'}
            {mode === 'forgot' && 'Provide your station email to receive an authorized 6-digit recovery code.'}
            {mode === 'verify_reset' && 'Enter your verified 6-digit passcode to configure new encrypted station credentials.'}
          </p>

          <div className="narrative-perks-list">
            <div className="narrative-perk-item">
              <ShieldCheck size={16} className="perk-icon" />
              <span>100% Verified Hardware Matrix & Encrypted Sessions</span>
            </div>
            <div className="narrative-perk-item">
              <Zap size={16} className="perk-icon" />
              <span>Automated Nodemailer Gmail Transmission Protocol</span>
            </div>
          </div>
        </div>

        {/* Right Side: Refined Auth Panel */}
        <div className={`login-panel ${mode === 'register' ? 'register-mode-panel' : ''}`}>

          {/* Header Brand */}
          <div className="login-panel-header">
            <div className="auth-brand-badge">
              <span className="auth-brand-dot" />
              <span>
                {mode === 'login' && 'GEARGRID // AUTHENTICATION'}
                {mode === 'register' && 'GEARGRID // NEW ACCOUNT'}
                {mode === 'verify_email' && 'GEARGRID // OTP VERIFICATION'}
                {mode === 'forgot' && 'GEARGRID // RECOVER ACCOUNT'}
                {mode === 'verify_reset' && 'GEARGRID // RESET CREDENTIALS'}
              </span>
            </div>
            <h2 className="login-panel-title">
              {mode === 'login' && 'ACCESS YOUR RIG STATION'}
              {mode === 'register' && 'CREATE YOUR ACCOUNT'}
              {mode === 'verify_email' && 'VERIFY EMAIL ADDRESS'}
              {mode === 'forgot' && 'RESET STATION PASSWORD'}
              {mode === 'verify_reset' && 'ENTER RECOVERY OTP'}
            </h2>
            <p className="login-panel-subtitle">
              {mode === 'login' && 'Enter your credentials to manage your builds and hardware orders.'}
              {mode === 'register' && 'Join the GearGrid engineering platform for high-performance builds.'}
              {mode === 'verify_email' && `Enter the 6-digit passcode sent to ${email}`}
              {mode === 'forgot' && 'Enter your registered email address to receive a recovery code.'}
              {mode === 'verify_reset' && `Enter the 6-digit recovery code sent to ${email} and your new password.`}
            </p>
          </div>

          {/* Preserved Pending Action Notice */}
          {pendingAuthAction && pendingAuthAction.product && mode === 'login' && (
            <div className="auth-prompt-notice">
              {pendingAuthAction.type === 'cart' ? (
                <ShoppingCart size={15} className="prompt-notice-icon" />
              ) : (
                <Heart size={15} className="prompt-notice-icon" />
              )}
              <div className="prompt-notice-text">
                <strong>Authentication Required</strong>
                <span>
                  Sign in to {pendingAuthAction.type === 'cart' ? 'add' : 'save'} "{(pendingAuthAction.product.title || pendingAuthAction.product.name || 'Hardware').split('(')[0].trim()}" to your {pendingAuthAction.type === 'cart' ? 'cart' : 'wishlist'}.
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="auth-error-banner" role="alert">
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

          {/* Form */}
          <form onSubmit={handleSubmit} className={`login-form-body ${mode === 'register' ? 'compact-register-form' : ''}`}>

            {/* 1. REGISTER MODE: Full Name */}
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

            {/* 2. COMMON EMAIL FIELD (Login, Register, Forgot) */}
            {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
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
            )}

            {/* 3. OTP FIELD (Verify Email & Reset Password) */}
            {(mode === 'verify_email' || mode === 'verify_reset') && (
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="auth-otp">6-Digit Passcode</label>
                <div className="auth-input-wrapper">
                  <input
                    id="auth-otp"
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    className="auth-text-field auth-otp-input"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>
                <div className="auth-resend-row">
                  <span className="auth-resend-text">Didn't receive passcode?</span>
                  <button
                    type="button"
                    className="auth-resend-btn"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            )}

            {/* 4. NEW PASSWORD (Reset Mode) */}
            {mode === 'verify_reset' && (
              <div className="auth-input-group">
                <label className="auth-label" htmlFor="new-password">New Password (Min. 8 characters)</label>
                <div className="auth-input-wrapper">
                  <Lock size={16} className="auth-field-icon" />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="auth-text-field"
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
            )}

            {/* 5. PASSWORD FIELD (Login & Register) */}
            {(mode === 'login' || mode === 'register') && (
              <div className="auth-input-group">
                <div className="auth-label-row">
                  <label className="auth-label" htmlFor="login-password">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      className="auth-forgot-link"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                        setSuccessMsg('');
                      }}
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
            )}

            {/* 6. CONFIRM PASSWORD (Register) */}
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

            {/* Remember Me on Login */}
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

            {/* Primary Submit Button */}
            <button type="submit" className="btn-primary auth-submit-btn" disabled={isSubmitting}>
              <span>
                {isSubmitting ? 'PROCESSING...' : (
                  mode === 'login' ? 'SIGN IN' :
                    mode === 'register' ? 'CREATE ACCOUNT & SEND OTP' :
                      mode === 'verify_email' ? 'VERIFY & ENTER STATION' :
                        mode === 'forgot' ? 'SEND RECOVERY CODE' :
                          'RESET PASSWORD & SIGN IN'
                )}
              </span>
              <ArrowRight size={15} />
            </button>



          </form>

          {/* Panel Footer / Mode Switching */}
          <div className="login-panel-footer">
            {mode === 'login' && (
              <p className="auth-switch-text">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => {
                    setMode('register');
                    setError('');
                    setSuccessMsg('');
                  }}
                >
                  CREATE ACCOUNT
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p className="auth-switch-text">
                Already registered?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                >
                  SIGN IN
                </button>
              </p>
            )}

            {(mode === 'verify_email' || mode === 'forgot' || mode === 'verify_reset') && (
              <p className="auth-switch-text">
                Return to sign in?{' '}
                <button
                  type="button"
                  className="auth-switch-btn"
                  onClick={() => {
                    setMode('login');
                    setError('');
                    setSuccessMsg('');
                  }}
                >
                  BACK TO SIGN IN
                </button>
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
