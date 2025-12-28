import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Facebook, Instagram, Twitter } from 'lucide-react';
import { message } from 'antd';
import './style.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: 'Điện Thoại',
      content: '+84 123 456 789',
      link: 'tel:+84123456789'
    },
    {
      icon: <Mail size={24} />,
      title: 'Email',
      content: 'contact@coffeebooking.vn',
      link: 'mailto:contact@coffeebooking.vn'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Địa Chỉ',
      content: '123 Đường Lê Lợi, Quận 1, TP.HCM',
      link: 'https://maps.google.com'
    },
    {
      icon: <Clock size={24} />,
      title: 'Giờ Làm Việc',
      content: 'T2 - T7: 8:00 - 22:00',
      link: null
    }
  ];

  const faqs = [
    {
      question: 'Làm thế nào để đặt bàn?',
      answer: 'Bạn chỉ cần tìm kiếm quán cà phê yêu thích, chọn thời gian và số người, sau đó xác nhận đặt bàn.'
    },
    {
      question: 'Tôi có thể hủy đặt bàn không?',
      answer: 'Có, bạn có thể hủy đặt bàn trước 2 giờ so với thời gian đã đặt mà không mất phí.'
    },
    {
      question: 'Có mất phí đặt bàn không?',
      answer: 'Không, việc đặt bàn qua nền tảng của chúng tôi hoàn toàn miễn phí.'
    },
    {
      question: 'Làm sao để trở thành đối tác?',
      answer: 'Vui lòng liên hệ với chúng tôi qua form dưới đây hoặc email để được tư vấn chi tiết.'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      message.warning('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      message.success('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      message.error('Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Liên Hệ Với Chúng Tôi</h1>
          <p className="hero-subtitle">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
          <div className="hero-icon">
            <MessageCircle size={64} />
          </div>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-info-card">
                <div className="info-icon">{info.icon}</div>
                <h3 className="info-title">{info.title}</h3>
                {info.link ? (
                  <a href={info.link} className="info-content">
                    {info.content}
                  </a>
                ) : (
                  <p className="info-content">{info.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container">
          <div className="contact-grid">
            <div className="form-container">
              <div className="form-header">
                <h2 className="form-title">Gửi Tin Nhắn</h2>
                <p className="form-subtitle">
                  Điền thông tin bên dưới và chúng tôi sẽ liên hệ với bạn sớm nhất
                </p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Họ và tên *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123 456 789"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Chủ đề</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Tiêu đề tin nhắn"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="message">Tin nhắn *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Nội dung tin nhắn của bạn..."
                    rows={6}
                    required
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  <Send size={20} />
                  {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                </button>
              </form>
            </div>

            <div className="map-container">
              <div className="map-wrapper">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4857385021455!2d106.69522631533417!3d10.776889192319842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc1%3A0xb3ff69197b10ec4f!2zMTIzIMSQLiBMw6ogTOG7o2ksIEJhzIHMgW4gTmdo4buHLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0!3m2!1sen!2s!4v1234567890"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Office Location"
                />
              </div>

              <div className="social-section">
                <h3 className="social-title">Kết Nối Với Chúng Tôi</h3>
                <div className="social-links">
                  <a href="#facebook" className="social-link facebook">
                    <Facebook size={24} />
                  </a>
                  <a href="#instagram" className="social-link instagram">
                    <Instagram size={24} />
                  </a>
                  <a href="#twitter" className="social-link twitter">
                    <Twitter size={24} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Câu Hỏi Thường Gặp</h2>
          <p className="section-subtitle">
            Những câu hỏi phổ biến từ khách hàng
          </p>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Bạn Là Chủ Quán Cà Phê?</h2>
            <p className="cta-text">
              Hợp tác cùng chúng tôi để tiếp cận hàng nghìn khách hàng tiềm năng
            </p>
            <button className="cta-button">
              Đăng Ký Đối Tác Ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;