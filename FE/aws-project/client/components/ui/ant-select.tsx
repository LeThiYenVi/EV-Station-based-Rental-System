import React, { useState } from 'react';
import { Select } from 'antd';

export interface SelectComponentProps {
  placeholder?: string;
  defaultValue?: string | string[];
  value?: string | string[];
  mode?: 'multiple' | 'tags';
  showSearch?: boolean;
  allowClear?: boolean;
  disabled?: boolean;
  size?: 'large' | 'middle' | 'small';
  options?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  onChange?: (value: string | string[]) => void;
  onSearch?: (value: string) => void;
  filterOption?: boolean | ((input: string, option?: any) => boolean);
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  placeholder = "Vui lòng chọn",
  defaultValue,
  value,
  mode,
  showSearch = true,
  allowClear = true,
  disabled = false,
  size = 'middle',
  options = [],
  onChange,
  onSearch,
  filterOption
}) => {
  const [selectValue, setSelectValue] = useState(value || defaultValue);

  const handleChange = (val: string | string[]) => {
    setSelectValue(val);
    onChange?.(val);
    console.log(`selected:`, val);
  };

  const handleSearch = (val: string) => {
    onSearch?.(val);
    console.log('search:', val);
  };

  return (
    <Select
      value={selectValue}
      mode={mode}
      showSearch={showSearch}
      placeholder={placeholder}
      allowClear={allowClear}
      disabled={disabled}
      size={size}
      optionFilterProp="label"
      onChange={handleChange}
      onSearch={handleSearch}
      options={options}
      filterOption={filterOption}
      style={{ width: '100%' }}
    />
  );
};

// Component Select theo mẫu gốc
export const SimpleSelect: React.FC = () => {
  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  return (
    <Select
      showSearch
      placeholder="Select a person"
      optionFilterProp="label"
      onChange={onChange}
      onSearch={onSearch}
      options={[
        {
          value: 'jack',
          label: 'Jack',
        },
        {
          value: 'lucy',
          label: 'Lucy',
        },
        {
          value: 'tom',
          label: 'Tom',
        },
      ]}
      style={{ width: '100%' }}
    />
  );
};

// Component Select cho loại xe
export const CarTypeSelect: React.FC<{ 
  onChange?: (value: string) => void;
  defaultValue?: string;
}> = ({ onChange, defaultValue }) => {
  const carTypes = [
    { value: 'sedan', label: 'Sedan (4-5 chỗ)' },
    { value: 'suv', label: 'SUV (7 chỗ)' },
    { value: 'hatchback', label: 'Hatchback (4-5 chỗ)' },
    { value: 'pickup', label: 'Pickup (2-5 chỗ)' },
    { value: 'van', label: 'Van (16 chỗ)' },
    { value: 'luxury', label: 'Xe sang (4-5 chỗ)' }
  ];

  return (
    <Select
      showSearch
      placeholder="Chọn loại xe"
      defaultValue={defaultValue}
      optionFilterProp="label"
      onChange={onChange}
      options={carTypes}
      style={{ width: '100%' }}
    />
  );
};

// Component Select cho thành phố
export const CitySelect: React.FC<{ 
  onChange?: (value: string) => void;
  defaultValue?: string;
}> = ({ onChange, defaultValue }) => {
  const cities = [
    { value: 'hanoi', label: 'Hà Nội' },
    { value: 'hochiminh', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' },
    { value: 'nhatrang', label: 'Nha Trang' },
    { value: 'dalat', label: 'Đà Lạt' },
    { value: 'vungtau', label: 'Vũng Tàu' }
  ];

  return (
    <Select
      showSearch
      placeholder="Chọn thành phố"
      defaultValue={defaultValue}
      optionFilterProp="label"
      onChange={onChange}
      options={cities}
      style={{ width: '100%' }}
    />
  );
};

export default SelectComponent;