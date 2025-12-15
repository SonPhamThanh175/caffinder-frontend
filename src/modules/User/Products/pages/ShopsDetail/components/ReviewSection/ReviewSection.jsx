import React, { useState, useEffect } from 'react';
import { Star, User, Calendar, ThumbsUp, MessageCircle } from 'lucide-react';
import { message } from 'antd';
import reviewApi from '../../../../../../../api/reviewApi';
import './style.css';

const ReviewSection = ({ shopId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddReview, setShowAddReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [shopId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewApi.getShopReviewById(shopId);
            setReviews(response.data || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            message.error(error || 'Không thể tải đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            message.warning('Vui lòng chọn số sao đánh giá');
            return;
        }

        if (!comment.trim()) {
            message.warning('Vui lòng nhập nội dung đánh giá');
            return;
        }

        try {
            setSubmitting(true);
            await reviewApi.addReview(shopId, {
                rating,
                comment: comment.trim(),
            });

            message.success('Đánh giá của bạn đã được gửi!');
            setRating(0);
            setComment('');
            setShowAddReview(false);
            fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            message.error(error || 'Không thể gửi đánh giá. Vui lòng thử lại.');
        } finally {
            setSubmitting(false);
        }
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach((review) => {
            distribution[review.rating]++;
        });
        return distribution;
    };

    const renderStars = (rating, size = 20, interactive = false) => {
        return (
            <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        className={`star ${
                            star <= (interactive ? hoverRating || rating : rating)
                                ? 'filled'
                                : ''
                        }`}
                        fill={
                            star <= (interactive ? hoverRating || rating : rating)
                                ? '#FFD700'
                                : 'none'
                        }
                        color={
                            star <= (interactive ? hoverRating || rating : rating)
                                ? '#FFD700'
                                : '#D1D5DB'
                        }
                        onClick={() => interactive && setRating(star)}
                        onMouseEnter={() => interactive && setHoverRating(star)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        style={{ cursor: interactive ? 'pointer' : 'default' }}
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

    const distribution = getRatingDistribution();
    const averageRating = calculateAverageRating();

    if (loading) {
        return (
            <div className="review-section">
                <div className="loading-reviews">Đang tải đánh giá...</div>
            </div>
        );
    }

    return (
        <div className="review-section">
            <div className="review-header">
                <h2>Đánh giá & Nhận xét</h2>
                <button
                    className="add-review-btn"
                    onClick={() => setShowAddReview(!showAddReview)}
                >
                    <MessageCircle size={18} />
                    <span>Viết đánh giá</span>
                </button>
            </div>

            {/* Review Summary */}
            <div className="review-summary">
                <div className="summary-left">
                    <div className="average-rating">{averageRating}</div>
                    <div className="summary-stars">{renderStars(Math.round(averageRating))}</div>
                    <div className="total-reviews">{reviews.length} đánh giá</div>
                </div>

                <div className="summary-right">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="rating-bar">
                            <span className="rating-label">{star}</span>
                            <Star size={14} fill="#FFD700" color="#FFD700" />
                            <div className="bar-container">
                                <div
                                    className="bar-fill"
                                    style={{
                                        width: `${
                                            reviews.length > 0
                                                ? (distribution[star] / reviews.length) * 100
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>
                            <span className="rating-count">{distribution[star]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Review Form */}
            {showAddReview && (
                <div className="add-review-form">
                    <h3>Đánh giá của bạn</h3>
                    <div className="form-group">
                        <label>Chọn số sao</label>
                        {renderStars(rating, 32, true)}
                    </div>
                    <div className="form-group">
                        <label>Nội dung đánh giá</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm của bạn về quán..."
                            rows={4}
                            maxLength={500}
                        />
                        <div className="char-count">{comment.length}/500</div>
                    </div>
                    <div className="form-actions">
                        <button
                            className="cancel-btn"
                            onClick={() => {
                                setShowAddReview(false);
                                setRating(0);
                                setComment('');
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            className="submit-btn"
                            onClick={handleSubmitReview}
                            disabled={submitting}
                        >
                            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                        </button>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <div className="no-reviews">
                        <MessageCircle size={48} />
                        <p>Chưa có đánh giá nào</p>
                        <small>Hãy là người đầu tiên đánh giá quán này!</small>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="review-item">
                            <div className="review-header-item">
                                <div className="reviewer-info">
                                    <div className="reviewer-avatar">
                                        {review.user?.avaUrl ? (
                                            <img src={review.user.avaUrl} alt={review.user.displayName} />
                                        ) : (
                                            <User size={24} />
                                        )}
                                    </div>
                                    <div className="reviewer-details">
                                        <div className="reviewer-name">
                                            {review.user?.displayName || 'Người dùng'}
                                        </div>
                                        <div className="review-date">
                                            <Calendar size={14} />
                                            <span>{formatDate(review.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="review-rating">
                                    {renderStars(review.rating, 16)}
                                </div>
                            </div>
                            <div className="review-content">{review.comment}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ReviewSection;