import React from 'react';
import { Button, message, Space } from 'antd';

export interface MessageComponentProps {
  showButtons?: boolean;
  customMessages?: {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
  };
}

const MessageComponent: React.FC<MessageComponentProps> = ({
  showButtons = true,
  customMessages = {}
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: customMessages.success || 'Thao tác thành công!',
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: customMessages.error || 'Đã xảy ra lỗi!',
    });
  };

  const warning = () => {
    messageApi.open({
      type: 'warning',
      content: customMessages.warning || 'Cảnh báo: Vui lòng kiểm tra thông tin!',
    });
  };

  const info = () => {
    messageApi.open({
      type: 'info',
      content: customMessages.info || 'Thông tin đã được cập nhật!',
    });
  };

  // Hook để sử dụng trong components khác
  const useMessageHook = () => {
    return {
      messageApi,
      contextHolder,
      showSuccess: (content?: string) => {
        messageApi.open({
          type: 'success',
          content: content || customMessages.success || 'Thao tác thành công!',
        });
      },
      showError: (content?: string) => {
        messageApi.open({
          type: 'error',
          content: content || customMessages.error || 'Đã xảy ra lỗi!',
        });
      },
      showWarning: (content?: string) => {
        messageApi.open({
          type: 'warning',
          content: content || customMessages.warning || 'Cảnh báo: Vui lòng kiểm tra thông tin!',
        });
      },
      showInfo: (content?: string) => {
        messageApi.open({
          type: 'info',
          content: content || customMessages.info || 'Thông tin đã được cập nhật!',
        });
      },
    };
  };

  return (
    <>
      {contextHolder}
      {showButtons && (
        <Space>
          <Button 
            onClick={success}
            className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
          >
            Thành công
          </Button>
          <Button 
            onClick={error}
            danger
          >
            Lỗi
          </Button>
          <Button 
            onClick={warning}
            className="text-orange-600 border-orange-600 hover:bg-orange-50"
          >
            Cảnh báo
          </Button>
          <Button 
            onClick={info}
            type="primary"
          >
            Thông tin
          </Button>
        </Space>
      )}
    </>
  );
};

// Export hook để sử dụng trong components khác
export const useMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  
  return {
    messageApi,
    contextHolder,
    showSuccess: (content: string) => {
      messageApi.open({
        type: 'success',
        content,
      });
    },
    showError: (content: string) => {
      messageApi.open({
        type: 'error',
        content,
      });
    },
    showWarning: (content: string) => {
      messageApi.open({
        type: 'warning',
        content,
      });
    },
    showInfo: (content: string) => {
      messageApi.open({
        type: 'info',
        content,
      });
    },
  };
};

export default MessageComponent;