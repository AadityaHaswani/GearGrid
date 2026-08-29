import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingBag, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ArrowLeft, 
  TrendingUp, 
  Clock, 
  Truck, 
  CheckCheck, 
  Ban, 
  Menu, 
  SlidersHorizontal,
  LogOut,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PRODUCTS, HARDWARE_CATEGORIES } from '../data/hardwareData';
import './AdminPage.css';

// Initial Mock Orders structured for real API replacement
const INITIAL_ORDERS = [
  {
    id: 'GG-914820-EXP',
    customer: { name: 'Alex Vance', email: 'alex.vance@blackmesa.io', phone: '+1 555 382 9102' },
    shippingAddress: '104 Research Complex Blvd, Sector C, Black Mesa, NM 87001',
    paymentMethod: 'CARD (•••• 4242)',
    date: 'Aug 29, 2026',
    items: [
      { id: 'gpu-5090', name: 'NVIDIA GeForce RTX 5090 Founders Edition', price: 1999, quantity: 1 },
      { id: 'cpu-7800x3d', name: 'AMD Ryzen 7 7800X3D Processor', price: 449, quantity: 1 }
    ],
    total: 2448,
    status: 'Shipped' // Pending | Processing | Shipped | Delivered | Cancelled
  },
  {
    id: 'GG-884210-EXP',
    customer: { name: 'Elena Rostova', email: 'elena.rostova@cyberdyn.com', phone: '+1 555 892 4819' },
    shippingAddress: '742 Skyline Tower, Penthouse 48, Seattle, WA 98101',
    paymentMethod: 'UPI (elena@okaxis)',
    date: 'Aug 29, 2026',
    items: [
      { id: 'rig-monolith', name: 'GearGrid Apex Horizon Custom Gaming PC', price: 3799, quantity: 1 }
    ],
    total: 3799,
    status: 'Processing'
  },
  {
    id: 'GG-742918-EXP',
    customer: { name: 'Marcus Chen', email: 'marcus.chen@horizon.dev', phone: '+1 555 192 8472' },
    shippingAddress: '220 Innovation Way, Suite 300, Austin, TX 78701',
    paymentMethod: 'NET BANKING (HDFC)',
    date: 'Aug 28, 2026',
    items: [
      { id: 'gpu-5090', name: 'NVIDIA GeForce RTX 5090 Founders Edition', price: 1999, quantity: 1 }
    ],
    total: 1999,
    status: 'Pending'
  },
  {
    id: 'GG-652011-EXP',
    customer: { name: 'Sarah Jenkins', email: 's.jenkins@vanguard.org', phone: '+1 555 901 3841' },
    shippingAddress: '88 Cyber Way, Palo Alto, CA 94301',
    paymentMethod: 'CARD (•••• 8912)',
    date: 'Aug 27, 2026',
    items: [
      { id: 'cpu-7800x3d', name: 'AMD Ryzen 7 7800X3D Processor', price: 449, quantity: 1 },
      { id: 'mb-x870e', name: 'ASUS ROG Crosshair X870E Hero', price: 699, quantity: 1 }
    ],
    total: 1148,
    status: 'Delivered'
  }
];

export default function AdminPage() {
  const { user, logoutUser, showToast } = useShop();
  const navigate = useNavigate();

  // Navigation tab: 'dashboard' | 'products' | 'categories' | 'orders'
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data State
  const [products, setProducts] = useState(() => {
    return PRODUCTS.map((p, idx) => ({
      ...p,
      stock: p.stock !== undefined ? p.stock : (idx % 3 === 0 ? 4 : idx % 5 === 0 ? 0 : 24),
      status: p.stock === 0 ? 'Out of Stock' : (p.stock < 10 || idx % 3 === 0) ? 'Low Stock' : 'In Stock'
    }));
  });

  const [categories, setCategories] = useState(() => {
    return HARDWARE_CATEGORIES.filter(c => c.id !== 'all').map(c => ({
      ...c,
      description: `Enthusiast-grade ${c.label.toLowerCase()} curated for competitive hardware configurations.`
    }));
  });

  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // Search & Filter State
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modal States
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Add, object = Edit
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'gpus',
    categoryLabel: 'Graphics Card',
    price: '',
    originalPrice: '',
    stock: '',
    image: '',
    specs: '',
    wattage: '',
    badge: '',
    description: ''
  });

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    id: '',
    label: '',
    description: ''
  });

  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    open: false,
    type: '', // 'product' | 'category'
    item: null
  });

  const [viewOrderModal, setViewOrderModal] = useState(null);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

    return {
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      lowStockCount,
      pendingOrdersCount
    };
  }, [products, categories, orders]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          (p.categoryLabel || '').toLowerCase().includes(productSearch.toLowerCase());
      const matchCat = productCatFilter === 'all' || p.category === productCatFilter;
      return matchSearch && matchCat;
    });
  }, [products, productSearch, productCatFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
                          o.customer.email.toLowerCase().includes(orderSearch.toLowerCase());
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // --------------------------------------------------------------------------
  // Product CRUD Handlers
  // --------------------------------------------------------------------------
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      category: 'gpus',
      categoryLabel: 'Graphics Card',
      price: '',
      originalPrice: '',
      stock: '15',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
      specs: 'PCIe 5.0 Support, High Performance',
      wattage: '300',
      badge: '',
      description: ''
    });
    setProductModalOpen(true);
  };

  const openEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      category: prod.category,
      categoryLabel: prod.categoryLabel || '',
      price: prod.price.toString(),
      originalPrice: prod.originalPrice ? prod.originalPrice.toString() : '',
      stock: prod.stock.toString(),
      image: prod.image,
      specs: Array.isArray(prod.specs) ? prod.specs.join(', ') : (prod.specs || ''),
      wattage: prod.wattage ? prod.wattage.toString() : '',
      badge: prod.badge || '',
      description: prod.description || ''
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const priceNum = parseFloat(productFormData.price) || 0;
    const origPriceNum = productFormData.originalPrice ? parseFloat(productFormData.originalPrice) : null;
    const stockNum = parseInt(productFormData.stock, 10) || 0;
    const specsArray = productFormData.specs
      ? productFormData.specs.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const categoryObj = categories.find(c => c.id === productFormData.category);
    const categoryLabel = categoryObj ? categoryObj.label : 'Hardware Component';

    const status = stockNum === 0 ? 'Out of Stock' : stockNum < 10 ? 'Low Stock' : 'In Stock';

    if (editingProduct) {
      // Update
      setProducts(prev => prev.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: productFormData.name,
            category: productFormData.category,
            categoryLabel,
            price: priceNum,
            originalPrice: origPriceNum,
            stock: stockNum,
            status,
            image: productFormData.image,
            specs: specsArray,
            wattage: productFormData.wattage ? parseInt(productFormData.wattage, 10) : undefined,
            badge: productFormData.badge || undefined,
            description: productFormData.description
          };
        }
        return p;
      }));
      showToast(`Updated "${productFormData.name}"`, 'amber');
    } else {
      // Create new
      const newProd = {
        id: `prod-${Date.now()}`,
        name: productFormData.name,
        category: productFormData.category,
        categoryLabel,
        price: priceNum,
        originalPrice: origPriceNum,
        stock: stockNum,
        status,
        image: productFormData.image,
        specs: specsArray,
        wattage: productFormData.wattage ? parseInt(productFormData.wattage, 10) : undefined,
        badge: productFormData.badge || undefined,
        description: productFormData.description,
        rating: 5.0,
        reviews: 1
      };
      setProducts(prev => [newProd, ...prev]);
      showToast(`Created hardware product "${productFormData.name}"`, 'amber');
    }

    setProductModalOpen(false);
  };

  const confirmDeleteProduct = (prod) => {
    setDeleteConfirmModal({
      open: true,
      type: 'product',
      item: prod
    });
  };

  // --------------------------------------------------------------------------
  // Category CRUD Handlers
  // --------------------------------------------------------------------------
  const openAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({ id: '', label: '', description: '' });
    setCategoryModalOpen(true);
  };

  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryFormData({
      id: cat.id,
      label: cat.label,
      description: cat.description || ''
    });
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = (e) => {
    e.preventDefault();
    const slug = categoryFormData.id.trim().toLowerCase().replace(/\s+/g, '-');
    
    if (editingCategory) {
      setCategories(prev => prev.map(c => {
        if (c.id === editingCategory.id) {
          return {
            ...c,
            label: categoryFormData.label,
            description: categoryFormData.description
          };
        }
        return c;
      }));
      showToast(`Updated category "${categoryFormData.label}"`, 'amber');
    } else {
      const newCat = {
        id: slug || `cat-${Date.now()}`,
        label: categoryFormData.label,
        description: categoryFormData.description
      };
      setCategories(prev => [...prev, newCat]);
      showToast(`Added hardware category "${categoryFormData.label}"`, 'amber');
    }
    setCategoryModalOpen(false);
  };

  const confirmDeleteCategory = (cat) => {
    setDeleteConfirmModal({
      open: true,
      type: 'category',
      item: cat
    });
  };

  // Execute confirmed deletion
  const executeDelete = () => {
    if (deleteConfirmModal.type === 'product' && deleteConfirmModal.item) {
      setProducts(prev => prev.filter(p => p.id !== deleteConfirmModal.item.id));
      showToast(`Deleted product "${deleteConfirmModal.item.name}"`, 'red');
    } else if (deleteConfirmModal.type === 'category' && deleteConfirmModal.item) {
      setCategories(prev => prev.filter(c => c.id !== deleteConfirmModal.item.id));
      showToast(`Deleted category "${deleteConfirmModal.item.label}"`, 'red');
    }
    setDeleteConfirmModal({ open: false, type: '', item: null });
  };

  // --------------------------------------------------------------------------
  // Order Status Handler
  // --------------------------------------------------------------------------
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    }));
    showToast(`Order ${orderId} marked as ${newStatus}`, 'amber');
  };

  return (
    <div className="admin-console-root">
      
      {/* Top Console Bar */}
      <header className="admin-top-bar">
        <div className="top-bar-left">
          <button 
            type="button" 
            className="admin-mobile-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle admin sidebar"
          >
            <Menu size={20} />
          </button>

          <Link to="/admin" className="admin-brand-link">
            <div className="admin-logo-dot" />
            <span className="admin-brand-text">GEARGRID <span className="admin-sub-tag">OPERATIONS</span></span>
          </Link>
        </div>

        <div className="top-bar-right">
          <Link to="/" className="store-return-link">
            <ArrowLeft size={14} />
            <span>View Public Store</span>
          </Link>

          <div className="admin-user-badge">
            <span className="admin-role-indicator">ADMIN</span>
            <span className="admin-user-name">{user?.name || 'Administrator'}</span>
          </div>

          <button 
            type="button" 
            className="admin-logout-btn"
            onClick={() => {
              logoutUser();
              navigate('/');
            }}
            title="Sign out of Admin Console"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Console Workspace */}
      <div className="admin-workspace-layout">
        
        {/* Left Navigation Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-inner">
            
            <div className="sidebar-section-label">MANAGEMENT</div>
            <nav className="sidebar-nav">
              <button 
                type="button" 
                className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setActiveTab('dashboard'); setSidebarOpen(false); }}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>

              <button 
                type="button" 
                className={`sidebar-nav-item ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => { setActiveTab('products'); setSidebarOpen(false); }}
              >
                <Package size={18} />
                <span>Hardware Catalog</span>
                <span className="sidebar-pill">{products.length}</span>
              </button>

              <button 
                type="button" 
                className={`sidebar-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => { setActiveTab('categories'); setSidebarOpen(false); }}
              >
                <Layers size={18} />
                <span>Categories</span>
                <span className="sidebar-pill">{categories.length}</span>
              </button>

              <button 
                type="button" 
                className={`sidebar-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
              >
                <ShoppingBag size={18} />
                <span>Order Manifests</span>
                {metrics.pendingOrdersCount > 0 && (
                  <span className="sidebar-pill amber-pill">{metrics.pendingOrdersCount}</span>
                )}
              </button>
            </nav>

            <div className="sidebar-footer-note">
              <span className="status-live-dot" />
              <span>Internal Operations Active</span>
            </div>

          </div>
        </aside>

        {/* Center Workspace Content Area */}
        <main className="admin-main-content">
          
          {/* ================================================================
              TAB 1: DASHBOARD
             ================================================================ */}
          {activeTab === 'dashboard' && (
            <div className="admin-tab-pane">
              
              <div className="tab-pane-header">
                <div>
                  <span className="pane-eyebrow">COMMAND CONSOLE</span>
                  <h1 className="pane-title">OPERATIONS DASHBOARD</h1>
                </div>
                <button 
                  type="button" 
                  className="btn-primary admin-primary-action"
                  onClick={openAddProduct}
                >
                  <Plus size={15} />
                  <span>ADD HARDWARE PRODUCT</span>
                </button>
              </div>

              {/* Real-Data Summary Cards */}
              <div className="admin-metrics-grid">
                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-label">TOTAL PRODUCTS</span>
                    <Package size={18} className="metric-icon" />
                  </div>
                  <div className="metric-value">{metrics.totalProducts}</div>
                  <div className="metric-sub">{metrics.lowStockCount} items flagged low stock</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-label">HARDWARE CATEGORIES</span>
                    <Layers size={18} className="metric-icon" />
                  </div>
                  <div className="metric-value">{metrics.totalCategories}</div>
                  <div className="metric-sub">Active hardware taxonomies</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-label">TOTAL ORDERS</span>
                    <ShoppingBag size={18} className="metric-icon" />
                  </div>
                  <div className="metric-value">{metrics.totalOrders}</div>
                  <div className="metric-sub">{metrics.pendingOrdersCount} awaiting dispatch</div>
                </div>

                <div className="metric-card">
                  <div className="metric-header">
                    <span className="metric-label">TOTAL MANIFEST REVENUE</span>
                    <TrendingUp size={18} className="metric-icon" />
                  </div>
                  <div className="metric-value">${metrics.totalRevenue.toLocaleString()}</div>
                  <div className="metric-sub">Verified hardware transactions</div>
                </div>
              </div>

              {/* Dashboard Split View: Recent Orders & Low Stock */}
              <div className="dashboard-sections-grid">
                
                {/* Recent Orders Panel */}
                <div className="admin-panel-card">
                  <div className="panel-card-header">
                    <h2 className="panel-card-title">Recent Order Manifests</h2>
                    <button 
                      type="button" 
                      className="panel-link-btn"
                      onClick={() => setActiveTab('orders')}
                    >
                      <span>View All</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>ORDER ID</th>
                          <th>CUSTOMER</th>
                          <th>AMOUNT</th>
                          <th>STATUS</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 4).map((order) => (
                          <tr key={order.id}>
                            <td className="mono-text">{order.id}</td>
                            <td>{order.customer.name}</td>
                            <td className="price-text">${order.total.toLocaleString()}</td>
                            <td>
                              <span className={`status-badge status-${order.status.toLowerCase()}`}>
                                {order.status}
                              </span>
                            </td>
                            <td>
                              <button 
                                type="button" 
                                className="table-action-btn"
                                onClick={() => setViewOrderModal(order)}
                                title="View Order Manifest"
                              >
                                <Eye size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Low Stock Alert Section */}
                <div className="admin-panel-card">
                  <div className="panel-card-header">
                    <div className="flex-row gap-2 align-center">
                      <AlertTriangle size={16} className="text-amber" />
                      <h2 className="panel-card-title">Low Stock Hardware</h2>
                    </div>
                    <button 
                      type="button" 
                      className="panel-link-btn"
                      onClick={() => setActiveTab('products')}
                    >
                      <span>Manage Inventory</span>
                      <ArrowUpRight size={13} />
                    </button>
                  </div>

                  <div className="low-stock-list">
                    {products.filter(p => p.stock < 10).slice(0, 5).map(prod => (
                      <div key={prod.id} className="low-stock-item">
                        <img src={prod.image} alt={prod.name} className="low-stock-thumb" />
                        <div className="low-stock-meta">
                          <span className="low-stock-name">{prod.name}</span>
                          <span className="low-stock-cat">{prod.categoryLabel}</span>
                        </div>
                        <div className="low-stock-count-box">
                          <span className="stock-count-num">{prod.stock}</span>
                          <span className="stock-units">units</span>
                        </div>
                        <button 
                          type="button" 
                          className="table-action-btn edit-btn"
                          onClick={() => openEditProduct(prod)}
                          title="Restock / Edit"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================================================================
              TAB 2: PRODUCT MANAGEMENT
             ================================================================ */}
          {activeTab === 'products' && (
            <div className="admin-tab-pane">
              
              <div className="tab-pane-header">
                <div>
                  <span className="pane-eyebrow">HARDWARE CATALOG</span>
                  <h1 className="pane-title">PRODUCT MANAGEMENT</h1>
                </div>
                <button 
                  type="button" 
                  className="btn-primary admin-primary-action"
                  onClick={openAddProduct}
                >
                  <Plus size={15} />
                  <span>ADD NEW PRODUCT</span>
                </button>
              </div>

              {/* Product Filtering Toolbar */}
              <div className="admin-toolbar-row">
                <div className="admin-search-box">
                  <Search size={15} className="toolbar-search-icon" />
                  <input 
                    type="text"
                    placeholder="Search by hardware name or category..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="admin-search-input"
                  />
                </div>

                <div className="admin-filter-group">
                  <span className="filter-label">CATEGORY:</span>
                  <select 
                    value={productCatFilter}
                    onChange={(e) => setProductCatFilter(e.target.value)}
                    className="admin-select"
                  >
                    <option value="all">All Categories ({products.length})</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="admin-panel-card no-padding">
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>STATUS</th>
                        <th className="text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="table-empty-cell">
                            No hardware products match the active query.
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((prod) => (
                          <tr key={prod.id}>
                            <td>
                              <div className="table-product-cell">
                                <img src={prod.image} alt={prod.name} className="table-thumb" />
                                <div className="table-prod-info">
                                  <span className="table-prod-title">{prod.name}</span>
                                  {prod.badge && <span className="table-badge-tag">{prod.badge}</span>}
                                </div>
                              </div>
                            </td>
                            <td>{prod.categoryLabel || prod.category}</td>
                            <td className="price-text">${prod.price.toLocaleString()}</td>
                            <td className="mono-text">{prod.stock} units</td>
                            <td>
                              <span className={`status-badge ${prod.stock === 0 ? 'status-cancelled' : prod.stock < 10 ? 'status-pending' : 'status-delivered'}`}>
                                {prod.status}
                              </span>
                            </td>
                            <td className="text-right">
                              <div className="table-actions-group">
                                <button 
                                  type="button" 
                                  className="table-action-btn edit-btn"
                                  onClick={() => openEditProduct(prod)}
                                  title="Edit Product"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  type="button" 
                                  className="table-action-btn delete-btn"
                                  onClick={() => confirmDeleteProduct(prod)}
                                  title="Delete Product"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================
              TAB 3: CATEGORY MANAGEMENT
             ================================================================ */}
          {activeTab === 'categories' && (
            <div className="admin-tab-pane">
              
              <div className="tab-pane-header">
                <div>
                  <span className="pane-eyebrow">TAXONOMY</span>
                  <h1 className="pane-title">CATEGORY MANAGEMENT</h1>
                </div>
                <button 
                  type="button" 
                  className="btn-primary admin-primary-action"
                  onClick={openAddCategory}
                >
                  <Plus size={15} />
                  <span>ADD CATEGORY</span>
                </button>
              </div>

              {/* Categories Table */}
              <div className="admin-panel-card no-padding">
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>CATEGORY NAME</th>
                        <th>SLUG IDENTIFIER</th>
                        <th>PRODUCTS COUNT</th>
                        <th>DESCRIPTION</th>
                        <th className="text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => {
                        const count = products.filter(p => p.category === cat.id).length;
                        return (
                          <tr key={cat.id}>
                            <td className="font-semibold text-primary">{cat.label}</td>
                            <td className="mono-text">{cat.id}</td>
                            <td className="mono-text">{count} products</td>
                            <td className="text-muted text-sm">{cat.description}</td>
                            <td className="text-right">
                              <div className="table-actions-group">
                                <button 
                                  type="button" 
                                  className="table-action-btn edit-btn"
                                  onClick={() => openEditCategory(cat)}
                                  title="Edit Category"
                                >
                                  <Edit size={14} />
                                </button>
                                <button 
                                  type="button" 
                                  className="table-action-btn delete-btn"
                                  onClick={() => confirmDeleteCategory(cat)}
                                  title="Delete Category"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ================================================================
              TAB 4: ORDER MANAGEMENT
             ================================================================ */}
          {activeTab === 'orders' && (
            <div className="admin-tab-pane">
              
              <div className="tab-pane-header">
                <div>
                  <span className="pane-eyebrow">FULFILLMENT</span>
                  <h1 className="pane-title">ORDER MANIFESTS</h1>
                </div>
              </div>

              {/* Order Filtering Toolbar */}
              <div className="admin-toolbar-row">
                <div className="admin-search-box">
                  <Search size={15} className="toolbar-search-icon" />
                  <input 
                    type="text"
                    placeholder="Search by Order ID, customer name or email..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="admin-search-input"
                  />
                </div>

                <div className="admin-filter-group">
                  <span className="filter-label">STATUS:</span>
                  <select 
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="admin-select"
                  >
                    <option value="all">All Statuses ({orders.length})</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="admin-panel-card no-padding">
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ORDER ID</th>
                        <th>CUSTOMER</th>
                        <th>DATE</th>
                        <th>ITEMS</th>
                        <th>TOTAL</th>
                        <th>UPDATE STATUS</th>
                        <th className="text-right">VIEW</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="table-empty-cell">
                            No orders match the active filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="mono-text font-bold">{order.id}</td>
                            <td>
                              <div className="table-cust-cell">
                                <span className="cust-name">{order.customer.name}</span>
                                <span className="cust-email">{order.customer.email}</span>
                              </div>
                            </td>
                            <td className="text-muted">{order.date}</td>
                            <td>{order.items.length} {order.items.length === 1 ? 'part' : 'parts'}</td>
                            <td className="price-text font-bold">${order.total.toLocaleString()}</td>
                            <td>
                              <select 
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className={`order-status-select status-select-${order.status.toLowerCase()}`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="text-right">
                              <button 
                                type="button" 
                                className="table-action-btn"
                                onClick={() => setViewOrderModal(order)}
                                title="View Order Manifest"
                              >
                                <Eye size={14} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* ====================================================================
          MODAL 1: ADD / EDIT PRODUCT
         ==================================================================== */}
      {productModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setProductModalOpen(false)}>
          <div className="admin-modal-panel large-modal" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">HARDWARE CATALOG</span>
                <h3 className="modal-title">{editingProduct ? 'Edit Hardware Product' : 'Add New Hardware Product'}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setProductModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="modal-body-form">
              <div className="modal-form-grid">
                
                <div className="modal-field full-width">
                  <label className="modal-label">Product Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. NVIDIA GeForce RTX 5090 Founders Edition"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-label">Category *</label>
                  <select 
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    className="modal-select"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="modal-field">
                  <label className="modal-label">Stock Quantity *</label>
                  <input 
                    type="number" 
                    min="0"
                    required 
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-label">Price ($) *</label>
                  <input 
                    type="number" 
                    min="1"
                    required 
                    placeholder="1999"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-label">Original Price ($ optional)</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="2199"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-label">Power Consumption (Wattage TDP)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 500"
                    value={productFormData.wattage}
                    onChange={(e) => setProductFormData({ ...productFormData, wattage: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-label">Badge Tag (optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Flagship / Best Seller"
                    value={productFormData.badge}
                    onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="modal-field full-width">
                  <label className="modal-label">Image URL *</label>
                  <input 
                    type="url" 
                    required 
                    placeholder="https://images.unsplash.com/..."
                    value={productFormData.image}
                    onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="modal-field full-width">
                  <label className="modal-label">Key Specifications (Comma Separated)</label>
                  <input 
                    type="text" 
                    placeholder="32GB GDDR7, 512-bit Memory Bus, PCIe 5.0 Support"
                    value={productFormData.specs}
                    onChange={(e) => setProductFormData({ ...productFormData, specs: e.target.value })}
                    className="modal-input"
                  />
                </div>

                <div className="modal-field full-width">
                  <label className="modal-label">Product Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Enter hardware architecture and technical details..."
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    className="modal-textarea"
                  />
                </div>

              </div>

              <div className="modal-actions-bar">
                <button 
                  type="button" 
                  className="btn-outline modal-cancel-btn"
                  onClick={() => setProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary modal-save-btn">
                  <span>{editingProduct ? 'SAVE CHANGES' : 'CREATE PRODUCT'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: ADD / EDIT CATEGORY
         ==================================================================== */}
      {categoryModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setCategoryModalOpen(false)}>
          <div className="admin-modal-panel" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">TAXONOMY</span>
                <h3 className="modal-title">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setCategoryModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="modal-body-form">
              <div className="modal-form-grid single-col">
                
                <div className="modal-field">
                  <label className="modal-label">Category Title *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Liquid Coolers"
                    value={categoryFormData.label}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, label: e.target.value })}
                    className="modal-input"
                  />
                </div>

                {!editingCategory && (
                  <div className="modal-field">
                    <label className="modal-label">Category Slug ID *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. liquid-coolers"
                      value={categoryFormData.id}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, id: e.target.value })}
                      className="modal-input"
                    />
                  </div>
                )}

                <div className="modal-field">
                  <label className="modal-label">Description</label>
                  <textarea 
                    rows="3"
                    placeholder="Short description of this hardware family..."
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    className="modal-textarea"
                  />
                </div>

              </div>

              <div className="modal-actions-bar">
                <button 
                  type="button" 
                  className="btn-outline modal-cancel-btn"
                  onClick={() => setCategoryModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary modal-save-btn">
                  <span>{editingCategory ? 'SAVE CATEGORY' : 'CREATE CATEGORY'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 3: DELETE CONFIRMATION
         ==================================================================== */}
      {deleteConfirmModal.open && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirmModal({ open: false, type: '', item: null })}>
          <div className="admin-modal-panel confirm-modal" onClick={(e) => e.stopPropagation()}>
            
            <div className="confirm-icon-box">
              <AlertTriangle size={24} className="text-red" />
            </div>

            <h3 className="confirm-modal-title">Confirm Deletion</h3>
            <p className="confirm-modal-desc">
              Are you sure you want to permanently delete{' '}
              <strong>{deleteConfirmModal.item?.name || deleteConfirmModal.item?.label}</strong>? This action cannot be undone.
            </p>

            <div className="confirm-actions-row">
              <button 
                type="button" 
                className="btn-outline modal-cancel-btn"
                onClick={() => setDeleteConfirmModal({ open: false, type: '', item: null })}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="admin-delete-confirm-btn"
                onClick={executeDelete}
              >
                <span>DELETE PERMANENTLY</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 4: VIEW ORDER MANIFEST
         ==================================================================== */}
      {viewOrderModal && (
        <div className="admin-modal-overlay" onClick={() => setViewOrderModal(null)}>
          <div className="admin-modal-panel large-modal" onClick={(e) => e.stopPropagation()}>
            
            <div className="modal-header">
              <div>
                <span className="modal-eyebrow">ORDER RECONCILIATION</span>
                <h3 className="modal-title">Order Manifest #{viewOrderModal.id}</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setViewOrderModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="order-details-body">
              
              <div className="order-details-grid">
                <div className="order-info-card">
                  <span className="order-card-label">CUSTOMER DETAILS</span>
                  <strong>{viewOrderModal.customer.name}</strong>
                  <span>{viewOrderModal.customer.email}</span>
                  <span>{viewOrderModal.customer.phone}</span>
                </div>

                <div className="order-info-card">
                  <span className="order-card-label">SHIPPING DESTINATION</span>
                  <span>{viewOrderModal.shippingAddress}</span>
                </div>

                <div className="order-info-card">
                  <span className="order-card-label">PAYMENT & DATE</span>
                  <span>Method: {viewOrderModal.paymentMethod}</span>
                  <span>Registered: {viewOrderModal.date}</span>
                </div>

                <div className="order-info-card">
                  <span className="order-card-label">ORDER STATUS</span>
                  <select 
                    value={viewOrderModal.status}
                    onChange={(e) => {
                      const newSt = e.target.value;
                      handleUpdateOrderStatus(viewOrderModal.id, newSt);
                      setViewOrderModal({ ...viewOrderModal, status: newSt });
                    }}
                    className={`order-status-select status-select-${viewOrderModal.status.toLowerCase()}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items Table */}
              <div className="order-items-manifest">
                <span className="order-card-label">COMPONENTS INCLUDED</span>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>HARDWARE</th>
                      <th>UNIT PRICE</th>
                      <th>QTY</th>
                      <th className="text-right">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewOrderModal.items.map((item, i) => (
                      <tr key={i}>
                        <td className="font-semibold">{item.name}</td>
                        <td className="price-text">${item.price.toLocaleString()}</td>
                        <td className="mono-text">{item.quantity}</td>
                        <td className="price-text text-right">${(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-modal-total-bar">
                <span className="order-modal-total-label">INVOICE TOTAL</span>
                <span className="order-modal-total-value">${viewOrderModal.total.toLocaleString()}</span>
              </div>

            </div>

            <div className="modal-actions-bar">
              <button 
                type="button" 
                className="btn-primary modal-save-btn"
                onClick={() => setViewOrderModal(null)}
              >
                <span>CLOSE MANIFEST</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
