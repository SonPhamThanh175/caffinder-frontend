import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
    ArrowLeft,
    Store,
    MapPin,
    Phone,
    Clock,
    Users,
    Calendar,
    CheckCircle,
    XCircle,
    AlertCircle,
    Ban,
    Edit,
    Trash2,
    Star,
    TrendingUp,
    DollarSign,
    Package,
    User,
    Mail,
    Globe,
    Timer,
    Percent,
    Info,
} from 'lucide-react';
import shopAdminApi from '../../../../api/shopAdmin';
import './style.css';

const { confirm } = Modal;

const ShopDetail = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        fetchShopDetail();
    }, [shopId]);

    const fetchShopDetail = async () => {
        setLoading(true);
        try {
            const response = await shopAdminApi.getById(shopId);
            setShop(response.shop);
        } catch (error) {
            console.error('Failed to fetch shop details:', error);
            messageApi.error('Failed to load shop details. Please try again.');
        } finally {
            setLoading(false);
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
                <Icon size={16} />
                {config.label}
            </span>
        );
    };

    const handleApprove = () => {
        confirm({
            title: 'Approve Shop',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to approve this shop?',
            okText: 'Yes, Approve',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await shopAdminApi.approveShop(shopId);
                    setShop((prev) => ({ ...prev, status: 'approved' }));
                    messageApi.success('Shop approved successfully!');
                } catch (error) {
                    console.error('Failed to approve shop:', error);
                    messageApi.error('Failed to approve shop. Please try again.');
                }
            },
        });
    };

    const handleReject = () => {
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
                    setShop((prev) => ({ ...prev, status: 'rejected' }));
                    messageApi.success('Shop rejected successfully!');
                } catch (error) {
                    console.error('Failed to reject shop:', error);
                    messageApi.error('Failed to reject shop. Please try again.');
                }
            },
        });
    };

    const handleBlock = () => {
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
                    setShop((prev) => ({ ...prev, status: 'block' }));
                    messageApi.success('Shop blocked successfully!');
                } catch (error) {
                    console.error('Failed to block shop:', error);
                    messageApi.error('Failed to block shop. Please try again.');
                }
            },
        });
    };

    const handleUnblock = () => {
        confirm({
            title: 'Unblock Shop',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to unblock this shop?',
            okText: 'Yes, Unblock',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await shopAdminApi.approveShop(shopId);
                    setShop((prev) => ({ ...prev, status: 'approved' }));
                    messageApi.success('Shop unblocked and approved successfully!');
                } catch (error) {
                    console.error('Failed to unblock shop:', error);
                    messageApi.error('Failed to unblock shop. Please try again.');
                }
            },
        });
    };

    if (loading) {
        return (
            <div className='shop-detail'>
                {contextHolder}
                <div className='loading-container'>
                    <div className='loading-spinner'></div>
                    <p>Loading shop details...</p>
                </div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className='shop-detail'>
                {contextHolder}
                <div className='empty-state'>
                    <div className='empty-icon'>🏪</div>
                    <h3>Shop not found</h3>
                    <p>The shop you're looking for doesn't exist or has been removed.</p>
                    <button
                        className='action-btn primary'
                        onClick={() => navigate('/admin/shops')}
                    >
                        Back to Shops
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='shop-detail'>
            {contextHolder}
            <div className='detail-header'>
                <button
                    className='back-btn'
                    onClick={() => navigate('/admin/shops')}
                >
                    <ArrowLeft size={20} />
                    <span>Back to Shops</span>
                </button>

                <div className='header-actions'>
                    {shop.status === 'pending' && (
                        <>
                            <button
                                className='action-btn approve'
                                onClick={handleApprove}
                            >
                                <CheckCircle size={18} />
                                <span>Approve Shop</span>
                            </button>
                            <button
                                className='action-btn reject'
                                onClick={handleReject}
                            >
                                <XCircle size={18} />
                                <span>Reject Shop</span>
                            </button>
                        </>
                    )}

                    {shop.status === 'approved' && (
                        <>
                            <button
                                className='action-btn reject'
                                onClick={handleReject}
                            >
                                <XCircle size={18} />
                                <span>Reject Shop</span>
                            </button>
                            <button
                                className='action-btn block'
                                onClick={handleBlock}
                            >
                                <Ban size={18} />
                                <span>Block Shop</span>
                            </button>
                        </>
                    )}

                    {shop.status === 'rejected' && (
                        <button
                            className='action-btn approve'
                            onClick={handleApprove}
                        >
                            <CheckCircle size={18} />
                            <span>Restore Shop</span>
                        </button>
                    )}

                    {shop.status === 'block' && (
                        <button
                            className='action-btn approve'
                            onClick={handleUnblock}
                        >
                            <CheckCircle size={18} />
                            <span>Unblock Shop</span>
                        </button>
                    )}
                </div>
            </div>

            <div className='shop-banner'>
                <div className='banner-image'>
                    <img
                        src={shop.img[0]}
                        alt={shop.name}
                    />
                    <div className='banner-overlay'>
                        <div className='shop-title-section'>
                            <h1 className='shop-title'>{shop.name}</h1>
                            {getStatusBadge(shop.status)}
                        </div>
                    </div>
                </div>
            </div>

            <div className='detail-content'>
                <div className='quick-stats'>
                    <div className='stat-item'>
                        <div className='stat-icon'>
                            <Users size={24} />
                        </div>
                        <div className='stat-info'>
                            <div className='stat-value'>{shop.totalCapacity}</div>
                            <div className='stat-label'>Total Capacity</div>
                        </div>
                    </div>

                    <div className='stat-item'>
                        <div className='stat-icon'>
                            <Timer size={24} />
                        </div>
                        <div className='stat-info'>
                            <div className='stat-value'>{shop.defaultDuration} min</div>
                            <div className='stat-label'>Default Duration</div>
                        </div>
                    </div>

                    <div className='stat-item'>
                        <div className='stat-icon'>
                            <Percent size={24} />
                        </div>
                        <div className='stat-info'>
                            <div className='stat-value'>
                                {(parseFloat(shop.overbookingRate) * 100).toFixed(0)}%
                            </div>
                            <div className='stat-label'>Overbooking Rate</div>
                        </div>
                    </div>

                    <div className='stat-item'>
                        <div className='stat-icon'>
                            <Clock size={24} />
                        </div>
                        <div className='stat-info'>
                            <div className='stat-value'>
                                {shop.openTime.slice(0, 5)} - {shop.closeTime.slice(0, 5)}
                            </div>
                            <div className='stat-label'>Opening Hours</div>
                        </div>
                    </div>
                </div>

                <div className='detail-grid'>
                    <div className='detail-left'>
                        <div className='info-card'>
                            <div className='card-header'>
                                <Store size={20} />
                                <h2>Basic Information</h2>
                            </div>
                            <div className='card-content'>
                                <div className='info-row'>
                                    <div className='info-label'>
                                        <Info size={16} />
                                        <span>Description</span>
                                    </div>
                                    <div className='info-value'>{shop.description}</div>
                                </div>

                                <div className='info-row'>
                                    <div className='info-label'>
                                        <MapPin size={16} />
                                        <span>Address</span>
                                    </div>
                                    <div className='info-value'>{shop.address}</div>
                                </div>

                                <div className='info-row'>
                                    <div className='info-label'>
                                        <Globe size={16} />
                                        <span>Coordinates</span>
                                    </div>
                                    <div className='info-value'>
                                        Lat: {shop.latitude}, Long: {shop.longitude}
                                    </div>
                                </div>

                                <div className='info-row'>
                                    <div className='info-label'>
                                        <Calendar size={16} />
                                        <span>Created At</span>
                                    </div>
                                    <div className='info-value'>
                                        {new Date(shop.createdAt).toLocaleString('vi-VN')}
                                    </div>
                                </div>

                                <div className='info-row'>
                                    <div className='info-label'>
                                        <Calendar size={16} />
                                        <span>Last Updated</span>
                                    </div>
                                    <div className='info-value'>
                                        {new Date(shop.updatedAt).toLocaleString('vi-VN')}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='info-card'>
                            <div className='card-header'>
                                <MapPin size={20} />
                                <h2>Location</h2>
                            </div>
                            <div className='card-content'>
                                <div className='map-placeholder'>
                                    <iframe
                                        width='100%'
                                        height='300'
                                        frameBorder='0'
                                        style={{ border: 0, borderRadius: '12px' }}
                                        src={`https://www.google.com/maps?q=${shop.latitude},${shop.longitude}&z=15&output=embed`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='detail-right'>
                        <div className='info-card'>
                            <div className='card-header'>
                                <User size={20} />
                                <h2>Owner Information</h2>
                            </div>
                            <div className='card-content'>
                                <div className='owner-profile'>
                                    <img
                                        src={shop.owner.avaUrl}
                                        alt={shop.owner.displayName}
                                        className='owner-avatar'
                                    />
                                    <div className='owner-details'>
                                        <h3 className='owner-name'>{shop.owner.displayName}</h3>
                                        <p className='owner-id'>Owner ID: #{shop.owner.id}</p>
                                    </div>
                                </div>

                                <div className='info-row'>
                                    <div className='info-label'>
                                        <Phone size={16} />
                                        <span>Contact Phone</span>
                                    </div>
                                    <div className='info-value'>
                                        {shop.owner.contactPhone || 'Not provided'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='info-card'>
                            <div className='card-header'>
                                <Clock size={20} />
                                <h2>Operating Details</h2>
                            </div>
                            <div className='card-content'>
                                <div className='info-row'>
                                    <div className='info-label'>
                                        <Clock size={16} />
                                        <span>Opening Time</span>
                                    </div>
                                    <div className='info-value'>{shop.openTime}</div>
                                </div>

                                <div className='info-row'>
                                    <div className='info-label'>
                                        <Clock size={16} />
                                        <span>Closing Time</span>
                                    </div>
                                    <div className='info-value'>{shop.closeTime}</div>
                                </div>

                                <div className='info-row'>
                                    <div className='info-label'>
                                        <Users size={16} />
                                        <span>Total Capacity</span>
                                    </div>
                                    <div className='info-value'>{shop.totalCapacity} seats</div>
                                </div>

                                <div className='info-row'>
                                    <div className='info-label'>
                                        <Timer size={16} />
                                        <span>Default Duration</span>
                                    </div>
                                    <div className='info-value'>{shop.defaultDuration} minutes</div>
                                </div>

                                <div className='info-row'>
                                    <div className='info-label'>
                                        <Percent size={16} />
                                        <span>Overbooking Rate</span>
                                    </div>
                                    <div className='info-value'>
                                        {shop.overbookingRate} (
                                        {(parseFloat(shop.overbookingRate) * 100).toFixed(0)}%)
                                    </div>
                                </div>
                            </div>
                        </div>

                        {shop.img && shop.img.length > 0 && (
                            <div className='info-card'>
                                <div className='card-header'>
                                    <Package size={20} />
                                    <h2>Shop Images</h2>
                                </div>
                                <div className='card-content'>
                                    <div className='images-grid'>
                                        {shop.img.map((image, index) => (
                                            <div
                                                key={index}
                                                className='image-item'
                                            >
                                                <img
                                                    src={image}
                                                    alt={`${shop.name} ${index + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopDetail;
