import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  ShoppingCart, 
  Heart, 
  Cpu, 
  Loader2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { authAPI } from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUser, logoutUser, showToast, cartCount, wishlistCount } = useShop();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successBanner, setSuccessBanner] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  
  // Avatar upload
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Synchronize state when user object changes or edit mode toggles
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setStateVal(user.state || '');
      setPostalCode(user.postalCode || '');
      setCountry(user.country || 'India');
      setAvatarPreview(user.avatar || null);
      setAvatarFile(null);
    }
  }, [user, isEditing]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Avatar image size must be under 5MB.');
      return;
    }

    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
    setErrorMsg('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMsg('');
    setSuccessBanner('');
    if (user) {
      setFullName(user.fullName || user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setStateVal(user.state || '');
      setPostalCode(user.postalCode || '');
      setCountry(user.country || 'India');
      setAvatarPreview(user.avatar || null);
      setAvatarFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessBanner('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('phone', phone.trim());
      formData.append('address', address.trim());
      formData.append('city', city.trim());
      formData.append('state', stateVal.trim());
      formData.append('postalCode', postalCode.trim());
      formData.append('country', country.trim() || 'India');

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await authAPI.updateProfile(formData);
      const updatedData = res.data?.data;

      if (updatedData) {
        updateUser(updatedData);
        setSuccessBanner('Profile updated successfully!');
        showToast('Profile updated successfully!', 'amber');
        setIsEditing(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update profile. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = (nameStr) => {
    if (!nameStr) return 'GG';
    const parts = nameStr.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatJoinDate = (dateVal) => {
    if (!dateVal) return 'Verified Member';
    try {
      const d = new Date(dateVal);
      return `Member since ${d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    } catch {
      return 'Verified Member';
    }
  };

  const displayName = fullName || user?.name || user?.username || 'Builder';

  return (
    <div className="profile-page-wrapper">
      <div className="profile-container">
        
        {/* Breadcrumb / Top Bar */}
        <div className="profile-top-bar">
          <div className="profile-breadcrumb">
            <Link to="/" className="breadcrumb-link">GearGrid</Link>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">User Profile</span>
          </div>
          <div className="profile-system-status">
            <span className="system-dot" />
            <span className="system-status-text">SYSTEM OPERATIONAL // ENCRYPTED SESSION</span>
          </div>
        </div>

        {/* Success / Error Banners */}
        {successBanner && (
          <div className="profile-banner banner-success" role="alert">
            <CheckCircle2 size={18} className="banner-icon" />
            <span>{successBanner}</span>
            <button type="button" className="banner-close" onClick={() => setSuccessBanner('')} aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="profile-banner banner-error" role="alert">
            <AlertCircle size={18} className="banner-icon" />
            <span>{errorMsg}</span>
            <button type="button" className="banner-close" onClick={() => setErrorMsg('')} aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        )}

        {/* Profile Hero Header Card */}
        <section className="profile-hero-card">
          <div className="profile-hero-background-grid" />
          
          <div className="profile-hero-content">
            {/* Avatar Section */}
            <div className="profile-avatar-container">
              <div className="profile-avatar-frame">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt={displayName} 
                    className="profile-avatar-img" 
                  />
                ) : (
                  <div className="profile-avatar-fallback">
                    {getUserInitials(displayName)}
                  </div>
                )}
                
                {isEditing && (
                  <label 
                    htmlFor="avatar-upload-input" 
                    className="profile-avatar-edit-overlay"
                    title="Change Profile Avatar"
                  >
                    <Camera size={20} />
                    <span className="avatar-edit-label">Upload</span>
                  </label>
                )}
              </div>

              {isEditing && (
                <input 
                  type="file" 
                  id="avatar-upload-input" 
                  ref={fileInputRef} 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={handleAvatarChange}
                  className="profile-hidden-file-input"
                  aria-label="Upload profile avatar"
                />
              )}
            </div>

            {/* User Primary Meta */}
            <div className="profile-hero-meta">
              <div className="profile-hero-badges">
                <span className={`profile-role-badge ${user?.role === 'admin' ? 'role-admin' : 'role-builder'}`}>
                  <Shield size={13} />
                  <span>{user?.role === 'admin' ? 'SYSTEM ADMINISTRATOR' : 'VERIFIED BUILDER'}</span>
                </span>
                <span className="profile-date-badge">
                  <Calendar size={13} />
                  <span>{formatJoinDate(user?.createdAt)}</span>
                </span>
              </div>

              <h1 className="profile-hero-name">{displayName}</h1>
              
              <div className="profile-hero-handle">
                <Mail size={14} className="hero-handle-icon" />
                <span className="hero-handle-email">{user?.email}</span>
                {user?.username && (
                  <span className="hero-handle-tag">@{user.username}</span>
                )}
              </div>
            </div>

            {/* Quick Hero Actions */}
            <div className="profile-hero-actions">
              {!isEditing ? (
                <button 
                  type="button" 
                  className="btn-primary profile-edit-btn"
                  onClick={() => setIsEditing(true)}
                  id="edit-profile-btn"
                >
                  <Edit3 size={16} />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="profile-edit-mode-actions">
                  <button 
                    type="button" 
                    className="btn-outline profile-cancel-btn"
                    onClick={handleCancel}
                    disabled={loading}
                    id="cancel-profile-btn"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </button>
                  <button 
                    type="submit" 
                    form="profile-edit-form"
                    className="btn-primary profile-save-btn"
                    disabled={loading}
                    id="save-profile-btn"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="spinner" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Profile Grid */}
        <div className="profile-layout-grid">
          
          {/* Left Column: Information / Form */}
          <main className="profile-main-column">
            
            {/* If Edit Mode */}
            {isEditing ? (
              <form id="profile-edit-form" onSubmit={handleSubmit} className="profile-card profile-form-card">
                <div className="card-header">
                  <div className="card-header-icon">
                    <Edit3 size={18} />
                  </div>
                  <div>
                    <h2 className="card-title">Edit Personal Details</h2>
                    <p className="card-subtitle">Keep your hardware delivery and contact information updated.</p>
                  </div>
                </div>

                <div className="form-fields-grid">
                  {/* Full Name */}
                  <div className="form-group col-span-2">
                    <label htmlFor="fullNameInput" className="form-label">
                      Full Name
                    </label>
                    <div className="input-with-icon">
                      <User size={16} className="field-icon" />
                      <input 
                        type="text" 
                        id="fullNameInput"
                        className="form-input" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Mercer"
                        maxLength={100}
                        required
                      />
                    </div>
                  </div>

                  {/* Email (Read-Only) */}
                  <div className="form-group col-span-2">
                    <label htmlFor="emailDisabledInput" className="form-label">
                      Account Email <span className="read-only-tag">Locked / Read-Only</span>
                    </label>
                    <div className="input-with-icon disabled">
                      <Mail size={16} className="field-icon" />
                      <input 
                        type="email" 
                        id="emailDisabledInput"
                        className="form-input disabled" 
                        value={user?.email || ''} 
                        disabled
                        readOnly
                      />
                    </div>
                    <span className="field-hint">Email address is permanently bound to your security verification key.</span>
                  </div>

                  {/* Phone */}
                  <div className="form-group col-span-2">
                    <label htmlFor="phoneInput" className="form-label">
                      Phone Number
                    </label>
                    <div className="input-with-icon">
                      <Phone size={16} className="field-icon" />
                      <input 
                        type="tel" 
                        id="phoneInput"
                        className="form-input" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        maxLength={20}
                      />
                    </div>
                  </div>

                  {/* Shipping Address Header */}
                  <div className="form-divider col-span-2">
                    <MapPin size={16} className="divider-icon" />
                    <span>Hardware Delivery Address</span>
                  </div>

                  {/* Street Address */}
                  <div className="form-group col-span-2">
                    <label htmlFor="addressInput" className="form-label">
                      Street Address
                    </label>
                    <div className="input-with-icon">
                      <MapPin size={16} className="field-icon" />
                      <input 
                        type="text" 
                        id="addressInput"
                        className="form-input" 
                        value={address} 
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Suite 404, Silicon Arcade, Tech Park"
                        maxLength={250}
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="form-group">
                    <label htmlFor="cityInput" className="form-label">
                      City
                    </label>
                    <input 
                      type="text" 
                      id="cityInput"
                      className="form-input" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Bangalore"
                      maxLength={100}
                    />
                  </div>

                  {/* State */}
                  <div className="form-group">
                    <label htmlFor="stateInput" className="form-label">
                      State / Province
                    </label>
                    <input 
                      type="text" 
                      id="stateInput"
                      className="form-input" 
                      value={stateVal} 
                      onChange={(e) => setStateVal(e.target.value)}
                      placeholder="e.g. Karnataka"
                      maxLength={100}
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="form-group">
                    <label htmlFor="postalCodeInput" className="form-label">
                      Postal Code / ZIP
                    </label>
                    <input 
                      type="text" 
                      id="postalCodeInput"
                      className="form-input" 
                      value={postalCode} 
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 560001"
                      maxLength={20}
                    />
                  </div>

                  {/* Country */}
                  <div className="form-group">
                    <label htmlFor="countryInput" className="form-label">
                      Country
                    </label>
                    <input 
                      type="text" 
                      id="countryInput"
                      className="form-input" 
                      value={country} 
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. India"
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="form-actions-bottom">
                  <button 
                    type="button" 
                    className="btn-outline" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="spinner" />
                        <span>Updating Profile...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="profile-view-stack">
                
                {/* Account Details Card */}
                <div className="profile-card">
                  <div className="card-header">
                    <div className="card-header-icon">
                      <User size={18} />
                    </div>
                    <div>
                      <h2 className="card-title">Account Information</h2>
                      <p className="card-subtitle">Verified credentials and identity specifications.</p>
                    </div>
                  </div>

                  <div className="details-grid">
                    <div className="detail-item">
                      <span className="detail-label">Full Name</span>
                      <span className="detail-value">{fullName || user?.name || 'Not provided'}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Station Identifier</span>
                      <span className="detail-value">@{user?.username || 'builder'}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Primary Email</span>
                      <div className="detail-email-row">
                        <span className="detail-value">{user?.email}</span>
                        <span className="detail-verified-chip">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Direct Contact</span>
                      <span className="detail-value">{phone || 'No phone registered'}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Account Privilege</span>
                      <span className="detail-value text-amber uppercase">
                        {user?.role === 'admin' ? 'Administrator' : 'Verified Builder'}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Station Enrollment</span>
                      <span className="detail-value">{formatJoinDate(user?.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping & Hardware Dispatch Card */}
                <div className="profile-card">
                  <div className="card-header">
                    <div className="card-header-icon">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <h2 className="card-title">Hardware Delivery Location</h2>
                      <p className="card-subtitle">Default destination for custom rigs, parts, and hardware shipments.</p>
                    </div>
                  </div>

                  {address || city || stateVal || postalCode ? (
                    <div className="address-display-box">
                      <div className="address-line address-main">{address || 'No street specified'}</div>
                      <div className="address-line address-sub">
                        {[city, stateVal, postalCode].filter(Boolean).join(', ')}
                      </div>
                      <div className="address-line address-country">{country || 'India'}</div>
                    </div>
                  ) : (
                    <div className="empty-address-box">
                      <MapPin size={24} className="empty-address-icon" />
                      <p className="empty-address-text">No delivery address saved to your profile yet.</p>
                      <button 
                        type="button" 
                        className="btn-outline btn-sm"
                        onClick={() => setIsEditing(true)}
                      >
                        Add Shipping Address
                      </button>
                    </div>
                  )}
                </div>

              </div>
            )}

          </main>

          {/* Right Sidebar: Shortcuts & Stats */}
          <aside className="profile-sidebar-column">
            
            {/* Quick Actions Card */}
            <div className="profile-card sidebar-card">
              <h3 className="sidebar-card-title">Station Shortcuts</h3>
              <div className="sidebar-nav-links">
                <Link to="/wishlist" className="sidebar-action-item">
                  <div className="sidebar-action-icon">
                    <Heart size={16} />
                  </div>
                  <div className="sidebar-action-meta">
                    <span className="sidebar-action-name">Hardware Arsenal</span>
                    <span className="sidebar-action-count">{wishlistCount} saved components</span>
                  </div>
                  <ArrowRight size={14} className="sidebar-action-arrow" />
                </Link>

                <Link to="/cart" className="sidebar-action-item">
                  <div className="sidebar-action-icon">
                    <ShoppingCart size={16} />
                  </div>
                  <div className="sidebar-action-meta">
                    <span className="sidebar-action-name">Your Build Cart</span>
                    <span className="sidebar-action-count">{cartCount} items staged</span>
                  </div>
                  <ArrowRight size={14} className="sidebar-action-arrow" />
                </Link>

                <Link to="/configure" className="sidebar-action-item">
                  <div className="sidebar-action-icon">
                    <Sparkles size={16} />
                  </div>
                  <div className="sidebar-action-meta">
                    <span className="sidebar-action-name">Intelligent Configurator</span>
                    <span className="sidebar-action-count">PC & Laptop matching</span>
                  </div>
                  <ArrowRight size={14} className="sidebar-action-arrow" />
                </Link>

                <Link to="/build" className="sidebar-action-item">
                  <div className="sidebar-action-icon">
                    <Cpu size={16} />
                  </div>
                  <div className="sidebar-action-meta">
                    <span className="sidebar-action-name">Custom PC Builder</span>
                    <span className="sidebar-action-count">Component compatibility</span>
                  </div>
                  <ArrowRight size={14} className="sidebar-action-arrow" />
                </Link>
              </div>
            </div>

            {/* Hardware Warranty & Security Specs */}
            <div className="profile-card sidebar-card security-card">
              <h3 className="sidebar-card-title">Security & Integrity</h3>
              <ul className="security-check-list">
                <li className="security-item">
                  <CheckCircle2 size={15} className="security-icon text-amber" />
                  <span>JWT Token Protected Session</span>
                </li>
                <li className="security-item">
                  <CheckCircle2 size={15} className="security-icon text-amber" />
                  <span>Encrypted Credentials</span>
                </li>
                <li className="security-item">
                  <CheckCircle2 size={15} className="security-icon text-amber" />
                  <span>Multi-layer CORS / Helmet Active</span>
                </li>
              </ul>

              <div className="sidebar-logout-wrapper">
                <button 
                  type="button" 
                  className="profile-logout-btn"
                  onClick={logoutUser}
                >
                  <LogOut size={16} />
                  <span>Sign Out of Station</span>
                </button>
              </div>
            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}
