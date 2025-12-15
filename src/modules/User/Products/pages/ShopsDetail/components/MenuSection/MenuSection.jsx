import { useState, useEffect } from 'react';
import { Tag, Empty } from 'antd';
import { Coffee, UtensilsCrossed, Wine, IceCream, Search } from 'lucide-react';
import './style.css';
import menuApi from '../../../../../../../api/menuApi';
import { formatPrice } from '../../../../../../../utils/helpers';

const MenuSection = ({ shopId }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchMenus();
    }, [shopId]);

    const fetchMenus = async () => {
        try {
            setLoading(true);
            const response = await menuApi.getMenusByShopId(shopId);
            setMenus(response.data || []);
        } catch (error) {
            console.error('Error fetching menus:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryIcon = (categoryName) => {
        const name = categoryName.toLowerCase();
        if (name.includes('đồ uống') || name.includes('drink')) return <Coffee size={20} />;
        if (name.includes('đồ ăn') || name.includes('food')) return <UtensilsCrossed size={20} />;
        if (name.includes('rượu') || name.includes('wine')) return <Wine size={20} />;
        if (name.includes('tráng miệng') || name.includes('dessert')) return <IceCream size={20} />;
        return <UtensilsCrossed size={20} />;
    };

    const getTagColor = (tag) => {
        const colors = {
            'hot': 'red',
            'new': 'green',
            'sale': 'orange',
            'best': 'blue',
            'popular': 'purple'
        };
        return colors[tag.toLowerCase()] || 'default';
    };

    const allCategories = ['all', ...menus.map(menu => menu.id)];

    const filteredMenus = menus.map(menu => ({
        ...menu,
        items: menu.items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(menu => 
        selectedCategory === 'all' ? true : menu.id === selectedCategory
    );

    if (loading) {
        return (
            <div className="menu-section">
                <div className="menu-loading">
                    <div className="menu-loading-spinner"></div>
                    <p>Đang tải thực đơn...</p>
                </div>
            </div>
        );
    }

    if (!menus || menus.length === 0) {
        return (
            <div className="menu-section">
                <h2 className="menu-title">
                    <UtensilsCrossed size={28} />
                    Thực đơn
                </h2>
                <Empty 
                    description="Chưa có thực đơn nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </div>
        );
    }

    return (
        <div className="menu-section">
            <div className="menu-header">
                <h2 className="menu-title">
                    <UtensilsCrossed size={28} />
                    Thực đơn
                </h2>
                <p className="menu-subtitle">Khám phá các món ăn và thức uống đặc sắc</p>
            </div>

            <div className="menu-controls">
                <div className="search-box">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm món ăn, đồ uống..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="category-filters">
                    <button
                        className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('all')}
                    >
                        Tất cả
                    </button>
                    {menus.map(menu => (
                        <button
                            key={menu.id}
                            className={`category-btn ${selectedCategory === menu.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(menu.id)}
                        >
                            {getCategoryIcon(menu.name)}
                            {menu.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="menu-content">
                {filteredMenus.map(menu => (
                    menu.items.length > 0 && (
                        <div key={menu.id} className="menu-category">
                            <div className="category-header">
                                <div className="category-info">
                                    {getCategoryIcon(menu.name)}
                                    <div>
                                        <h3>{menu.name}</h3>
                                        {menu.description && (
                                            <p className="category-description">{menu.description}</p>
                                        )}
                                    </div>
                                </div>
                                <span className="items-count">{menu.items.length} món</span>
                            </div>

                            <div className="menu-items-grid">
                                {menu.items.map(item => (
                                    <div key={item.id} className="menu-item-card">
                                        <div className="item-image-wrapper">
                                            <img 
                                                src={item.img[0]} 
                                                alt={item.name}
                                                className="item-image"
                                            />
                                            {item.tags && item.tags.length > 0 && (
                                                <div className="item-tags">
                                                    {item.tags.map((tag, index) => (
                                                        <Tag 
                                                            key={index}
                                                            color={getTagColor(tag)}
                                                            className="item-tag"
                                                        >
                                                            {tag.toUpperCase()}
                                                        </Tag>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="item-content">
                                            <h4 className="item-name">{item.name}</h4>
                                            {item.description && (
                                                <p className="item-description">{item.description}</p>
                                            )}
                                            {item.category && (
                                                <span className="item-category-badge">{item.category}</span>
                                            )}
                                            <div className="item-footer">
                                                <span className="item-price">{formatPrice(item.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}

                {filteredMenus.every(menu => menu.items.length === 0) && (
                    <Empty 
                        description="Không tìm thấy món nào phù hợp"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                )}
            </div>
        </div>
    );
};

export default MenuSection;