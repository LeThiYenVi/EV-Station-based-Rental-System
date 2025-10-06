import { Phone, Mail, MapPin, Target, Award, Car, Shield, Clock, Star, CheckCircle, Heart, Users, TrendingUp, Zap, Globe } from "lucide-react";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>BF Car Rental</h1>
          <p>
            Đối tác đáng tin cậy cho mọi hành trình của bạn. 
            Với hơn 5 năm kinh nghiệm, chúng tôi cam kết mang đến 
            dịch vụ cho thuê xe chất lượng cao và an toàn nhất.
          </p>
          
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">10,000+</span>
              <span className="hero-stat-label">Khách hàng tin tưởng</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">200+</span>
              <span className="hero-stat-label">Xe đa dạng</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">4.9/5</span>
              <span className="hero-stat-label">Đánh giá trung bình</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">24/7</span>
              <span className="hero-stat-label">Hỗ trợ khách hàng</span>
            </div>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="company-section">
        <div className="company-content">
          <div className="company-text">
            <h2>
              Công ty Cổ phần Thương mại và Dịch vụ{" "}
              <span className="highlight">Green Future</span>
            </h2>
            <p>
              Được thành lập với sứ mệnh cung cấp dịch vụ cho thuê xe chuyên nghiệp 
              và đáng tin cậy, BF Car Rental đã phục vụ hàng nghìn khách hàng trên 
              khắp Việt Nam với cam kết về chất lượng và sự hài lòng.
            </p>

            <div className="company-info">
              <div className="info-card">
                <h3>
                  <MapPin className="info-icon" />
                  Địa chỉ
                </h3>
                <p>
                  Tòa Symphony, Chu Huy Mân, Vinhomes Riverside, 
                  Long Biên, Hà Nội, Việt Nam
                </p>
              </div>

              <div className="info-card">
                <h3>
                  <Phone className="info-icon" />
                  Hotline
                </h3>
                <p>1900 1877 | 0896 229 555</p>
              </div>

              <div className="info-card">
                <h3>
                  <Mail className="info-icon" />
                  Email
                </h3>
                <p>support@greenfuture.tech</p>
              </div>
            </div>
          </div>

          <div className="company-image">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop&crop=center" 
              alt="BF Car Rental Office"
              className="company-main-image"
            />
            <div className="floating-card">
              <h4>Đánh giá khách hàng</h4>
              <div className="rating">4.9/5</div>
              <div className="stars">⭐⭐⭐⭐⭐</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company History & Milestones */}
      <section className="company-history">
        <div className="container">
          <div className="history-content">
            <div className="history-header">
              <h2>Hành trình phát triển</h2>
              <p>Từ một startup nhỏ đến thương hiệu cho thuê xe hàng đầu Việt Nam</p>
            </div>
            
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-year">2020</div>
                <div className="timeline-content">
                  <h3>Khởi nghiệp</h3>
                  <p>Thành lập công ty với 5 xe đầu tiên và đội ngũ 3 người. Khởi đầu từ dịch vụ đưa đón sân bay tại Hà Nội.</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-year">2021</div>
                <div className="timeline-content">
                  <h3>Mở rộng đội xe</h3>
                  <p>Đạt mốc 50 xe và mở rộng dịch vụ thuê xe tự lái. Thu hút được 1,000 khách hàng đầu tiên.</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-year">2022</div>
                <div className="timeline-content">
                  <h3>Mở rộng toàn quốc</h3>
                  <p>Có mặt tại TP.HCM và Đà Nẵng. Đội xe tăng lên 100 chiếc với đa dạng các loại xe cao cấp.</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-year">2023</div>
                <div className="timeline-content">
                  <h3>Công nghệ 4.0</h3>
                  <p>Ra mắt ứng dụng di động và hệ thống đặt xe trực tuyến. Đạt 5,000 khách hàng thường xuyên.</p>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-year">2024</div>
                <div className="timeline-content">
                  <h3>Thương hiệu uy tín</h3>
                  <p>Đạt 200+ xe và phục vụ hơn 10,000 khách hàng. Nhận giải thưởng "Thương hiệu tin cậy 2024".</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="testimonials-content">
            <h2>Khách hàng nói gì về chúng tôi</h2>
            <p>Những phản hồi chân thực từ khách hàng đã sử dụng dịch vụ</p>
            
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                </div>
                <p className="testimonial-text">
                  "Dịch vụ tuyệt vời! Xe sạch sẽ, tài xế thân thiện và chuyên nghiệp. 
                  Tôi đã sử dụng dịch vụ nhiều lần và luôn hài lòng."
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Nguyễn Văn An</h4>
                    <span>Giám đốc Marketing</span>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                </div>
                <p className="testimonial-text">
                  "Thuê xe đám cưới tại BF Car Rental là quyết định đúng đắn. 
                  Xe đẹp, giá hợp lý và đội ngũ hỗ trợ nhiệt tình."
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Trần Thị Lan</h4>
                    <span>Cô dâu hạnh phúc</span>
                  </div>
                </div>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-rating">
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                  <Star className="star filled" size={20} />
                </div>
                <p className="testimonial-text">
                  "Dịch vụ đưa đón sân bay rất chuyên nghiệp. Tài xế đến đúng giờ, 
                  lái xe an toàn và giá cả phải chăng."
                </p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>Lê Minh Tuấn</h4>
                    <span>Doanh nhân</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2>Dịch vụ của chúng tôi</h2>
        <p>Đa dạng các loại hình dịch vụ cho thuê xe để đáp ứng mọi nhu cầu</p>
        
        <div className="services-grid">
          <div className="service-card">
            <div className="service-image">
              <img 
                src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop&crop=center" 
                alt="Thuê xe có tài"
              />
              <div className="service-price">Từ 800k/ngày</div>
            </div>
            <div className="service-content">
              <h3>Thuê xe có tài</h3>
              <p>Dịch vụ đưa đón sân bay, tour du lịch với tài xế kinh nghiệm và am hiểu địa hình.</p>
              <button className="service-button">Tìm hiểu thêm</button>
            </div>
          </div>

          <div className="service-card">
            <div className="service-image">
              <img 
                src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=300&fit=crop&crop=center" 
                alt="Thuê xe tự lái"
              />
              <div className="service-price">Từ 600k/ngày</div>
            </div>
            <div className="service-content">
              <h3>Thuê xe tự lái</h3>
              <p>Thuê xe đám cưới, du lịch với nhiều mẫu xe cao cấp và hiện đại.</p>
              <button className="service-button">Tìm hiểu thêm</button>
            </div>
          </div>

          <div className="service-card">
            <div className="service-image">
              <img 
                src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop&crop=center" 
                alt="Thuê xe sự kiện"
              />
              <div className="coming-soon-overlay">
                COMING SOON
              </div>
            </div>
            <div className="service-content">
              <h3>Thuê xe sự kiện</h3>
              <p>Phục vụ các sự kiện lớn, hội nghị, tiệc cưới với đội xe chuyên nghiệp.</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-image">
              <img 
                src="https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7c?w=400&h=300&fit=crop&crop=center" 
                alt="Sở hữu xe linh hoạt"
              />
              <div className="coming-soon-overlay">
                COMING SOON
              </div>
            </div>
            <div className="service-content">
              <h3>Sở hữu xe linh hoạt</h3>
              <p>Chương trình thuê dài hạn với quyền lợi đặc biệt và linh hoạt.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Drive. Explore. Inspire */}
      <section className="drive-explore-section">
        <div className="container">
          <div className="drive-explore-content">
            <div className="text-content">
              <h2>Drive. Explore. Inspire</h2>
              <p className="tagline">
                <strong>Cầm lái</strong> và <strong>Khám phá</strong> thế giới đầy <strong>Cảm hứng</strong>.
              </p>
              
              <p className="description">
                BF Car Rental đặt mục tiêu trở thành cộng đồng người dùng ô tô Văn minh & Uy tín #1 
                tại Việt Nam, nhằm mang lại những giá trị thiết thực cho tất cả những thành 
                viên hướng đến một cuộc sống tốt đẹp hơn.
              </p>
              
              <p className="mission">
                Chúng tôi tin rằng mỗi hành trình đều quan trọng, vì vậy đội ngũ và các đối tác 
                của BF Car Rental với nhiều kinh nghiệm về lĩnh vực cho thuê xe, công nghệ, bảo hiểm 
                & du lịch sẽ mang đến cho hành trình của bạn thêm nhiều trải nghiệm mới lạ, 
                thú vị cùng sự an toàn ở mức cao nhất.
              </p>
            </div>
            
            <div className="image-section">
              <div className="main-image-container">
                <img 
                  src="/mocks/aboutus1.4c31a699.png" 
                  alt="Drive and explore beautiful landscapes" 
                  className="hero-landscape-image"
                />
              </div>
              
              {/* <div className="dual-images">
                <div className="left-image">
                  <img 
                    src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop&crop=center" 
                    alt="Woman reading map in car" 
                    className="journey-image"
                  />
                </div>
                <div className="right-image">
                  <img 
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center" 
                    alt="Car dashboard and navigation" 
                    className="journey-image"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: BF Car Rental Journey */}
      <section className="mioto-journey-section">
        <div className="container">
          <div className="mioto-journey-content">
            <div className="journey-image-left">
              <img 
                src="/mocks/aboutus2.18999daf.png" 
                alt="MIOTO - Cùng bạn đến mọi hành trình" 
                className="mioto-journey-image"
              />
            </div>
            
            <div className="journey-text-right">
              <h2>BF Car Rental - Cùng bạn đến mọi hành trình</h2>
              
              <p className="journey-intro">
                Mỗi chuyến đi là một hành trình khám phá cuộc sống và thế giới xung quanh, 
                là cơ hội học hỏi và chinh phục những điều mới lạ của mỗi cá nhân để trở nên tốt hơn. 
                Do đó, chất lượng trải nghiệm của khách hàng là ưu tiên hàng đầu và là nguồn 
                cảm hứng của đội ngũ MIOTO.
              </p>
              
              <p className="journey-mission">
                BF Car Rental là nền tảng chia sẻ ô tô, sứ mệnh của chúng tôi không chỉ dừng lại ở việc 
                kết nối chủ xe và khách hàng một cách <strong>Nhanh chóng - An toàn - Tiện lợi</strong>, 
                mà còn hướng đến việc truyền cảm hứng <strong>KHÁM PHÁ</strong> những điều mới lạ 
                đến cộng đồng qua những chuyến đi trên nền tảng của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bắt đầu ngay hôm nay */}
      <section className="cta-section-new">
        <div className="container">
          <div className="cta-header">
            <h2>Bắt đầu ngay hôm nay</h2>
          </div>
          
          <div className="cta-cards-grid">
            {/* Card 1: Xe tự lái */}
            <div className="cta-card-item">
              <div className="cta-card-image-overlay">
                <img 
                  src="/mocks/gia_thue_xe_tu_lai_4cho_tai_hanoi.e6ebc385.png" 
                  alt="Xe đã sẵn sàng - Bắt đầu hành trình ngay"
                  className="cta-image"
                />
                <div className="cta-overlay-content">
                  <h3>Xe đã sẵn sàng.</h3>
                  <h3>Bắt đầu hành trình ngay!</h3>
                  <p>Tự tay cầm lái chiếc xe bạn yêu thích cho hành trình thêm hứng khởi.</p>
                  <button className="cta-btn primary">
                    Thuê xe tự lái
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Xe có tài xế */}
            <div className="cta-card-item">
              <div style={{ marginTop: "65px" }} className="cta-card-image-overlay">
                <img 
                  src="/mocks/thue_xe_oto_tu_lai_va_co_tai.9df79c9f.png" 
                  alt="Tài xế của bạn đã đến"
                  className="cta-image"
                />
                <div className="cta-overlay-content">
                  <h3 style={{ marginLeft: "198px" }}>Tài xế của bạn đã đến!</h3>
                  <p style={{ marginLeft: "230px" }}>Chuyến đi thêm thú vị cùng các tài xế.</p>
                  <button style={{ marginLeft: "320px" }} className="cta-btn secondary">
                    Thuê xe có tài xế
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}