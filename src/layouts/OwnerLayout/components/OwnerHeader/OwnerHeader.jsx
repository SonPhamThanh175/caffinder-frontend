import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, X, LogOut, User, Coffee, Store, ChevronDown, Plus } from 'lucide-react';
import './style.css';

const OwnerHeader = ({ 
  currentPage, 
  sidebarOpen, 
  setSidebarOpen,
  selectedShop,
  shops,
  onShopChange,
  onCreateShop
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'booking', message: 'Có đặt chỗ mới từ Nguyễn Văn A', time: '5 phút trước', unread: true },
    { id: 2, type: 'review', message: 'Khách hàng vừa để lại đánh giá 5 sao', time: '1 giờ trước', unread: true },
    { id: 3, type: 'booking', message: 'Đặt chỗ #BK123 đã được xác nhận', time: '2 giờ trước', unread: false }
  ]);
  
  const { user } = useSelector((state) => state.user.current);
  const navigate = useNavigate();

  const pageTitles = {
    dashboard: 'Dashboard',
    shop: 'Quản lý Shop',
    bookings: 'Quản lý Đặt chỗ',
    reviews: 'Quản lý Đánh giá',
    settings: 'Cài đặt'
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      navigate('/auth/login');
    }
  };

  const handleShopSelect = (shopId) => {
    onShopChange(shopId);
    setShowShopDropdown(false);
  };

  const handleCreateShop = () => {
    setShowShopDropdown(false);
    onCreateShop();
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <header className="owner-header">
      <div className="header-left">
        <button 
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        <div className="header-title-section">
          <h1 className="page-title">{pageTitles[currentPage]}</h1>
          <p className="header-greeting" style={{color:'black'}}>
            <Coffee size={16} />
            {getGreeting()}, {user?.name}
          </p>
        </div>
      </div>
      
      <div className="header-right">
        {shops && shops.length > 0 && (
          <div className="shop-selector-container">
            <button 
              className="shop-selector-btn"
              onClick={() => setShowShopDropdown(!showShopDropdown)}
            >
              <Store size={18} />
              <span className="shop-name">{selectedShop?.name || 'Chọn quán'}</span>
              <ChevronDown size={18} />
            </button>

            {showShopDropdown && (
              <>
                <div 
                  className="dropdown-overlay" 
                  onClick={() => setShowShopDropdown(false)}
                />
                <div className="shop-dropdown-menu">
                  <div className="shop-dropdown-header">
                    <span>Chọn quán</span>
                  </div>
                  
                  <div className="shop-dropdown-list">
                    {shops.map(shop => (
                      <button
                        key={shop.id}
                        className={`shop-dropdown-item ${selectedShop?.id === shop.id ? 'active' : ''}`}
                        onClick={() => handleShopSelect(shop.id)}
                      >
                        <div className="shop-item-icon">
                          <Store size={16} />
                        </div>
                        <div className="shop-item-info">
                          <span className="shop-item-name">{shop.name}</span>
                          <span className="shop-item-address">{shop.address}</span>
                        </div>
                        {selectedShop?.id === shop.id && (
                          <div className="shop-item-check">✓</div>
                        )}
                      </button>
                    ))}
                  </div>

                  <button 
                    className="create-shop-dropdown-btn"
                    onClick={handleCreateShop}
                  >
                    <Plus size={18} />
                    Tạo quán mới
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="header-notification">
          <button 
            className="notification-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>
          
          {showNotifications && (
            <>
              <div 
                className="dropdown-overlay" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Thông báo</h3>
                  <button className="mark-read-btn">Đánh dấu đã đọc</button>
                </div>
                <div className="notification-list">
                  {notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`notification-item ${notif.unread ? 'unread' : ''}`}
                    >
                      <div className={`notif-icon ${notif.type}`}>
                        {notif.type === 'booking' ? '📅' : '⭐'}
                      </div>
                      <div className="notif-content">
                        <p className="notif-message">{notif.message}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="notification-footer">
                  <button>Xem tất cả</button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="header-user-menu">
          <button 
            className="user-profile-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.avaUrl ? (
                <img src={user.avaUrl} alt={user.name} />
              ) : (
                <span>{user?.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.username}</span>
              <span className="user-role">Chủ quán</span>
            </div>
          </button>
          
          {showUserMenu && (
            <>
              <div 
                className="dropdown-overlay" 
                onClick={() => setShowUserMenu(false)}
              />
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar-large">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="dropdown-name">{user?.username}</p>
                    <p className="dropdown-email">{user?.displayName}</p>
                  </div>
                </div>
                <div className="user-dropdown-menu">
                  {/* <button className="dropdown-item" onClick={() => navigate('/owner/settings')}>
                    <User size={18} />
                    Trang cá nhân
                  </button>
                  <button className="dropdown-item">
                    <Coffee size={18} />
                    Shop của tôi
                  </button> */}
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={18} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default OwnerHeader;