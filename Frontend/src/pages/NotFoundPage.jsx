import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="notfound-page-root">
      <div className="container notfound-container">
        <div className="notfound-card">
          <span className="notfound-tag">404 ERROR</span>
          <h1 className="notfound-title">Page Not Found</h1>
          
          <p className="notfound-desc">
            The page you are looking for does not exist or has been moved. Check the URL or return to the home station.
          </p>

          <div className="notfound-actions">
            <Link to="/" className="btn-primary">
              <Home size={16} />
              <span>Back to Home</span>
            </Link>

            <Link to="/shop" className="btn-secondary">
              <span>Browse Hardware Shop</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
