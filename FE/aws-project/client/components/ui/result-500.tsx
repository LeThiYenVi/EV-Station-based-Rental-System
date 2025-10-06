import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Result500Props {
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode;
  onBackHome?: () => void;
}

const Result500: React.FC<Result500Props> = ({ 
  title = "500",
  subTitle = "Xin lỗi, đã có lỗi xảy ra từ phía server.",
  extra,
  onBackHome
}) => {
  const navigate = useNavigate();

  const defaultExtra = (
    <Button 
      type="primary" 
      onClick={onBackHome || (() => navigate('/'))}
      className="bg-red-600 hover:bg-red-700 border-red-600"
    >
      Quay về trang chủ
    </Button>
  );

  return (
    <Result
      status="500"
      title={title}
      subTitle={subTitle}
      extra={extra || defaultExtra}
    />
  );
};

export default Result500;