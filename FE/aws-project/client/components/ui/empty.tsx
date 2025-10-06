import React from 'react';
import { Empty, Button } from 'antd';
import { PlusOutlined, ReloadOutlined, SearchOutlined, FileOutlined } from '@ant-design/icons';

export interface EmptyComponentProps {
  image?: React.ReactNode | string;
  imageStyle?: React.CSSProperties;
  description?: React.ReactNode;
  children?: React.ReactNode;
}

const EmptyComponent: React.FC<EmptyComponentProps> = ({
  image,
  imageStyle,
  description,
  children
}) => {
  return (
    <Empty
      image={image}
      imageStyle={imageStyle}
      description={description}
    >
      {children}
    </Empty>
  );
};

// Component Empty đơn giản theo mẫu gốc
export const SimpleEmpty: React.FC = () => <Empty />;

// Component Empty cho danh sách xe trống
export const NoCarEmpty: React.FC<{
  onAddCar?: () => void;
  onRefresh?: () => void;
}> = ({ onAddCar, onRefresh }) => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={
      <span className="text-gray-500">
        Không tìm thấy xe nào phù hợp với tiêu chí của bạn
      </span>
    }
  >
    <div className="space-x-2">
      {onRefresh && (
        <Button 
          type="primary" 
          icon={<ReloadOutlined />}
          onClick={onRefresh}
        >
          Làm mới
        </Button>
      )}
      {onAddCar && (
        <Button 
          icon={<SearchOutlined />}
          onClick={onAddCar}
        >
          Tìm kiếm lại
        </Button>
      )}
    </div>
  </Empty>
);

// Component Empty cho lịch sử đặt xe
export const NoBookingHistoryEmpty: React.FC<{
  onCreateBooking?: () => void;
}> = ({ onCreateBooking }) => (
  <Empty
    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
    imageStyle={{
      height: 60,
    }}
    description={
      <span className="text-gray-500">
        Bạn chưa có lịch sử đặt xe nào
      </span>
    }
  >
    {onCreateBooking && (
      <Button 
        type="primary" 
        icon={<PlusOutlined />}
        onClick={onCreateBooking}
        className="bg-blue-600 hover:bg-blue-700 border-blue-600"
      >
        Đặt xe ngay
      </Button>
    )}
  </Empty>
);

// Component Empty cho tìm kiếm
export const NoSearchResultEmpty: React.FC<{
  searchTerm?: string;
  onClearSearch?: () => void;
}> = ({ searchTerm, onClearSearch }) => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={
      <div className="text-gray-500">
        <p>Không tìm thấy kết quả cho "{searchTerm}"</p>
        <p className="text-sm">Hãy thử tìm kiếm với từ khóa khác</p>
      </div>
    }
  >
    {onClearSearch && (
      <Button onClick={onClearSearch}>
        Xóa bộ lọc
      </Button>
    )}
  </Empty>
);

// Component Empty cho dữ liệu tải về
export const NoDataEmpty: React.FC<{
  title?: string;
  description?: string;
  action?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}> = ({ 
  title = "Không có dữ liệu",
  description = "Chưa có thông tin để hiển thị",
  action
}) => (
  <Empty
    image={<FileOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
    description={
      <div className="text-gray-500">
        <p className="font-medium">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    }
  >
    {action && (
      <Button 
        type="primary"
        icon={action.icon}
        onClick={action.onClick}
      >
        {action.text}
      </Button>
    )}
  </Empty>
);

// Component Empty với custom image
export const CustomImageEmpty: React.FC<{
  imageSrc?: string;
  title?: string;
  description?: string;
  imageHeight?: number;
}> = ({
  imageSrc = '/placeholder.svg',
  title = "Trống",
  description = "Không có dữ liệu để hiển thị",
  imageHeight = 100
}) => (
  <Empty
    image={imageSrc}
    imageStyle={{
      height: imageHeight,
    }}
    description={
      <div className="text-gray-500">
        <p className="font-medium text-base">{title}</p>
        <p className="text-sm">{description}</p>
      </div>
    }
  />
);

// Component Empty size nhỏ
export const SmallEmpty: React.FC<{
  description?: string;
}> = ({ description = "Không có dữ liệu" }) => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={<span className="text-gray-400 text-sm">{description}</span>}
  />
);

export default EmptyComponent;