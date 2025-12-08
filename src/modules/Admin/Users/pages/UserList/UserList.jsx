import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
    Users,
    Search,
    User,
    Mail,
    Phone,
    Calendar,
    CheckCircle,
    XCircle,
    Ban,
    Eye,
    RefreshCw,
    Download,
    Shield,
    UserCheck,
    Clock,
    X,
} from 'lucide-react';
import userAdminApi from '../../../../../api/userAdmin';
import './style.css';

const { confirm } = Modal;

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const stats = {
        total: users.length,
        active: users.filter((u) => u.status === 'active').length,
        blocked: users.filter((u) => u.status === 'block').length,
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userAdminApi.getAll();
            const transformedUsers = (response.users || []).map((user) => ({
                id: user.id,
                displayName: user.displayName || 'N/A',
                email: user.email || 'N/A',
                contactPhone: user.contactPhone || 'N/A',
                avaUrl: user.avaUrl || 'https://via.placeholder.com/80',
                role: user.role || 'user',
                status: user.status || 'active',
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }));

            setUsers(transformedUsers);
            setFilteredUsers(transformedUsers);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            messageApi.error('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = [...users];

        if (statusFilter !== 'all') {
            filtered = filtered.filter((user) => user.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(
                (user) =>
                    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.contactPhone.toLowerCase().includes(searchTerm.toLowerCase()),
            );
        }

        setFilteredUsers(filtered);
    }, [searchTerm, statusFilter, users]);

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleActiveUser = async (userId) => {
        try {
            await userAdminApi.activeUser(userId);
            setUsers((prev) =>
                prev.map((user) => (user.id === userId ? { ...user, status: 'active' } : user)),
            );
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser((prev) => ({ ...prev, status: 'active' }));
            }
            messageApi.success('User activated successfully!');
        } catch (error) {
            console.error('Failed to activate user:', error);
            messageApi.error('Failed to activate user. Please try again.');
        }
    };

    const handleBlockUser = (userId) => {
        confirm({
            title: 'Block User',
            icon: <ExclamationCircleOutlined />,
            content:
                'Are you sure you want to block this user? The user will not be able to access the system.',
            okText: 'Yes, Block',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await userAdminApi.blockUser(userId);
                    setUsers((prev) =>
                        prev.map((user) =>
                            user.id === userId ? { ...user, status: 'block' } : user,
                        ),
                    );
                    if (selectedUser && selectedUser.id === userId) {
                        setSelectedUser((prev) => ({ ...prev, status: 'block' }));
                    }
                    messageApi.success('User blocked successfully!');
                } catch (error) {
                    console.error('Failed to block user:', error);
                    messageApi.error('Failed to block user. Please try again.');
                }
            },
        });
    };

    const getStatusBadge = (status) => {
        const configs = {
            active: {
                className: 'status-badge approved',
                icon: CheckCircle,
                label: 'Active',
            },
            block: {
                className: 'status-badge blocked',
                icon: Ban,
                label: 'Blocked',
            },
        };

        const config = configs[status] || configs.active;
        const Icon = config.icon;

        return (
            <span className={config.className}>
                <Icon size={14} />
                {config.label}
            </span>
        );
    };

    const getRoleBadge = (role) => {
        const configs = {
            admin: {
                className: 'role-badge admin',
                icon: Shield,
                label: 'Admin',
            },
            owner: {
                className: 'role-badge owner',
                icon: UserCheck,
                label: 'Owner',
            },
            user: {
                className: 'role-badge user',
                icon: User,
                label: 'User',
            },
        };

        const config = configs[role] || configs.user;
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
                    <h1 className='page-title'>User Management</h1>
                    <p className='page-subtitle'>Manage and monitor user accounts</p>
                </div>
                <div className='header-actions'>
                    <button className='action-btn secondary' onClick={fetchUsers}>
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
                        <Users size={24} />
                    </div>
                    <div className='stat-content'>
                        <div className='stat-value'>{stats.total}</div>
                        <div className='stat-label'>Total Users</div>
                    </div>
                </div>

                <div className='stat-card approved'>
                    <div className='stat-icon'>
                        <CheckCircle size={24} />
                    </div>
                    <div className='stat-content'>
                        <div className='stat-value'>{stats.active}</div>
                        <div className='stat-label'>Active</div>
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
                    <Search className='search-icon' size={18} />
                    <input
                        type='text'
                        placeholder='Search users by name, email, or phone...'
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
                        className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('active')}
                    >
                        Active ({stats.active})
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
                    <p>Loading users...</p>
                </div>
            )}

            {!loading && (
                <div className='shops-list'>
                    {filteredUsers.map((user) => (
                        <div key={user.id} className='shop-item'>
                            <div className='shop-image'>
                                <img
                                    className='shop-img'
                                    src={user.avaUrl}
                                    alt={user.displayName}
                                    style={{ borderRadius: '50%' }}
                                />
                            </div>

                            <div className='shop-details'>
                                <div className='shop-header'>
                                    <div>
                                        <h3 className='shop-name'>{user.displayName}</h3>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                            {getStatusBadge(user.status)}
                                            {getRoleBadge(user.role)}
                                        </div>
                                    </div>
                                </div>

                                <div className='shop-info-grid'>
                                    <div className='info-item'>
                                        <Mail size={16} />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className='info-item'>
                                        <Phone size={16} />
                                        <span>{user.contactPhone}</span>
                                    </div>
                                    <div className='info-item'>
                                        <Calendar size={16} />
                                        <span>
                                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className='info-item'>
                                        <Calendar size={16} />
                                        <span>
                                            Updated: {new Date(user.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='shop-actions'>
                                <button
                                    className='action-icon-btn view'
                                    onClick={() => handleViewDetails(user)}
                                    title='View Details'
                                >
                                    <Eye size={18} />
                                </button>

                                {user.status === 'active' && (
                                    <button
                                        className='action-icon-btn block'
                                        onClick={() => handleBlockUser(user.id)}
                                        title='Block User'
                                    >
                                        <Ban size={18} />
                                    </button>
                                )}

                                {user.status === 'block' && (
                                    <button
                                        className='action-icon-btn approve'
                                        onClick={() => handleActiveUser(user.id)}
                                        title='Activate User'
                                    >
                                        <CheckCircle size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredUsers.length === 0 && (
                <div className='empty-state'>
                    <div className='empty-icon'>👥</div>
                    <h3>No users found</h3>
                    <p>
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'No users match the selected filter'}
                    </p>
                </div>
            )}

            {/* User Detail Modal */}
            {isModalOpen && selectedUser && (
                <div className='user-modal-overlay' onClick={handleCloseModal}>
                    <div className='user-modal-content' onClick={(e) => e.stopPropagation()}>
                        <div className='user-modal-header'>
                            <h2>User Details</h2>
                            <button className='modal-close-btn' onClick={handleCloseModal}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className='user-modal-body'>
                            <div className='user-profile-section'>
                                <img
                                    src={selectedUser.avaUrl}
                                    alt={selectedUser.displayName}
                                    className='user-modal-avatar'
                                />
                                <h3 className='user-modal-name'>{selectedUser.displayName}</h3>
                                <div className='user-modal-badges'>
                                    {getStatusBadge(selectedUser.status)}
                                    {getRoleBadge(selectedUser.role)}
                                </div>
                            </div>

                            <div className='user-info-section'>
                                <div className='info-card'>
                                    <div className='card-header'>
                                        <User size={20} />
                                        <h3>Personal Information</h3>
                                    </div>
                                    <div className='card-content'>
                                        <div className='info-row'>
                                            <div className='info-label'>
                                                <Mail size={16} />
                                                <span>Email</span>
                                            </div>
                                            <div className='info-value'>{selectedUser.email}</div>
                                        </div>

                                        <div className='info-row'>
                                            <div className='info-label'>
                                                <Phone size={16} />
                                                <span>Phone</span>
                                            </div>
                                            <div className='info-value'>{selectedUser.contactPhone}</div>
                                        </div>

                                        <div className='info-row'>
                                            <div className='info-label'>
                                                <Shield size={16} />
                                                <span>Role</span>
                                            </div>
                                            <div className='info-value'>{selectedUser.role}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className='info-card'>
                                    <div className='card-header'>
                                        <Clock size={20} />
                                        <h3>Account Information</h3>
                                    </div>
                                    <div className='card-content'>
                                        <div className='info-row'>
                                            <div className='info-label'>
                                                <Calendar size={16} />
                                                <span>Created At</span>
                                            </div>
                                            <div className='info-value'>
                                                {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}
                                            </div>
                                        </div>

                                        <div className='info-row'>
                                            <div className='info-label'>
                                                <Calendar size={16} />
                                                <span>Last Updated</span>
                                            </div>
                                            <div className='info-value'>
                                                {new Date(selectedUser.updatedAt).toLocaleString('vi-VN')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='user-modal-footer'>
                            {selectedUser.status === 'active' ? (
                                <button
                                    className='action-btn block'
                                    onClick={() => {
                                        handleBlockUser(selectedUser.id);
                                    }}
                                >
                                    <Ban size={18} />
                                    <span>Block User</span>
                                </button>
                            ) : (
                                <button
                                    className='action-btn approve'
                                    onClick={() => {
                                        handleActiveUser(selectedUser.id);
                                    }}
                                >
                                    <CheckCircle size={18} />
                                    <span>Activate User</span>
                                </button>
                            )}
                            <button className='action-btn secondary' onClick={handleCloseModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;