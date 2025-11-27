import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Phone, User, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import orderApi from '../../../../api/orderService';
import './style.css';

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchDate, setSearchDate] = useState('');

  const statusConfig = {
    pending: { label: 'Chờ xác nhận', color: 'status-pending' },
    confirmed: { label: 'Đã xác nhận', color: 'status-confirmed' },
    rejected: { label: 'Đã từ chối', color: 'status-rejected' },
    cancelled: { label: 'Đã hủy', color: 'status-cancelled' },
    completed: { label: 'Hoàn thành', color: 'status-completed' },
    no_show: { label: 'Không đến', color: 'status-no-show' }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, searchDate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedStatus !== 'all') {
        params.status = selectedStatus;
      }
      if (searchDate) {
        params.date = searchDate;
      }
      const response = await orderApi.getUserOrder(params);
      setOrders(response.bookings || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (timeStr) => {
    return timeStr.substring(0, 5);
  };

  const handleOrderClick = (orderId) => {
    navigate(`${orderId}`);
  };

  return (
    <div className="order-list-container">
      {/* Header */}
      <div className="order-list-header">
        <div className="header-content">
          <h1 className="header-title">Đơn đặt bàn của tôi</h1>
          <p className="header-subtitle">Quản lý và theo dõi các đơn đặt bàn</p>
        </div>
      </div>

      <div className="order-list-content">
        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-wrapper">
            <div className="filter-group">
              <label className="filter-label">
                <Filter className="filter-icon" />
                Trạng thái
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
                <option value="rejected">Đã từ chối</option>
                <option value="no_show">Không đến</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">
                <Calendar className="filter-icon" />
                Ngày đặt
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="filter-input"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải...</p>
          </div>
        ) : (
          /* Orders List */
          <div className="orders-wrapper">
            {orders.length === 0 ? (
              <div className="empty-state">
                <Calendar className="empty-icon" />
                <p className="empty-text">Không có đơn đặt bàn nào</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleOrderClick(order.id)}
                  className="order-card"
                >
                  <div className="order-card-layout">
                    {/* Image */}
                    <div className="order-image">
                      <img
                        src={order.shop.img[0]}
                        alt={order.shop.name}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400';
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="order-content">
                      <div className="order-header">
                        <div>
                          <h3 className="shop-name">{order.shop.name}</h3>
                          <div className="shop-address">
                            <MapPin className="address-icon" />
                            {order.shop.address}
                          </div>
                        </div>
                        <span className={`status-badge ${statusConfig[order.status].color}`}>
                          {statusConfig[order.status].label}
                        </span>
                      </div>

                      <div className="order-details-grid">
                        <div className="detail-item">
                          <Calendar className="detail-icon" />
                          <div>
                            <div className="detail-label">Ngày</div>
                            <div className="detail-value">{formatDate(order.bookingDate)}</div>
                          </div>
                        </div>
                        <div className="detail-item">
                          <Clock className="detail-icon" />
                          <div>
                            <div className="detail-label">Giờ</div>
                            <div className="detail-value">{formatTime(order.bookingTime)}</div>
                          </div>
                        </div>
                        <div className="detail-item">
                          <Users className="detail-icon" />
                          <div>
                            <div className="detail-label">Số khách</div>
                            <div className="detail-value">{order.numberOfGuests} người</div>
                          </div>
                        </div>
                        <div className="detail-item">
                          <User className="detail-icon" />
                          <div>
                            <div className="detail-label">Người đặt</div>
                            <div className="detail-value">{order.customerName}</div>
                          </div>
                        </div>
                      </div>

                      {order.note && (
                        <div className="order-note">
                          <p>
                            <span className="note-label">Ghi chú:</span> {order.note}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;