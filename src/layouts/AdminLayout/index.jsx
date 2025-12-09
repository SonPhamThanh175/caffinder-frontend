import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store,
  Star,
  Menu, 
  X
} from 'lucide-react';
import AdminHeader from './components/AdminHeader/AdminHeader';
import './style.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
      setShowOverlay(false);
    }
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setShowOverlay(sidebarOpen);
      } else {
        setShowOverlay(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    
    if (window.innerWidth <= 768) {
      setShowOverlay(newState);
    }
  };

  const menuItems = [
    { 
      path: '/admin/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard' 
    },
    { 
      path: '/admin/shops', 
      icon: Store, 
      label: 'Shops' 
    },
    { 
      path: '/admin/users', 
      icon: Users, 
      label: 'Users' 
    },
    { 
      path: '/admin/reviews', 
      icon: Star, 
      label: 'Reviews' 
    }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="admin-layout">
      {showOverlay && (
        <div 
          className="sidebar-overlay show"
          onClick={() => {
            setSidebarOpen(false);
            setShowOverlay(false);
          }}
        />
      )}

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && (
            <h1 className="sidebar-title">Admin Panel</h1>
          )}
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span className="nav-item-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="admin-main">
        <AdminHeader />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;