import React from 'react';
import { Coffee, Heart, Users, Award, Clock, MapPin, Shield, Star } from 'lucide-react';
import './style.css';

function AboutUs() {
  const stats = [
    { icon: <Coffee size={32} />, value: '500+', label: 'Quán Cà Phê' },
    { icon: <Users size={32} />, value: '50K+', label: 'Khách Hàng' },
    { icon: <Award size={32} />, value: '100+', label: 'Giải Thưởng' },
    { icon: <Heart size={32} />, value: '99%', label: 'Hài Lòng' }
  ];

  const values = [
    {
      icon: <Shield size={28} />,
      title: 'Chất Lượng',
      description: 'Cam kết mang đến những quán cà phê chất lượng cao, được kiểm duyệt kỹ lưỡng'
    },
    {
      icon: <Clock size={28} />,
      title: 'Tiện Lợi',
      description: 'Đặt bàn nhanh chóng, dễ dàng chỉ với vài thao tác đơn giản'
    },
    {
      icon: <Star size={28} />,
      title: 'Trải Nghiệm',
      description: 'Khám phá không gian cà phê độc đáo, phù hợp với mọi sở thích'
    },
    {
      icon: <MapPin size={28} />,
      title: 'Đa Dạng',
      description: 'Hàng trăm quán cà phê trên khắp cả nước, phong cách đa dạng'
    }
  ];

  const team = [
    {
      name: 'Nguyễn Văn A',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      description: 'Người sáng lập với tầm nhìn kết nối yêu thích cà phê'
    },
    {
      name: 'Trần Thị B',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      description: 'Chuyên gia vận hành với 10 năm kinh nghiệm'
    },
    {
      name: 'Lê Văn C',
      role: 'Tech Lead',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      description: 'Kiến trúc sư công nghệ đằng sau nền tảng'
    },
    {
      name: 'Phạm Thị D',
      role: 'Customer Success',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      description: 'Chăm sóc khách hàng tận tâm, nhiệt huyết'
    }
  ];

  return (
    <div className="aboutus-page">
      <section className="aboutus-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Về Chúng Tôi</h1>
          <p className="hero-subtitle">
            Kết nối những người yêu cà phê với những không gian tuyệt vời
          </p>
          <div className="hero-coffee-icon">
            <Coffee size={64} />
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800" 
                alt="Coffee Story"
              />
            </div>
            <div className="story-content">
              <h2 className="section-title">Câu Chuyện Của Chúng Tôi</h2>
              <p className="story-text">
                Được thành lập vào năm 2020, chúng tôi bắt đầu từ một ý tưởng đơn giản: 
                làm thế nào để giúp mọi người dễ dàng tìm kiếm và đặt chỗ tại những quán 
                cà phê yêu thích của họ?
              </p>
              <p className="story-text">
                Ngày nay, chúng tôi tự hào là nền tảng đặt bàn cà phê hàng đầu, kết nối 
                hàng nghìn khách hàng với hàng trăm quán cà phê độc đáo trên khắp cả nước. 
                Sứ mệnh của chúng tôi là tạo ra những trải nghiệm cà phê tuyệt vời cho 
                tất cả mọi người.
              </p>
              <p className="story-text">
                Chúng tôi tin rằng mỗi tách cà phê không chỉ là một thức uống, mà là một 
                trải nghiệm, một khoảnh khắc để thư giãn, kết nối và sáng tạo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <h2 className="section-title center">Giá Trị Cốt Lõi</h2>
          <p className="section-subtitle center">
            Những nguyên tắc định hướng mọi quyết định và hành động của chúng tôi
          </p>
          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3 className="value-title">{value.title}</h3>
                <p className="value-description">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2 className="section-title center">Đội Ngũ Của Chúng Tôi</h2>
          <p className="section-subtitle center">
            Những con người tài năng và nhiệt huyết đằng sau sự thành công
          </p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image">
                  <img src={member.image} alt={member.name} />
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <p className="team-description">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Sẵn Sàng Khám Phá?</h2>
            <p className="cta-text">
              Tham gia cùng hàng nghìn người yêu cà phê và khám phá những không gian tuyệt vời
            </p>
            <div className="cta-buttons">
              <button className="cta-btn primary">
                <Coffee size={20} />
                Khám Phá Ngay
              </button>
              <button className="cta-btn secondary">
                Đăng Ký Đối Tác
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;