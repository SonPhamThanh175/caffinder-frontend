import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Phone, User, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import orderApi from '../../../../api/orderService';
import './style.css';

const OrderDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusConfig = {
    pending: { label: 'Chờ xác nhận', color: 'status-pending' },
    confirmed: { label: 'Đã xác nhận', color: 'status-confirmed' },
    rejected: { label: 'Đã từ chối', color: 'status-rejected' },
    cancelled: { label: 'Đã hủy', color: 'status-cancelled' },
    completed: { label: 'Hoàn thành', color: 'status-completed' },
    no_show: { label: 'Không đến', color: 'status-no-show' }
  };

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getInfoById(id);
      setOrder(response.booking);
    } catch (error) {
      console.error('Error fetching order detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'long', 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    return timeStr.substring(0, 5);
  };

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN');
  };

  const handleBack = () => {
    navigate('/user/orders');
  };

  if (loading) {
    return (
      <div className="order-detail-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-container">
        <div className="empty-state">
          <p>Không tìm thấy đơn đặt bàn</p>
          <button onClick={handleBack} className="back-button">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-container">
      {/* Header */}
      <div className="order-detail-header">
        <div className="header-content">
          <button onClick={handleBack} className="back-button">
            <ArrowLeft className="back-icon" />
            Quay lại
          </button>
          <h1 className="header-title">Chi tiết đơn đặt bàn</h1>
          <p className="header-subtitle">Mã đơn: #{order.id}</p>
        </div>
      </div>

      <div className="order-detail-content">
        {/* Status Badge */}
        <div className="status-container">
          <span className={`status-badge-large ${statusConfig[order.status].color}`}>
            {statusConfig[order.status].label}
          </span>
        </div>

        {/* Shop Info */}
        <div className="info-card shop-info">
          <img
            src={order.shop.img?.[0] || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'}
            alt={order.shop.name}
            className="shop-image"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400';
            }}
          />
          <div className="shop-details">
            <h2 className="shop-name">{order.shop.name}</h2>
            <div className="shop-address">
              <MapPin className="address-icon" />
              <p>{order.shop.address}</p>
            </div>
            {order.shop.owner && (
              <div className="owner-info">
                <img 
                  src={order.shop.owner.avaUrl} 
                  alt={order.shop.owner.displayName}
                  className="owner-avatar"
                  onError={(e) => {
                    e.target.src = 'https://jskadysbdihpzhmaaccv.supabase.co/storage/v1/object/public/image/default-avatar.jpg';
                  }}
                />
                <div>
                  <div className="owner-label">Chủ quán</div>
                  <div className="owner-name">{order.shop.owner.displayName}</div>
                  {order.shop.owner.contactPhone && (
                    <div className="owner-phone">{order.shop.owner.contactPhone}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Info */}
        <div className="info-card">
          <h3 className="card-title">Thông tin đặt bàn</h3>
          <div className="info-list">
            <div className="info-item">
              <Calendar className="info-icon" />
              <div>
                <div className="info-label">Ngày đặt</div>
                <div className="info-value">{formatDate(order.bookingDate)}</div>
              </div>
            </div>
            <div className="info-item">
              <Clock className="info-icon" />
              <div>
                <div className="info-label">Thời gian</div>
                <div className="info-value">
                  {formatTime(order.bookingTime)} - {formatTime(order.endTime)} ({order.duration} phút)
                </div>
              </div>
            </div>
            <div className="info-item">
              <Users className="info-icon" />
              <div>
                <div className="info-label">Số lượng khách</div>
                <div className="info-value">{order.numberOfGuests} người</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="info-card">
          <h3 className="card-title">Thông tin khách hàng</h3>
          <div className="info-list">
            <div className="info-item">
              <User className="info-icon" />
              <div>
                <div className="info-label">Tên khách hàng</div>
                <div className="info-value">{order.customerName}</div>
              </div>
            </div>
            <div className="info-item">
              <Phone className="info-icon" />
              <div>
                <div className="info-label">Số điện thoại</div>
                <div className="info-value">{order.customerPhone}</div>
              </div>
            </div>
            {order.note && (
              <div className="note-box">
                <div className="info-label">Ghi chú</div>
                <p className="note-text">{order.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="info-card">
          <h3 className="card-title">Lịch sử đơn hàng</h3>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div>
                <div className="timeline-label">Tạo đơn</div>
                <div className="timeline-value">{formatDateTime(order.createdAt)}</div>
              </div>
            </div>
            {order.confirmedAt && (
              <div className="timeline-item">
                <div className="timeline-dot timeline-dot-confirmed"></div>
                <div>
                  <div className="timeline-label">Xác nhận</div>
                  <div className="timeline-value">{formatDateTime(order.confirmedAt)}</div>
                </div>
              </div>
            )}
            {order.completedAt && (
              <div className="timeline-item">
                <div className="timeline-dot timeline-dot-completed"></div>
                <div>
                  <div className="timeline-label">Hoàn thành</div>
                  <div className="timeline-value">{formatDateTime(order.completedAt)}</div>
                </div>
              </div>
            )}
            {order.rejectionReason && (
              <div className="rejection-box">
                <div className="rejection-label">Lý do từ chối</div>
                <p className="rejection-text">{order.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;