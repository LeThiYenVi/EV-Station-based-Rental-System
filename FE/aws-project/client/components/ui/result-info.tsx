import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface InfoResultProps {
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode;
  onGoConsole?: () => void;
}

const InfoResult: React.FC<InfoResultProps> = ({ 
  title = "Thao tác của bạn đã được thực hiện",
  subTitle,
  extra,
  onGoConsole
}) => {
  const navigate = useNavigate();

  const defaultExtra = (
    <Button 
      type="primary" 
      key="console"
      onClick={onGoConsole || (() => navigate('/dashboard'))}
      className="bg-blue-600 hover:bg-blue-700 border-blue-600"
    >
      Quay lại trang chủ
    </Button>
  );

  return (
    <Result
      title={title}
      subTitle={subTitle}
      extra={extra || defaultExtra}
    />
  );
};

export default InfoResult;