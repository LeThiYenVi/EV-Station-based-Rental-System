import React, { useState } from 'react';
import { DatePicker } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

export interface DatePickerComponentProps {
  placeholder?: string | [string, string];
  defaultValue?: Dayjs | [Dayjs, Dayjs];
  value?: Dayjs | [Dayjs, Dayjs];
  format?: string;
  size?: 'large' | 'middle' | 'small';
  disabled?: boolean;
  allowClear?: boolean;
  showTime?: boolean;
  showToday?: boolean;
  onChange?: (date: Dayjs | null, dateString: string) => void;
}

export interface RangePickerComponentProps {
  placeholder?: [string, string];
  defaultValue?: [Dayjs, Dayjs];
  value?: [Dayjs, Dayjs];
  format?: string;
  size?: 'large' | 'middle' | 'small';
  disabled?: boolean | [boolean, boolean];
  allowClear?: boolean;
  allowEmpty?: [boolean, boolean];
  showTime?: boolean;
  onChange?: (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  placeholder = "Chọn ngày",
  defaultValue,
  value,
  format = 'DD/MM/YYYY',
  size = 'middle',
  disabled = false,
  allowClear = true,
  showTime = false,
  showToday = true,
  onChange
}) => {
  const [dateValue, setDateValue] = useState<Dayjs | null>(value as Dayjs || null);

  const handleChange = (date: Dayjs | null, dateString: string) => {
    setDateValue(date);
    onChange?.(date, dateString);
    console.log('Selected Date:', dateString);
  };

  return (
    <DatePicker
      value={dateValue}
      placeholder={placeholder as string}
      format={format}
      size={size}
      disabled={disabled}
      allowClear={allowClear}
      showTime={showTime}
      showToday={showToday}
      onChange={handleChange}
      style={{ width: '100%' }}
    />
  );
};

// Component RangePicker theo mẫu gốc
export const SimpleRangePicker: React.FC = () => (
  <RangePicker
    placeholder={['Start Date', 'Till Now']}
    allowEmpty={[false, true]}
    onChange={(date, dateString) => {
      console.log(date, dateString);
    }}
    style={{ width: '100%' }}
  />
);

// Component RangePicker cho thuê xe
export const CarRentalRangePicker: React.FC<RangePickerComponentProps> = ({
  placeholder = ['Ngày nhận xe', 'Ngày trả xe'],
  defaultValue,
  value,
  format = 'DD/MM/YYYY',
  size = 'middle',
  disabled = false,
  allowClear = true,
  allowEmpty = [false, false],
  showTime = false,
  onChange
}) => {
  const [rangeValue, setRangeValue] = useState<[Dayjs | null, Dayjs | null] | null>(value as [Dayjs | null, Dayjs | null] || null);

  const handleChange = (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => {
    setRangeValue(dates);
    onChange?.(dates, dateStrings);
    console.log('Selected Range:', dateStrings);
  };

  return (
    <RangePicker
      value={rangeValue}
      placeholder={placeholder}
      format={format}
      size={size}
      disabled={disabled}
      allowClear={allowClear}
      allowEmpty={allowEmpty}
      showTime={showTime}
      onChange={handleChange}
      style={{ width: '100%' }}
    />
  );
};

// Component DatePicker với Time
export const DateTimePickerComponent: React.FC<{ 
  placeholder?: string;
  onChange?: (date: Dayjs | null, dateString: string) => void;
}> = ({ 
  placeholder = "Chọn ngày và giờ",
  onChange 
}) => (
  <DatePicker
    showTime
    placeholder={placeholder}
    format="DD/MM/YYYY HH:mm"
    onChange={onChange}
    style={{ width: '100%' }}
  />
);

// Component RangePicker với Time cho thuê xe theo giờ
export const HourlyCarRentalPicker: React.FC<{ 
  onChange?: (dates: [Dayjs | null, Dayjs | null] | null, dateStrings: [string, string]) => void;
}> = ({ onChange }) => (
  <RangePicker
    showTime={{
      format: 'HH:mm',
    }}
    format="DD/MM/YYYY HH:mm"
    placeholder={['Thời gian nhận xe', 'Thời gian trả xe']}
    onChange={onChange}
    style={{ width: '100%' }}
  />
);

export default DatePickerComponent;