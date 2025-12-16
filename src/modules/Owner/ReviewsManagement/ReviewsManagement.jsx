import React, { useEffect, useState } from 'react';
import { Star, MessageSquare, Send, X } from 'lucide-react';
import ownerServiceApi from '../../../api/ownerServiceApi';
import './style.css';
import { message } from 'antd';


const ReviewsManagement = ({ shopId }) => {
  console.log(shopId);
  
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    try {
      const fetchReviews = async () => {
        const response = await ownerServiceApi.getReviewsByShopId(shopId);
        setReviews(response.data);
        setResponse(response);
      };
      fetchReviews();
    } catch (error) {
      message.error(error || 'Lỗi khi tải đánh giá. Vui lòng thử lại sau.');
    }
  }, []);

  const [replyModal, setReplyModal] = useState({ show: false, reviewId: null });
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({});

  const handleOpenReply = (reviewId, existingReply = '') => {
    setReplyModal({ show: true, reviewId });
    setReplyText(existingReply);
  };

  const handleCloseReply = () => {
    setReplyModal({ show: false, reviewId: null });
    setReplyText('');
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      alert('Vui lòng nhập nội dung phản hồi!');
      return;
    }

    try {
      setLoading(true);
      await ownerServiceApi.replyReview(replyModal.reviewId, replyText);
      
      setReviews(reviews.map(review => 
        review.id === replyModal.reviewId 
          ? { ...review, ownerReply: replyText }
          : review
      ));
      
      alert('Phản hồi thành công!');
      handleCloseReply();
    } catch (error) {
      console.error('Error replying to review:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? '#F59E0B' : 'none'}
            color={star <= rating ? '#F59E0B' : '#D1D5DB'}
          />
        ))}
      </div>
    );
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const reviewDate = new Date(date);
    const diffInMs = now - reviewDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Hôm nay';
    if (diffInDays === 1) return 'Hôm qua';
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} tuần trước`;
    return `${Math.floor(diffInDays / 30)} tháng trước`;
  };

  return (
    <div className="reviews-management">
      <div className="reviews-header">
        <div className="header-info">
          <h2>Đánh giá từ khách hàng</h2>
          <p>{response?.data?.length} đánh giá</p>
        </div>
        <div className="rating-summary">
          <div className="avg-rating">
            <span className="rating-number">{response?.stats?.avgRating || 0}</span>
            <div className="rating-stars">
              {renderStars(response?.stats?.avgRating || 0)}
              <span className="rating-count">({response?.stats?.totalReviews ? response?.stats?.totalReviews : 0} đánh giá)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews?.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {review.user.avatar ? (
                    <img src={review.user.avaUrl} alt={review.user.displayName} />
                  ) : (
                    <span>{review?.user?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="reviewer-details">
                  <h4>{review.user.displayName}</h4>
                  <div className="review-meta">
                    {renderStars(review.rating)}
                    <span className="review-date">{getTimeAgo(review.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="review-content">
              <p className="review-comment">{review.comment}</p>
            </div>

            {review.ownerReply && (
              <div className="owner-reply">
                <div className="reply-header">
                  <MessageSquare size={16} />
                  <span>Phản hồi từ chủ quán</span>
                </div>
                <p className="reply-text">{review.ownerReply}</p>
              </div>
            )}

            <div className="review-actions">
              <button 
                className="reply-btn"
                onClick={() => handleOpenReply(review.id, review.ownerReply || '')}
              >
                <MessageSquare size={16} />
                {review.ownerReply ? 'Chỉnh sửa phản hồi' : 'Phản hồi'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {replyModal.show && (
        <div className="modal-overlay" onClick={handleCloseReply}>
          <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Phản hồi đánh giá</h3>
              <button className="close-btn" onClick={handleCloseReply}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <textarea
                className="reply-textarea"
                placeholder="Nhập phản hồi của bạn..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="modal-footer">
              <button className="cancel-btn" onClick={handleCloseReply}>
                Hủy
              </button>
              <button 
                className="submit-btn" 
                onClick={handleSubmitReply}
                disabled={loading}
              >
                <Send size={16} />
                {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;