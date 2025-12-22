import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Save } from 'lucide-react';
import { message } from 'antd';
import './style.css';
import { updateProfile, clearError } from '../../../../src/store/slices/userSlice';

const SettingsPage = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.user.current);
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);
  
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    contactPhone: user?.contactPhone || '',
    avaUrl: user?.avaUrl || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        contactPhone: user.contactPhone || '',
        avaUrl: user.avaUrl || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(updateProfile(formData)).unwrap();
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Cài đặt tài khoản</h2>
        <p>Quản lý thông tin cá nhân của bạn</p>
      </div>

      <div className="settings-content">
        <div className="settings-card">
          <h3 className="card-title">Thông tin cá nhân</h3>
          
          <form className="settings-form" onSubmit={handleSubmit}>
            <div className="avatar-section">
              <div className="avatar-preview">
                {user?.avaUrl ? (
                  <img src={user.avaUrl} alt={user.displayName} />
                ) : (
                  <span>{user?.displayName?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="avatar-actions">
                <button type="button" className="change-avatar-btn">
                  Thay đổi ảnh đại diện
                </button>
                <p className="avatar-hint">JPG, PNG. Tối đa 5MB</p>
              </div>
            </div>

            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={loading}>
                <Save size={18} />
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>

        <div className="settings-card">
          <h3 className="card-title">Bảo mật</h3>
          
          <div className="security-item">
            <div className="security-info">
              <h4>Đổi mật khẩu</h4>
              <p>Cập nhật mật khẩu của bạn để bảo mật tài khoản</p>
            </div>
            <button className="secondary-btn">Đổi mật khẩu</button>
          </div>

          <div className="security-item">
            <div className="security-info">
              <h4>Xác thực hai yếu tố</h4>
              <p>Thêm lớp bảo mật cho tài khoản của bạn</p>
            </div>
            <button className="secondary-btn">Kích hoạt</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;