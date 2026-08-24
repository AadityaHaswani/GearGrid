import { Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import ScrollToTop from './components/common/ScrollToTop';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import PCBuilderPage from './pages/PCBuilderPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ShopProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="build" element={<PCBuilderPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ShopProvider>
  );
}

export default App;