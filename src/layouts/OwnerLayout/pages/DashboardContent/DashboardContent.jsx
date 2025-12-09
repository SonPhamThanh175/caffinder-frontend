import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Star, DollarSign, Users, Clock } from 'lucide-react';
import ownerServiceApi from '../../../../api/ownerServiceApi';
import './style.css';


const DashboardContent = ({ shopData }) => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    todayBookings: 0,
    avgRating: 0,
    revenue: 0
  });

  useEffect(() => {
    if (shopData?.id) {
      loadDashboardData();
    }
  }, [shopData]);

  const loadDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const bookingsData = await ownerServiceApi.getShopBooking(shopData.id, {
        date: today,
        status: 'pending'
      });
      
      setRecentBookings(bookingsData?.data?.slice(0, 5) || []);
      
      setStats({
        totalBookings: 156,
        todayBookings: bookingsData?.data?.length || 0,
        avgRating: 4.8,
        revenue: 45000000
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const statCards = [
    { 
      label: 'Tổng đặt chỗ', 
      value: stats.totalBookings, 
      change: '+12%', 
      icon: Calendar,
      color: '#D4A574',
      bgColor: '#FFF8F0'
    },
    { 
      label: 'Hôm nay', 
      value: stats.todayBookings, 
      change: '+5%', 
      icon: Clock,
      color: '#8B6F47',
      bgColor: '#F5EDE3'
    },
    { 
      label: 'Đánh giá TB', 
      value: stats.avgRating.toFixed(1), 
      change: '+0.2', 
      icon: Star,
      color: '#C9A66B',
      bgColor: '#FFF5E6'
    },
    { 
      label: 'Doanh thu', 
      value: `${(stats.revenue / 1000000).toFixed(0)}M`, 
      change: '+18%', 
      icon: DollarSign,
      color: '#A0826D',
      bgColor: '#F9F3ED'
    }
  ];

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xác nhận', class: 'pending' },
      confirmed: { label: 'Đã xác nhận', class: 'confirmed' },
      completed: { label: 'Hoàn thành', class: 'completed' },
      cancelled: { label: 'Đã hủy', class: 'cancelled' }
    };
    return statusMap[status] || statusMap.pending;
  };

  return (
    <div className="dashboard-container">
      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="stat-card"
              style={{
                '--card-color': stat.color,
                '--card-bg': stat.bgColor
              }}
            >
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <h3 className="stat-label">{stat.label}</h3>
                <div className="stat-value-row">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-change positive">
                    <TrendingUp size={14} />
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card recent-bookings">
          <div className="card-header">
            <h2>
              <Calendar size={20} />
              Đặt chỗ gần đây
            </h2>
            <button className="view-all-btn">Xem tất cả</button>
          </div>
          
          <div className="booking-list">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-avatar">
                    {booking.user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="booking-info">
                    <p className="customer-name">{booking.user?.name || 'Khách hàng'}</p>
                    <p className="booking-time">
                      {new Date(booking.bookingDate).toLocaleDateString('vi-VN')} • 
                      {booking.numberOfGuests} người
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusBadge(booking.status).class}`}>
                    {getStatusBadge(booking.status).label}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Calendar size={48} />
                <p>Chưa có đặt chỗ nào</p>
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card quick-stats">
          <div className="card-header">
            <h2>
              <Users size={20} />
              Thống kê nhanh
            </h2>
          </div>
          
          <div className="quick-stats-list">
            <div className="quick-stat-item">
              <div className="stat-icon-small booking">
                <Calendar size={18} />
              </div>
              <div className="stat-details">
                <span className="stat-number">24</span>
                <span className="stat-text">Đặt chỗ hôm nay</span>
              </div>
            </div>
            
            <div className="quick-stat-item">
              <div className="stat-icon-small pending">
                <Clock size={18} />
              </div>
              <div className="stat-details">
                <span className="stat-number">8</span>
                <span className="stat-text">Chờ xác nhận</span>
              </div>
            </div>
            
            <div className="quick-stat-item">
              <div className="stat-icon-small review">
                <Star size={18} />
              </div>
              <div className="stat-details">
                <span className="stat-number">156</span>
                <span className="stat-text">Đánh giá</span>
              </div>
            </div>
            
            <div className="quick-stat-item">
              <div className="stat-icon-small capacity">
                <Users size={18} />
              </div>
              <div className="stat-details">
                <span className="stat-number">{shopData?.totalCapacity || 0}</span>
                <span className="stat-text">Sức chứa</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;