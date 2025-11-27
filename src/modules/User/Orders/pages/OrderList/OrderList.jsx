import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, User, Heart } from 'lucide-react';
import { Select, DatePicker, Card, Empty, Spin, Tag, Row, Col, Space, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import orderApi from '../../../../../api/orderService';
import favoriteApi from '../../../../../api/favoriteApi';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import './style.css';

dayjs.locale('vi');

const { Title, Text } = Typography;
const { Option } = Select;

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchDate, setSearchDate] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [togglingFav, setTogglingFav] = useState(null);

  const statusConfig = {
    pending: { label: 'Chờ xác nhận', color: 'warning' },
    confirmed: { label: 'Đã xác nhận', color: 'processing' },
    rejected: { label: 'Đã từ chối', color: 'error' },
    cancelled: { label: 'Đã hủy', color: 'default' },
    completed: { label: 'Hoàn thành', color: 'success' },
    no_show: { label: 'Không đến', color: 'orange' }
  };

  useEffect(() => {
    fetchOrders();
    fetchFavorites();
  }, [selectedStatus, searchDate]);

  const fetchFavorites = async () => {
    try {
      const response = await favoriteApi.getMyFavorite();
      const favShopIds = new Set(response.data?.map(fav => fav.shop.id) || []);
      setFavorites(favShopIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

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

  const handleToggleFavorite = async (shopId, e) => {
    console.log(1111);
    
    e.stopPropagation();
    try {
      setTogglingFav(shopId);
      const isFavorite = favorites.has(shopId);
      
      if (isFavorite) {
        await favoriteApi.delete(shopId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(shopId);
          return newSet;
        });
        message.success('Đã xóa khỏi yêu thích');
      } else {
        await favoriteApi.add(shopId);
        setFavorites(prev => new Set([...prev, shopId]));
        message.success('Đã thêm vào yêu thích');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setTogglingFav(null);
    }
  };

  const formatDate = (dateStr) => {
    return dayjs(dateStr).format('DD/MM/YYYY');
  };

  const formatTime = (timeStr) => {
    return timeStr.substring(0, 5);
  };

  const handleOrderClick = (orderId) => {
    navigate(`${orderId}`);
  };

  const handleDateChange = (date) => {
    setSearchDate(date ? date.format('YYYY-MM-DD') : null);
  };

  return (
    <div className="order-list-container">
      <div className="order-list-header">
        <div className="header-content">
          <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
            Đơn đặt bàn của tôi
          </Title>
          <Text style={{ color: '#fde68a' }}>
            Quản lý và theo dõi các đơn đặt bàn
          </Text>
        </div>
      </div>

      <div className="order-list-content">
        <Card className="filter-card" bordered={false}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>
                  <Calendar size={16} style={{ marginRight: 8 }} />
                  Trạng thái
                </Text>
                <Select
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  style={{ width: '100%' }}
                  size="large"
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="pending">Chờ xác nhận</Option>
                  <Option value="confirmed">Đã xác nhận</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="cancelled">Đã hủy</Option>
                  <Option value="rejected">Đã từ chối</Option>
                  <Option value="no_show">Không đến</Option>
                </Select>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>
                  <Calendar size={16} style={{ marginRight: 8 }} />
                  Ngày đặt
                </Text>
                <DatePicker
                  value={searchDate ? dayjs(searchDate) : null}
                  onChange={handleDateChange}
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày"
                  style={{ width: '100%' }}
                  size="large"
                />
              </Space>
            </Col>
          </Row>
        </Card>

        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <Text style={{ marginTop: 16 }}>Đang tải...</Text>
          </div>
        ) : (
          <div className="orders-wrapper">
            {orders.length === 0 ? (
              <Card>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Không có đơn đặt bàn nào"
                />
              </Card>
            ) : (
              orders.map((order) => (
                <Card
                  key={order.id}
                  hoverable
                  onClick={() => handleOrderClick(order.id)}
                  className="order-card-antd"
                  bordered={false}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={6}>
                      <div className="order-image-wrapper">
                        <img
                          src={order.shop.img[0]}
                          alt={order.shop.name}
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400';
                          }}
                        />
                        <button
                          className={`favorite-btn-order ${favorites.has(order.shop.id) ? 'active' : ''}`}
                          onClick={(e) => handleToggleFavorite(order.shop.id, e)}
                          disabled={togglingFav === order.shop.id}
                        >
                          <Heart
                            size={18}
                            fill={favorites.has(order.shop.id) ? '#EF4444' : 'none'}
                            color={favorites.has(order.shop.id) ? '#EF4444' : '#757575'}
                          />
                        </button>
                      </div>
                    </Col>

                    <Col xs={24} md={18}>
                      <div className="order-content-antd">
                        <div className="order-header-flex">
                          <div>
                            <Title level={4} style={{ marginBottom: 4 }}>
                              {order.shop.name}
                            </Title>
                            <Space size={4}>
                              <MapPin size={14} color="#d97706" />
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                {order.shop.address}
                              </Text>
                            </Space>
                          </div>
                          <Tag color={statusConfig[order.status].color} className="status-tag">
                            {statusConfig[order.status].label}
                          </Tag>
                        </div>

                        <Row gutter={[16, 12]} style={{ marginTop: 16 }}>
                          <Col xs={12} sm={6}>
                            <Space direction="vertical" size={0}>
                              <Space size={4}>
                                <Calendar size={16} color="#d97706" />
                                <Text type="secondary" style={{ fontSize: 12 }}>Ngày</Text>
                              </Space>
                              <Text strong>{formatDate(order.bookingDate)}</Text>
                            </Space>
                          </Col>
                          <Col xs={12} sm={6}>
                            <Space direction="vertical" size={0}>
                              <Space size={4}>
                                <Clock size={16} color="#d97706" />
                                <Text type="secondary" style={{ fontSize: 12 }}>Giờ</Text>
                              </Space>
                              <Text strong>{formatTime(order.bookingTime)}</Text>
                            </Space>
                          </Col>
                          <Col xs={12} sm={6}>
                            <Space direction="vertical" size={0}>
                              <Space size={4}>
                                <Users size={16} color="#d97706" />
                                <Text type="secondary" style={{ fontSize: 12 }}>Số khách</Text>
                              </Space>
                              <Text strong>{order.numberOfGuests} người</Text>
                            </Space>
                          </Col>
                          <Col xs={12} sm={6}>
                            <Space direction="vertical" size={0}>
                              <Space size={4}>
                                <User size={16} color="#d97706" />
                                <Text type="secondary" style={{ fontSize: 12 }}>Người đặt</Text>
                              </Space>
                              <Text strong>{order.customerName}</Text>
                            </Space>
                          </Col>
                        </Row>

                        {order.note && (
                          <div className="order-note-antd">
                            <Text>
                              <Text strong>Ghi chú:</Text> {order.note}
                            </Text>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;