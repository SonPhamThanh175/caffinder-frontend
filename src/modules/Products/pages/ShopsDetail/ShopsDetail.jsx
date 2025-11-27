import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style.css';
import shopsApi from '../../../../api/shopsApi';

const ShopsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchShopDetail();
    }, [id]);

    const fetchShopDetail = async () => {
        try {
            setLoading(true);
            const response = await shopsApi.getInfoById(id);
            console.log("response",response);
            
            setShop(response.shop);
        } catch (error) {
            console.error('Error fetching shop details:', error);
        } finally {
            setLoading(false);
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

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    if (!shop) {
        return <div className="error">Không tìm thấy cửa hàng</div>;
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

                    <button className="book-btn">Đặt bàn ngay</button>
                </div>
            </div>
        </div>
    );
};

export default ShopsDetail;