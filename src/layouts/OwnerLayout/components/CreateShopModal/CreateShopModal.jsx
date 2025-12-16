import React, { useState } from 'react';
import { X, Store, MapPin, Clock, Users, Upload, Image as ImageIcon } from 'lucide-react';
import ownerServiceApi from '../../../../api/ownerServiceApi';
import './style.css';
import UpLoadService from '../../../../api/UpLoadService';

const CreateShopModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        totalCapacity: 30,
        openTime: '09:00',
        closeTime: '22:00',
        latitude: '',
        longitude: '',
        img: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        setImageFiles((prev) => [...prev, ...files]);

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreview((prev) => [...prev, ...previews]);
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreview[index]);

        setImagePreview((prev) => prev.filter((_, i) => i !== index));
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData((prev) => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString(),
                    }));
                    alert('Đã lấy vị trí hiện tại thành công!');
                },
                (error) => {
                    alert('Không thể lấy vị trí. Vui lòng nhập thủ công.');
                },
            );
        } else {
            alert('Trình duyệt không hỗ trợ định vị.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            let imageUrls = [];
            if (imageFiles.length > 0) {
                imageUrls = await UpLoadService.uploadImages(imageFiles);
            }
            console.log('imageUrls :', imageUrls);

            const payload = {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                totalCapacity: parseInt(formData.totalCapacity),
                img: imageUrls,
            };

            await ownerServiceApi.createShop(payload);
            alert('Tạo quán mới thành công!');
            onSuccess();
            onClose();

            setFormData({
                name: '',
                address: '',
                description: '',
                totalCapacity: 30,
                openTime: '09:00',
                closeTime: '22:00',
                latitude: '',
                longitude: '',
                img: [],
            });
            setImagePreview([]);
        } catch (error) {
            console.error('Error creating shop:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className='modal-overlay'
            onClick={onClose}
        >
            <div
                className='modal-content'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='modal-header'>
                    <div className='modal-title-section'>
                        <div className='modal-icon'>
                            <Store size={24} />
                        </div>
                        <div>
                            <h2>Tạo quán mới</h2>
                            <p>Điền thông tin để tạo quán cà phê của bạn</p>
                        </div>
                    </div>
                    <button
                        className='modal-close-btn'
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form
                    className='modal-form'
                    onSubmit={handleSubmit}
                >
                    <div className='form-section'>
                        <h3 className='section-title'>
                            <ImageIcon size={18} />
                            Hình ảnh quán
                        </h3>

                        <div className='image-upload-area'>
                            {imagePreview.length > 0 && (
                                <div className='image-preview-grid'>
                                    {imagePreview.map((preview, index) => (
                                        <div
                                            key={index}
                                            className='image-preview-item'
                                        >
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                            />
                                            <button
                                                type='button'
                                                className='remove-image-btn'
                                                onClick={() => removeImage(index)}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <label className='upload-label'>
                                <input
                                    type='file'
                                    accept='image/*'
                                    multiple
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <Upload size={24} />
                                <span>Tải ảnh lên</span>
                                <small>PNG, JPG, WEBP (Tối đa 5MB)</small>
                            </label>
                        </div>
                    </div>

                    <div className='form-section'>
                        <h3 className='section-title'>
                            <Store size={18} />
                            Thông tin cơ bản
                        </h3>

                        <div className='form-grid'>
                            <div className='form-group full-width'>
                                <label>Tên quán *</label>
                                <input
                                    type='text'
                                    name='name'
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder='VD: The Coffee House'
                                    required
                                />
                            </div>

                            <div className='form-group full-width'>
                                <label>
                                    <MapPin size={16} />
                                    Địa chỉ *
                                </label>
                                <input
                                    type='text'
                                    name='address'
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder='VD: 123 Đường Lê Lợi, Quận 1, TP.HCM'
                                    required
                                />
                            </div>

                            <div className='form-group full-width'>
                                <label>Mô tả</label>
                                <textarea
                                    name='description'
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder='Mô tả về quán của bạn...'
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='form-section'>
                        <h3 className='section-title'>
                            <MapPin size={18} />
                            Tọa độ vị trí
                        </h3>

                        <div className='location-helper'>
                            <button
                                type='button'
                                className='get-location-btn'
                                onClick={getCurrentLocation}
                            >
                                📍 Lấy vị trí hiện tại
                            </button>
                            <small>Hoặc nhập tọa độ thủ công</small>
                        </div>

                        <div className='form-grid'>
                            <div className='form-group'>
                                <label>Vĩ độ (Latitude) *</label>
                                <input
                                    type='number'
                                    step='any'
                                    name='latitude'
                                    value={formData.latitude}
                                    onChange={handleChange}
                                    placeholder='VD: 10.776889'
                                    required
                                />
                            </div>

                            <div className='form-group'>
                                <label>Kinh độ (Longitude) *</label>
                                <input
                                    type='number'
                                    step='any'
                                    name='longitude'
                                    value={formData.longitude}
                                    onChange={handleChange}
                                    placeholder='VD: 106.700806'
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className='form-section'>
                        <h3 className='section-title'>
                            <Clock size={18} />
                            Thông tin hoạt động
                        </h3>

                        <div className='form-grid'>
                            <div className='form-group'>
                                <label>
                                    <Users size={16} />
                                    Sức chứa *
                                </label>
                                <input
                                    type='number'
                                    name='totalCapacity'
                                    value={formData.totalCapacity}
                                    onChange={handleChange}
                                    min='1'
                                    required
                                />
                            </div>

                            <div className='form-group'>
                                <label>Giờ mở cửa *</label>
                                <input
                                    type='time'
                                    name='openTime'
                                    value={formData.openTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className='form-group'>
                                <label>Giờ đóng cửa *</label>
                                <input
                                    type='time'
                                    name='closeTime'
                                    value={formData.closeTime}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className='modal-actions'>
                        <button
                            type='button'
                            className='cancel-btn'
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type='submit'
                            className='submit-btn'
                            disabled={loading}
                        >
                            {loading ? 'Đang tạo...' : 'Tạo quán'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateShopModal;
