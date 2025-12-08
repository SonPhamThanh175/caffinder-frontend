import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock,
  TrendingUp,
  Award,
  Heart,
  Coffee,
  Gift,
  Zap,
  Users,
  ThumbsUp,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import './style.css';

const Home = () => {
  const navigate = useNavigate();

  const featuredShops = [
    {
      id: 1,
      name: 'The Coffee House',
      image: '☕',
      rating: 4.8,
      reviews: 245,
      distance: 1.2,
      priceRange: '$$',
      tags: ['Popular', 'WiFi'],
      discount: '20% OFF'
    },
    {
      id: 2,
      name: 'Highlands Coffee',
      image: '🏔️',
      rating: 4.7,
      reviews: 189,
      distance: 2.5,
      priceRange: '$$',
      tags: ['Fast Delivery'],
      discount: null
    },
    {
      id: 3,
      name: 'Phúc Long Coffee & Tea',
      image: '🍵',
      rating: 4.9,
      reviews: 312,
      distance: 0.8,
      priceRange: '$',
      tags: ['Best Seller'],
      discount: '15% OFF'
    },
    {
      id: 4,
      name: 'Starbucks Reserve',
      image: '⭐',
      rating: 4.6,
      reviews: 567,
      distance: 3.2,
      priceRange: '$$$',
      tags: ['Premium'],
      discount: null
    }
  ];

  const popularDrinks = [
    { name: 'Espresso', emoji: '☕', orders: '2.5K' },
    { name: 'Cappuccino', emoji: '🥤', orders: '3.2K' },
    { name: 'Latte', emoji: '🍵', orders: '4.1K' },
    { name: 'Americano', emoji: '☕', orders: '1.8K' },
    { name: 'Macchiato', emoji: '🥛', orders: '1.5K' },
    { name: 'Mocha', emoji: '🍫', orders: '2.9K' }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Get your coffee in 15-30 minutes'
    },
    {
      icon: Award,
      title: 'Quality Guaranteed',
      description: 'Only the best coffee shops'
    },
    {
      icon: Gift,
      title: 'Special Offers',
      description: 'Daily deals and discounts'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join 10K+ coffee lovers'
    }
  ];

  const stats = [
    { value: '50+', label: 'Coffee Shops' },
    { value: '10K+', label: 'Happy Customers' },
    { value: '25K+', label: 'Orders Delivered' },
    { value: '4.8', label: 'Average Rating' }
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <TrendingUp size={16} />
              <span>50+ Coffee Shops Available</span>
            </div>
            <h1 className="hero-title">
              Find Your Perfect
              <span className="highlight"> Coffee </span>
              Experience
            </h1>
            <p className="hero-description">
              Discover the best coffee shops near you. Order your favorite drinks 
              and get them delivered fresh to your doorstep.
            </p>
            
            <div className="hero-search">
              <div className="search-input-group">
                <MapPin className="input-icon" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter your location..."
                  className="location-input"
                />
              </div>
              {/* <button 
                className="search-btn"
                onClick={() => navigate('/user/search')}
              >
                <Search size={20} />
                <span>Find Shops</span>
              </button> */}
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <ThumbsUp size={18} />
                <span>4.8/5 Rating</span>
              </div>
              <div className="stat-divider">•</div>
              <div className="stat-item">
                <Users size={18} />
                <span>10K+ Users</span>
              </div>
              <div className="stat-divider">•</div>
              <div className="stat-item">
                <Award size={18} />
                <span>Best Quality</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-card floating">
              <div className="card-emoji">☕</div>
              <div className="card-content">
                <h4>Hot Latte</h4>
                <div className="card-rating">
                  <Star size={14} fill="currentColor" />
                  <span>4.9</span>
                </div>
              </div>
            </div>
            <div className="hero-card floating" style={{animationDelay: '0.5s'}}>
              <div className="card-emoji">🍵</div>
              <div className="card-content">
                <h4>Green Tea</h4>
                <div className="card-rating">
                  <Star size={14} fill="currentColor" />
                  <span>4.7</span>
                </div>
              </div>
            </div>
            <div className="hero-card floating" style={{animationDelay: '1s'}}>
              <div className="card-emoji">🥤</div>
              <div className="card-content">
                <h4>Iced Coffee</h4>
                <div className="card-rating">
                  <Star size={14} fill="currentColor" />
                  <span>4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="popular-drinks-section">
        <div className="section-header">
          <h2 className="section-title">Popular Drinks</h2>
          <p className="section-subtitle">Most ordered this week</p>
        </div>
        <div className="drinks-grid">
          {popularDrinks.map((drink, index) => (
            <div key={index} className="drink-card">
              <div className="drink-emoji">{drink.emoji}</div>
              <h4 className="drink-name">{drink.name}</h4>
              <p className="drink-orders">{drink.orders} orders</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Coffee Shops</h2>
            <p className="section-subtitle">Top rated shops near you</p>
          </div>
          <button 
            className="view-all-btn"
            onClick={() => navigate('/user/search')}
          >
            View All
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="shops-grid">
          {featuredShops.map((shop) => (
            <div key={shop.id} className="shop-card-home">
              {shop.discount && (
                <div className="discount-badge">{shop.discount}</div>
              )}
              
              <div className="shop-image-home">
                <div className="shop-emoji-home">{shop.image}</div>
              </div>

              <div className="shop-info-home">
                <h3 className="shop-name-home">{shop.name}</h3>
                
                <div className="shop-meta-home">
                  <div className="meta-rating">
                    <Star size={14} fill="currentColor" />
                    <span>{shop.rating}</span>
                    <span className="reviews">({shop.reviews})</span>
                  </div>
                  <div className="meta-distance">
                    <MapPin size={14} />
                    <span>{shop.distance} km</span>
                  </div>
                </div>

                <div className="shop-tags-home">
                  {shop.tags.map((tag, idx) => (
                    <span key={idx} className="tag-home">{tag}</span>
                  ))}
                  <span className="price-range-home">{shop.priceRange}</span>
                </div>

                <button className="order-btn">
                  Order Now
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <div className="section-header centered">
          <h2 className="section-title">Why Choose Caffinder?</h2>
          <p className="section-subtitle">Experience the best coffee delivery service</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <Icon size={28} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <Coffee className="cta-icon" size={48} />
          <h2 className="cta-title">Ready to Order?</h2>
          <p className="cta-description">
            Join thousands of coffee lovers and get your favorite drinks delivered today
          </p>
          <div className="cta-buttons">
            <button 
              className="cta-btn primary"
              onClick={() => navigate('/user/search')}
            >
              <Search size={20} />
              <span>Find Coffee Shops</span>
            </button>
            <button 
              className="cta-btn secondary"
              onClick={() => navigate('/user/favorites')}
            >
              <Heart size={20} />
              <span>View Favorites</span>
            </button>
          </div>
        </div>
      </section>

      <section className="app-promo-section">
        <div className="promo-content">
          <div className="promo-text">
            <h2 className="promo-title">Get the App</h2>
            <p className="promo-description">
              Download our mobile app for exclusive deals and faster ordering
            </p>
            <div className="app-badges">
              <div className="app-badge">📱 App Store</div>
              <div className="app-badge">🤖 Google Play</div>
            </div>
          </div>
          <div className="promo-image">
            <div className="phone-mockup">📱</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;