import React from 'react';
import { Pagination } from 'antd';

export interface AntPaginationProps {
  total?: number;
  defaultCurrent?: number;
  pageSize?: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  onChange?: (page: number, pageSize: number) => void;
  onShowSizeChange?: (current: number, size: number) => void;
}

const AntPagination: React.FC<AntPaginationProps> = ({
  total = 50,
  defaultCurrent = 1,
  pageSize = 10,
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal = true,
  onChange,
  onShowSizeChange
}) => {
  const handleChange = (page: number, size: number) => {
    console.log(`Current page: ${page}, Page size: ${size}`);
    onChange?.(page, size);
  };

  const handleShowSizeChange = (current: number, size: number) => {
    console.log(`Current: ${current}, Size: ${size}`);
    onShowSizeChange?.(current, size);
  };

  const showTotalItems = (total: number, range: [number, number]) =>
    `Hiển thị ${range[0]}-${range[1]} của ${total} mục`;

  return (
    <Pagination
      defaultCurrent={defaultCurrent}
      total={total}
      pageSize={pageSize}
      showSizeChanger={showSizeChanger}
      showQuickJumper={showQuickJumper}
      showTotal={showTotal ? showTotalItems : undefined}
      onChange={handleChange}
      onShowSizeChange={handleShowSizeChange}
      pageSizeOptions={['10', '20', '50', '100']}
      size="default"
      className="text-center"
    />
  );
};

// Component đơn giản cho trường hợp cơ bản
export const SimpleAntPagination: React.FC<{ total?: number; defaultCurrent?: number }> = ({ 
  total = 50, 
  defaultCurrent = 1 
}) => (
  <Pagination 
    defaultCurrent={defaultCurrent} 
    total={total} 
    className="text-center"
  />
);

export default AntPagination;