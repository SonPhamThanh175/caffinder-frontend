import React from 'react';
import { MapPin, X, AlertCircle } from 'lucide-react';
import './style.css';

const LocationPermissionModal = ({ isOpen, onAllow, onDeny }) => {
  if (!isOpen) return null;

  return (
    <div className="location-modal-overlay">
      <div className="location-modal">
        <div className="location-modal-content">
          {/* Header */}
          <div className="location-modal-header">
            <div className="location-modal-icon">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="location-modal-title">
                Cho phép truy cập vị trí
              </h3>
              <p className="location-modal-subtitle">
                Để tìm quán cafe gần bạn
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="location-modal-body">
            <p className="location-modal-description">
              Chúng tôi cần quyền truy cập vị trí của bạn để:
            </p>
            <ul className="location-modal-list">
              <li>Hiển thị các quán cafe gần bạn nhất</li>
              <li>Tính toán thời gian giao hàng chính xác</li>
              <li>Đề xuất các ưu đãi theo khu vực</li>
            </ul>

            <div className="location-modal-info">
              <AlertCircle size={18} />
              <p>
                Thông tin vị trí của bạn được bảo mật và chỉ dùng để cải thiện trải nghiệm.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="location-modal-actions">
            <button
              onClick={onDeny}
              className="location-modal-btn location-modal-btn-secondary"
            >
              Từ chối
            </button>
            <button
              onClick={onAllow}
              className="location-modal-btn location-modal-btn-primary"
            >
              Cho phép
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;