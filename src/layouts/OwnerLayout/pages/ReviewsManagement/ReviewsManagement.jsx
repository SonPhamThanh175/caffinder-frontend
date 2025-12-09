import React, { useState } from 'react';
import { Star, MessageSquare, Send, X } from 'lucide-react';
import ownerServiceApi from '../../../../api/ownerServiceApi';
import './style.css';


const ReviewsManagement = ({ shopId }) => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: { name: 'Nguyễn Văn A', avatar: null },
      rating: 5,
      comment: 'Quán rất đẹp, không gian thoáng mát, món ăn ngon. Sẽ quay lại!',
      createdAt: '2024-12-05T10:30:00',
      ownerReply: null
    },
    {
      id: 2,
      user: { name: 'Trần Thị B', avatar: null },
      rating: 4,
      comment: 'Đồ uống ngon, nhân viên thân thiện. Chỉ có điều hơi đông người.',
      createdAt: '2024-12-04T15:20:00',
      ownerReply: 'Cảm ơn bạn đã ghé thăm! Chúng mình sẽ cải thiện dịch vụ hơn nữa.'
    }
  ]);

  const [replyModal, setReplyModal] = useState({ show: false, reviewId: null });
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

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
          <p>{reviews.length} đánh giá</p>
        </div>
        <div className="rating-summary">
          <div className="avg-rating">
            <span className="rating-number">4.8</span>
            <div className="rating-stars">
              {renderStars(5)}
              <span className="rating-count">(156 đánh giá)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-list">
        {reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div className="reviewer-info">
                <div className="reviewer-avatar">
                  {review.user.avatar ? (
                    <img src={review.user.avatar} alt={review.user.name} />
                  ) : (
                    <span>{review.user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="reviewer-details">
                  <h4>{review.user.name}</h4>
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