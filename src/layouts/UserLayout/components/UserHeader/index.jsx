import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Home,
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  Bell,
  Settings,
  Clock,
  LogOut,
  Gift
} from 'lucide-react';
import LocationSelector from './LocationSelector';
import { updateLocation } from '../../redux/slices/userSlice';
import './UserLayout.css';

const UserHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Lấy location từ Redux
  const currentLocation = useSelector(state => state.user.current.location);
  
  const [user] = useState({
    displayName: 'SonUser',
    username: 'SonUser',
    role: 'user',
    avatar: null
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu-wrapper')) {
        setShowUserMenu(false);
      }
      if (!event.target.closest('.mobile-menu-content') && 
          !event.target.closest('.mobile-menu-btn')) {
        setShowMobileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    navigate('/auth/login');
  };

  const handleLocationChange = (newLocation) => {
    dispatch(updateLocation(newLocation));
  };

  const navItems = [
    { path: '/user', label: 'Home', icon: Home },
    // { path: '/user/search', label: 'Find Shops', icon: Search },
    { path: '/user/orders', label: 'My Orders', icon: ShoppingBag },
    { path: '/user/favorites', label: 'Favorites', icon: Heart }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={`user-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <a 
            className="header-logo" 
            onClick={() => navigate('/user')}
          >
            <span className="logo-icon">☕</span>
            <span className="logo-text">Caffinder</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="header-nav">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Location Selector - UPDATED */}
            <LocationSelector 
              currentLocation={currentLocation}
              onLocationChange={handleLocationChange}
            />

            {/* Favorites Button */}
            <button 
              className="icon-btn"
              onClick={() => navigate('/user/favorites')}
              title="Favorites"
            >
              <Heart size={20} />
            </button>

            {/* Notifications Button */}
            <button 
              className="icon-btn"
              onClick={() => navigate('/user/notifications')}
              title="Notifications"
            >
              <Bell size={20} />
              <span className="icon-badge"></span>
            </button>

            {/* User Menu */}
            <div className="user-menu-wrapper">
              <button 
                className={`user-menu-trigger ${showUserMenu ? 'active' : ''}`}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <Menu size={18} />
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.displayName} />
                  ) : (
                    user.displayName.charAt(0).toUpperCase()
                  )}
                </div>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">{user.displayName}</div>
                    <div className="dropdown-user-email">{user.username}</div>
                  </div>

                  <div className="dropdown-section">
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/user/profile');
                        setShowUserMenu(false);
                      }}
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/user/orders');
                        setShowUserMenu(false);
                      }}
                    >
                      <ShoppingBag size={18} />
                      <span>My Orders</span>
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/user/favorites');
                        setShowUserMenu(false);
                      }}
                    >
                      <Heart size={18} />
                      <span>Favorites</span>
                    </button>
                  </div>

                  <div className="dropdown-divider" />

                  <div className="dropdown-section">
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/user/rewards');
                        setShowUserMenu(false);
                      }}
                    >
                      <Gift size={18} />
                      <span>Rewards & Offers</span>
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/user/history');
                        setShowUserMenu(false);
                      }}
                    >
                      <Clock size={18} />
                      <span>Order History</span>
                    </button>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/user/settings');
                        setShowUserMenu(false);
                      }}
                    >
                      <Settings size={18} />
                      <span>Settings</span>
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
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            <div className="dropdown-header">
              <div className="dropdown-user-name">{user.displayName}</div>
              <div className="dropdown-user-email">{user.username}</div>
            </div>

            <div className="mobile-menu-divider" />

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setShowMobileMenu(false);
                  }}
                  className={`mobile-nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="mobile-menu-divider" />

            <button 
              className="mobile-nav-item"
              onClick={() => {
                navigate('/user/profile');
                setShowMobileMenu(false);
              }}
            >
              <User size={20} />
              <span>My Profile</span>
            </button>
            <button 
              className="mobile-nav-item"
              onClick={() => {
                navigate('/user/rewards');
                setShowMobileMenu(false);
              }}
            >
              <Gift size={20} />
              <span>Rewards & Offers</span>
            </button>
            <button 
              className="mobile-nav-item"
              onClick={() => {
                navigate('/user/settings');
                setShowMobileMenu(false);
              }}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>

            <div className="mobile-menu-divider" />

            <button 
              className="mobile-nav-item danger"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserHeader;