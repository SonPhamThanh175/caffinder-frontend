import React, { useState, useEffect } from 'react';
import { Store, MapPin, Clock, Users, Edit2, Save, X } from 'lucide-react';
import ownerServiceApi from '../../../../api/ownerServiceApi';
import './style.css';

const ShopManagement = ({ shopData, onUpdate, loadShopDetail }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [shopDetail, setShopDetail] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    totalCapacity: 0,
    openTime: '',
    closeTime: ''
  });

  useEffect(() => {
    if (shopData) {
      loadDetail();
    }
  }, [shopData?.id]);

  const loadDetail = async () => {
    if (!shopData?.id) return;
    
    try {
      setDetailLoading(true);
      const detail = await loadShopDetail(shopData.id);
      setShopDetail(detail);
      
      // Cập nhật form data với thông tin chi tiết
      setFormData({
        name: detail?.name || '',
        address: detail?.address || '',
        description: detail?.description || '',
        totalCapacity: detail?.totalCapacity || 0,
        openTime: detail?.openTime || '',
        closeTime: detail?.closeTime || ''
      });
    } catch (error) {
      console.error('Error loading shop detail:', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await ownerServiceApi.updateShop(shopData.id, formData);
      alert('Cập nhật thông tin shop thành công!');
      setIsEditing(false);
      await loadDetail();
      onUpdate();
    } catch (error) {
      console.error('Error updating shop:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: shopDetail?.name || '',
      address: shopDetail?.address || '',
      description: shopDetail?.description || '',
      totalCapacity: shopDetail?.totalCapacity || 0,
      openTime: shopDetail?.openTime || '',
      closeTime: shopDetail?.closeTime || ''
    });
    setIsEditing(false);
  };

  if (!shopData) {
    return (
      <div className="shop-loading">
        <div className="coffee-spinner">
          <div className="coffee-cup">☕</div>
          <p>Vui lòng chọn một quán để quản lý...</p>
        </div>
      </div>
    );
  }

  if (detailLoading) {
    return (
      <div className="shop-loading">
        <div className="coffee-spinner">
          <div className="coffee-cup">☕</div>
          <p>Đang tải thông tin shop...</p>
        </div>
      </div>
    );
  }

  const displayData = shopDetail || shopData;

  return (
    <div className="shop-management">
      <div className="shop-header">
        <div className="shop-header-content">
          <div className="shop-icon-large">
            <Store size={32} />
          </div>
          <div>
            <h2>{displayData.name}</h2>
            <p className="shop-subtitle">Quản lý thông tin quán của bạn</p>
          </div>
        </div>
        
        {!isEditing && (
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            <Edit2 size={18} />
            Chỉnh sửa
          </button>
        )}
      </div>

      <form className="shop-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">Thông tin cơ bản</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>
                <Store size={16} />
                Tên quán
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="form-value">{displayData.name}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label>
                <MapPin size={16} />
                Địa chỉ
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="form-value">{displayData.address}</div>
              )}
            </div>

            <div className="form-group full-width">
              <label>Mô tả</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              ) : (
                <div className="form-value">{displayData.description || 'Chưa có mô tả'}</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="section-title">Thông tin hoạt động</h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label>
                <Users size={16} />
                Sức chứa
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="totalCapacity"
                  value={formData.totalCapacity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              ) : (
                <div className="form-value">{displayData.totalCapacity} người</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <Clock size={16} />
                Giờ mở cửa
              </label>
              {isEditing ? (
                <input
                  type="time"
                  name="openTime"
                  value={formData.openTime}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="form-value">{displayData.openTime}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <Clock size={16} />
                Giờ đóng cửa
              </label>
              {isEditing ? (
                <input
                  type="time"
                  name="closeTime"
                  value={formData.closeTime}
                  onChange={handleChange}
                  required
                />
              ) : (
                <div className="form-value">{displayData.closeTime}</div>
              )}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              <X size={18} />
              Hủy
            </button>
            <button type="submit" className="save-btn" disabled={loading}>
              <Save size={18} />
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ShopManagement;