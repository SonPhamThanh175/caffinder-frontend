import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home,
  Search,
  ShoppingBag,
  User,
  Bell,
  MapPin,
  Heart,
  Clock,
  LogOut,
  Settings,
  ChevronDown,
  ShoppingBasket
} from 'lucide-react';
import './style.css';

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };
  const bottomNavItems = [
    { path: '/user/dashboard', icon: Home, label: 'Home' },
    { path: '/user/products', icon: ShoppingBasket, label: 'Product' },
    { path: '/user/search', icon: Search, label: 'Search' },
    { path: '/user/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/user/profile', icon: User, label: 'Profile' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="user-layout">
      {/* Top Header */}
      <header className="user-header">
        <div className="location-section">
          <div className="location-info">
            <MapPin size={20} className="location-icon" />
            <div className="location-text">
              <p className="location-label">Deliver to</p>
              <div className="location-value">
                <span>Current Location</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
          
          <button className="notification-btn">
            <Bell size={22} />
            <span className="notification-badge"></span>
          </button>
        </div>

        <div className="user-greeting">
          <span className="emoji">👋</span>
          <p>
            Hi, <span className="name">{user?.displayName || 'Guest'}</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="user-content">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-container">
          {bottomNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-item ${active ? 'active' : ''}`}
              >
                <div className="nav-indicator"></div>
                <item.icon size={24} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Profile Menu Modal */}
      {showProfileMenu && (
        <div 
          className="profile-modal-overlay"
          onClick={() => setShowProfileMenu(false)}
        >
          <div 
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-header">
              <div className="profile-avatar">
                {user?.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="profile-info">
                <p className="profile-name">{user?.displayName || 'User'}</p>
                <p className="profile-username">{user?.username || 'user@example.com'}</p>
                <span className="profile-role">{user?.role || 'User'}</span>
              </div>
            </div>

            <div className="profile-menu">
              <button className="menu-item">
                <Heart size={20} />
                <span>Favorites</span>
              </button>
              
              <button className="menu-item">
                <Clock size={20} />
                <span>Order History</span>
              </button>
              
              <button className="menu-item">
                <Settings size={20} />
                <span>Settings</span>
              </button>
              
              <button onClick={handleLogout} className="menu-item logout">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLayout;