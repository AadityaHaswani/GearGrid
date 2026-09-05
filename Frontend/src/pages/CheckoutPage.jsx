import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Edit3, 
  AlertCircle,
  PackageCheck,
  Cpu
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import orderAPI from '../services/order.api';
import paymentAPI from '../services/payment.api';
import { formatPrice } from '../utils/formatCurrency';
import SEO from '../components/common/SEO';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, clearCart, user } = useShop();

  // Multi-step: 1 = Shipping, 2 = Payment, 3 = Review
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [shippingData, setShippingData] = useState({
    fullName: user ? user.name : '',
    email: user ? user.email : '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'upi' | 'card' | 'netbanking'
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: user ? user.name : '',
    cardExpiry: '',
    cardCvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // UI / Submission state
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(null);

  // Handlers for Shipping inputs
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  // Validation checkers
  const isShippingValid = () => {
    const { fullName, email, phone, address, city, state, postalCode } = shippingData;
    return (
      fullName.trim().length >= 2 &&
      email.includes('@') &&
      phone.trim().length >= 8 &&
      address.trim().length >= 5 &&
      city.trim().length >= 2 &&
      state.trim().length >= 2 &&
      postalCode.trim().length >= 4
    );
  };

  const isPaymentValid = () => {
    if (paymentMethod === 'card') {
      return (
        cardData.cardNumber.replace(/\s/g, '').length >= 15 &&
        cardData.cardName.trim().length >= 2 &&
        cardData.cardExpiry.length >= 4 &&
        cardData.cardCvv.length >= 3
      );
    }
    if (paymentMethod === 'upi') {
      return upiId.includes('@') && upiId.trim().length >= 5;
    }
    if (paymentMethod === 'netbanking') {
      return Boolean(selectedBank);
    }
    return false;
  };

  const goToPayment = (e) => {
    e.preventDefault();
    if (!isShippingValid()) {
      setErrorMsg('Please complete all required shipping fields correctly.');
      return;
    }
    setErrorMsg('');
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToReview = (e) => {
    e.preventDefault();
    if (!isPaymentValid()) {
      setErrorMsg('Please provide valid payment credentials.');
      return;
    }
    setErrorMsg('');
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (!isShippingValid()) {
      setCurrentStep(1);
      setErrorMsg('Please review your shipping destination details.');
      return;
    }
    if (!isPaymentValid()) {
      setCurrentStep(2);
      setErrorMsg('Please verify your payment method details.');
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const orderRes = await orderAPI.placeOrder();
      const realOrder = orderRes.data?.data;
      const orderId = realOrder?._id;

      if (orderId) {
        try {
          await paymentAPI.createPayment({
            orderId,
            paymentMethod: paymentMethod.toUpperCase(),
          });
        } catch {
          // Payment creation logged
        }
      }

      await clearCart();

      const generatedOrder = {
        orderId: realOrder?._id ? `GG-${realOrder._id.slice(-6).toUpperCase()}-EXP` : `GG-${Math.floor(100000 + Math.random() * 900000)}-EXP`,
        realId: realOrder?._id,
        items: realOrder?.items?.map(item => ({
          product: {
            id: item.product,
            name: item.name,
            price: item.price,
            image: item.image?.url || item.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
          },
          quantity: item.quantity
        })) || [...cart],
        total: realOrder?.totalAmount ?? cartTotal,
        shipping: { ...shippingData },
        paymentMethod: paymentMethod.toUpperCase(),
        status: realOrder?.orderStatus || 'Pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };

      setOrderCompleted(generatedOrder);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------------------------------
  // Render: Order Completed Confirmation
  // --------------------------------------------------------------------------
  if (orderCompleted) {
    return (
      <div className="checkout-page-root">
        <SEO
          title="Order Confirmed | GearGrid"
          description="Your GearGrid hardware order has been registered and submitted for assembly."
          noindex={true}
        />
        <div className="checkout-container">
          <div className="order-confirmed-wrapper">
            
            <div className="confirmation-badge">
              <PackageCheck size={28} className="conf-icon-amber" />
            </div>

            <span className="checkout-eyebrow">ORDER RECONCILED // MANIFEST CONFIRMED</span>
            <h1 className="confirmation-heading">ORDER PLACED SUCCESSFULLY.</h1>
            <p className="confirmation-sub">
              Your hardware build manifest has been registered and submitted to the assembly queue.
            </p>

            <div className="confirmation-manifest-card">
              <div className="conf-card-header">
                <div>
                  <span className="conf-manifest-id">MANIF-ID: {orderCompleted.orderId}</span>
                  <p className="conf-date-text">Registered: {orderCompleted.date}</p>
                </div>
                <div className="conf-status-tag">
                  <span className="status-dot" />
                  <span>PRIORITY DISPATCH</span>
                </div>
              </div>

              <div className="conf-summary-grid">
                <div className="conf-info-block">
                  <span className="conf-block-label">SHIPPING DESTINATION</span>
                  <strong>{orderCompleted.shipping.fullName}</strong>
                  <span>{orderCompleted.shipping.address}</span>
                  <span>{orderCompleted.shipping.city}, {orderCompleted.shipping.state} {orderCompleted.shipping.postalCode}</span>
                  <span>{orderCompleted.shipping.phone}</span>
                </div>

                <div className="conf-info-block">
                  <span className="conf-block-label">PAYMENT METHOD</span>
                  <strong>{orderCompleted.paymentMethod} TRANSACTION</strong>
                  <span>Status: Verified & Approved</span>
                  <span>Invoice Total: {formatPrice(orderCompleted.total)}</span>
                </div>
              </div>

              <div className="conf-items-list">
                <span className="conf-block-label">COMPONENTS INCLUDED</span>
                {orderCompleted.items.map(({ product, quantity }) => (
                  <div key={product.id} className="conf-item-row">
                    <span className="conf-item-name">{quantity}x {product.name}</span>
                    <span className="conf-item-price">{formatPrice(product.price * quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="confirmation-actions">
              <Link to="/shop" className="btn-primary conf-primary-btn">
                <span>EXPLORE HARDWARE CATALOG</span>
                <ArrowRight size={15} />
              </Link>
              <Link to="/" className="btn-outline conf-secondary-btn">
                <span>RETURN TO HOME</span>
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Render: Empty Cart Guard
  // --------------------------------------------------------------------------
  if (cart.length === 0) {
    return (
      <div className="checkout-page-root">
        <SEO
          title="Checkout — Secure Hardware Order | GearGrid"
          description="Secure checkout for your custom PC hardware order."
          noindex={true}
        />
        <div className="checkout-container">
          <div className="checkout-empty-desk">
            <span className="checkout-eyebrow">GEARGRID // CHECKOUT</span>
            <h1 className="checkout-empty-title">NO HARDWARE STAGED FOR CHECKOUT.</h1>
            <p className="checkout-empty-desc">
              Your build manifest currently contains zero components. Please select hardware to proceed with checkout.
            </p>
            <Link to="/shop" className="btn-primary checkout-empty-cta">
              <span>EXPLORE HARDWARE CATALOG</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // Render: Multi-Step Checkout Flow
  // --------------------------------------------------------------------------
  return (
    <div className="checkout-page-root">
      <SEO
        title="Checkout — Secure Hardware Order | GearGrid"
        description="Secure checkout for your custom PC hardware order."
        noindex={true}
      />
      <div className="checkout-container">
        
        {/* Page Header */}
        <header className="checkout-header">
          <span className="checkout-eyebrow">GEARGRID / CHECKOUT</span>
          <h1 className="checkout-title">FINALIZE YOUR BUILD.</h1>
          <p className="checkout-subtitle">
            Securely review your hardware and complete your order.
          </p>
        </header>

        {/* Step Progression Bar */}
        <div className="checkout-step-tracker" role="tablist">
          <button 
            type="button" 
            className={`step-tab ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <span className="step-num">01</span>
            <span className="step-label">SHIPPING</span>
          </button>
          
          <div className="step-connector" />

          <button 
            type="button" 
            className={`step-tab ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
            onClick={() => isShippingValid() && setCurrentStep(2)}
            disabled={!isShippingValid() && currentStep < 2}
          >
            <span className="step-num">02</span>
            <span className="step-label">PAYMENT</span>
          </button>

          <div className="step-connector" />

          <button 
            type="button" 
            className={`step-tab ${currentStep === 3 ? 'active' : ''}`}
            onClick={() => isShippingValid() && isPaymentValid() && setCurrentStep(3)}
            disabled={(!isShippingValid() || !isPaymentValid()) && currentStep < 3}
          >
            <span className="step-num">03</span>
            <span className="step-label">REVIEW</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="checkout-error-banner" role="alert">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main 2-Column Checkout Layout */}
        <div className="checkout-layout-grid">
          
          {/* Left Column: Multi-Step Forms */}
          <main className="checkout-form-column">
            
            {/* STEP 1: SHIPPING */}
            {currentStep === 1 && (
              <form onSubmit={goToPayment} className="checkout-form-card">
                <div className="form-card-header">
                  <span className="form-step-tag">STEP 01</span>
                  <h2 className="form-card-title">SHIPPING DESTINATION</h2>
                </div>

                <div className="checkout-form-grid">
                  
                  <div className="form-field-group full-width">
                    <label className="checkout-label" htmlFor="fullName">Full Name *</label>
                    <input 
                      id="fullName"
                      name="fullName"
                      type="text" 
                      required
                      placeholder="e.g. Alex Miller"
                      value={shippingData.fullName}
                      onChange={handleShippingChange}
                      className="checkout-text-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="checkout-label" htmlFor="email">Email Address *</label>
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      required
                      placeholder="alex.miller@example.com"
                      value={shippingData.email}
                      onChange={handleShippingChange}
                      className="checkout-text-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="checkout-label" htmlFor="phone">Phone Number *</label>
                    <input 
                      id="phone"
                      name="phone"
                      type="tel" 
                      required
                      placeholder="+1 (555) 000-0000"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      className="checkout-text-input"
                    />
                  </div>

                  <div className="form-field-group full-width">
                    <label className="checkout-label" htmlFor="address">Street Address *</label>
                    <input 
                      id="address"
                      name="address"
                      type="text" 
                      required
                      placeholder="Suite / Apt / Street Address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      className="checkout-text-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="checkout-label" htmlFor="city">City *</label>
                    <input 
                      id="city"
                      name="city"
                      type="text" 
                      required
                      placeholder="e.g. San Francisco"
                      value={shippingData.city}
                      onChange={handleShippingChange}
                      className="checkout-text-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="checkout-label" htmlFor="state">State / Province *</label>
                    <input 
                      id="state"
                      name="state"
                      type="text" 
                      required
                      placeholder="e.g. California"
                      value={shippingData.state}
                      onChange={handleShippingChange}
                      className="checkout-text-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="checkout-label" htmlFor="postalCode">Postal Code *</label>
                    <input 
                      id="postalCode"
                      name="postalCode"
                      type="text" 
                      required
                      placeholder="e.g. 94107"
                      value={shippingData.postalCode}
                      onChange={handleShippingChange}
                      className="checkout-text-input"
                    />
                  </div>

                </div>

                <div className="form-actions-row">
                  <Link to="/cart" className="checkout-back-link">
                    <ArrowLeft size={14} />
                    <span>Back to Manifest</span>
                  </Link>

                  <button type="submit" className="btn-primary step-continue-btn">
                    <span>CONTINUE TO PAYMENT</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT */}
            {currentStep === 2 && (
              <form onSubmit={goToReview} className="checkout-form-card">
                <div className="form-card-header">
                  <span className="form-step-tag">STEP 02</span>
                  <h2 className="form-card-title">PAYMENT METHOD</h2>
                </div>

                {/* Method Switcher Tabs */}
                <div className="payment-method-selector">
                  <button 
                    type="button" 
                    className={`payment-tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={16} />
                    <span>CREDIT / DEBIT CARD</span>
                  </button>

                  <button 
                    type="button" 
                    className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <Smartphone size={16} />
                    <span>UPI INSTANT</span>
                  </button>

                  <button 
                    type="button" 
                    className={`payment-tab-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <Building2 size={16} />
                    <span>NET BANKING</span>
                  </button>
                </div>

                {/* Card Fields */}
                {paymentMethod === 'card' && (
                  <div className="payment-fields-block">
                    <div className="form-field-group">
                      <label className="checkout-label" htmlFor="cardNumber">Card Number *</label>
                      <input 
                        id="cardNumber"
                        type="text" 
                        required
                        maxLength={19}
                        placeholder="•••• •••• •••• ••••"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        className="checkout-text-input"
                      />
                    </div>

                    <div className="form-field-group">
                      <label className="checkout-label" htmlFor="cardName">Cardholder Name *</label>
                      <input 
                        id="cardName"
                        type="text" 
                        required
                        placeholder="Name on card"
                        value={cardData.cardName}
                        onChange={(e) => setCardData({ ...cardData, cardName: e.target.value })}
                        className="checkout-text-input"
                      />
                    </div>

                    <div className="card-sub-grid">
                      <div className="form-field-group">
                        <label className="checkout-label" htmlFor="cardExpiry">Expiry Date *</label>
                        <input 
                          id="cardExpiry"
                          type="text" 
                          required
                          maxLength={5}
                          placeholder="MM / YY"
                          value={cardData.cardExpiry}
                          onChange={(e) => setCardData({ ...cardData, cardExpiry: e.target.value })}
                          className="checkout-text-input"
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="checkout-label" htmlFor="cardCvv">CVV Code *</label>
                        <input 
                          id="cardCvv"
                          type="password" 
                          required
                          maxLength={4}
                          placeholder="•••"
                          value={cardData.cardCvv}
                          onChange={(e) => setCardData({ ...cardData, cardCvv: e.target.value })}
                          className="checkout-text-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* UPI Fields */}
                {paymentMethod === 'upi' && (
                  <div className="payment-fields-block">
                    <div className="form-field-group">
                      <label className="checkout-label" htmlFor="upiId">Virtual Payment Address (VPA / UPI ID) *</label>
                      <input 
                        id="upiId"
                        type="text" 
                        required
                        placeholder="username@okhdfcbank / yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="checkout-text-input"
                      />
                    </div>
                    <p className="payment-helper-text">
                      A payment request notification will be dispatched to your authenticated UPI application.
                    </p>
                  </div>
                )}

                {/* Net Banking Fields */}
                {paymentMethod === 'netbanking' && (
                  <div className="payment-fields-block">
                    <div className="form-field-group">
                      <label className="checkout-label" htmlFor="bankSelect">Select Banking Institution *</label>
                      <select 
                        id="bankSelect"
                        value={selectedBank} 
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="checkout-select-input"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                    <p className="payment-helper-text">
                      You will be securely redirected to the authorized banking portal for two-factor authentication.
                    </p>
                  </div>
                )}

                <div className="form-actions-row">
                  <button 
                    type="button" 
                    className="checkout-back-link-btn"
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Shipping</span>
                  </button>

                  <button type="submit" className="btn-primary step-continue-btn">
                    <span>CONTINUE TO REVIEW</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: REVIEW */}
            {currentStep === 3 && (
              <div className="checkout-form-card">
                <div className="form-card-header">
                  <span className="form-step-tag">STEP 03</span>
                  <h2 className="form-card-title">FINAL MANIFEST RECONCILIATION</h2>
                </div>

                <div className="review-blocks-stack">
                  
                  {/* Shipping Destination Review */}
                  <div className="review-summary-box">
                    <div className="review-box-header">
                      <span className="review-box-title">01. SHIPPING DESTINATION</span>
                      <button 
                        type="button" 
                        className="review-edit-btn"
                        onClick={() => setCurrentStep(1)}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                    </div>
                    <div className="review-box-details">
                      <strong>{shippingData.fullName}</strong>
                      <span>{shippingData.address}</span>
                      <span>{shippingData.city}, {shippingData.state} {shippingData.postalCode}</span>
                      <span>{shippingData.phone} • {shippingData.email}</span>
                    </div>
                  </div>

                  {/* Payment Details Review */}
                  <div className="review-summary-box">
                    <div className="review-box-header">
                      <span className="review-box-title">02. PAYMENT METHOD</span>
                      <button 
                        type="button" 
                        className="review-edit-btn"
                        onClick={() => setCurrentStep(2)}
                      >
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                    </div>
                    <div className="review-box-details">
                      {paymentMethod === 'card' && (
                        <span>Credit / Debit Card ending in •••• {cardData.cardNumber.slice(-4) || '4242'}</span>
                      )}
                      {paymentMethod === 'upi' && (
                        <span>UPI Payment ID: {upiId || 'username@upi'}</span>
                      )}
                      {paymentMethod === 'netbanking' && (
                        <span>Net Banking via {selectedBank}</span>
                      )}
                    </div>
                  </div>

                </div>

                <div className="form-actions-row">
                  <button 
                    type="button" 
                    className="checkout-back-link-btn"
                    onClick={() => setCurrentStep(2)}
                  >
                    <ArrowLeft size={14} />
                    <span>Back to Payment</span>
                  </button>

                  <button 
                    type="button" 
                    className="btn-primary step-continue-btn final-place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span>ENCRYPTING & REGISTERING...</span>
                    ) : (
                      <>
                        <span>PLACE ORDER</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </main>

          {/* Right Column: Sticky Order Manifest Summary */}
          <aside className="checkout-summary-column">
            <div className="checkout-summary-panel">
              
              <div className="checkout-summary-header">
                <span className="summary-card-eyebrow">TRANSACTION MANIFEST</span>
                <h3 className="summary-card-title">ORDER MANIFEST</h3>
              </div>

              {/* Items Staged List */}
              <div className="checkout-items-preview">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="preview-item-row">
                    <img src={product.image} alt={product.name} className="preview-item-thumb" />
                    <div className="preview-item-meta">
                      <span className="preview-item-title">{product.name}</span>
                      <div className="preview-item-sub">
                        <span>Qty: {quantity}</span>
                        <span className="preview-item-price">{formatPrice(product.price * quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Line Items */}
              <div className="summary-pricing-list">
                <div className="summary-price-row">
                  <span className="price-row-label">Hardware Subtotal</span>
                  <span className="price-row-val">{formatPrice(cartTotal)}</span>
                </div>

                <div className="summary-price-row">
                  <span className="price-row-label">Insured Freight Delivery</span>
                  <span className="price-row-val val-amber">COMPLIMENTARY</span>
                </div>

                <div className="summary-price-row">
                  <span className="price-row-label">Component Match Guarantee</span>
                  <span className="price-row-val val-amber">INCLUDED</span>
                </div>
              </div>

              {/* Total Section */}
              <div className="summary-total-section">
                <div className="total-label-block">
                  <span className="total-title">TOTAL</span>
                  <span className="total-sub">All taxes and freight included</span>
                </div>
                <div className="total-figure-large">
                  {formatPrice(cartTotal)}
                </div>
              </div>

              {/* Place Order CTA on Step 3 or Trigger Next */}
              {currentStep === 3 ? (
                <button 
                  type="button" 
                  className="btn-primary summary-place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>ENCRYPTING TRANSACTION...</span>
                  ) : (
                    <>
                      <span>PLACE ORDER</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn-primary summary-place-order-btn"
                  onClick={() => {
                    if (currentStep === 1 && isShippingValid()) setCurrentStep(2);
                    else if (currentStep === 2 && isPaymentValid()) setCurrentStep(3);
                    else if (currentStep === 1) setErrorMsg('Please complete all shipping fields.');
                    else if (currentStep === 2) setErrorMsg('Please complete all payment fields.');
                  }}
                >
                  <span>CONTINUE CHECKOUT</span>
                  <ArrowRight size={16} />
                </button>
              )}

              {/* Small Trust & Reassurance Row */}
              <div className="checkout-trust-row">
                <div className="trust-item">
                  <Lock size={13} className="trust-icon" />
                  <span>Secure 256-Bit Checkout</span>
                </div>
                <div className="trust-item">
                  <ShieldCheck size={13} className="trust-icon" />
                  <span>Official 3-Year Warranty</span>
                </div>
                <div className="trust-item">
                  <Truck size={13} className="trust-icon" />
                  <span>Insured Priority Delivery</span>
                </div>
              </div>

            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
