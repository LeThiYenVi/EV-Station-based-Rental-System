import { Link } from "react-router-dom";
import { Phone, Mail, Facebook, Youtube, MessageCircle } from "lucide-react";
import "./footer.css";

export function Footer() {
  return (
    <footer className="footer-container">
      <div className="container footer-content">
        <div className="footer-grid">
          {/* Logo and Contact Info */}
          <div className="footer-company">
            <div className="footer-logo">
              <svg viewBox="0 0 120 40" className="footer-logo-svg">
                <rect x="0" y="8" width="30" height="24" rx="4" fill="#4ade80"/>
                <rect x="35" y="8" width="30" height="24" rx="4" fill="#4ade80"/>
                <text x="75" y="20" fontSize="18" fontWeight="bold" fill="#1a1a1a">BF Car Rental</text>
              </svg>
            </div>
            
            <div className="footer-contact-info">
              <div className="footer-hotline">
                <strong>1900 9217</strong>
              </div>
              <div className="footer-hours">
                Tổng đài hỗ trợ: 7AM - 10PM
              </div>
              
              <div className="footer-email">
                <strong>contact@BF Car Rental.vn</strong>
              </div>
              <div className="footer-email-desc">
                Gửi mail cho BF Car Rental
              </div>
            </div>
            
            <div className="footer-social-icons">
              <a href="#" className="footer-social-icon facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="footer-social-icon youtube">
                <Youtube size={20} />
              </a>
              <a href="#" className="footer-social-icon zalo">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Chính Sách */}
          <div className="footer-section">
            <h3 className="footer-section-title">Chính Sách</h3>
            <ul className="footer-links">
              <li><Link to="/policy/rules" className="footer-link">Chính sách & quy định</Link></li>
              <li><Link to="/policy/operation" className="footer-link">Quy chế hoạt động</Link></li>
              <li><Link to="/policy/insurance" className="footer-link">Chính sách bảo mật</Link></li>
              <li><Link to="/policy/dispute" className="footer-link">Giải quyết khiếu nại</Link></li>
            </ul>
          </div>

          {/* Tìm Hiểu Thêm */}
          <div className="footer-section">
            <h3 className="footer-section-title">Tìm Hiểu Thêm</h3>
            <ul className="footer-links">
              <li><Link to="/guide/certificate" className="footer-link">Hướng dẫn chung</Link></li>
              <li><Link to="/guide/booking" className="footer-link">Hướng dẫn đặt xe</Link></li>
              <li><Link to="/guide/payment" className="footer-link">Hướng dẫn thanh toán</Link></li>
              <li><Link to="/guide/faq" className="footer-link">Hỏi và trả lời</Link></li>
            </ul>
          </div>

          {/* Đối Tác */}
          <div className="footer-section">
            <h3 className="footer-section-title">Đối Tác</h3>
            <ul className="footer-links">
              <li><Link to="/about" className="footer-link">Về BF Car Rental</Link></li>
              <li><Link to="/blog" className="footer-link">BF Car Rental Blog</Link></li>
              <li><Link to="/recruitment" className="footer-link">Tuyển dụng</Link></li>
              <li><Link to="/register/owner" className="footer-link">Đăng ký chủ xe BF Car Rental</Link></li>
              <li><Link to="/register/gps" className="footer-link">Đăng ký GPS MITRACK 4G</Link></li>
              <li><Link to="/register/longterm" className="footer-link">Đăng ký cho thuê xe dài hạn MICAR</Link></li>
            </ul>
          </div>
        </div>

        {/* Company Registration Info */}
        <div className="footer-registration">
          <div className="footer-reg-row">
            <span>© Công ty Cổ phần BF Car Rental Asia</span>
            <span>Số GCNĐKDN: 0317307544</span>
            <span>Ngày cấp: 24-05-22</span>
            <span>Nơi cấp: Sở kế hoạch và Đầu tư TP.HCM</span>
          </div>
          
          <div className="footer-reg-row">
            <span>Địa chỉ: Văn phòng 01, Tầng 09, Tòa nhà Pearl Plaza, Số 561A Điện Biên Phủ, Phường Thanh Mỹ Tây, Thành phố Hồ Chí Minh, Việt Nam.</span>
          </div>
          
          <div className="footer-reg-row">
            <span>Tên TK: CT CP BF Car Rental ASIA</span>
            <span>Số TK: 102-989-1989</span>
            <span>Ngân hàng Vietcombank - CN Tân Định</span>
          </div>
        </div>

        {/* Payment Methods and Certification */}
        <div className="footer-bottom">
          <div className="footer-certification">
            <div className="footer-cert-badge">
              <img 
                src="/mocks/bocongthuong.png" 
                alt="Đã đăng ký Bộ Công Thương" 
                className="footer-cert-image"
              />
            </div>
          </div>
          
          <div className="footer-payment-methods">
            <img 
              src="/mocks/thanhtoan.png" 
              alt="Phương thức thanh toán" 
              className="footer-payment-image"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
