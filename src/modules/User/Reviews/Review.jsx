import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageCircle, Calendar, Store, ArrowRight, Trash2 } from 'lucide-react';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import reviewApi from '../../../api/reviewApi';
import './style.css';

const { confirm } = Modal;

const Reviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyReviews();
    }, []);

    const fetchMyReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewApi.getMyReviewList();
            setReviews(response.data || []);
        } catch (error) {
            console.error('Error fetching my reviews:', error);
            message.error(error || 'Không thể tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToShop = (shopId) => {
        navigate(`/user/shops/${shopId}`);
    };

    const renderStars = (rating) => {
        return (
            <div className="stars-display">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        fill={star <= rating ? '#FFD700' : 'none'}
                        color={star <= rating ? '#FFD700' : '#D1D5DB'}
                    />
                ))}
            </div>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="my-reviews-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải đánh giá của bạn...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-reviews-page">
            <div className="page-header-reviews">
                <div className="header-content">
                    <h1>Đánh giá của tôi</h1>
                    <p>Quản lý tất cả đánh giá bạn đã gửi</p>
                </div>
                <div className="reviews-stats">
                    <div className="stat-item">
                        <MessageCircle size={24} />
                        <div>
                            <div className="stat-value">{reviews.length}</div>
                            <div className="stat-label">Tổng đánh giá</div>
                        </div>
                    </div>
                </div>
            </div>

            {reviews.length === 0 ? (
                <div className="empty-reviews">
                    <div className="empty-icon">
                        <MessageCircle size={64} />
                    </div>
                    <h2>Chưa có đánh giá nào</h2>
                    <p>Bạn chưa đánh giá quán nào. Hãy ghé thăm và chia sẻ trải nghiệm của bạn!</p>
                    <button
                        className="explore-btn"
                        onClick={() => navigate('/user/shops')}
                    >
                        <Store size={18} />
                        <span>Khám phá quán</span>
                    </button>
                </div>
            ) : (
                <div className="reviews-grid">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="review-card"
                            onClick={() => handleNavigateToShop(review.shop.id)}
                        >
                            <div className="review-card-header">
                                <div className="shop-info">
                                    <div className="shop-image">
                                        {review.shop.img && review.shop.img[0] ? (
                                            <img
                                                src={review.shop.img[0]}
                                                alt={review.shop.name}
                                            />
                                        ) : (
                                            <div className="shop-placeholder">
                                                <Store size={32} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="shop-details">
                                        <h3 className="shop-name">{review.shop.name}</h3>
                                        <p className="shop-address">{review.shop.address}</p>
                                    </div>
                                </div>
                                <button
                                    className="view-shop-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNavigateToShop(review.shop.id);
                                    }}
                                >
                                    <ArrowRight size={20} />
                                </button>
                            </div>

                            <div className="review-card-body">
                                <div className="review-rating-date">
                                    <div className="rating-with-stars">
                                        {renderStars(review.rating)}
                                        <span className="rating-text">{review.rating}/5</span>
                                    </div>
                                    <div className="review-date">
                                        <Calendar size={14} />
                                        <span>{formatDate(review.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="review-comment">
                                    {review.comment}
                                </div>
                            </div>

                            <div className="review-card-footer">
                                <div className="review-status">
                                    <span className="status-badge published">Đã xuất bản</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Reviews;