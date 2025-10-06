import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Result403Props {
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode;
  onBackHome?: () => void;
}

const Result403: React.FC<Result403Props> = ({ 
  title = "403",
  subTitle = "Xin lỗi, bạn không có quyền truy cập trang này.",
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
      status="403"
      title={title}
      subTitle={subTitle}
      extra={extra || defaultExtra}
    />
  );
};

export default Result403;