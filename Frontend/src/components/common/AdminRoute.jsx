import { Navigate, useLocation } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';

export default function AdminRoute({ children }) {
  const { user } = useShop();
  const location = useLocation();

  // If no user is logged in or user does not have admin role, redirect
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
