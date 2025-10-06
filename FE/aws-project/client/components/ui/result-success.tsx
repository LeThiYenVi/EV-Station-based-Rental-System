import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface SuccessResultProps {
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode[];
  onGoConsole?: () => void;
  onBuyAgain?: () => void;
}

const SuccessResult: React.FC<SuccessResultProps> = ({ 
  title = "Đặt xe thành công!",
  subTitle = "Mã đơn hàng: BF2025091512345. Chúng tôi sẽ liên hệ với bạn trong vòng 5-10 phút để xác nhận thông tin.",
  extra,
  onGoConsole,
  onBuyAgain
}) => {
  const navigate = useNavigate();

  const defaultExtra = [
    <Button 
      type="primary" 
      key="console"
      onClick={onGoConsole || (() => navigate('/dashboard'))}
      className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
    >
      Xem đơn hàng
    </Button>,
    <Button 
      key="buy" 
      onClick={onBuyAgain || (() => navigate('/'))}
    >
      Đặt xe khác
    </Button>,
  ];

  return (
    <Result
      status="success"
      title={title}
      subTitle={subTitle}
      extra={extra || defaultExtra}
    />
  );
};

export default SuccessResult;