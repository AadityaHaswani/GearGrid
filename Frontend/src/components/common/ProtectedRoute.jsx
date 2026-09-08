import { Navigate, useLocation } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

export default function ProtectedRoute({ children }) {
  const { user } = useShop();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
