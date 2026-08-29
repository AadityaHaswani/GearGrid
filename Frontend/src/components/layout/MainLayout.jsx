import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import CartDrawer from '../common/CartDrawer';
import WishlistDrawer from '../common/WishlistDrawer';
import SearchModal from '../common/SearchModal';
import Toast from '../common/Toast';
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className="layout-root">
      {/* Global Sticky Navbar */}
      <Navbar />

      {/* Main Content Area with React Router Outlet */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Interactive Global Drawers & Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <SearchModal />
      <Toast />
    </div>
  );
}
