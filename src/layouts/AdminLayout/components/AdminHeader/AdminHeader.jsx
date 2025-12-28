import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LogOut,
  Bell,
  Settings,
  User,
  ChevronDown,
  Search,
  Moon,
  Sun,
  Gift
} from 'lucide-react';
import './style.css';
import { logout } from '../../../../store/slices/userSlice';
import { useDispatch } from 'react-redux';

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/auth/login');
  };

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return { title: 'Caffinder', emoji: '📊' };
    if (path.includes('/shops')) return { title: 'Shop Management', emoji: '🏪' };
    if (path.includes('/users')) return { title: 'User Management', emoji: '👥' };
    if (path.includes('/reviews')) return { title: 'Review Management', emoji: '⭐' };
    if (path.includes('/shops')) return { title: 'Shops', emoji: '📦' };
    if (path.includes('/orders')) return { title: 'Orders', emoji: '🛍️' };
    return { title: 'Admin Panel', emoji: '⚙️' };
  };

  const pageInfo = getPageInfo();

  return (
    <header className="admin-header">
      <div className="admin-header-content">
        <h2 className="admin-header-title">
          {pageInfo.title}
        </h2>

        {/* Header Actions */}
        <div className="admin-header-actions">
          {/* Search Bar (Optional - Uncomment to use) */}
          {/* <div className="admin-search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="search-input"
            />
          </div> */}

          <button 
            className="admin-icon-btn"
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* <button 
            className="admin-icon-btn"
            onClick={() => navigate('/admin/notifications')}
            title="Notifications"
          >
            <Bell size={20} />
            <span className="notification-badge"></span>
          </button> */}

          <div className="admin-user-menu-wrapper">
            <button 
              className="admin-user-profile"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="admin-user-avatar">
                {user?.displayName?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="admin-user-info">
                <div className="admin-user-name">
                  {user?.displayName || 'Admin User'}
                </div>
                <div className="admin-user-role">
                  {user?.role || 'Administrator'}
                </div>
              </div>
              <ChevronDown size={16} className="user-menu-arrow" />
            </button>

            {showUserMenu && (
              <>
                <div 
                  className="user-menu-overlay"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="admin-user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">
                      {user?.displayName || 'Admin User'}
                    </div>
                    <div className="dropdown-user-email">
                      {user?.username || user?.email || 'admin@example.com'}
                    </div>
                  </div>

                  <div className="dropdown-section">
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/admin/profile');
                        setShowUserMenu(false);
                      }}
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/admin/settings');
                        setShowUserMenu(false);
                      }}
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/admin/activity');
                        setShowUserMenu(false);
                      }}
                    >
                      <Gift size={18} />
                      <span>Activity Log</span>
                    </button>
                  </div>

                  <div className="dropdown-divider" />

                  <div className="dropdown-section">
                    <button 
                      className="dropdown-item danger"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Logout Button (Desktop Only) */}
          {/* <button 
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button> */}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;