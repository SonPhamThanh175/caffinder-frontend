import React, { useState, useEffect } from 'react';
import { Menu, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import ownerServiceApi from './../../../../api/ownerServiceApi';
import { message, Popconfirm } from 'antd';

const MenuManagement = ({ shopId }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        displayOrder: 0,
    });

    useEffect(() => {
        if (shopId) loadMenus();
    }, [shopId]);

    const loadMenus = async () => {
        try {
            setLoading(true);
            const data = await ownerServiceApi.getMenus(shopId);
            setMenus(data.data);
        } catch (error) {
            console.error('Error loading menus:', error);
            alert('Không thể tải danh sách menu!');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (editingId) {
                await ownerServiceApi.updateMenu(editingId, formData);
                message.success('Cập nhật menu thành công!');
            } else {
                await ownerServiceApi.createMenu(shopId, formData);
                message.success('Thêm menu thành công!');
            }
            resetForm();
            await loadMenus();
        } catch (error) {
            console.error('Error saving menu:', error);
            alert('Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (menu) => {
        setFormData({
            name: menu.name,
            description: menu.description || '',
            displayOrder: menu.displayOrder || 0,
        });
        setEditingId(menu.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        console.log('id :', id);
        try {
            setLoading(true);
            await ownerServiceApi.deleteMenu(id);
            message.success('Xóa menu thành công!');
            await loadMenus();
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', displayOrder: 0 });
        setEditingId(null);
        setShowAddForm(false);
    };

    if (!shopId) {
        return (
            <div style={{ padding: '48px', textAlign: 'center', color: '#999' }}>
                <Menu
                    size={48}
                    style={{ marginBottom: '16px' }}
                />
                <p>Vui lòng chọn một quán để quản lý menu</p>
            </div>
        );
    }

    const cancel = (e) => {
        console.log(e);
    };
    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                }}
            >
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                        Quản lý Menu
                    </h2>
                    <p style={{ color: '#666' }}>Quản lý các danh mục menu của quán</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: loading ? '#ccc' : '#8B4513',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                    }}
                >
                    <Plus size={18} />
                    Thêm Menu
                </button>
            </div>

            {showAddForm && (
                <div
                    style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        marginBottom: '24px',
                    }}
                >
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
                        {editingId ? 'Chỉnh sửa Menu' : 'Thêm Menu Mới'}
                    </h3>
                    <div>
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                    }}
                                >
                                    Tên menu *
                                </label>
                                <input
                                    type='text'
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    required
                                    placeholder='VD: Menu Đồ uống'
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                    }}
                                >
                                    Mô tả
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={3}
                                    placeholder='Mô tả ngắn về menu...'
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        resize: 'vertical',
                                    }}
                                />
                            </div>
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                    }}
                                >
                                    Thứ tự hiển thị
                                </label>
                                <input
                                    type='number'
                                    value={formData.displayOrder}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            displayOrder: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    min='0'
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>
                            <div
                                style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}
                            >
                                <button
                                    type='button'
                                    onClick={resetForm}
                                    disabled={loading}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#f5f5f5',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                    }}
                                >
                                    <X
                                        size={16}
                                        style={{ marginRight: '8px', verticalAlign: 'middle' }}
                                    />
                                    Hủy
                                </button>
                                <button
                                    type='button'
                                    onClick={handleSubmit}
                                    disabled={loading || !formData.name.trim()}
                                    style={{
                                        padding: '10px 20px',
                                        background:
                                            loading || !formData.name.trim() ? '#ccc' : '#8B4513',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor:
                                            loading || !formData.name.trim()
                                                ? 'not-allowed'
                                                : 'pointer',
                                        fontSize: '14px',
                                    }}
                                >
                                    <Save
                                        size={16}
                                        style={{ marginRight: '8px', verticalAlign: 'middle' }}
                                    />
                                    {loading ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading && menus.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#999' }}>
                    <p>Đang tải...</p>
                </div>
            ) : menus.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#999' }}>
                    <Menu
                        size={48}
                        style={{ marginBottom: '16px' }}
                    />
                    <p>Chưa có menu nào</p>
                    <small>Nhấn "Thêm Menu" để tạo menu đầu tiên</small>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {menus.map((menu) => (
                        <div
                            key={menu.id}
                            style={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        marginBottom: '8px',
                                    }}
                                >
                                    <Menu
                                        size={20}
                                        color='#8B4513'
                                    />
                                    <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>
                                        {menu.name}
                                    </h3>
                                    <span
                                        style={{
                                            background: '#f0f0f0',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                        }}
                                    >
                                        #{menu.displayOrder}
                                    </span>
                                </div>
                                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                                    {menu.description || 'Chưa có mô tả'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleEdit(menu)}
                                    disabled={loading}
                                    style={{
                                        padding: '8px 16px',
                                        background: '#f8f9fa',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        fontSize: '14px',
                                    }}
                                >
                                    <Edit2
                                        size={16}
                                        style={{ verticalAlign: 'middle' }}
                                    />
                                </button>
                                <Popconfirm
                                    title='Delete the task'
                                    description='Are you sure to delete this task?'
                                    onConfirm={() => handleDelete(menu.id)}
                                    onCancel={cancel}
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuManagement;
