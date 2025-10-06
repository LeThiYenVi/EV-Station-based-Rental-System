import React, { useState } from 'react';
import { Button, Space, Card, Typography } from 'antd';
import { 
  SuccessResult, 
  InfoResult, 
  WarningResult, 
  Result403, 
  Result404, 
  Result500, 
  ErrorResult 
} from '../components/ui/results';

const { Title } = Typography;

type ResultType = 'success' | 'info' | 'warning' | '403' | '404' | '500' | 'error' | null;

const ResultDemo: React.FC = () => {
  const [currentResult, setCurrentResult] = useState<ResultType>(null);

  const renderResult = () => {
    switch (currentResult) {
      case 'success':
        return <SuccessResult />;
      case 'info':
        return <InfoResult />;
      case 'warning':
        return <WarningResult />;
      case '403':
        return <Result403 />;
      case '404':
        return <Result404 />;
      case '500':
        return <Result500 />;
      case 'error':
        return <ErrorResult />;
      default:
        return (
          <Card className="text-center p-8">
            <Title level={3}>Result Components Demo</Title>
            <p className="text-gray-600 mb-6">
              Chọn một loại result để xem preview
            </p>
            <Space wrap size="middle">
              <Button 
                type="primary" 
                className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                onClick={() => setCurrentResult('success')}
              >
                Success Result
              </Button>
              <Button 
                onClick={() => setCurrentResult('info')}
              >
                Info Result
              </Button>
              <Button 
                className="text-orange-600 border-orange-600 hover:bg-orange-50"
                onClick={() => setCurrentResult('warning')}
              >
                Warning Result
              </Button>
              <Button 
                danger
                onClick={() => setCurrentResult('403')}
              >
                403 Forbidden
              </Button>
              <Button 
                onClick={() => setCurrentResult('404')}
              >
                404 Not Found
              </Button>
              <Button 
                danger
                onClick={() => setCurrentResult('500')}
              >
                500 Server Error
              </Button>
              <Button 
                danger
                onClick={() => setCurrentResult('error')}
              >
                Error Result
              </Button>
            </Space>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {currentResult && (
          <div className="mb-6 text-center">
            <Button 
              onClick={() => setCurrentResult(null)}
              className="mb-4"
            >
              ← Quay lại danh sách
            </Button>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderResult()}
        </div>
      </div>
    </div>
  );
};

export default ResultDemo;