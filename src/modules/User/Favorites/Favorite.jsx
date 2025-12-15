import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Star, Navigation, Phone, Clock, Coffee } from 'lucide-react';
import { Card, Empty, Spin, message, Row, Col, Space, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import favoriteApi from '../../../api/favoriteApi';
import './style.css';

const { Title, Text } = Typography;

const FavoritePage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoriteApi.getMyFavorite();
      setFavorites(response.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      message.error(error || 'Không thể tải danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (shopId, e) => {
    e.stopPropagation();
    try {
      setRemovingId(shopId);
      await favoriteApi.delete(shopId);
      setFavorites(prev => prev.filter(fav => fav.shop.id !== shopId));
      message.success('Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      console.error('Error removing favorite:', error);
      message.error(error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleShopClick = (shopId) => {
    navigate(`/shops/${shopId}`);
  };

  const handleBooking = (shopId, e) => {
    e.stopPropagation();
    navigate(`/user/shops/${shopId}`);
  };

  return (
    <div className="favorite-container">
      <div className="favorite-header">
        <div className="header-content">
          <div className="header-icon-wrapper">
            <Heart size={40} fill="#FFFFFF" color="#FFFFFF" />
          </div>
          <Title level={2} style={{ color: 'white', marginBottom: 8, marginTop: 0 }}>
            Quán yêu thích
          </Title>
          <Text style={{ color: '#FFE0B2', fontSize: '16px' }}>
            {favorites.length} quán bạn đã lưu
          </Text>
        </div>
      </div>

      <div className="favorite-content">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
            <Text style={{ marginTop: 16, color: '#757575' }}>Đang tải...</Text>
          </div>
        ) : (
          <div className="favorites-wrapper">
            {favorites.length === 0 ? (
              <Card className="empty-card">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Space direction="vertical" size={8}>
                      <Text style={{ fontSize: '16px', color: '#757575' }}>
                        Chưa có quán yêu thích nào
                      </Text>
                      <Text type="secondary">
                        Khám phá và lưu các quán cà phê yêu thích của bạn
                      </Text>
                    </Space>
                  }
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate('/user/shops')}
                    style={{
                      background: 'linear-gradient(135deg, #8B5A2B 0%, #6B4423 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      height: '44px',
                      padding: '0 32px',
                      fontWeight: 600
                    }}
                  >
                    Khám phá ngay
                  </Button>
                </Empty>
              </Card>
            ) : (
              <Row gutter={[24, 24]}>
                {favorites.map((favorite) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={favorite.id}>
                    <Card
                      hoverable
                      onClick={() => handleShopClick(favorite.shop.id)}
                      className="favorite-shop-card"
                      bordered={false}
                      cover={
                        <div className="shop-image-container">
                          <img
                            alt={favorite.shop.name}
                            src={favorite.shop.img?.[0] || 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400';
                            }}
                          />
                          <button
                            className="favorite-btn active"
                            onClick={(e) => handleRemoveFavorite(favorite.shop.id, e)}
                            disabled={removingId === favorite.shop.id}
                          >
                            <Heart size={20} fill="#EF4444" color="#EF4444" />
                          </button>
                        </div>
                      }
                    >
                      <div className="shop-card-content">
                        <Title level={4} className="shop-name-fav">
                          {favorite.shop.name}
                        </Title>

                        <Space size={4} className="shop-address-fav">
                          <MapPin size={14} color="#1976D2" />
                          <Text type="secondary" ellipsis>
                            {favorite.shop.address}
                          </Text>
                        </Space>

                        <div className="shop-meta-fav">
                          <Space size={4}>
                            <Star size={14} fill="#FFB300" color="#FFB300" />
                            <Text strong style={{ color: '#FFB300' }}>
                              {favorite.shop.rating || '5.0'}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '13px' }}>
                              ({favorite.shop.reviewCount || '0'})
                            </Text>
                          </Space>

                          {favorite.shop.distance && (
                            <Space size={4}>
                              <Navigation size={14} color="#1976D2" />
                              <Text type="secondary" style={{ fontSize: '13px' }}>
                                {favorite.shop.distance} km
                              </Text>
                            </Space>
                          )}
                        </div>

                        {favorite.shop.tags && favorite.shop.tags.length > 0 && (
                          <div className="shop-tags-fav">
                            {favorite.shop.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="tag-fav">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <Button
                          type="primary"
                          block
                          className="booking-btn-fav"
                          onClick={(e) => handleBooking(favorite.shop.id, e)}
                        >
                          <Coffee size={16} />
                          Đặt bàn ngay
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;