import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import cartAPI from '../services/cart.api';
import wishlistAPI from '../services/wishlist.api';

const ShopContext = createContext();

export const normalizeProduct = (p) => {
  if (!p) return null;
  const id = p._id || p.id;
  const name = p.title || p.name || 'Hardware Component';
  const categoryLabel = p.category?.name || p.categoryLabel || p.brand || 'Hardware';
  const price = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : (p.price || 0);
  const originalPrice = p.originalPrice || (p.discountPrice && p.discountPrice < p.price ? p.price : null);
  const rating = p.rating || 4.8;
  const reviews = p.numReviews ?? p.reviews ?? 0;
  const image = (p.images && p.images.length > 0 && p.images[0]?.url)
    ? p.images[0].url
    : (p.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80');
  const specs = p.specs && p.specs.length > 0
    ? p.specs
    : [p.brand, p.category?.name, p.stock ? `${p.stock} in stock` : 'In Stock'].filter(Boolean);

  return {
    ...p,
    id,
    _id: id,
    name,
    title: name,
    categoryLabel,
    price,
    originalPrice,
    rating,
    reviews,
    numReviews: reviews,
    image,
    specs
  };
};

const normalizeCartItem = (item) => {
  if (!item || !item.product) return null;
  return {
    ...item,
    product: normalizeProduct(item.product),
    quantity: item.quantity || 1
  };
};

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

  // Sync state to localStorage cache
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

  // Fetch real cart from backend
  const fetchCart = useCallback(async () => {
    if (!localStorage.getItem('geargrid_token')) return;
    try {
      const res = await cartAPI.getCart();
      const items = res.data?.data?.items || [];
      const normalized = items.map(normalizeCartItem).filter(Boolean);
      setCart(normalized);
    } catch {
      // Offline fallback
    }
  }, []);

  // Fetch real wishlist from backend
  const fetchWishlist = useCallback(async () => {
    if (!localStorage.getItem('geargrid_token')) return;
    try {
      const res = await wishlistAPI.getWishlist();
      const products = res.data?.data?.products || [];
      const normalized = products.map(normalizeProduct).filter(Boolean);
      setWishlist(normalized);
    } catch {
      // Offline fallback
    }
  }, []);

  // Initial user verification & cart/wishlist hydration - runs ONCE on mount
  useEffect(() => {
    const token = localStorage.getItem('geargrid_token');
    if (token) {
      let isMounted = true;
      authAPI.getCurrentUser()
        .then((res) => {
          if (!isMounted) return;
          const u = res.data?.data;
          if (u) {
            const formatted = {
              id: u._id,
              name: u.username || u.name,
              email: u.email,
              avatar: u.avatar?.url || null,
              role: u.role || 'user'
            };
            setUser((prev) => {
              if (prev && prev.id === formatted.id && prev.email === formatted.email && prev.role === formatted.role) {
                return prev;
              }
              return formatted;
            });
            localStorage.setItem('geargrid_user', JSON.stringify(formatted));
          }
        })
        .catch(() => {
          // Token expired or invalid
        });
      fetchCart();
      fetchWishlist();

      return () => {
        isMounted = false;
      };
    }
  }, [fetchCart, fetchWishlist]);

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

  // Protected Cart operation
  const addToCart = async (product, qty = 1) => {
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

    const productId = product._id || product.id;
    try {
      const res = await cartAPI.addToCart(productId);
      const items = res.data?.data?.items || [];
      const normalized = items.map(normalizeCartItem).filter(Boolean);
      setCart(normalized);
    } catch {
      // Local optimistic update
      setCart((prev) => {
        const norm = normalizeProduct(product);
        const existing = prev.find((item) => (item.product._id || item.product.id) === productId);
        if (existing) {
          return prev.map((item) =>
            (item.product._id || item.product.id) === productId
              ? { ...item, quantity: item.quantity + qty }
              : item
          );
        }
        return [...prev, { product: norm, quantity: qty }];
      });
    }

    showToast(`Added ${(product.title || product.name || 'Component').split('(')[0].trim()} to Cart`, 'amber');
    return true;
  };

  // Batch Add Custom PC Build Components to Cart
  const addBuildToCart = async (components) => {
    const validItems = (Array.isArray(components) ? components : Object.values(components || {}))
      .filter(item => item && (item._id || item.id));

    if (validItems.length === 0) {
      showToast('No valid hardware components configured', 'red');
      return false;
    }

    if (!user) {
      const pending = {
        type: 'build-cart',
        products: validItems,
        from: location.pathname + location.search
      };
      try {
        sessionStorage.setItem('geargrid_pending_action', JSON.stringify(pending));
      } catch {}
      setPendingAuthAction(pending);
      navigate('/login', { state: { from: location.pathname + location.search } });
      return false;
    }

    try {
      for (const item of validItems) {
        const productId = item._id || item.id;
        await cartAPI.addToCart(productId);
      }
      const res = await cartAPI.getCart();
      const items = res.data?.data?.items || [];
      const normalized = items.map(normalizeCartItem).filter(Boolean);
      setCart(normalized);
    } catch {
      // Local optimistic update
      setCart((prev) => {
        let updated = [...prev];
        for (const item of validItems) {
          const productId = item._id || item.id;
          const norm = normalizeProduct(item);
          const existing = updated.find((cartItem) => (cartItem.product._id || cartItem.product.id) === productId);
          if (existing) {
            updated = updated.map((cartItem) =>
              (cartItem.product._id || cartItem.product.id) === productId
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          } else {
            updated.push({ product: norm, quantity: 1 });
          }
        }
        return updated;
      });
    }

    showToast(`Added PC Build (${validItems.length} verified parts) to Cart`, 'amber');
    setIsCartOpen(true);
    return true;
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartAPI.removeFromCart(productId);
      const items = res.data?.data?.items || [];
      const normalized = items.map(normalizeCartItem).filter(Boolean);
      setCart(normalized);
    } catch {
      setCart((prev) => prev.filter((item) => (item.product._id || item.product.id) !== productId));
    }
    showToast('Item removed from cart', 'red');
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    const currentItem = cart.find(item => (item.product._id || item.product.id) === productId);
    const action = currentItem && newQty < currentItem.quantity ? 'decrease' : 'increase';

    try {
      const res = await cartAPI.updateCartQuantity(productId, action);
      const items = res.data?.data?.items || [];
      const normalized = items.map(normalizeCartItem).filter(Boolean);
      setCart(normalized);
    } catch {
      setCart((prev) =>
        prev.map((item) =>
          (item.product._id || item.product.id) === productId ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
    } catch {
      // Ignore
    }
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartTotal = cart.reduce(
    (total, item) => total + (item.product?.price || 0) * (item.quantity || 1),
    0
  );

  // Protected Wishlist operation
  const toggleWishlist = async (product) => {
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

    const productId = product._id || product.id;
    const exists = wishlist.some((item) => (item._id || item.id) === productId);

    if (exists) {
      try {
        await wishlistAPI.removeFromWishlist(productId);
        await fetchWishlist();
      } catch {
        setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== productId));
      }
      showToast('Removed from Wishlist', 'red');
    } else {
      try {
        await wishlistAPI.addToWishlist(productId);
        await fetchWishlist();
      } catch {
        setWishlist((prev) => [...prev, normalizeProduct(product)]);
      }
      showToast(`Saved ${(product.title || product.name || 'Component').split('(')[0].trim()} to Wishlist`, 'amber');
    }
    return true;
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item.id) === productId);
  };

  const wishlistCount = wishlist.length;

  // Login / Register action handler
  const loginUser = (userData, customRedirect = null) => {
    setUser(userData);
    try {
      localStorage.setItem('geargrid_user', JSON.stringify(userData));
    } catch {}

    fetchCart();
    fetchWishlist();

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
        addToCart(action.product, action.qty || 1);
      } else if (action.type === 'build-cart' && action.products) {
        addBuildToCart(action.products);
      } else if (action.type === 'wishlist' && action.product) {
        toggleWishlist(action.product);
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
  const logoutUser = async () => {
    try {
      await authAPI.logout();
    } catch {}
    setUser(null);
    setCart([]);
    setWishlist([]);
    try {
      localStorage.removeItem('geargrid_user');
      localStorage.removeItem('geargrid_token');
      localStorage.removeItem('geargrid_cart');
      localStorage.removeItem('geargrid_wishlist');
    } catch {}
    showToast('Signed out of GearGrid', 'amber');
    navigate('/');
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
        fetchCart,
        addToCart,
        addBuildToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        wishlist,
        fetchWishlist,
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
