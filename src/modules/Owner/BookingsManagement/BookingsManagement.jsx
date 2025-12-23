import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Check, X, Eye, Search } from 'lucide-react';
import ownerServiceApi from '../../../api/ownerServiceApi';
import './style.css';
import { message, Modal, Input } from 'antd'; // ✅ Thêm Input
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input; // ✅ TextArea cho lý do từ chối

const BookingsManagement = ({ shopId }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        date: '',
        status: '',
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
            const params = {};

            if (filters.date) {
                params.date = filters.date;
            }

            if (filters.status) {
                params.status = filters.status;
            }

            const response = await ownerServiceApi.getShopBooking(shopId, params);
            setBookings(response?.bookings || []);
        } catch (error) {
            console.error('Error loading bookings:', error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Hàm kiểm tra booking đã qua chưa
    const isBookingPast = (bookingDate, bookingTime) => {
        const now = new Date();
        const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
        return bookingDateTime < now;
    };

    const handleConfirm = async (bookingId) => {
        try {
            await ownerServiceApi.confirmBooking(bookingId);
            loadBookings();
            message.success('Xác nhận đặt chỗ thành công!');
        } catch (error) {
            console.error('Error confirming booking:', error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    // ✅ Modal với input lý do từ chối
    const handleReject = (bookingId) => {
        let rejectionReason = '';

        Modal.confirm({
            title: 'Xác nhận từ chối',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p style={{ marginBottom: '12px' }}>Bạn có chắc muốn từ chối đặt chỗ này?</p>
                    <TextArea
                        placeholder='Nhập lý do từ chối (bắt buộc)...'
                        rows={4}
                        onChange={(e) => {
                            rejectionReason = e.target.value;
                        }}
                        style={{ marginTop: '8px' }}
                    />
                </div>
            ),
            okText: 'Từ chối',
            cancelText: 'Hủy',
            okType: 'danger',
            centered: true,
            onOk: async () => {
                // ✅ Validate lý do từ chối
                if (!rejectionReason || rejectionReason.trim() === '') {
                    message.error('Vui lòng nhập lý do từ chối!');
                    return Promise.reject(); // Ngăn modal đóng
                }

                try {
                    // ✅ Gửi kèm rejectionReason
                    await ownerServiceApi.rejectBooking(bookingId, {
                        rejectionReason: rejectionReason.trim(),
                    });
                    loadBookings();
                    message.success('Đã từ chối đặt chỗ!');
                } catch (error) {
                    console.error('Error rejecting booking:', error);
                    message.error('Có lỗi xảy ra. Vui lòng thử lại!');
                    return Promise.reject();
                }
            },
        });
    };

    const getStatusInfo = (status) => {
        const statusMap = {
            pending: { label: 'Chờ xác nhận', class: 'pending', color: '#F59E0B' },
            confirmed: { label: 'Đã xác nhận', class: 'confirmed', color: '#10B981' },
            completed: { label: 'Hoàn thành', class: 'completed', color: '#3B82F6' },
            cancelled: { label: 'Đã hủy', class: 'cancelled', color: '#EF4444' },
            rejected: { label: 'Đã từ chối', class: 'rejected', color: '#EF4444' },
        };
        return statusMap[status] || statusMap.pending;
    };

    const filteredBookings = bookings.filter(
        (booking) =>
            booking.user?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id?.toString().includes(searchTerm),
    );

    return (
        <div className='bookings-management'>
            <div className='filters-section'>
                <div className='filters-group'>
                    <div className='filter-item'>
                        <label>
                            <Calendar size={16} />
                            Ngày đặt
                        </label>
                        <input
                            type='date'
                            className='date-input'
                            value={filters.date}
                            onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                        />
                    </div>

                    <div className='filter-item'>
                        <label>
                            <Filter size={16} />
                            Trạng thái
                        </label>
                        <select
                            className='status-select'
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value=''>Tất cả</option>
                            <option value='pending'>Chờ xác nhận</option>
                            <option value='confirmed'>Đã xác nhận</option>
                            <option value='completed'>Hoàn thành</option>
                            <option value='cancelled'>Đã hủy</option>
                        </select>
                    </div>

                    <div className='filter-item search-box'>
                        <label>
                            <Search size={16} />
                            Tìm kiếm
                        </label>
                        <input
                            type='text'
                            placeholder='Tên khách hàng hoặc mã đặt...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='search-input'
                        />
                    </div>
                </div>

                <button
                    className='refresh-btn'
                    onClick={loadBookings}
                >
                    Làm mới
                </button>
            </div>

            <div className='bookings-table-container'>
                {loading ? (
                    <div className='loading-state'>
                        <div className='coffee-spinner'>
                            <div className='coffee-cup'>☕</div>
                            <p>Đang tải...</p>
                        </div>
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <table className='bookings-table'>
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
                                // ✅ Kiểm tra booking đã qua chưa
                                const isPast = isBookingPast(
                                    booking.bookingDate,
                                    booking.bookingTime,
                                );

                                return (
                                    <tr key={booking.id}>
                                        <td className='booking-id'>#{booking.id}</td>
                                        <td>
                                            <div className='customer-cell'>
                                                <div className='customer-avatar'>
                                                    {booking.user?.displayName
                                                        ?.charAt(0)
                                                        .toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <p className='customer-name'>
                                                        {booking.user?.displayName || 'N/A'}
                                                    </p>
                                                    <p className='customer-email'>
                                                        {booking.user?.email || ''}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='datetime-cell'>
                                                <span className='date'>
                                                    {new Date(
                                                        booking.bookingDate,
                                                    ).toLocaleDateString('vi-VN')}
                                                </span>
                                                <span className='time'>{booking.bookingTime}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className='guest-count'>
                                                {booking.numberOfGuests} người
                                            </span>
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
                                            <div className='action-buttons'>
                                                {/* ✅ Chỉ hiện confirm/reject nếu pending và chưa qua thời gian */}
                                                {booking.status === 'pending' && !isPast && (
                                                    <>
                                                        <button
                                                            className='action-btn confirm'
                                                            onClick={() =>
                                                                handleConfirm(booking.id)
                                                            }
                                                            title='Xác nhận'
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            className='action-btn reject'
                                                            onClick={() => handleReject(booking.id)}
                                                            title='Từ chối'
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    className='action-btn view'
                                                    title='Xem chi tiết'
                                                >
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
                    <div className='empty-state'>
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
