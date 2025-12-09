import React, { useState, useEffect } from 'react';
import {
    Menu,
    Plus,
    Edit2,
    Trash2,
    Save,
    X,
    Image,
    Tag,
    DollarSign,
    Coffee,
    Search,
} from 'lucide-react';

const mockMenuApi = {
    getMenus: async (shopId) => {
        return [
            { id: 1, name: 'Menu Đồ uống', description: 'Các loại đồ uống', displayOrder: 1 },
            { id: 2, name: 'Menu Đồ ăn', description: 'Các món ăn nhẹ', displayOrder: 2 },
        ];
    },
    createMenu: async (shopId, data) => ({ id: Date.now(), ...data }),
    updateMenu: async (shopId, menuId, data) => ({ id: menuId, ...data }),
    deleteMenu: async (shopId, menuId) => ({ success: true }),

    getMenuItems: async (shopId, menuId) => {
        return [
            {
                id: 1,
                name: 'Cà phê đen',
                description: 'Cà phê capuchino',
                price: 25000,
                img: [],
                category: 'coffee',
                tags: ['hot', 'bestseller'],
                displayOrder: 1,
            },
            {
                id: 2,
                name: 'Trà sữa',
                description: 'Trà sữa truyền thống',
                price: 30000,
                img: [],
                category: 'tea',
                tags: ['cold'],
                displayOrder: 2,
            },
        ];
    },
    createMenuItem: async (shopId, data) => ({ id: Date.now(), ...data }),
    updateMenuItem: async (shopId, itemId, data) => ({ id: itemId, ...data }),
    deleteMenuItem: async (shopId, itemId) => ({ success: true }),
};

const MenuManagement = ({ shopId }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', displayOrder: 0 });

    useEffect(() => {
        if (shopId) loadMenus();
    }, [shopId]);

    const loadMenus = async () => {
        try {
            setLoading(true);
            const data = await mockMenuApi.getMenus(shopId);
            setMenus(data);
        } catch (error) {
            console.error('Error loading menus:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await mockMenuApi.updateMenu(shopId, editingId, formData);
                alert('Cập nhật menu thành công!');
            } else {
                await mockMenuApi.createMenu(shopId, formData);
                alert('Thêm menu thành công!');
            }
            resetForm();
            loadMenus();
        } catch (error) {
            alert('Có lỗi xảy ra!');
        }
    };

    const handleEdit = (menu) => {
        setFormData({
            name: menu.name,
            description: menu.description,
            displayOrder: menu.displayOrder,
        });
        setEditingId(menu.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa menu này?')) return;
        try {
            await mockMenuApi.deleteMenu(shopId, id);
            alert('Xóa menu thành công!');
            loadMenus();
        } catch (error) {
            alert('Có lỗi xảy ra!');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', description: '', displayOrder: 0 });
        setEditingId(null);
        setShowAddForm(false);
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
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: '#8B4513',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
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
                    <form onSubmit={handleSubmit}>
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
                                            displayOrder: parseInt(e.target.value),
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
                                    style={{
                                        padding: '10px 20px',
                                        background: '#f5f5f5',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
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
                                    type='submit'
                                    style={{
                                        padding: '10px 20px',
                                        background: '#8B4513',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                    }}
                                >
                                    <Save
                                        size={16}
                                        style={{ marginRight: '8px', verticalAlign: 'middle' }}
                                    />
                                    {editingId ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

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
                                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{menu.name}</h3>
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
                            <p style={{ color: '#666', fontSize: '14px' }}>{menu.description}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => handleEdit(menu)}
                                style={{
                                    padding: '8px 16px',
                                    background: '#f8f9fa',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                }}
                            >
                                <Edit2
                                    size={16}
                                    style={{ verticalAlign: 'middle' }}
                                />
                            </button>
                            <button
                                onClick={() => handleDelete(menu.id)}
                                style={{
                                    padding: '8px 16px',
                                    background: '#fee',
                                    border: '1px solid #fcc',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: '#c00',
                                }}
                            >
                                <Trash2
                                    size={16}
                                    style={{ verticalAlign: 'middle' }}
                                />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MenuManagement;
