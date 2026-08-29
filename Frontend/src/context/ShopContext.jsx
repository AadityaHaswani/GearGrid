import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Authentication state persisted in localStorage
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('geargrid_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Preserved action to perform after authenticating
  const [pendingAuthAction, setPendingAuthAction] = useState(() => {
    try {
      const stored = sessionStorage.getItem('geargrid_pending_action');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Cart & Wishlist state
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('geargrid_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('geargrid_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync cart & wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('geargrid_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('geargrid_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  // Modal / Drawer visibility states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState({ message: '', type: 'amber', visible: false });

  const showToast = (message, type = 'amber') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3200);
  };

  // Global Keyboard shortcut: Ctrl+K or Cmd+K opens Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Internal direct cart manipulation
  const executeAddToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added ${product.name.split('(')[0].trim()} to Cart`, 'amber');
  };

  // Protected Cart operation
  const addToCart = (product, qty = 1) => {
    if (!user) {
      const pending = {
        type: 'cart',
        product,
        qty,
        from: location.pathname + location.search
      };
      try {
        sessionStorage.setItem('geargrid_pending_action', JSON.stringify(pending));
      } catch {}
      setPendingAuthAction(pending);
      navigate('/login', { state: { from: location.pathname + location.search } });
      return false;
    }
    executeAddToCart(product, qty);
    return true;
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'red');
  };

  const updateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // Internal direct wishlist manipulation
  const executeToggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast('Removed from Wishlist', 'red');
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Saved ${product.name.split('(')[0].trim()} to Wishlist`, 'amber');
        return [...prev, product];
      }
    });
  };

  // Protected Wishlist operation
  const toggleWishlist = (product) => {
    if (!user) {
      const pending = {
        type: 'wishlist',
        product,
        from: location.pathname + location.search
      };
      try {
        sessionStorage.setItem('geargrid_pending_action', JSON.stringify(pending));
      } catch {}
      setPendingAuthAction(pending);
      navigate('/login', { state: { from: location.pathname + location.search } });
      return false;
    }
    executeToggleWishlist(product);
    return true;
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const wishlistCount = wishlist.length;

  // Login / Register action handler
  const loginUser = (userData, customRedirect = null) => {
    setUser(userData);
    try {
      localStorage.setItem('geargrid_user', JSON.stringify(userData));
    } catch {}

    // Retrieve pending action from state or sessionStorage
    let action = pendingAuthAction;
    if (!action) {
      try {
        const stored = sessionStorage.getItem('geargrid_pending_action');
        if (stored) {
          action = JSON.parse(stored);
        }
      } catch {}
    }

    if (action) {
      if (action.type === 'cart' && action.product) {
        executeAddToCart(action.product, action.qty || 1);
      } else if (action.type === 'wishlist' && action.product) {
        executeToggleWishlist(action.product);
      }
      try {
        sessionStorage.removeItem('geargrid_pending_action');
      } catch {}
      setPendingAuthAction(null);
      
      const destination = customRedirect || action.from || '/';
      navigate(destination);
    } else {
      showToast(`Welcome back, ${userData.name}!`, 'amber');
      const destination = customRedirect || location.state?.from || '/';
      navigate(destination);
    }
  };

  // Logout handler
  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem('geargrid_user');
    } catch {}
    showToast('Signed out of GearGrid', 'amber');
  };

  return (
    <ShopContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        pendingAuthAction,
        setPendingAuthAction,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthOpen,
        setIsAuthOpen,
        toast,
        showToast
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
