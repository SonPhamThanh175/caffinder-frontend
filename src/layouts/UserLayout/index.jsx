import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    Home,
    Search,
    ShoppingBag,
    User,
    Heart,
    Menu,
    X,
    Bell,
    Settings,
    Clock,
    LogOut,
    Gift,
    ShoppingBasket,
} from 'lucide-react';
import LocationSelector from '../../components/LocationSelector/LocationSelector';
import LocationPermissionModal from '../../components/LocationPermissionModal/LocationPermissionModal';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import { hideLocationModal, updateLocation } from '../../store/slices/userSlice';
import './style.css';

const UserLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentLocation = useSelector((state) => state.user.current.location);
    const showLocationModal = useSelector((state) => state.user.settings.showLocationModal);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userLocation');
        navigate('/auth/login');
    };

    const handleLocationChange = (newLocation) => {
        dispatch(updateLocation(newLocation));
        console.log('Location updated:', newLocation);
    };

    const handleAllowLocation = async () => {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                });
            });

            const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                name: 'Vị trí hiện tại',
            };

            dispatch(updateLocation(location));
            dispatch(hideLocationModal());
            console.log('Location saved:', location);
        } catch (error) {
            console.error('Error getting location:', error);
            dispatch(hideLocationModal());
            alert(
                'Không thể lấy vị trí. Vui lòng kiểm tra quyền truy cập trong cài đặt trình duyệt.',
            );
        }
    };

    const handleDenyLocation = () => {
        dispatch(hideLocationModal());
        sessionStorage.setItem('locationPermissionDenied', 'true');
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-menu-wrapper')) {
                setShowUserMenu(false);
            }
            if (
                !event.target.closest('.mobile-menu-content') &&
                !event.target.closest('.mobile-menu-btn')
            ) {
                setShowMobileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { path: '/user', label: 'Home', icon: Home },
        { path: '/user/shops', label: 'Shops', icon: ShoppingBasket },
        // { path: '/user/search', label: 'Find Shops', icon: Search },
        { path: '/user/orders', label: 'My Orders', icon: ShoppingBag },
        { path: '/user/favorites', label: 'Favorites', icon: Heart },
        { path: '/user/reviews', label: 'Reviews', icon: Heart },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className='user-layout'>
            {/* Top Navigation Header */}
            <header className={`user-header ${isScrolled ? 'scrolled' : ''}`}>
                <div className='header-container'>
                    {/* Logo */}
                    <div
                        className='header-logo'
                        onClick={() => navigate('/user')}
                    >
                        <span className='logo-icon'>☕</span>
                        <span className='logo-text'>Caffinder</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className='header-nav'>
                        {navItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Header Actions */}
                    <div className='header-actions'>
                        {/* Location Selector - UPDATED */}
                        <LocationSelector
                            currentLocation={currentLocation}
                            onLocationChange={handleLocationChange}
                        />

                        {/* Favorites Button */}
                        <button
                            className='icon-btn'
                            onClick={() => navigate('/user/favorites')}
                            title='Favorites'
                        >
                            <Heart size={20} />
                        </button>

                        {/* Notifications Button */}
                        <button
                            className='icon-btn'
                            onClick={() => navigate('/user/notifications')}
                            title='Notifications'
                        >
                            <Bell size={20} />
                            <span className='icon-badge'></span>
                        </button>

                        {/* User Menu */}
                        <div className='user-menu-wrapper'>
                            <button
                                className={`user-menu-trigger ${showUserMenu ? 'active' : ''}`}
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                <Menu size={18} />
                                <div className='user-avatar'>
                                    {user?.displayName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </button>

                            {/* User Dropdown */}
                            {showUserMenu && (
                                <div className='user-dropdown'>
                                    <div className='dropdown-header'>
                                        <div className='dropdown-user-name'>
                                            {user?.displayName || 'User'}
                                        </div>
                                        <div className='dropdown-user-email'>
                                            {user?.username || user?.email || 'user@example.com'}
                                        </div>
                                    </div>

                                    <div className='dropdown-section'>
                                        <button
                                            className='dropdown-item'
                                            onClick={() => {
                                                navigate('/user/profile');
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <User size={18} />
                                            <span>My Profile</span>
                                        </button>
                                        <button
                                            className='dropdown-item'
                                            onClick={() => {
                                                navigate('/user/orders');
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <ShoppingBag size={18} />
                                            <span>My Orders</span>
                                        </button>
                                        <button
                                            className='dropdown-item'
                                            onClick={() => {
                                                navigate('/user/favorites');
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <Heart size={18} />
                                            <span>Favorites</span>
                                        </button>
                                    </div>

                                    <div className='dropdown-divider' />

                                    <div className='dropdown-section'>
                                        <button
                                            className='dropdown-item'
                                            onClick={() => {
                                                navigate('/user/rewards');
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <Gift size={18} />
                                            <span>Rewards & Offers</span>
                                        </button>
                                        <button
                                            className='dropdown-item'
                                            onClick={() => {
                                                navigate('/user/history');
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <Clock size={18} />
                                            <span>Order History</span>
                                        </button>
                                        <button
                                            className='dropdown-item'
                                            onClick={() => {
                                                navigate('/user/settings');
                                                setShowUserMenu(false);
                                            }}
                                        >
                                            <Settings size={18} />
                                            <span>Settings</span>
                                        </button>
                                    </div>

                                    <div className='dropdown-divider' />

                                    <div className='dropdown-section'>
                                        <button
                                            className='dropdown-item danger'
                                            onClick={handleLogout}
                                        >
                                            <LogOut size={18} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className='mobile-menu-btn'
                            onClick={() => setShowMobileMenu(!showMobileMenu)}
                        >
                            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <div className='mobile-menu-overlay'>
                    <div className='mobile-menu-content'>
                        {/* User Info in Mobile */}
                        <div className='dropdown-header'>
                            <div className='dropdown-user-name'>{user?.displayName || 'User'}</div>
                            <div className='dropdown-user-email'>
                                {user?.username || user?.email || 'user@example.com'}
                            </div>
                        </div>

                        <div className='mobile-menu-divider' />

                        {/* Navigation Items */}
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => {
                                        navigate(item.path);
                                        setShowMobileMenu(false);
                                    }}
                                    className={`mobile-nav-item ${
                                        isActive(item.path) ? 'active' : ''
                                    }`}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}

                        <div className='mobile-menu-divider' />

                        {/* Additional Menu Items */}
                        <button
                            className='mobile-nav-item'
                            onClick={() => {
                                navigate('/user/profile');
                                setShowMobileMenu(false);
                            }}
                        >
                            <User size={20} />
                            <span>My Profile</span>
                        </button>
                        <button
                            className='mobile-nav-item'
                            onClick={() => {
                                navigate('/user/rewards');
                                setShowMobileMenu(false);
                            }}
                        >
                            <Gift size={20} />
                            <span>Rewards & Offers</span>
                        </button>
                        <button
                            className='mobile-nav-item'
                            onClick={() => {
                                navigate('/user/settings');
                                setShowMobileMenu(false);
                            }}
                        >
                            <Settings size={20} />
                            <span>Settings</span>
                        </button>

                        <div className='mobile-menu-divider' />

                        <button
                            className='mobile-nav-item danger'
                            onClick={handleLogout}
                        >
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className='user-main'>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className='user-footer'>
                <div className='footer-container'>
                    <div className='footer-content'>
                        {/* Brand Section */}
                        <div className='footer-brand'>
                            <div className='footer-logo'>
                                <span className='footer-logo-icon'>☕</span>
                                <span className='footer-logo-text'>Caffinder</span>
                            </div>
                            <p className='footer-description'>
                                Discover the best coffee shops in your area. Order your favorite
                                drinks and enjoy convenient delivery.
                            </p>
                        </div>

                        {/* Company Links */}
                        <div className='footer-column'>
                            <h4>Company</h4>
                            <div className='footer-links'>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/about')}
                                >
                                    About Us
                                </a>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/contact')}
                                >
                                    Contact
                                </a>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/careers')}
                                >
                                    Careers
                                </a>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/blog')}
                                >
                                    Blog
                                </a>
                            </div>
                        </div>

                        {/* Support Links */}
                        <div className='footer-column'>
                            <h4>Support</h4>
                            <div className='footer-links'>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/help')}
                                >
                                    Help Center
                                </a>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/terms')}
                                >
                                    Terms of Service
                                </a>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/privacy')}
                                >
                                    Privacy Policy
                                </a>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/faq')}
                                >
                                    FAQ
                                </a>
                            </div>
                        </div>

                        {/* Discover Links */}
                        <div className='footer-column'>
                            <h4>Discover</h4>
                            <div className='footer-links'>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/user/search')}
                                >
                                    Popular Shops
                                </a>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/user/new')}
                                >
                                    New Arrivals
                                </a>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/user/offers')}
                                >
                                    Special Offers
                                </a>
                                <a
                                    className='footer-link'
                                    onClick={() => navigate('/user/rewards')}
                                >
                                    Rewards Program
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className='footer-bottom'>
                        <p className='footer-copyright'>
                            © {new Date().getFullYear()} Caffinder. All rights reserved.
                        </p>
                        <div className='footer-social'>
                            <a
                                className='social-link'
                                href='#'
                                title='Facebook'
                            >
                                <span>f</span>
                            </a>
                            <a
                                className='social-link'
                                href='#'
                                title='Instagram'
                            >
                                <span>📷</span>
                            </a>
                            <a
                                className='social-link'
                                href='#'
                                title='Twitter'
                            >
                                <span>🐦</span>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Location Permission Modal */}
            <LocationPermissionModal
                isOpen={showLocationModal}
                onAllow={handleAllowLocation}
                onDeny={handleDenyLocation}
            />

            {/* Scroll to Top */}
            <ScrollToTop />
        </div>
    );
};

export default UserLayout;
