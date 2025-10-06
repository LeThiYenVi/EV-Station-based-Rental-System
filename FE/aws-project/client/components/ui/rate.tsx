import React, { useState } from 'react';
import { FrownOutlined, MehOutlined, SmileOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { Flex, Rate } from 'antd';

export interface RateComponentProps {
  defaultValue?: number;
  value?: number;
  count?: number;
  allowHalf?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  character?: React.ReactNode | ((props: { index?: number }) => React.ReactNode);
  tooltips?: string[];
}

const customIcons: Record<number, React.ReactNode> = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};

const RateComponent: React.FC<RateComponentProps> = ({
  defaultValue = 0,
  value,
  count = 5,
  allowHalf = false,
  allowClear = true,
  disabled = false,
  onChange,
  character,
  tooltips
}) => {
  const [rateValue, setRateValue] = useState(value || defaultValue);

  const handleChange = (val: number) => {
    setRateValue(val);
    onChange?.(val);
    console.log('Rating:', val);
  };

  return (
    <Flex gap="middle" vertical>
      <div>
        <p className="mb-2 text-sm text-gray-600">Đánh giá cơ bản:</p>
        <Rate
          value={rateValue}
          count={count}
          allowHalf={allowHalf}
          allowClear={allowClear}
          disabled={disabled}
          onChange={handleChange}
          tooltips={tooltips}
        />
        {rateValue > 0 && (
          <span className="ml-2 text-sm text-gray-500">
            {rateValue} {rateValue === 1 ? 'sao' : 'sao'}
          </span>
        )}
      </div>
      
      {character && (
        <div>
          <p className="mb-2 text-sm text-gray-600">Đánh giá với biểu tượng tùy chỉnh:</p>
          <Rate
            defaultValue={rateValue}
            character={character}
            onChange={handleChange}
          />
        </div>
      )}
    </Flex>
  );
};

// Component Rate với số
export const NumberRate: React.FC<{ defaultValue?: number; onChange?: (value: number) => void }> = ({ 
  defaultValue = 2, 
  onChange 
}) => (
  <Rate 
    defaultValue={defaultValue} 
    character={({ index = 0 }) => index + 1} 
    onChange={onChange}
  />
);

// Component Rate với icons như mẫu gốc
export const IconRate: React.FC<{ defaultValue?: number; onChange?: (value: number) => void }> = ({ 
  defaultValue = 3, 
  onChange 
}) => (
  <Rate 
    defaultValue={defaultValue} 
    character={({ index = 0 }) => customIcons[index + 1]} 
    onChange={onChange}
  />
);

// Component Rate cho dịch vụ thuê xe
export const CarServiceRate: React.FC<{ 
  defaultValue?: number; 
  onChange?: (value: number) => void;
  showText?: boolean; 
}> = ({ 
  defaultValue = 0, 
  onChange,
  showText = true 
}) => {
  const [value, setValue] = useState(defaultValue);
  
  const handleChange = (val: number) => {
    setValue(val);
    onChange?.(val);
  };

  const rateTexts = ['Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];

  return (
    <div>
      <Rate
        value={value}
        onChange={handleChange}
        tooltips={rateTexts}
        allowClear
      />
      {showText && value > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rateTexts[value - 1]}
        </span>
      )}
    </div>
  );
};

export default RateComponent;