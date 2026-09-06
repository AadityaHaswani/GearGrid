import { Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import ScrollToTop from './components/common/ScrollToTop';
import IntroGate from './components/common/IntroGate';
import MainLayout from './components/layout/MainLayout';
import AdminRoute from './components/common/AdminRoute';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import PCBuilderPage from './pages/PCBuilderPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ConfigurePage from './pages/ConfigurePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ShopProvider>
      <ScrollToTop />
      <IntroGate>
        <Routes>
          {/* True Fullscreen Authentication Routes (No Navbar, No Footer) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage initialMode="register" />} />

          {/* Protected Admin Operations Console */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } 
          />

          {/* Main Store Layout (Includes Sticky Navbar & Global Footer) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="shop" element={<ShopPage />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="build" element={<PCBuilderPage />} />
            <Route path="pc-builder" element={<PCBuilderPage />} />
            <Route path="configure" element={<ConfigurePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </IntroGate>
    </ShopProvider>
  );
}

export default App;