import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { message } from 'antd';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Flame,
  SlidersHorizontal,
  X,
  Heart,
  Navigation,
  Users
} from 'lucide-react';
import './style.css'
import shopsApi from '../../../../../api/shopsApi';
import favoriteApi from '../../../../../api/favoriteApi';

const ShopsList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [shopList, setShopList] = useState([]);
  const [totalShops, setTotalShops] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [togglingFav, setTogglingFav] = useState(null);

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    
    const savedLocation = localStorage.getItem('userLocation');
    const userLocation = savedLocation ? JSON.parse(savedLocation) : null;
    
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      console.error('Location is required. Please enable location access.');
    }
    
    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || 10,
      longitude: userLocation?.longitude,
      latitude: userLocation?.latitude,
      radius: Number.parseInt(params.radius) || 5,
      sortBy: params.sortBy || undefined,
      search: params.search || ''
    };
  }, [location.search]);

  useEffect(() => {
    fetchShops();
    fetchFavorites();
  }, [queryParams]);

  useEffect(() => {
    setSearchText(queryParams.search || '');
  }, [queryParams.search]);

  const fetchFavorites = async () => {
    try {
      const response = await favoriteApi.getMyFavorite();
      console.log("response",response);
      
      const favShopIds = new Set(response.data?.map(fav => fav.shop.id) || []);
      setFavorites(favShopIds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchShops = async () => {
    if (!queryParams.latitude || !queryParams.longitude) {
      console.error('Location coordinates are required');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await shopsApi.getAll(queryParams);
      console.log("response", response);
      
      setShopList(response?.data || []);
      setTotalShops(response?.pagination?.total || 0);
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (shopId, e) => {
    e.stopPropagation();
    try {
      setTogglingFav(shopId);
      const isFavorite = favorites.has(shopId);
      
      if (isFavorite) {
        await favoriteApi.delete(shopId);
        setFavorites(prev => {
          const newSet = new Set(prev);
          newSet.delete(shopId);
          return newSet;
        });
        message.success('Đã xóa khỏi yêu thích');
      } else {
        await favoriteApi.add(shopId);
        setFavorites(prev => new Set([...prev, shopId]));
        message.success('Đã thêm vào yêu thích');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      message.error('Có lỗi xảy ra');
    } finally {
      setTogglingFav(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateQueryParams({ search: searchText, page: 1 });
  };

  const updateQueryParams = (newParams) => {
    const params = {
      ...queryParams,
      ...newParams
    };
    
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key];
      }
    });

    delete params.latitude;
    delete params.longitude;

    navigate(`?${queryString.stringify(params)}`);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: Star },
    { value: 'most_favorite', label: 'Most Popular', icon: Flame }
  ];

  const isShopOpen = (openTime, closeTime) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;
    
    return currentTime >= openMinutes && currentTime <= closeMinutes;
  };

  return (
    <div className="product-search-page">
      <form onSubmit={handleSearch} className="search-bar-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search for coffee shops..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="search-input"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => {
                setSearchText('');
                updateQueryParams({ search: '', page: 1 });
              }}
              className="clear-btn"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="filter-btn"
        >
          <SlidersHorizontal size={20} />
        </button>
      </form>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <label className="filter-label">Sort By</label>
            <div className="sort-options">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateQueryParams({ sortBy: option.value, page: 1 })}
                  className={`sort-option ${queryParams.sortBy === option.value ? 'active' : ''}`}
                >
                  <option.icon size={16} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <label className="filter-label">Radius: {queryParams.radius} km</label>
            <input
              type="range"
              min="1"
              max="20"
              value={queryParams.radius}
              onChange={(e) => updateQueryParams({ radius: e.target.value, page: 1 })}
              className="radius-slider"
            />
            <div className="radius-labels">
              <span>1 km</span>
              <span>20 km</span>
            </div>
          </div>
        </div>
      )}

      {(queryParams.search || queryParams.radius !== 5) && (
        <div className="active-filters">
          {queryParams.search && (
            <div className="filter-chip">
              <span>Search: {queryParams.search}</span>
              <button onClick={() => updateQueryParams({ search: '', page: 1 })}>
                <X size={14} />
              </button>
            </div>
          )}
          {queryParams.radius !== 5 && (
            <div className="filter-chip">
              <span>Radius: {queryParams.radius}km</span>
              <button onClick={() => updateQueryParams({ radius: 5, page: 1 })}>
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="results-header">
        <h3>{totalShops} coffee shops found</h3>
        <p className="results-subtitle">Near your location</p>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Finding coffee shops...</p>
        </div>
      )}

      {!loading && (
        <div className="shop-list">
          {shopList.map((shop) => {
            const isOpen = isShopOpen(shop.openTime, shop.closeTime);
            const mainImage = shop.img && shop.img.length > 0 ? shop.img[0] : null;
            
            return (
              <div key={shop.id} className="shop-card">
                <div className="shop-card-content">
                  <div className="shop-image">
                    {mainImage ? (
                      <img src={mainImage} alt={shop.name} className="shop-img" />
                    ) : (
                      <div className="shop-emoji">☕</div>
                    )}
                    {!isOpen && <div className="closed-badge">Closed</div>}
                    <button
                      className={`favorite-btn-list ${favorites.has(shop.id) ? 'active' : ''}`}
                      onClick={(e) => handleToggleFavorite(shop.id, e)}
                      disabled={togglingFav === shop.id}
                    >
                      <Heart
                        size={20}
                        fill={favorites.has(shop.id) ? '#EF4444' : 'none'}
                        color={favorites.has(shop.id) ? '#EF4444' : '#757575'}
                      />
                    </button>
                  </div>

                  <div className="shop-info">
                    <div className="shop-header">
                      <h4 className="shop-name">{shop.name}</h4>
                    </div>

                    <div className="shop-address">
                      <MapPin size={14} />
                      <span>{shop.address}</span>
                    </div>

                    <div className="shop-meta">
                      <div className="meta-item">
                        <Heart size={14} fill="currentColor" />
                        <span>{shop.favorite_count || 0}</span>
                        <span className="meta-secondary">favorites</span>
                      </div>
                      <span className="meta-divider">•</span>
                      <div className="meta-item">
                        <Navigation size={14} />
                        <span>{shop.distance?.text || 'N/A'}</span>
                      </div>
                      <span className="meta-divider">•</span>
                      <div className="meta-item">
                        <Users size={14} />
                        <span>{shop.totalCapacity} seats</span>
                      </div>
                    </div>

                    {shop.description && (
                      <p className="shop-description">{shop.description}</p>
                    )}

                    {isOpen && (
                      <div className="shop-status open">
                        <Clock size={12} />
                        <span>Open now • {shop.openTime} - {shop.closeTime}</span>
                      </div>
                    )}
                    
                    {!isOpen && (
                      <div className="shop-status closed">
                        <Clock size={12} />
                        <span>Closed • Opens at {shop.openTime}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  className="view-menu-btn"
                  onClick={() => navigate(`/user/shops/${shop.id}`)}
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}

      {!loading && shopList.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No shops found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {!loading && totalShops > queryParams.limit && (
        <div className="pagination">
          <button
            onClick={() => updateQueryParams({ page: queryParams.page - 1 })}
            disabled={queryParams.page === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {queryParams.page} of {Math.ceil(totalShops / queryParams.limit)}
          </span>
          <button
            onClick={() => updateQueryParams({ page: queryParams.page + 1 })}
            disabled={queryParams.page >= Math.ceil(totalShops / queryParams.limit)}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopsList;