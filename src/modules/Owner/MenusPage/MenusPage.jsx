import React, { useState } from 'react';
import MenuManagement from './MenuManagement';
import MenuItemManagement from './MenuItemManagement';
import './MenuStyles.css';

const MenusPage = ({ shopId }) => {
    const [activeTab, setActiveTab] = useState('menu');

    return (
        <div className='menus-page'>
            <div className='menus-tabs-container'>
                <button
                    onClick={() => setActiveTab('menu')}
                    className={`menus-tab ${activeTab === 'menu' ? 'active' : ''}`}
                >
                    Quản lý Menu
                </button>
                <button
                    onClick={() => setActiveTab('items')}
                    className={`menus-tab ${activeTab === 'items' ? 'active' : ''}`}
                >
                    Quản lý Món
                </button>
            </div>

            {activeTab === 'menu' ? (
                <MenuManagement shopId={shopId} />
            ) : (
                <MenuItemManagement shopId={shopId} />
            )}
        </div>
    );
};

export default MenusPage;
