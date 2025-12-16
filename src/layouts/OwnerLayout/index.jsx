import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import OwnerSidebar from './components/OwnerSidebar/OwnerSidebar';
import OwnerHeader from './components/OwnerHeader/OwnerHeader';
import DashboardContent from '../../modules/Owner/DashboardContent/DashboardContent';
import ShopManagement from '../../modules/Owner/ShopManagement/ShopManagement';
import BookingsManagement from '../../modules/Owner/BookingsManagement/BookingsManagement';
import ReviewsManagement from '../../modules/Owner/ReviewsManagement/ReviewsManagement';
import SettingsPage from '../../modules/Owner/SettingsPage/SettingsPage';
import CreateShopModal from './components/CreateShopModal/CreateShopModal';
import ownerServiceApi from '../../api/ownerServiceApi';
import './style.css';
import MenuManagement from '../../modules/Owner/MenusPage/MenusPage';
import MenusPage from '../../modules/Owner/MenusPage/MenusPage';

const OwnerLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState('menu');
    const [shops, setShops] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { user } = useSelector((state) => state.user.current);

    useEffect(() => {
        loadShops();
    }, []);

    const loadShops = async () => {
        try {
            setLoading(true);
            const data = await ownerServiceApi.getShopByOwnerId();
            setShops(data);

            if (data && data.length > 0) {
                setSelectedShop(data[0]);
            }
        } catch (error) {
            console.error('Error loading shops:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadShopDetail = async (shopId) => {
        try {
            const response = await ownerServiceApi.getShopById(shopId);
            console.log('Chi tiết shop:', response);
            return response.shop;
        } catch (error) {
            console.error('Error loading shop detail:', error);
            return null;
        }
    };

    const handleShopChange = async (shopId) => {
        const shop = shops.find((s) => s.id === shopId);
        if (shop) {
            setSelectedShop(shop);
        }
    };

    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    const handleCreateSuccess = () => {
        loadShops();
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className='owner-loading'>
                    <div className='coffee-spinner'>
                        <div className='coffee-cup'>☕</div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                </div>
            );
        }

        if (!shops || shops.length === 0) {
            return (
                <div className='no-shops'>
                    <div className='no-shops-content'>
                        <div className='no-shops-icon'>🏪</div>
                        <h2>Chưa có quán nào</h2>
                        <p>Bạn chưa có quán cà phê nào. Hãy tạo quán đầu tiên của bạn!</p>
                        <button
                            className='create-shop-btn'
                            onClick={handleOpenCreateModal}
                        >
                            Tạo quán mới
                        </button>
                    </div>
                </div>
            );
        }

        switch (currentPage) {
            case 'dashboard':
                return <DashboardContent shopData={selectedShop} />;
            case 'shop':
                return (
                    <ShopManagement
                        shopData={selectedShop}
                        onUpdate={loadShops}
                        loadShopDetail={loadShopDetail}
                    />
                );
            case 'menu':
                return <MenusPage shopId={selectedShop?.id} />;
            case 'bookings':
                return <BookingsManagement shopId={selectedShop?.id} />;
            case 'reviews':
                return <ReviewsManagement shopId={selectedShop?.id} />;
            case 'settings':
                return <SettingsPage user={user} />;
            default:
                return <DashboardContent shopData={selectedShop} />;
        }
    };

    return (
        <div className='owner-layout'>
            <OwnerSidebar
                isOpen={sidebarOpen}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                shops={shops}
                selectedShop={selectedShop}
                onShopChange={handleShopChange}
            />

            <main className='owner-main'>
                <OwnerHeader
                    currentPage={currentPage}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    selectedShop={selectedShop}
                    shops={shops}
                    onShopChange={handleShopChange}
                    onCreateShop={handleOpenCreateModal}
                />

                <div className='owner-content'>{renderContent()}</div>
            </main>

            <CreateShopModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default OwnerLayout;
