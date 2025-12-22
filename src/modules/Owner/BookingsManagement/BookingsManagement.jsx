import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Check, X, Eye, Search } from 'lucide-react';
import ownerServiceApi from '../../../api/ownerServiceApi';
import './style.css';

const BookingsManagement = ({ shopId }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    status: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (shopId) {
      loadBookings();
    }
  }, [shopId, filters]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params = {
        date: filters.date,
        ...(filters.status && { status: filters.status })
      };
      
      const response = await ownerServiceApi.getShopBooking(shopId, params);
      setBookings(response?.data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId) => {
    try {
      await ownerServiceApi.confirmBooking(bookingId);
      loadBookings();
      alert('Xác nhận đặt chỗ thành công!');
    } catch (error) {
      console.error('Error confirming booking:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const handleReject = async (bookingId) => {
    if (window.confirm('Bạn có chắc muốn từ chối đặt chỗ này?')) {
      try {
        await ownerServiceApi.rejectBooking(bookingId);
        loadBookings();
        alert('Đã từ chối đặt chỗ!');
      } catch (error) {
        console.error('Error rejecting booking:', error);
        alert('Có lỗi xảy ra. Vui lòng thử lại!');
      }
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xác nhận', class: 'pending', color: '#F59E0B' },
      confirmed: { label: 'Đã xác nhận', class: 'confirmed', color: '#10B981' },
      completed: { label: 'Hoàn thành', class: 'completed', color: '#3B82F6' },
      cancelled: { label: 'Đã hủy', class: 'cancelled', color: '#EF4444' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const filteredBookings = bookings.filter(booking => 
    booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id?.toString().includes(searchTerm)
  );

  return (
    <div className="bookings-management">
      <div className="filters-section">
        <div className="filters-group">
          <div className="filter-item">
            <label>
              <Calendar size={16} />
              Ngày đặt
            </label>
            <input 
              type="date" 
              className="date-input"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
          </div>

          <div className="filter-item">
            <label>
              <Filter size={16} />
              Trạng thái
            </label>
            <select 
              className="status-select"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">Tất cả</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="filter-item search-box">
            <label>
              <Search size={16} />
              Tìm kiếm
            </label>
            <input 
              type="text"
              placeholder="Tên khách hàng hoặc mã đặt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <button className="refresh-btn" onClick={loadBookings}>
          Làm mới
        </button>
      </div>

      <div className="bookings-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="coffee-spinner">
              <div className="coffee-cup">☕</div>
              <p>Đang tải...</p>
            </div>
          </div>
        ) : filteredBookings.length > 0 ? (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Mã đặt</th>
                <th>Khách hàng</th>
                <th>Ngày & Giờ</th>
                <th>Số người</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const status = getStatusInfo(booking.status);
                return (
                  <tr key={booking.id}>
                    <td className="booking-id">#{booking.id}</td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {booking.user?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="customer-name">{booking.user?.name || 'N/A'}</p>
                          <p className="customer-email">{booking.user?.email || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="datetime-cell">
                        <span className="date">
                          {new Date(booking.bookingDate).toLocaleDateString('vi-VN')}
                        </span>
                        <span className="time">{booking.bookingTime}</span>
                      </div>
                    </td>
                    <td>
                      <span className="guest-count">{booking.numberOfGuests} người</span>
                    </td>
                    <td>
                      <span 
                        className={`status-badge ${status.class}`}
                        style={{ '--status-color': status.color }}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              className="action-btn confirm"
                              onClick={() => handleConfirm(booking.id)}
                              title="Xác nhận"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              className="action-btn reject"
                              onClick={() => handleReject(booking.id)}
                              title="Từ chối"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button className="action-btn view" title="Xem chi tiết">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Calendar size={64} />
            <h3>Không có đặt chỗ nào</h3>
            <p>Chưa có đặt chỗ nào trong khoảng thời gian này</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsManagement;