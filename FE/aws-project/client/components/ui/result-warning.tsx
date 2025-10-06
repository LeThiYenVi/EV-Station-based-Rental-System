import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface WarningResultProps {
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode;
  onGoConsole?: () => void;
}

const WarningResult: React.FC<WarningResultProps> = ({ 
  title = "Có một số vấn đề với thao tác của bạn",
  subTitle = "Vui lòng kiểm tra lại thông tin và thử lại.",
  extra,
  onGoConsole
}) => {
  const navigate = useNavigate();

  const defaultExtra = (
    <Button 
      type="primary" 
      key="console"
      onClick={onGoConsole || (() => navigate('/'))}
      className="bg-orange-600 hover:bg-orange-700 border-orange-600"
    >
      Thử lại
    </Button>
  );

  return (
    <Result
      status="warning"
      title={title}
      subTitle={subTitle}
      extra={extra || defaultExtra}
    />
  );
};

export default WarningResult;