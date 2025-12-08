import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
    Store,
    Search,
    Filter,
    MapPin,
    Phone,
    Mail,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    MoreVertical,
    RefreshCw,
    Download,
    Ban,
} from 'lucide-react';
import shopAdminApi from '../../../api/shopAdminApi';
import './style.css';

const { confirm } = Modal;

const ShopsManagement = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [filteredShops, setFilteredShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [messageApi, contextHolder] = message.useMessage();

    const stats = {
        total: shops.length,
        approved: shops.filter((s) => s.status === 'approved').length,
        pending: shops.filter((s) => s.status === 'pending').length,
        rejected: shops.filter((s) => s.status === 'rejected').length,
        blocked: shops.filter((s) => s.status === 'block').length,
    };

    useEffect(() => {
        fetchShops();
    }, []);

    const fetchShops = async () => {
        setLoading(true);
        try {
            const response = await shopAdminApi.getAll();
            const transformedShops = (response.data || []).map((shop) => ({
                id: shop.id,
                name: shop.name,
                owner: shop.owner?.displayName || 'N/A',
                email: 'N/A',
                phone: shop.owner?.contactPhone || 'N/A',
                address: shop.address,
                status: shop.status,
                rating: 0,
                totalReviews: 0,
                totalOrders: 0,
                totalCapacity: shop.totalCapacity,
                openTime: shop.openTime,
                closeTime: shop.closeTime,
                createdAt: shop.createdAt,
                image: shop.img?.[0] || '☕',
                description: shop.description,
                favoriteCount: shop.favorite_count || 0,
            }));

            setShops(transformedShops);
            setFilteredShops(transformedShops);
        } catch (error) {
            console.error('Failed to fetch shops:', error);
            messageApi.error('Failed to load shops. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...shops];

        if (statusFilter !== 'all') {
            filtered = filtered.filter((shop) => shop.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (shop) =>
                    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    shop.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    shop.address.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        setFilteredShops(filtered);
    }, [searchTerm, statusFilter, shops]);

    const handleApproveShop = async (shopId) => {
        try {
            await shopAdminApi.approveShop(shopId);
            setShops((prev) =>
                prev.map((shop) => (shop.id === shopId ? { ...shop, status: 'approved' } : shop)),
            );
            messageApi.success('Shop approved successfully!');
        } catch (error) {
            console.error('Failed to approve shop:', error);
            messageApi.error('Failed to approve shop. Please try again.');
        }
    };

    const handleRejectShop = (shopId) => {
        confirm({
            title: 'Reject Shop',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to reject this shop?',
            okText: 'Yes, Reject',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await shopAdminApi.rejectShop(shopId);
                    setShops((prev) =>
                        prev.map((shop) =>
                            shop.id === shopId ? { ...shop, status: 'rejected' } : shop,
                        ),
                    );
                    messageApi.success('Shop rejected successfully!');
                } catch (error) {
                    console.error('Failed to reject shop:', error);
                    messageApi.error('Failed to reject shop. Please try again.');
                }
            },
        });
    };

    const handleBlockShop = (shopId) => {
        confirm({
            title: 'Block Shop',
            icon: <ExclamationCircleOutlined />,
            content:
                'Are you sure you want to block this shop? The shop will not be able to operate.',
            okText: 'Yes, Block',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await shopAdminApi.blockShop(shopId);
                    setShops((prev) =>
                        prev.map((shop) =>
                            shop.id === shopId ? { ...shop, status: 'block' } : shop,
                        ),
                    );
                    messageApi.success('Shop blocked successfully!');
                } catch (error) {
                    console.error('Failed to block shop:', error);
                    messageApi.error('Failed to block shop. Please try again.');
                }
            },
        });
    };

    const handleUnblockShop = async (shopId) => {
        try {
            await shopAdminApi.approveShop(shopId);
            setShops((prev) =>
                prev.map((shop) => (shop.id === shopId ? { ...shop, status: 'approved' } : shop)),
            );
            messageApi.success('Shop unblocked and approved successfully!');
        } catch (error) {
            console.error('Failed to unblock shop:', error);
            messageApi.error('Failed to unblock shop. Please try again.');
        }
    };

    const getStatusBadge = (status) => {
        const configs = {
            approved: {
                className: 'status-badge approved',
                icon: CheckCircle,
                label: 'Approved',
            },
            pending: {
                className: 'status-badge pending',
                icon: AlertCircle,
                label: 'Pending',
            },
            rejected: {
                className: 'status-badge rejected',
                icon: XCircle,
                label: 'Rejected',
            },
            block: {
                className: 'status-badge blocked',
                icon: Ban,
                label: 'Blocked',
            },
        };

        const config = configs[status] || configs.pending;
        const Icon = config.icon;

        return (
            <span className={config.className}>
                <Icon size={14} />
                {config.label}
            </span>
        );
    };

    return (
        <div className='shops-management'>
            {contextHolder}
            <div className='page-header'>
                <div className='header-left'>
                    <h1 className='page-title'>Shop Management</h1>
                    <p className='page-subtitle'>Manage and verify coffee shop listings</p>
                </div>
                <div className='header-actions'>
                    <button
                        className='action-btn secondary'
                        onClick={fetchShops}
                    >
                        <RefreshCw size={18} />
                        <span>Refresh</span>
                    </button>
                    <button className='action-btn secondary'>
                        <Download size={18} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div className='stats-grid'>
                <div className='stat-card total'>
                    <div className='stat-icon'>
                        <Store size={24} />
                    </div>
                    <div className='stat-content'>
                        <div className='stat-value'>{stats.total}</div>
                        <div className='stat-label'>Total Shops</div>
                    </div>
                </div>

                <div className='stat-card approved'>
                    <div className='stat-icon'>
                        <CheckCircle size={24} />
                    </div>
                    <div className='stat-content'>
                        <div className='stat-value'>{stats.approved}</div>
                        <div className='stat-label'>Approved</div>
                    </div>
                </div>

                <div className='stat-card pending'>
                    <div className='stat-icon'>
                        <AlertCircle size={24} />
                    </div>
                    <div className='stat-content'>
                        <div className='stat-value'>{stats.pending}</div>
                        <div className='stat-label'>Pending Review</div>
                    </div>
                </div>

                <div className='stat-card rejected'>
                    <div className='stat-icon'>
                        <XCircle size={24} />
                    </div>
                    <div className='stat-content'>
                        <div className='stat-value'>{stats.rejected}</div>
                        <div className='stat-label'>Rejected</div>
                    </div>
                </div>

                <div className='stat-card blocked'>
                    <div className='stat-icon'>
                        <Ban size={24} />
                    </div>
                    <div className='stat-content'>
                        <div className='stat-value'>{stats.blocked}</div>
                        <div className='stat-label'>Blocked</div>
                    </div>
                </div>
            </div>

            <div className='filters-section'>
                <div className='search-box'>
                    <Search
                        className='search-icon'
                        size={18}
                    />
                    <input
                        type='text'
                        placeholder='Search shops by name, owner, or address...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='search-input'
                    />
                </div>

                <div className='filter-buttons'>
                    <button
                        className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        All ({stats.total})
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('pending')}
                    >
                        Pending ({stats.pending})
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('approved')}
                    >
                        Approved ({stats.approved})
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('rejected')}
                    >
                        Rejected ({stats.rejected})
                    </button>
                    <button
                        className={`filter-btn ${statusFilter === 'block' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('block')}
                    >
                        Blocked ({stats.blocked})
                    </button>
                </div>
            </div>

            {loading && (
                <div className='loading-container'>
                    <div className='loading-spinner'></div>
                    <p>Loading shops...</p>
                </div>
            )}

            {!loading && (
                <div className='shops-list'>
                    {filteredShops.map((shop) => (
                        <div
                            key={shop.id}
                            className='shop-item'
                        >
                            <div className='shop-image'>
                                {shop.image.startsWith('http') ? (
                                    <img
                                        className='shop-img'
                                        src={shop.image}
                                        alt={shop.name}
                                    />
                                ) : (
                                    <div className='shop-emoji'>{shop.image}</div>
                                )}
                            </div>

                            <div className='shop-details'>
                                <div className='shop-header'>
                                    <div>
                                        <h3 className='shop-name'>{shop.name}</h3>
                                        <p className='shop-owner'>Owner: {shop.owner}</p>
                                    </div>
                                    {getStatusBadge(shop.status)}
                                </div>

                                <div className='shop-info-grid'>
                                    <div className='info-item'>
                                        <MapPin size={16} />
                                        <span>{shop.address}</span>
                                    </div>
                                    <div className='info-item'>
                                        <Phone size={16} />
                                        <span>{shop.phone}</span>
                                    </div>
                                    <div className='info-item'>
                                        <Mail size={16} />
                                        <span>{shop.email}</span>
                                    </div>
                                    <div className='info-item'>
                                        <Clock size={16} />
                                        <span>
                                            Joined: {new Date(shop.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className='shop-stats'>
                                    <div className='stat'>
                                        <Star
                                            size={16}
                                            fill='currentColor'
                                        />
                                        <span>{shop.rating}</span>
                                        <span className='stat-label'>
                                            ({shop.totalReviews} reviews)
                                        </span>
                                    </div>
                                    <div className='stat-divider'>•</div>
                                    <div className='stat'>
                                        <Store size={16} />
                                        <span>{shop.totalOrders} orders</span>
                                    </div>
                                </div>
                            </div>

                            <div className='shop-actions'>
                                <button
                                    className='action-icon-btn view'
                                    onClick={() => navigate(`/admin/shops/${shop.id}`)}
                                    title='View Details'
                                >
                                    <Eye size={18} />
                                </button>

                                {shop.status === 'pending' && (
                                    <>
                                        <button
                                            className='action-icon-btn approve'
                                            onClick={() => handleApproveShop(shop.id)}
                                            title='Approve Shop'
                                        >
                                            <CheckCircle size={18} />
                                        </button>
                                        <button
                                            className='action-icon-btn reject'
                                            onClick={() => handleRejectShop(shop.id)}
                                            title='Reject Shop'
                                        >
                                            <XCircle size={18} />
                                        </button>
                                    </>
                                )}

                                {shop.status === 'approved' && (
                                    <>
                                        <button
                                            className='action-icon-btn reject'
                                            onClick={() => handleRejectShop(shop.id)}
                                            title='Reject Shop'
                                        >
                                            <XCircle size={18} />
                                        </button>
                                        <button
                                            className='action-icon-btn block'
                                            onClick={() => handleBlockShop(shop.id)}
                                            title='Block Shop'
                                        >
                                            <Ban size={18} />
                                        </button>
                                    </>
                                )}

                                {shop.status === 'rejected' && (
                                    <button
                                        className='action-icon-btn approve'
                                        onClick={() => handleApproveShop(shop.id)}
                                        title='Restore Shop'
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}

                                {shop.status === 'block' && (
                                    <button
                                        className='action-icon-btn approve'
                                        onClick={() => handleUnblockShop(shop.id)}
                                        title='Unblock Shop'
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredShops.length === 0 && (
                <div className='empty-state'>
                    <div className='empty-icon'>🏪</div>
                    <h3>No shops found</h3>
                    <p>
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'No shops match the selected filter'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ShopsManagement;
