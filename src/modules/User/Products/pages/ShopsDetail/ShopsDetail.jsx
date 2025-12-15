import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { message } from 'antd';
import './style.css';
import shopsApi from '../../../../../api/shopsApi';
import favoriteApi from '../../../../../api/favoriteApi';
import BookingModal from '../ShopsDetail/components/BookingModal/BookingModal';
import ReviewSection from './components/ReviewSection/ReviewSection';

const ShopsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [bookingModalVisible, setBookingModalVisible] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [togglingFav, setTogglingFav] = useState(false);

    useEffect(() => {
        fetchShopDetail();
        checkFavoriteStatus();
    }, [id]);

    const fetchShopDetail = async () => {
        try {
            setLoading(true);
            const response = await shopsApi.getInfoById(id);
            console.log("response", response);
            setShop(response.shop);
        } catch (error) {
            console.error('Error fetching shop details:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkFavoriteStatus = async () => {
        try {
            const response = await favoriteApi.getMyFavorite();
            const favorites = response.data || [];
            setIsFavorite(favorites.some(fav => fav.shop.id === parseInt(id)));
        } catch (error) {
            console.error('Error checking favorite status:', error);
        }
    };

    const handleToggleFavorite = async (e) => {
        e.stopPropagation();
        try {
            setTogglingFav(true);
            
            if (isFavorite) {
                await favoriteApi.delete(id);
                setIsFavorite(false);
                message.success('Đã xóa khỏi yêu thích');
            } else {
                await favoriteApi.add(id);
                setIsFavorite(true);
                message.success('Đã thêm vào yêu thích');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            message.error(error || 'Có lỗi xảy ra');
        } finally {
            setTogglingFav(false);
        }
    };

    const handleNextImage = () => {
        if (shop?.img) {
            setCurrentImageIndex((prev) => 
                prev === shop.img.length - 1 ? 0 : prev + 1
            );
        }
    };

    const handlePrevImage = () => {
        if (shop?.img) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? shop.img.length - 1 : prev - 1
            );
        }
    };

    const handleBooking = () => {
        setBookingModalVisible(true);
    };

    const handleCloseBookingModal = () => {
        setBookingModalVisible(false);
    };

    if (loading) {
        return (
            <div className="shops-detail">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>Đang tải thông tin quán...</p>
                </div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="shops-detail">
                <div className="error">
                    <h2>Không tìm thấy cửa hàng</h2>
                    <button onClick={() => navigate('/user/shops')}>
                        Quay về danh sách
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="shops-detail">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← Quay lại
            </button>

            <div className="detail-container">
                <div className="image-section">
                    <div className="main-image">
                        <img 
                            src={shop.img[currentImageIndex]} 
                            alt={shop.name}
                        />
                        <button
                            className={`favorite-btn-shop-detail ${isFavorite ? 'active' : ''}`}
                            onClick={handleToggleFavorite}
                            disabled={togglingFav}
                        >
                            <Heart
                                size={24}
                                fill={isFavorite ? '#EF4444' : 'none'}
                                color={isFavorite ? '#EF4444' : '#757575'}
                            />
                        </button>
                        {shop.img.length > 1 && (
                            <>
                                <button className="nav-btn prev" onClick={handlePrevImage}>
                                    ‹
                                </button>
                                <button className="nav-btn next" onClick={handleNextImage}>
                                    ›
                                </button>
                            </>
                        )}
                    </div>
                    <div className="thumbnail-list">
                        {shop.img.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${shop.name} ${index + 1}`}
                                className={index === currentImageIndex ? 'active' : ''}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                </div>

                <div className="info-section">
                    <h1 className="shop-name">{shop.name}</h1>
                    
                    <div className="status-badge">
                        {shop.status === 'approved' ? 'Đã xác minh' : 'Chưa xác minh'}
                    </div>

                    <div className="info-group">
                        <h3>Mô tả</h3>
                        <p>{shop.description}</p>
                    </div>

                    <div className="info-group">
                        <h3>Địa chỉ</h3>
                        <p>📍 {shop.address}</p>
                    </div>

                    <div className="info-group">
                        <h3>Giờ mở cửa</h3>
                        <p>🕐 {shop.openTime} - {shop.closeTime}</p>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <span className="label">Sức chứa:</span>
                            <span className="value">{shop.totalCapacity} người</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Thời gian mặc định:</span>
                            <span className="value">{shop.defaultDuration} phút</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Tỷ lệ overbooking:</span>
                            <span className="value">{shop.overbookingRate}</span>
                        </div>
                    </div>

                    <div className="owner-section">
                        <h3>Chủ sở hữu</h3>
                        <div className="owner-info">
                            <img 
                                src={shop.owner.avaUrl} 
                                alt={shop.owner.displayName}
                                className="owner-avatar"
                            />
                            <div>
                                <p className="owner-name">{shop.owner.displayName}</p>
                                {shop.owner.contactPhone && (
                                    <p className="owner-phone">📞 {shop.owner.contactPhone}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button className="book-btn" onClick={handleBooking}>
                        Đặt bàn ngay
                    </button>
                </div>
            </div>

            <ReviewSection shopId={id} />

            <BookingModal
                visible={bookingModalVisible}
                onCancel={handleCloseBookingModal}
                shop={shop}
            />
        </div>
    );
};

export default ShopsDetail;