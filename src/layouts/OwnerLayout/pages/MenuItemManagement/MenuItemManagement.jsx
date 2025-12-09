// MenuItem Management Component
const MenuItemManagement = ({ shopId }) => {
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        img: [],
        category: '',
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
            const data = await mockMenuApi.getMenus(shopId);
            setMenus(data);
            if (data.length > 0) setSelectedMenu(data[0].id);
        } catch (error) {
            console.error('Error loading menus:', error);
        }
    };

    const loadItems = async () => {
        try {
            setLoading(true);
            const data = await mockMenuApi.getMenuItems(shopId, selectedMenu);
            setItems(data);
        } catch (error) {
            console.error('Error loading items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submitData = {
                ...formData,
                img: formData.img.filter((url) => url.trim() !== ''),
                tags: formData.tags.filter((tag) => tag.trim() !== ''),
            };

            if (editingId) {
                await mockMenuApi.updateMenuItem(shopId, editingId, submitData);
                alert('Cập nhật món thành công!');
            } else {
                await mockMenuApi.createMenuItem(shopId, submitData);
                alert('Thêm món thành công!');
            }
            resetForm();
            loadItems();
        } catch (error) {
            alert('Có lỗi xảy ra!');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            img: item.img || [],
            category: item.category,
            tags: item.tags || [],
            displayOrder: item.displayOrder,
        });
        setEditingId(item.id);
        setShowAddForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc muốn xóa món này?')) return;
        try {
            await mockMenuApi.deleteMenuItem(shopId, id);
            alert('Xóa món thành công!');
            loadItems();
        } catch (error) {
            alert('Có lỗi xảy ra!');
        }
    };

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

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>
                    Quản lý Món ăn & Đồ uống
                </h2>
                <p style={{ color: '#666' }}>Quản lý các món trong menu của quán</p>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                {menus.map((menu) => (
                    <button
                        key={menu.id}
                        onClick={() => setSelectedMenu(menu.id)}
                        style={{
                            padding: '12px 24px',
                            background: selectedMenu === menu.id ? '#8B4513' : 'white',
                            color: selectedMenu === menu.id ? 'white' : '#333',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                        }}
                    >
                        {menu.name}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search
                        size={18}
                        style={{ position: 'absolute', left: '12px', top: '12px', color: '#999' }}
                    />
                    <input
                        type='text'
                        placeholder='Tìm kiếm món...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 12px 10px 40px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontSize: '14px',
                        }}
                    />
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
                        whiteSpace: 'nowrap',
                    }}
                >
                    <Plus size={18} />
                    Thêm món
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
                        {editingId ? 'Chỉnh sửa Món' : 'Thêm Món Mới'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div
                            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
                        >
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                    }}
                                >
                                    Tên món *
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
                                    Giá *
                                </label>
                                <input
                                    type='number'
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: parseInt(e.target.value),
                                        })
                                    }
                                    required
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
                            <div style={{ gridColumn: '1 / -1' }}>
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
                                    rows={2}
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
                                    Danh mục
                                </label>
                                <input
                                    type='text'
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    placeholder='coffee, tea, food...'
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
                                    Thứ tự
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
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                    }}
                                >
                                    Tags (phân cách bằng dấu phẩy)
                                </label>
                                <input
                                    type='text'
                                    value={formData.tags.join(', ')}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            tags: e.target.value.split(',').map((t) => t.trim()),
                                        })
                                    }
                                    placeholder='hot, bestseller, new...'
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label
                                    style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        fontWeight: '500',
                                    }}
                                >
                                    URL hình ảnh (phân cách bằng dấu phẩy)
                                </label>
                                <input
                                    type='text'
                                    value={formData.img.join(', ')}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            img: e.target.value.split(',').map((u) => u.trim()),
                                        })
                                    }
                                    placeholder='https://example.com/image.jpg'
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end',
                                marginTop: '16px',
                            }}
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
                    </form>
                </div>
            )}

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '16px',
                }}
            >
                {filteredItems.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            overflow: 'hidden',
                        }}
                    >
                        {item.img && item.img.length > 0 && (
                            <div
                                style={{
                                    height: '180px',
                                    background: '#f5f5f5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Coffee
                                    size={48}
                                    color='#ccc'
                                />
                            </div>
                        )}
                        <div style={{ padding: '16px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                    marginBottom: '8px',
                                }}
                            >
                                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{item.name}</h3>
                                <span
                                    style={{
                                        background: '#f0f0f0',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                    }}
                                >
                                    #{item.displayOrder}
                                </span>
                            </div>
                            <p
                                style={{
                                    color: '#666',
                                    fontSize: '13px',
                                    marginBottom: '12px',
                                    minHeight: '36px',
                                }}
                            >
                                {item.description}
                            </p>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '12px',
                                }}
                            >
                                <DollarSign
                                    size={16}
                                    color='#8B4513'
                                />
                                <span
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: '600',
                                        color: '#8B4513',
                                    }}
                                >
                                    {item.price.toLocaleString()}đ
                                </span>
                            </div>
                            {item.tags && item.tags.length > 0 && (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '6px',
                                        marginBottom: '12px',
                                    }}
                                >
                                    {item.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                background: '#fff3e0',
                                                color: '#8B4513',
                                                padding: '4px 10px',
                                                borderRadius: '12px',
                                                fontSize: '11px',
                                                fontWeight: '500',
                                            }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '8px',
                                    paddingTop: '12px',
                                    borderTop: '1px solid #eee',
                                }}
                            >
                                <button
                                    onClick={() => handleEdit(item)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        background: '#f8f9fa',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                    }}
                                >
                                    <Edit2
                                        size={14}
                                        style={{ verticalAlign: 'middle', marginRight: '4px' }}
                                    />
                                    Sửa
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        background: '#fee',
                                        border: '1px solid #fcc',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        color: '#c00',
                                    }}
                                >
                                    <Trash2
                                        size={14}
                                        style={{ verticalAlign: 'middle', marginRight: '4px' }}
                                    />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#999' }}>
                    <Coffee
                        size={48}
                        style={{ marginBottom: '16px' }}
                    />
                    <p>Chưa có món nào trong menu này</p>
                </div>
            )}
        </div>
    );
};
export default MenuItemManagement;
