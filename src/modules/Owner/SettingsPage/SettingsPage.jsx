import React, { useState } from 'react';
import { Save } from 'lucide-react';
import './style.css';
import userApi from '../../../api/userApi';
import { message } from 'antd';

const SettingsPage = ({ user }) => {
    console.log(user);
    
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    phone: user?.contactPhone || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await userApi.updateProfile(formData);
      message.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error(error);
      message.error(error || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
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
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase()}</span>
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
                name="name"
                value={formData.name}
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
                name="phone"
                value={formData.phone}
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