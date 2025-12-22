import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store,
  Users,
  Star,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Calendar,
  Activity
} from 'lucide-react';
import './style.css';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('week');

  const stats = {
    totalShops: 124,
    totalUsers: 15847,
    totalReviews: 8934,
    totalOrders: 45678,
    revenue: 125000,
    activeShops: 98,
    pendingReviews: 34,
    newUsers: 234
  };

  const recentShops = [
    {
      id: 1,
      name: 'The Coffee House Central',
      owner: 'John Doe',
      status: 'active',
      rating: 4.8,
      orders: 1245,
      joinedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Highlands Premium',
      owner: 'Jane Smith',
      status: 'pending',
      rating: 4.6,
      orders: 892,
      joinedDate: '2024-02-20'
    },
    {
      id: 3,
      name: 'Starbucks Reserve',
      owner: 'Mike Johnson',
      status: 'active',
      rating: 4.9,
      orders: 2341,
      joinedDate: '2024-01-05'
    }
  ];

  const recentReviews = [
    {
      id: 1,
      user: 'Nguyễn Văn A',
      shop: 'The Coffee House',
      rating: 5,
      comment: 'Quán đẹp!',
      status: 'approved',
      date: '2024-03-15'
    },
    {
      id: 2,
      user: 'Nguyên Thị B',
      shop: 'Highlands Coffee',
      rating: 4,
      comment: 'Tuyệt.',
      status: 'pending',
      date: '2024-03-14'
    },
    {
      id: 3,
      user: 'Trần Văn C',
      shop: 'Phúc Long',
      rating: 3,
      comment: 'oke !.',
      status: 'pending',
      date: '2024-03-14'
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'david.lee@example.com',
      role: 'customer',
      orders: 23,
      joinedDate: '2024-03-10',
      status: 'active'
    },
    {
      id: 2,
      name: 'Nguyên Thị B',
      email: 'emma.davis@example.com',
      role: 'shop_owner',
      orders: 0,
      joinedDate: '2024-03-12',
      status: 'pending'
    },
    {
      id: 3,
      name: 'Trần Văn C',
      email: 'frank.miller@example.com',
      role: 'customer',
      orders: 45,
      joinedDate: '2024-02-28',
      status: 'active'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Shops',
      description: 'View and manage coffee shops',
      icon: Store,
      color: '#8B5A2B',
      path: '/admin/shops',
      count: stats.totalShops
    },
    {
      title: 'Manage Users',
      description: 'View and manage users',
      icon: Users,
      color: '#1976D2',
      path: '/admin/users',
      count: stats.totalUsers
    },
    {
      title: 'Manage Reviews',
      description: 'Moderate customer reviews',
      icon: Star,
      color: '#FFB300',
      path: '/admin/reviews',
      count: stats.totalReviews
    }
  ];

  return (
    <div className="dashboard-home">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back, Admin! Here's what's happening.</p>
        </div>
        <div className="time-range-selector">
          <button 
            className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #8B5A2B, #6B4423)'}}>
              <Store size={24} />
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>+12%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalShops}</h3>
            <p className="stat-label">Total Shops</p>
            <div className="stat-detail">
              <CheckCircle size={14} />
              <span>{stats.activeShops} Active</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #1976D2, #1565C0)'}}>
              <Users size={24} />
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>+23%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalUsers.toLocaleString()}</h3>
            <p className="stat-label">Total Users</p>
            <div className="stat-detail">
              <Activity size={14} />
              <span>+{stats.newUsers} this week</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #FFB300, #FF8F00)'}}>
              <Star size={24} />
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>+8%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.totalReviews.toLocaleString()}</h3>
            <p className="stat-label">Total Reviews</p>
            <div className="stat-detail">
              <Clock size={14} />
              <span>{stats.pendingReviews} Pending</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{background: 'linear-gradient(135deg, #4CAF50, #388E3C)'}}>
              <DollarSign size={24} />
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>+15%</span>
            </div>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">${stats.revenue.toLocaleString()}</h3>
            <p className="stat-label">Total Revenue</p>
            <div className="stat-detail">
              <ShoppingBag size={14} />
              <span>{stats.totalOrders.toLocaleString()} orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div 
                key={index} 
                className="quick-action-card"
                onClick={() => navigate(action.path)}
              >
                <div className="action-icon" style={{background: action.color}}>
                  <Icon size={28} />
                </div>
                <div className="action-content">
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                  <div className="action-count">{action.count.toLocaleString()} items</div>
                </div>
                <ArrowRight className="action-arrow" size={20} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Sections */}
      <div className="activity-grid">
        {/* Recent Shops */}
        <div className="activity-section">
          <div className="section-header">
            <h2 className="section-title">Recent Shops</h2>
            <button 
              className="view-all-link"
              onClick={() => navigate('/admin/shops')}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="activity-list">
            {recentShops.map((shop) => (
              <div key={shop.id} className="activity-item">
                <div className="item-avatar shop-avatar">
                  <Store size={20} />
                </div>
                <div className="item-content">
                  <h4 className="item-title">{shop.name}</h4>
                  <p className="item-subtitle">Owner: {shop.owner}</p>
                  <div className="item-meta">
                    <div className="meta-rating">
                      <Star size={12} fill="currentColor" />
                      <span>{shop.rating}</span>
                    </div>
                    <span className="meta-divider">•</span>
                    <span>{shop.orders} orders</span>
                  </div>
                </div>
                <span className={`status-badge ${shop.status}`}>
                  {shop.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="activity-section">
          <div className="section-header">
            <h2 className="section-title">Recent Reviews</h2>
            <button 
              className="view-all-link"
              onClick={() => navigate('/admin/reviews')}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="activity-list">
            {recentReviews.map((review) => (
              <div key={review.id} className="activity-item">
                <div className="item-avatar user-avatar">
                  <Users size={20} />
                </div>
                <div className="item-content">
                  <h4 className="item-title">{review.user}</h4>
                  <p className="item-subtitle">{review.shop}</p>
                  <div className="item-meta">
                    <div className="meta-rating">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
                <span className={`status-badge ${review.status}`}>
                  {review.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="activity-section">
          <div className="section-header">
            <h2 className="section-title">Recent Users</h2>
            <button 
              className="view-all-link"
              onClick={() => navigate('/admin/users')}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="activity-list">
            {recentUsers.map((user) => (
              <div key={user.id} className="activity-item">
                <div className="item-avatar user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="item-content">
                  <h4 className="item-title">{user.name}</h4>
                  <p className="item-subtitle">{user.email}</p>
                  <div className="item-meta">
                    <span className="user-role">{user.role}</span>
                    <span className="meta-divider">•</span>
                    <span>{user.orders} orders</span>
                  </div>
                </div>
                <span className={`status-badge ${user.status}`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="alerts-section">
        <h2 className="section-title">System Alerts</h2>
        <div className="alerts-list">
          <div className="alert-item warning">
            <AlertCircle size={20} />
            <div className="alert-content">
              <h4>Pending Reviews</h4>
              <p>{stats.pendingReviews} reviews are waiting for moderation</p>
            </div>
            <button 
              className="alert-action"
              onClick={() => navigate('/admin/reviews')}
            >
              Review Now
            </button>
          </div>
          <div className="alert-item info">
            <CheckCircle size={20} />
            <div className="alert-content">
              <h4>System Status</h4>
              <p>All systems are operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;