import React from "react";
import { Notifications, useNotification } from "@/components/ui/notifications";
import { Button } from "@/components/ui/button";

const NotificationDemo: React.FC = () => {
  const {
    contextHolder,
    openNotification,
    openSuccessNotification,
    openErrorNotification,
    openWarningNotification,
    openInfoNotification,
  } = useNotification();

  const handleBookingSuccess = () => {
    openSuccessNotification(
      "Đặt xe thành công!",
      "Chúng tôi sẽ liên hệ với bạn trong vòng 15 phút để xác nhận thông tin.",
    );
  };

  const handleBookingError = () => {
    openErrorNotification(
      "Đặt xe thất bại!",
      "Vui lòng kiểm tra lại thông tin và thử lại sau.",
    );
  };

  const handleMaintenanceWarning = () => {
    openWarningNotification(
      "Bảo trì hệ thống",
      "Hệ thống sẽ bảo trì từ 23:00 - 01:00. Vui lòng hoàn tất giao dịch trước thời gian này.",
    );
  };

  const handlePromotionInfo = () => {
    openInfoNotification(
      "Khuyến mãi đặc biệt",
      "Giảm 20% cho khách hàng đặt xe lần đầu. Mã: WELCOME20",
    );
  };

  const handleCustomCarRental = () => {
    openNotification({
      message: "VoltGo EV Rental",
      description: "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!",
      type: "custom",
    });
  };

  return (
    <div className="container py-20">
      {contextHolder}

      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Demo Notification System
        </h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <h3 className="font-semibold mb-4 text-green-600">
              Success Notifications
            </h3>
            <Button
              onClick={handleBookingSuccess}
              className="w-full bg-green-500 hover:bg-green-600"
            >
              Booking Success
            </Button>
          </div>

          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <h3 className="font-semibold mb-4 text-red-600">
              Error Notifications
            </h3>
            <Button
              onClick={handleBookingError}
              variant="destructive"
              className="w-full"
            >
              Booking Error
            </Button>
          </div>

          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <h3 className="font-semibold mb-4 text-yellow-600">
              Warning Notifications
            </h3>
            <Button
              onClick={handleMaintenanceWarning}
              className="w-full bg-yellow-500 hover:bg-yellow-600"
            >
              Maintenance Warning
            </Button>
          </div>

          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <h3 className="font-semibold mb-4 text-blue-600">
              Info Notifications
            </h3>
            <Button
              onClick={handlePromotionInfo}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Promotion Info
            </Button>
          </div>

          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <h3 className="font-semibold mb-4 text-purple-600">
              Custom Notifications
            </h3>
            <Button
              onClick={handleCustomCarRental}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              Custom Message
            </Button>
          </div>

          <div className="p-6 rounded-lg border bg-white shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-600">Default Demo</h3>
            <Notifications />
          </div>
        </div>

        <div className="mt-12 p-6 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>

          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium">Import component:</h4>
              <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
                {`import { useNotification } from '@/components/ui/notifications';`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium">Use in component:</h4>
              <pre className="bg-gray-800 text-green-400 p-3 rounded mt-2 overflow-x-auto">
                {`const { contextHolder, openSuccessNotification } = useNotification();

// In JSX
{contextHolder}

// Call notification
openSuccessNotification('Success!', 'Operation completed successfully.');`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemo;
