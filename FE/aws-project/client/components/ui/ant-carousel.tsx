import React from 'react';
import { Carousel } from 'antd';

export interface AntCarouselProps {
  autoplay?: boolean;
  autoplaySpeed?: number;
  dots?: boolean;
  dotPosition?: 'top' | 'bottom' | 'left' | 'right';
  effect?: 'scrollx' | 'fade';
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  children?: React.ReactNode;
  customSlides?: Array<{
    content: React.ReactNode;
    key?: string;
  }>;
}

const AntCarousel: React.FC<AntCarouselProps> = ({
  autoplay = true,
  autoplaySpeed = 3000,
  dots = true,
  dotPosition = 'bottom',
  effect = 'scrollx',
  infinite = true,
  speed = 500,
  slidesToShow = 1,
  slidesToScroll = 1,
  children,
  customSlides
}) => {
  const contentStyle: React.CSSProperties = {
    height: '300px',
    color: '#fff',
    lineHeight: '300px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '8px',
    fontSize: '24px',
    fontWeight: 'bold',
  };

  const defaultSlides = [
    {
      key: '1',
      content: <h3 style={contentStyle}>Thuê xe sedan cao cấp</h3>
    },
    {
      key: '2', 
      content: <h3 style={{...contentStyle, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>Thuê xe SUV 7 chỗ</h3>
    },
    {
      key: '3',
      content: <h3 style={{...contentStyle, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>Thuê xe tự lái</h3>
    },
    {
      key: '4',
      content: <h3 style={{...contentStyle, background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>Dịch vụ có tài xế</h3>
    }
  ];

  const slides = customSlides || defaultSlides;

  return (
    <Carousel
      autoplay={autoplay}
      autoplaySpeed={autoplaySpeed}
      dots={dots}
      dotPosition={dotPosition}
      effect={effect}
      infinite={infinite}
      speed={speed}
      slidesToShow={slidesToShow}
      slidesToScroll={slidesToScroll}
    >
      {children ? children : slides.map((slide, index) => (
        <div key={slide.key || index}>
          {slide.content}
        </div>
      ))}
    </Carousel>
  );
};

// Component Carousel đơn giản theo mẫu gốc
export const SimpleAntCarousel: React.FC = () => {
  const contentStyle: React.CSSProperties = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };

  return (
    <Carousel autoplay autoplaySpeed={5000}>
      <div>
        <h3 style={contentStyle}>1</h3>
      </div>
      <div>
        <h3 style={contentStyle}>2</h3>
      </div>
      <div>
        <h3 style={contentStyle}>3</h3>
      </div>
      <div>
        <h3 style={contentStyle}>4</h3>
      </div>
    </Carousel>
  );
};

// Component Carousel cho hình ảnh xe
export const CarImageCarousel: React.FC<{
  images?: string[];
  height?: string;
}> = ({ 
  images = [], 
  height = '400px' 
}) => {
  const defaultImages = [
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];

  const imageList = images.length > 0 ? images : defaultImages;

  const imageStyle: React.CSSProperties = {
    height,
    width: '100%',
    objectFit: 'cover',
    borderRadius: '8px',
  };

  return (
    <Carousel autoplay autoplaySpeed={4000} dots>
      {imageList.map((image, index) => (
        <div key={index}>
          <div style={{ padding: '0 4px' }}>
            <img 
              src={image} 
              alt={`Car ${index + 1}`}
              style={imageStyle}
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      ))}
    </Carousel>
  );
};

// Component Carousel với fade effect
export const FadeCarousel: React.FC<{ 
  slides?: Array<{
    title: string;
    description: string;
    background: string;
  }>;
}> = ({ slides }) => {
  const defaultSlides = [
    {
      title: 'BF Car Rental',
      description: 'Dịch vụ thuê xe hàng đầu Việt Nam',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      title: 'Xe chất lượng cao',
      description: 'Đội xe đa dạng, được bảo dưỡng định kỳ',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      title: 'Giá cả hợp lý',
      description: 'Cam kết giá tốt nhất thị trường',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  const slideData = slides || defaultSlides;

  const slideStyle: React.CSSProperties = {
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    textAlign: 'center',
    borderRadius: '8px',
    padding: '40px',
  };

  return (
    <Carousel autoplay autoplaySpeed={5000} effect="fade">
      {slideData.map((slide, index) => (
        <div key={index}>
          <div style={{...slideStyle, background: slide.background}}>
            <div>
              <h2 style={{ fontSize: '32px', marginBottom: '16px', margin: 0 }}>
                {slide.title}
              </h2>
              <p style={{ fontSize: '18px', margin: 0, opacity: 0.9 }}>
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default AntCarousel;