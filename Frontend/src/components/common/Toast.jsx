import { useShop } from '../../context/ShopContext';
import './Toast.css';

export default function Toast() {
  const { toast } = useShop();

  if (!toast.visible) return null;

  return (
    <div className={`cyber-toast ${toast.type}`}>
      <span className="toast-indicator"></span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}
