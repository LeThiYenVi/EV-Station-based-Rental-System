import React from 'react';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined, CarOutlined, CreditCardOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Steps } from 'antd';

export interface StepsComponentProps {
  current?: number;
  direction?: 'horizontal' | 'vertical';
  size?: 'default' | 'small';
  type?: 'default' | 'navigation';
  onChange?: (current: number) => void;
  customSteps?: Array<{
    title: string;
    description?: string;
    icon?: React.ReactNode;
    status?: 'wait' | 'process' | 'finish' | 'error';
  }>;
}

const StepsComponent: React.FC<StepsComponentProps> = ({
  current = 0,
  direction = 'horizontal',
  size = 'default',
  type = 'default',
  onChange,
  customSteps
}) => {
  // Default steps cho thuê xe
  const defaultSteps = [
    {
      title: 'Đăng nhập',
      description: 'Đăng nhập tài khoản',
      icon: <UserOutlined />,
      status: current > 0 ? 'finish' : current === 0 ? 'process' : 'wait'
    },
    {
      title: 'Chọn xe',
      description: 'Chọn loại xe phù hợp',
      icon: <CarOutlined />,
      status: current > 1 ? 'finish' : current === 1 ? 'process' : 'wait'
    },
    {
      title: 'Xác nhận',
      description: 'Xác nhận thông tin đặt xe',
      icon: <SolutionOutlined />,
      status: current > 2 ? 'finish' : current === 2 ? 'process' : 'wait'
    },
    {
      title: 'Thanh toán',
      description: 'Thanh toán và hoàn tất',
      icon: current === 3 ? <LoadingOutlined /> : <CreditCardOutlined />,
      status: current > 3 ? 'finish' : current === 3 ? 'process' : 'wait'
    },
    {
      title: 'Hoàn thành',
      description: 'Đặt xe thành công',
      icon: <CheckCircleOutlined />,
      status: current >= 4 ? 'finish' : 'wait'
    }
  ];

  const steps = customSteps || defaultSteps;

  return (
    <Steps
      current={current}
      direction={direction}
      size={size}
      type={type}
      onChange={onChange}
      items={steps.map((step, index) => ({
        title: step.title,
        description: step.description,
        icon: step.icon,
        status: step.status as any
      }))}
    />
  );
};

// Component Steps đơn giản theo mẫu gốc
export const SimpleSteps: React.FC<{ current?: number }> = ({ current = 2 }) => (
  <Steps
    current={current}
    items={[
      {
        title: 'Login',
        status: 'finish',
        icon: <UserOutlined />,
      },
      {
        title: 'Verification',
        status: 'finish',
        icon: <SolutionOutlined />,
      },
      {
        title: 'Pay',
        status: 'process',
        icon: <LoadingOutlined />,
      },
      {
        title: 'Done',
        status: 'wait',
        icon: <SmileOutlined />,
      },
    ]}
  />
);

export default StepsComponent;