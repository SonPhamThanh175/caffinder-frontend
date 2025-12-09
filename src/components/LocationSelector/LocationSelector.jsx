import React, { useState, useEffect, useRef } from 'react';
import { MapPin, ChevronDown, Navigation, X, Search } from 'lucide-react';
import './style.css';

const LocationSelector = ({ currentLocation, onLocationChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  const suggestedLocations = [
    { id: 1, name: 'Quận 1, TP.HCM', coords: { latitude: 10.7769, longitude: 106.7009 } },
    { id: 2, name: 'Quận 3, TP.HCM', coords: { latitude: 10.7866, longitude: 106.6890 } },
    { id: 3, name: 'Quận Bình Thạnh, TP.HCM', coords: { latitude: 10.8142, longitude: 106.7068 } },
    { id: 4, name: 'Quận Phú Nhuận, TP.HCM', coords: { latitude: 10.7993, longitude: 106.6810 } },
    { id: 5, name: 'Quận 7, TP.HCM', coords: { latitude: 10.7333, longitude: 106.7200 } },
    { id: 6, name: 'Quận 10, TP.HCM', coords: { latitude: 10.7728, longitude: 106.6685 } },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGetCurrentLocation = async () => {
    setIsLoading(true);
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
        name: 'Vị trí hiện tại'
      };

      onLocationChange(location);
      setShowDropdown(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Error getting location:', error);
      let errorMessage = 'Không thể lấy vị trí hiện tại. ';
      
      if (error.code === 1) {
        errorMessage += 'Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt.';
      } else if (error.code === 2) {
        errorMessage += 'Không thể xác định vị trí. Vui lòng thử lại.';
      } else if (error.code === 3) {
        errorMessage += 'Yêu cầu quá thời gian. Vui lòng thử lại.';
      }
      
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectLocation = (location) => {
    onLocationChange({
      ...location.coords,
      name: location.name
    });
    setShowDropdown(false);
    setSearchQuery('');
  };

  const filteredLocations = suggestedLocations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayLocation = currentLocation?.name || 'Chọn vị trí';
  const isCurrentLocation = displayLocation === 'Vị trí hiện tại';

  return (
    <div className="location-selector-wrapper" ref={dropdownRef}>
      <button
        className="location-selector-trigger"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <MapPin size={18} className={`location-selector-icon ${isCurrentLocation ? 'active' : ''}`} />
        <div className="location-selector-text">
          <span className="location-selector-label">Cập nhật vị trí</span>
          <div className="location-selector-value">
            <span className="location-selector-name">{displayLocation}</span>
            <ChevronDown size={14} className={showDropdown ? 'rotated' : ''} />
          </div>
        </div>
      </button>

      {showDropdown && (
        <div className="location-dropdown">
          <div className="location-dropdown-header">
            <h4>Chọn vị trí giao hàng</h4>
            <button 
              className="location-dropdown-close"
              onClick={() => {
                setShowDropdown(false);
                setSearchQuery('');
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Search */}
          <div className="location-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="location-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Current Location Button */}
          <button
            className="location-current-btn"
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
          >
            <div className={`location-current-icon ${isLoading ? 'loading' : ''}`}>
              <Navigation size={18} />
            </div>
            <div className="location-current-content">
              <div className="location-current-title">
                {isLoading ? 'Đang lấy vị trí...' : 'Sử dụng vị trí hiện tại'}
              </div>
              <div className="location-current-subtitle">
                Tự động xác định vị trí của bạn
              </div>
            </div>
          </button>

          <div className="location-dropdown-divider">
            <span>Hoặc chọn vị trí</span>
          </div>

          {/* Suggested Locations */}
          <div className="location-list">
            <div className="location-list-title">Địa điểm gợi ý</div>
            {filteredLocations.length > 0 ? (
              filteredLocations.map(location => {
                const isSelected = currentLocation?.name === location.name;
                return (
                  <button
                    key={location.id}
                    className={`location-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectLocation(location)}
                  >
                    <MapPin size={16} />
                    <span>{location.name}</span>
                    {isSelected && (
                      <span className="location-item-check">✓</span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="location-empty">
                <MapPin size={32} />
                <p>Không tìm thấy địa điểm phù hợp</p>
                <small>Thử tìm kiếm với từ khóa khác</small>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;