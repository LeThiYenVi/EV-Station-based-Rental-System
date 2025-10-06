import React from 'react';
import { SmileOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import type { NotificationArgsProps } from 'antd';
import './notifications.css';

type NotificationType = 'success' | 'info' | 'warning' | 'error' | 'custom';

interface NotificationConfig extends Omit<NotificationArgsProps, 'icon' | 'type'> {
  type?: NotificationType;
  icon?: React.ReactNode;
}

interface NotificationsProps {
  children?: React.ReactNode;
}

const getDefaultIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    case 'info':
      return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
    case 'warning':
      return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
    case 'error':
      return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
    case 'custom':
    default:
      return <SmileOutlined style={{ color: '#108ee9' }} />;
  }
};

export const useNotification = () => {
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (config: NotificationConfig) => {
    const { type = 'custom', icon, ...restConfig } = config;
    
    api.open({
      ...restConfig,
      icon: icon || getDefaultIcon(type),
      placement: 'topRight',
      duration: 4.5,
    });
  };

  const openSuccessNotification = (message: string, description?: string) => {
    openNotification({
      type: 'success',
      message,
      description,
    });
  };

  const openErrorNotification = (message: string, description?: string) => {
    openNotification({
      type: 'error',
      message,
      description,
    });
  };

  const openWarningNotification = (message: string, description?: string) => {
    openNotification({
      type: 'warning',
      message,
      description,
    });
  };

  const openInfoNotification = (message: string, description?: string) => {
    openNotification({
      type: 'info',
      message,
      description,
    });
  };

  return {
    contextHolder,
    openNotification,
    openSuccessNotification,
    openErrorNotification,
    openWarningNotification,
    openInfoNotification,
  };
};

export const Notifications: React.FC<NotificationsProps> = ({ children }) => {
  const { 
    contextHolder, 
    openNotification,
    openSuccessNotification,
    openErrorNotification,
    openWarningNotification,
    openInfoNotification
  } = useNotification();

  const handleCustomNotification = () => {
    openNotification({
      message: 'Thông báo tùy chỉnh',
      description: 'Đây là nội dung thông báo tùy chỉnh với icon mặt cười.',
      type: 'custom',
    });
  };

  const handleSuccessNotification = () => {
    openSuccessNotification(
      'Thành công!',
      'Thao tác đã được thực hiện thành công.'
    );
  };

  const handleErrorNotification = () => {
    openErrorNotification(
      'Lỗi!',
      'Đã xảy ra lỗi trong quá trình thực hiện.'
    );
  };

  const handleWarningNotification = () => {
    openWarningNotification(
      'Cảnh báo!',
      'Vui lòng kiểm tra lại thông tin trước khi tiếp tục.'
    );
  };

  const handleInfoNotification = () => {
    openInfoNotification(
      'Thông tin',
      'Đây là thông báo mang tính chất thông tin.'
    );
  };

  if (children) {
    return (
      <>
        {contextHolder}
        {children}
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="space-y-4 p-6">
        <h3 className="text-lg font-semibold mb-4">Notification Examples</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button 
            type="primary" 
            onClick={handleCustomNotification}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Custom Notification
          </Button>
          
          <Button 
            onClick={handleSuccessNotification}
            className="bg-green-500 hover:bg-green-600 text-white border-green-500"
          >
            Success Notification
          </Button>
          
          <Button 
            onClick={handleErrorNotification}
            className="bg-red-500 hover:bg-red-600 text-white border-red-500"
          >
            Error Notification
          </Button>
          
          <Button 
            onClick={handleWarningNotification}
            className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
          >
            Warning Notification
          </Button>
          
          <Button 
            onClick={handleInfoNotification}
            className="bg-blue-400 hover:bg-blue-500 text-white border-blue-400"
          >
            Info Notification
          </Button>
        </div>
      </div>
    </>
  );
};

export default Notifications;