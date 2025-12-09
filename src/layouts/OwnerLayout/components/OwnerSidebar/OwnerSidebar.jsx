import React from 'react';
import {
    LayoutDashboard,
    Store,
    Calendar,
    Star,
    Settings,
    Menu,
    X,
    MenuSquare,
} from 'lucide-react';

const OwnerSidebar = ({ isOpen, currentPage, setCurrentPage, shopData }) => {
    const menuItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#D4A574' },
        { id: 'shop', icon: Store, label: 'Quản lý Shop', color: '#8B6F47' },
        { id: 'menu', icon: MenuSquare, label: 'Quản lý menu', color: '#8B6F47' },
        { id: 'bookings', icon: Calendar, label: 'Đặt chỗ', color: '#A0826D' },
        { id: 'reviews', icon: Star, label: 'Đánh giá', color: '#C9A66B' },
        { id: 'settings', icon: Settings, label: 'Cài đặt', color: '#7D6E5D' },
    ];

    return (
        <aside className={`owner-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className='sidebar-header'>
                {isOpen && (
                    <div className='sidebar-logo'>
                        <div className='logo-icon'>☕</div>
                        <span className='logo-text'>Owner Panel</span>
                    </div>
                )}
            </div>

            <nav className='sidebar-nav'>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                            onClick={() => setCurrentPage(item.id)}
                            style={{ '--item-color': item.color }}
                        >
                            <Icon size={22} />
                            {isOpen && <span className='nav-label'>{item.label}</span>}
                            {currentPage === item.id && <div className='active-indicator' />}
                        </button>
                    );
                })}
            </nav>

            {isOpen && shopData && (
                <div className='sidebar-footer'>
                    <div className='shop-preview'>
                        <div className='shop-icon'>
                            <Store size={20} />
                        </div>
                        <div className='shop-details'>
                            <p className='shop-name'>{shopData.name}</p>
                            <div className='shop-status'>
                                <span className='status-dot active'></span>
                                <span>Đang hoạt động</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default OwnerSidebar;
