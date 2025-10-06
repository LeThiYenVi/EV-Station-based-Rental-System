import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Button, Result, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Paragraph, Text } = Typography;

interface ErrorResultProps {
  title?: string;
  subTitle?: string;
  extra?: React.ReactNode[];
  onGoConsole?: () => void;
  onBuyAgain?: () => void;
  errorDetails?: React.ReactNode;
}

const ErrorResult: React.FC<ErrorResultProps> = ({ 
  title = "Gửi thông tin thất bại",
  subTitle = "Vui lòng kiểm tra và sửa đổi thông tin sau trước khi gửi lại.",
  extra,
  onGoConsole,
  onBuyAgain,
  errorDetails
}) => {
  const navigate = useNavigate();

  const defaultExtra = [
    <Button 
      type="primary" 
      key="console"
      onClick={onGoConsole || (() => navigate('/dashboard'))}
      className="bg-red-600 hover:bg-red-700 border-red-600"
    >
      Quay lại trang chủ
    </Button>,
    <Button 
      key="buy" 
      onClick={onBuyAgain || (() => navigate('/'))}
    >
      Thử lại
    </Button>,
  ];

  const defaultErrorDetails = (
    <div className="desc">
      <Paragraph>
        <Text
          strong
          style={{
            fontSize: 16,
          }}
        >
          Thông tin bạn gửi có các lỗi sau:
        </Text>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined className="site-result-demo-error-icon text-red-500 mr-2" /> 
        Thông tin tài khoản chưa được xác thực. 
        <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">Xác thực ngay &gt;</a>
      </Paragraph>
      <Paragraph>
        <CloseCircleOutlined className="site-result-demo-error-icon text-red-500 mr-2" /> 
        Tài khoản chưa đủ điều kiện để thực hiện thao tác này. 
        <a href="#" className="text-blue-600 hover:text-blue-800 ml-1">Nâng cấp tài khoản &gt;</a>
      </Paragraph>
    </div>
  );

  return (
    <Result
      status="error"
      title={title}
      subTitle={subTitle}
      extra={extra || defaultExtra}
    >
      {errorDetails || defaultErrorDetails}
    </Result>
  );
};

export default ErrorResult;