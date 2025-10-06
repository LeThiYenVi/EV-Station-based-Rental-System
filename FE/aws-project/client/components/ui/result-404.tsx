import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface Result404Props {
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode;
  onBackHome?: () => void;
}

const Result404: React.FC<Result404Props> = ({ 
  title = "404",
  subTitle = "Xin lỗi, trang bạn truy cập không tồn tại.",
  extra,
  onBackHome
}) => {
  const navigate = useNavigate();

  const defaultExtra = (
    <Button 
      type="primary" 
      onClick={onBackHome || (() => navigate('/'))}
      className="bg-blue-600 hover:bg-blue-700 border-blue-600"
    >
      Quay về trang chủ
    </Button>
  );

  return (
    <Result
      status="404"
      title={title}
      subTitle={subTitle}
      extra={extra || defaultExtra}
    />
  );
};

export default Result404;