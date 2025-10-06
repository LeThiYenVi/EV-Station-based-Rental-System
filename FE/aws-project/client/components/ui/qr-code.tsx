import React, { useState } from 'react';
import { CheckCircleFilled, CloseCircleFilled, ReloadOutlined, QrcodeOutlined } from '@ant-design/icons';
import type { QRCodeProps } from 'antd';
import { Button, Flex, QRCode, Space, Spin, Card, Typography, Input } from 'antd';

const { Title, Paragraph } = Typography;

export interface QRCodeComponentProps {
  value?: string;
  status?: 'active' | 'expired' | 'loading' | 'scanned';
  size?: number;
  icon?: string;
  iconSize?: number;
  bordered?: boolean;
  errorLevel?: 'L' | 'M' | 'Q' | 'H';
  color?: string;
  bgColor?: string;
  onRefresh?: () => void;
  statusRender?: QRCodeProps['statusRender'];
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  value = 'https://bf-car-rental.com',
  status = 'active',
  size = 160,
  icon,
  iconSize = size / 4,
  bordered = true,
  errorLevel = 'M',
  color = '#000000',
  bgColor = '#FFFFFF',
  onRefresh,
  statusRender
}) => {
  const [qrStatus, setQrStatus] = useState<'active' | 'expired' | 'loading' | 'scanned'>(status);

  const customStatusRender: QRCodeProps['statusRender'] = (info) => {
    if (statusRender) {
      return statusRender(info);
    }

    switch (info.status) {
      case 'expired':
        return (
          <div className="text-center">
            <CloseCircleFilled style={{ color: 'red', fontSize: '24px' }} />
            <p className="mt-2 text-red-600">QR Code đã hết hạn</p>
            <Button 
              type="link" 
              onClick={onRefresh || info.onRefresh}
              className="text-blue-600"
            >
              <ReloadOutlined /> Làm mới
            </Button>
          </div>
        );
      case 'loading':
        return (
          <Space direction="vertical" className="text-center">
            <Spin size="large" />
            <p className="text-gray-600">Đang tạo QR Code...</p>
          </Space>
        );
      case 'scanned':
        return (
          <div className="text-center">
            <CheckCircleFilled style={{ color: 'green', fontSize: '24px' }} />
            <p className="mt-2 text-green-600">Đã quét thành công</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <QRCode
      value={value}
      status={qrStatus}
      size={size}
      icon={icon}
      iconSize={iconSize}
      bordered={bordered}
      errorLevel={errorLevel}
      color={color}
      bgColor={bgColor}
      onRefresh={() => {
        setQrStatus('loading');
        setTimeout(() => setQrStatus('active'), 1000);
        onRefresh?.();
      }}
      statusRender={customStatusRender}
    />
  );
};

// Component QR Code đơn giản theo mẫu gốc
export const SimpleQRCode: React.FC = () => {
  const value = 'https://ant.design';

  const customStatusRender: QRCodeProps['statusRender'] = (info) => {
    switch (info.status) {
      case 'expired':
        return (
          <div>
            <CloseCircleFilled style={{ color: 'red' }} /> {info.locale?.expired}
            <p>
              <Button type="link" onClick={info.onRefresh}>
                <ReloadOutlined /> {info.locale?.refresh}
              </Button>
            </p>
          </div>
        );
      case 'loading':
        return (
          <Space direction="vertical">
            <Spin />
            <p>Loading...</p>
          </Space>
        );
      case 'scanned':
        return (
          <div>
            <CheckCircleFilled style={{ color: 'green' }} /> {info.locale?.scanned}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Flex gap="middle" wrap>
      <QRCode value={value} status="loading" statusRender={customStatusRender} />
      <QRCode
        value={value}
        status="expired"
        onRefresh={() => console.log('refresh')}
        statusRender={customStatusRender}
      />
      <QRCode value={value} status="scanned" statusRender={customStatusRender} />
    </Flex>
  );
};

// Component QR Code cho đặt xe
export const BookingQRCode: React.FC<{
  bookingId?: string;
  customerInfo?: {
    name: string;
    phone: string;
    car: string;
  };
}> = ({ 
  bookingId = 'BF2025091512345',
  customerInfo = {
    name: 'Nguyễn Văn A',
    phone: '0123456789',
    car: 'Toyota Camry'
  }
}) => {
  const qrValue = JSON.stringify({
    bookingId,
    customerInfo,
    timestamp: new Date().toISOString(),
    service: 'BF Car Rental'
  });

  return (
    <Card title="QR Code Đặt Xe" className="text-center">
      <div className="mb-4">
        <QRCodeComponent
          value={qrValue}
          size={200}
        />
      </div>
      <div className="text-left">
        <Paragraph>
          <strong>Mã đặt xe:</strong> {bookingId}
        </Paragraph>
        <Paragraph>
          <strong>Khách hàng:</strong> {customerInfo.name}
        </Paragraph>
        <Paragraph>
          <strong>Xe:</strong> {customerInfo.car}
        </Paragraph>
        <Paragraph className="text-sm text-gray-600">
          Vui lòng xuất trình QR Code này khi nhận xe
        </Paragraph>
      </div>
    </Card>
  );
};

// Component QR Code với URL tùy chỉnh
export const CustomUrlQRCode: React.FC = () => {
  const [url, setUrl] = useState('https://bf-car-rental.com');
  const [qrValue, setQrValue] = useState(url);

  const handleGenerate = () => {
    setQrValue(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <Title level={5}>Tạo QR Code tùy chỉnh</Title>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Nhập URL hoặc text"
          />
          <Button type="primary" onClick={handleGenerate}>
            Tạo QR
          </Button>
        </Space.Compact>
      </div>
      <div className="text-center">
        <QRCodeComponent value={qrValue} />
      </div>
    </div>
  );
};

// Component QR Code với nhiều trạng thái
export const MultiStatusQRCode: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<'active' | 'expired' | 'loading' | 'scanned'>('active');

  const handleStatusChange = (status: 'active' | 'expired' | 'loading' | 'scanned') => {
    setCurrentStatus(status);
    if (status === 'loading') {
      setTimeout(() => setCurrentStatus('active'), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Title level={5}>QR Code với các trạng thái</Title>
        <Space wrap>
          <Button onClick={() => handleStatusChange('active')}>
            Hoạt động
          </Button>
          <Button onClick={() => handleStatusChange('loading')}>
            Đang tải
          </Button>
          <Button onClick={() => handleStatusChange('expired')}>
            Hết hạn
          </Button>
          <Button onClick={() => handleStatusChange('scanned')}>
            Đã quét
          </Button>
        </Space>
      </div>
      <div className="text-center">
        <QRCodeComponent 
          value="https://bf-car-rental.com"
          status={currentStatus}
        />
      </div>
    </div>
  );
};

export default QRCodeComponent;