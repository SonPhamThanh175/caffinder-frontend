import React, { useState, useEffect, useMemo } from 'react';
import { Coffee, Plus, Edit2, Trash2, Save, X, Search, DollarSign, Upload } from 'lucide-react';

import './MenuStyles.css';
import ownerServiceApi from '../../../api/ownerServiceApi';
import UpLoadService from '../../../api/UpLoadService';
import { message, Popconfirm } from 'antd';

const MenuItemManagement = ({ shopId }) => {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreview, setImagePreview] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        img: [],
        tags: [],
        displayOrder: 0,
    });

    useEffect(() => {
        if (shopId) loadMenus();
    }, [shopId]);

    useEffect(() => {
        if (selectedMenu) loadItems();
    }, [selectedMenu]);

    const loadMenus = async () => {
        try {
            const data = await ownerServiceApi.getMenus(shopId);
            setMenus(data.data);
            if (data.data.length > 0 && !selectedMenu) {
                console.log('data.data[0].id :', data.data[0].id);
                setSelectedMenu(data.data[0].id);
            }
        } catch (error) {
            console.error('Error loading menus:', error);
        }
    };

    const loadItems = async () => {
        try {
            if (selectedMenu !== null) {
                setLoading(true);
                const res = await ownerServiceApi.getMenuItems(selectedMenu);

                if (Array.isArray(res.data)) {
                    setItems(res.data);
                } else {
                    setItems([]);
                }
            }
        } catch (error) {
            message.error(error || 'Không thể tải danh sách món!');
        } finally {
            setLoading(false);
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
            const submitData = {
                ...formData,
                img: imageUrls,
                price: parseFloat(formData.price) || 0,
                displayOrder: parseInt(formData.displayOrder) || 0,
                tags: Array.isArray(formData.tags)
                    ? formData.tags.filter((tag) => tag.trim() !== '')
                    : [],
            };

            if (editingId) {
                await ownerServiceApi.updateMenuItem(editingId, submitData);
                message.success('Cập nhật món thành công!');
            } else {
                await ownerServiceApi.createMenuItem(selectedMenu, submitData);
                message.success('Thêm món thành công!');
            }
            resetForm();
            await loadItems();
        } catch (error) {
            console.error('Error saving item:', error);
            message.error(error || 'Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price,
            img: item.img || [],
            category: item.category || '',
            tags: item.tags || [],
            displayOrder: item.displayOrder || 0,
        });
        setEditingId(item.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await ownerServiceApi.deleteMenuItem(id);
            message.success('Xóa món thành công!');
            await loadItems();
        } catch (error) {
            console.error('Error deleting item:', error);
            message.error(error || 'Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    const cancelDelete = (e) => {};

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            price: 0,
            img: [],
            category: '',
            tags: [],
            displayOrder: 0,
        });
        setEditingId(null);
        setShowAddForm(false);
    };

    const filteredItems = useMemo(() => {
        if (Array.isArray(items)) {
            return items.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }
        return [];
    }, [items, searchTerm]);

    if (!shopId) {
        return (
            <div className='empty-state'>
                <Coffee size={48} />
                <p>Vui lòng chọn một quán để quản lý món</p>
            </div>
        );
    }

    if (menus.length === 0) {
        return (
            <div className='empty-state'>
                <Coffee size={48} />
                <p>Vui lòng tạo menu trước khi thêm món</p>
            </div>
        );
    }

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            console.log('File name:', file.name);
            console.log('File type:', file.type);
            console.log('File size:', file.size);
        });
        setImageFiles((prev) => [...prev, ...files]);

        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreview((prev) => [...prev, ...previews]);
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreview[index]);

        setImagePreview((prev) => prev.filter((_, i) => i !== index));
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className='menu-item-container'>
            <div className='menu-header'>
                <div>
                    <h2>Quản lý Món ăn & Đồ uống</h2>
                    <p className='subtitle'>Quản lý các món trong menu của quán</p>
                </div>
            </div>

            <div className='menu-tabs'>
                {menus.map((menu) => (
                    <button
                        key={menu.id}
                        onClick={() => setSelectedMenu(menu.id)}
                        disabled={loading}
                        className={`menu-tab-item ${selectedMenu === menu.id ? 'active' : ''}`}
                    >
                        {menu.name}
                    </button>
                ))}
            </div>

            <div className='search-toolbar'>
                <div className='search-box'>
                    <Search size={18} />
                    <input
                        type='text'
                        placeholder='Tìm kiếm món...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    disabled={loading}
                    className='btn-primary'
                >
                    <Plus size={18} />
                    Thêm món
                </button>
            </div>

            {showAddForm && (
                <div className='form-card'>
                    <h3>{editingId ? 'Chỉnh sửa Món' : 'Thêm Món Mới'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className='form-grid'>
                            <div className='form-group'>
                                <label>Tên món *</label>
                                <input
                                    type='text'
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                    placeholder='VD: Cà phê đen'
                                    className='form-input'
                                />
                            </div>
                            <div className='form-group'>
                                <label>Giá *</label>
                                <input
                                    type='number'
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    required
                                    min='0'
                                    placeholder='25000'
                                    className='form-input'
                                />
                            </div>
                            <div className='form-group full-width'>
                                <label>Mô tả</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={2}
                                    placeholder='Mô tả về món...'
                                    className='form-textarea'
                                />
                            </div>

                            <div className='form-group'>
                                <label>Thứ tự hiển thị</label>
                                <input
                                    type='number'
                                    value={formData.displayOrder}
                                    onChange={(e) =>
                                        setFormData({ ...formData, displayOrder: e.target.value })
                                    }
                                    min='0'
                                    className='form-input'
                                />
                            </div>
                            <div className='form-group'>
                                <label>Tags (phân cách bằng dấu phẩy)</label>
                                <input
                                    type='text'
                                    value={
                                        Array.isArray(formData.tags) ? formData.tags.join(', ') : ''
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            tags: e.target.value.split(',').map((t) => t.trim()),
                                        })
                                    }
                                    placeholder='hot, bestseller, new...'
                                    className='form-input'
                                />
                            </div>
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
                        <div className='form-actions'>
                            <button
                                type='button'
                                onClick={resetForm}
                                disabled={loading}
                                className='btn-cancel'
                            >
                                <X size={16} />
                                Hủy
                            </button>
                            <button
                                type='submit'
                                disabled={loading || !formData.name.trim() || !formData.price}
                                className='btn-save'
                            >
                                <Save size={16} />
                                {loading ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className='items-grid'>
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        className='item-card'
                    >
                        <div className='item-image'>
                            {item.img && item.img.length > 0 && item.img[0] ? (
                                <img
                                    src={item.img[0]}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML +=
                                            '<svg class="placeholder-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>';
                                    }}
                                />
                            ) : (
                                <Coffee
                                    size={48}
                                    className='placeholder-icon'
                                />
                            )}
                        </div>
                        <div className='item-content'>
                            <div className='item-header'>
                                <h3>{item.name}</h3>
                                <span className='badge'>#{item.displayOrder}</span>
                            </div>
                            <p className='item-description'>
                                {item.description || 'Chưa có mô tả'}
                            </p>
                            <div className='item-price'>
                                <DollarSign size={16} />
                                <span>{item.price.toLocaleString('vi-VN')}đ</span>
                            </div>
                            {item.tags && item.tags.length > 0 && (
                                <div className='item-tags'>
                                    {item.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className='tag'
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className='item-actions'>
                                <button
                                    onClick={() => handleEdit(item)}
                                    disabled={loading}
                                    className='btn-edit-small'
                                >
                                    <Edit2 size={14} />
                                    Sửa
                                </button>
                                <Popconfirm
                                    title='Delete the task'
                                    description='Are you sure to delete this task?'
                                    onConfirm={() => handleDelete(item.id)}
                                    onCancel={cancelDelete}
                                    okText='Yes'
                                    cancelText='No'
                                >
                                    <button
                                        disabled={loading}
                                        style={{
                                            padding: '8px 16px',
                                            background: '#fee',
                                            border: '1px solid #fcc',
                                            borderRadius: '8px',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            fontSize: '14px',
                                            color: '#c00',
                                        }}
                                    >
                                        <Trash2
                                            size={16}
                                            style={{ verticalAlign: 'middle' }}
                                        />
                                    </button>
                                </Popconfirm>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className='empty-state'>
                    <Coffee size={48} />
                    <p>Chưa có món nào trong menu này</p>
                </div>
            )}
        </div>
    );
};

export default MenuItemManagement;
