import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Flame,
  SlidersHorizontal,
  X,
  ChevronDown,
  Heart,
  Navigation
} from 'lucide-react';
import './style.css'
import productsApi from '../../../../api/productApi';
const ProductSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [shopList, setShopList] = useState([]);
  const [totalShops, setTotalShops] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || 10,
      longitude: Number.parseFloat(params.longitude),
      latitude: Number.parseFloat(params.latitude),
      radius: Number.parseInt(params.radius) || 5,
      sortBy: params.sortBy || 'distance',
      search: params.search || ''
    };
  }, [location.search]);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const response = await productsApi.getAll(queryParams);
        setShopList(response.data);
        setTotalShops(response.total);
      } catch (error) {
        console.error('Failed to fetch shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [queryParams]);

  useEffect(() => {
    setSearchText(queryParams.search || '');
  }, [queryParams.search]);

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

    navigate(`?${queryString.stringify(params)}`);
  };

  const toggleFavorite = (shopId) => {
    setShopList(prev => 
      prev.map(shop => 
        shop.id === shopId ? { ...shop, favorite: !shop.favorite } : shop
      )
    );
  };

  const sortOptions = [
    { value: 'distance', label: 'Nearest', icon: Navigation },
    { value: 'rating', label: 'Highest Rated', icon: Star },
    { value: 'most_favorite', label: 'Most Popular', icon: Flame }
  ];

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

      {/* Filters Panel */}
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

      {/* Active Filters */}
      {(queryParams.search || queryParams.radius !== 4) && (
        <div className="active-filters">
          {queryParams.search && (
            <div className="filter-chip">
              <span>Search: {queryParams.search}</span>
              <button onClick={() => updateQueryParams({ search: '', page: 1 })}>
                <X size={14} />
              </button>
            </div>
          )}
          {queryParams.radius !== 4 && (
            <div className="filter-chip">
              <span>Radius: {queryParams.radius}km</span>
              <button onClick={() => updateQueryParams({ radius: 4, page: 1 })}>
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Header */}
      <div className="results-header">
        <h3>{totalShops} coffee shops found</h3>
        <p className="results-subtitle">Near your location</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Finding coffee shops...</p>
        </div>
      )}

      {/* Shop List */}
      {!loading && (
        <div className="shop-list">
          {shopList.map((shop) => (
            <div key={shop.id} className="shop-card">
              <div className="shop-card-content">
                <div className="shop-image">
                  <div className="shop-emoji">{shop.image}</div>
                  {!shop.isOpen && <div className="closed-badge">Closed</div>}
                </div>

                <div className="shop-info">
                  <div className="shop-header">
                    <h4 className="shop-name">{shop.name}</h4>
                    <button
                      onClick={() => toggleFavorite(shop.id)}
                      className="favorite-btn"
                    >
                      <Heart
                        size={20}
                        className={shop.favorite ? 'filled' : ''}
                        fill={shop.favorite ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  <div className="shop-address">
                    <MapPin size={14} />
                    <span>{shop.address}</span>
                  </div>

                  <div className="shop-meta">
                    <div className="meta-item">
                      <Star size={14} fill="currentColor" />
                      <span>{shop.rating}</span>
                      <span className="meta-secondary">({shop.totalReviews})</span>
                    </div>
                    <span className="meta-divider">•</span>
                    <div className="meta-item">
                      <Navigation size={14} />
                      <span>{shop.distance} km</span>
                    </div>
                    <span className="meta-divider">•</span>
                    <span className="price-range">{shop.priceRange}</span>
                  </div>

                  <div className="shop-tags">
                    {shop.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>

                  {shop.isOpen && (
                    <div className="shop-status open">
                      <Clock size={12} />
                      <span>Open now</span>
                    </div>
                  )}
                </div>
              </div>

              <button className="view-menu-btn">
                View Menu
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && shopList.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No shops found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
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

export default ProductSearch;