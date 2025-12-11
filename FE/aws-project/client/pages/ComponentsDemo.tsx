import React, { useState } from "react";
import { Card, Typography, Space, Button, Divider, Row, Col } from "antd";
import { FaSnowflake, FaGift, FaTree } from "react-icons/fa";
import {
  GiSnowflake1,
  GiPresent,
} from "react-icons/gi";

// Import components
import MessageComponent, { useMessage } from "../components/ui/message";
import AntPagination, {
  SimpleAntPagination,
} from "../components/ui/ant-pagination";
import StepsComponent, { SimpleSteps } from "../components/ui/steps";
import RateComponent, {
  NumberRate,
  IconRate,
  CarServiceRate,
} from "../components/ui/rate";
import SelectComponent, {
  SimpleSelect,
  CarTypeSelect,
  CitySelect,
} from "../components/ui/ant-select";
import DatePickerComponent, {
  SimpleRangePicker,
  CarRentalRangePicker,
  DateTimePickerComponent,
  HourlyCarRentalPicker,
} from "../components/ui/date-picker";
import AntCarousel, {
  SimpleAntCarousel,
  CarImageCarousel,
  FadeCarousel,
} from "../components/ui/ant-carousel";
import EmptyComponent, {
  SimpleEmpty,
  NoCarEmpty,
  NoBookingHistoryEmpty,
  NoSearchResultEmpty,
  NoDataEmpty,
  SmallEmpty,
} from "../components/ui/empty";
import QRCodeComponent, {
  SimpleQRCode,
  BookingQRCode,
  CustomUrlQRCode,
  MultiStatusQRCode,
} from "../components/ui/qr-code";

const { Title, Paragraph } = Typography;

const ComponentsDemo: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCarType, setSelectedCarType] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <Title level={2}>Ant Design Components Demo</Title>
          <Paragraph>
            Trang demo các components: Message, Pagination, Steps, Rate, Select,
            DatePicker, Carousel, Empty, QR Code
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {/* Christmas Icons Demo */}
          <Col xs={24}>
            <Card
              title="🎄 Christmas Icons Collection"
              className="bg-gradient-to-r from-red-50 to-green-50"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Title level={4}>FontAwesome Icons</Title>
                    <div className="flex justify-center items-center gap-4 my-4">
                      <FaSnowflake size={50} color="#4A90E2" />
                      <FaGift size={50} color="#D42426" />
                      <FaTree size={50} color="#2E7D32" />
                    </div>
                    <Paragraph className="text-sm text-gray-600">
                      Snowflake, Gift, Christmas Tree từ FontAwesome
                      (react-icons/fa)
                    </Paragraph>
                  </div>
                </Col>

                <Col xs={24} md={8}>
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Title level={4}>Game Icons (Detailed)</Title>
                    <div className="flex justify-center items-center gap-4 my-4">
              
                      <GiPresent size={60} color="#D42426" />
                    </div>
                    <Paragraph className="text-sm text-gray-600">
                      Santa, Christmas Tree, Present từ GameIcons
                      (react-icons/gi)
                    </Paragraph>
                  </div>
                </Col>

                <Col xs={24} md={8}>
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <Title level={4}>Với Animation</Title>
                    <div className="flex justify-center items-center gap-4 my-4">
                      <FaSnowflake
                        size={50}
                        color="#4A90E2"
                        className="animate-spin"
                        style={{ animationDuration: "3s" }}
                      />
                      <FaGift
                        size={50}
                        color="#D42426"
                        className="animate-pulse"
                      />
                    </div>
                    <Paragraph className="text-sm text-gray-600">
                      Với hiệu ứng spin, bounce và pulse
                    </Paragraph>
                  </div>
                </Col>
              </Row>

              <Divider />

              <div style={{ textAlign: "center", padding: "20px" }}>
                <Title level={4}>🎅 Santa Emoji Demo</Title>
                <div className="flex justify-center items-center gap-6 my-4">
                  <span className="text-6xl">🎅</span>
                  <span className="text-6xl animate-bounce">🎄</span>
                  <span className="text-6xl animate-pulse">🎁</span>
                  <span
                    className="text-6xl animate-spin"
                    style={{ animationDuration: "3s" }}
                  >
                    ❄️
                  </span>
                  <span
                    className="text-6xl"
                    style={{
                      transform: "rotate(45deg)",
                      display: "inline-block",
                    }}
                  >
                    🎅
                  </span>
                </div>
                <Paragraph className="text-sm text-gray-600">
                  Emoji Christmas với animations - Đây là cách đơn giản nhất!
                </Paragraph>
              </div>

              <Divider />

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Space direction="vertical" className="w-full">
                    <Title level={5}>📝 Cách sử dụng FontAwesome:</Title>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {`import { FaSnowflake, FaGift, FaTree } from "react-icons/fa";

<FaSnowflake size={50} color="#4A90E2" />
<FaGift size={50} color="#D42426" />
<FaTree size={50} color="#2E7D32" />`}
                    </pre>
                  </Space>
                </Col>

                <Col xs={24} md={12}>
                  <Space direction="vertical" className="w-full">
                    <Title level={5}>📝 Cách sử dụng GameIcons:</Title>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {`import { GiSantaClaus, GiChristmasTree, GiPresent } from "react-icons/gi";

<GiSantaClaus size={60} color="red" />
<GiChristmasTree size={60} color="green" />
<GiPresent size={60} color="#D42426" />`}
                    </pre>
                  </Space>
                </Col>

                <Col xs={24}>
                  <Space direction="vertical" className="w-full">
                    <Title level={5}>
                      📝 Cách sử dụng Emoji (Đơn giản nhất):
                    </Title>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {`{/* Không cần import gì cả! */}
<span className="text-6xl">🎅</span>
<span className="text-6xl animate-bounce">🎄</span>
<span className="text-6xl" style={{ transform: "rotate(45deg)" }}>🎅</span>`}
                    </pre>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Message Component */}
          <Col xs={24} lg={12}>
            <Card title="📢 Message Component" className="h-full">
              <Space direction="vertical" className="w-full">
                <MessageComponent />
                <Divider />
                <Paragraph className="text-sm text-gray-600">
                  Component hiển thị thông báo với các loại: success, error,
                  warning, info
                </Paragraph>
              </Space>
            </Card>
          </Col>

          {/* Pagination Component */}
          <Col xs={24} lg={12}>
            <Card title="📄 Pagination Component" className="h-full">
              <Space direction="vertical" className="w-full">
                <div>
                  <Paragraph className="mb-2">Pagination đầy đủ:</Paragraph>
                  <AntPagination total={500} />
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">Pagination đơn giản:</Paragraph>
                  <SimpleAntPagination total={100} />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Steps Component */}
          <Col xs={24}>
            <Card title="📊 Steps Component">
              <Space direction="vertical" className="w-full">
                <div>
                  <Paragraph className="mb-4">
                    Bước hiện tại: {currentStep + 1}/5
                  </Paragraph>
                  <StepsComponent
                    current={currentStep}
                    onChange={setCurrentStep}
                  />
                  <div className="mt-4 text-center">
                    <Space>
                      <Button
                        onClick={() =>
                          setCurrentStep(Math.max(0, currentStep - 1))
                        }
                        disabled={currentStep === 0}
                      >
                        Quay lại
                      </Button>
                      <Button
                        type="primary"
                        onClick={() =>
                          setCurrentStep(Math.min(4, currentStep + 1))
                        }
                        disabled={currentStep === 4}
                      >
                        Tiếp theo
                      </Button>
                    </Space>
                  </div>
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">Steps mẫu gốc:</Paragraph>
                  <SimpleSteps />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Rate Component */}
          <Col xs={24} lg={12}>
            <Card title="⭐ Rate Component" className="h-full">
              <Space direction="vertical" className="w-full">
                <div>
                  <Paragraph className="mb-2">
                    Đánh giá dịch vụ thuê xe:
                  </Paragraph>
                  <CarServiceRate />
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">Rate với số:</Paragraph>
                  <NumberRate />
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">Rate với icons:</Paragraph>
                  <IconRate />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Select Component */}
          <Col xs={24} lg={12}>
            <Card title="🔽 Select Component" className="h-full">
              <Space direction="vertical" className="w-full">
                <div>
                  <Paragraph className="mb-2">Chọn loại xe:</Paragraph>
                  <CarTypeSelect
                    onChange={setSelectedCarType}
                    defaultValue={selectedCarType}
                  />
                  {selectedCarType && (
                    <p className="text-sm text-gray-600 mt-1">
                      Đã chọn: {selectedCarType}
                    </p>
                  )}
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">Chọn thành phố:</Paragraph>
                  <CitySelect
                    onChange={setSelectedCity}
                    defaultValue={selectedCity}
                  />
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">Select mẫu gốc:</Paragraph>
                  <SimpleSelect />
                </div>
              </Space>
            </Card>
          </Col>

          {/* DatePicker Component */}
          <Col xs={24}>
            <Card title="📅 DatePicker Component">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Space direction="vertical" className="w-full">
                    <div>
                      <Paragraph className="mb-2">Chọn ngày thuê xe:</Paragraph>
                      <DatePickerComponent placeholder="Chọn ngày thuê xe" />
                    </div>
                    <div>
                      <Paragraph className="mb-2">
                        Khoảng thời gian thuê xe:
                      </Paragraph>
                      <CarRentalRangePicker />
                    </div>
                  </Space>
                </Col>

                <Col xs={24} md={12}>
                  <Space direction="vertical" className="w-full">
                    <div>
                      <Paragraph className="mb-2">Chọn ngày và giờ:</Paragraph>
                      <DateTimePickerComponent />
                    </div>
                    <div>
                      <Paragraph className="mb-2">Thuê xe theo giờ:</Paragraph>
                      <HourlyCarRentalPicker />
                    </div>
                  </Space>
                </Col>
              </Row>

              <Divider />

              <div>
                <Paragraph className="mb-2">RangePicker mẫu gốc:</Paragraph>
                <SimpleRangePicker />
              </div>
            </Card>
          </Col>

          {/* Carousel Component */}
          <Col xs={24}>
            <Card title="🎠 Carousel Component">
              <Space direction="vertical" className="w-full">
                <div>
                  <Paragraph className="mb-2">
                    Carousel dịch vụ thuê xe:
                  </Paragraph>
                  <AntCarousel />
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">
                    Carousel với fade effect:
                  </Paragraph>
                  <FadeCarousel />
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">Carousel hình ảnh xe:</Paragraph>
                  <CarImageCarousel height="200px" />
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">Carousel mẫu gốc:</Paragraph>
                  <SimpleAntCarousel />
                </div>
              </Space>
            </Card>
          </Col>

          {/* Empty Component */}
          <Col xs={24} lg={12}>
            <Card title="📭 Empty Component" className="h-full">
              <Space direction="vertical" className="w-full">
                <div>
                  <Paragraph className="mb-2">
                    Empty cho danh sách xe:
                  </Paragraph>
                  <NoCarEmpty
                    onRefresh={() => console.log("Refresh cars")}
                    onAddCar={() => console.log("Search again")}
                  />
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">
                    Empty cho lịch sử đặt xe:
                  </Paragraph>
                  <NoBookingHistoryEmpty
                    onCreateBooking={() => console.log("Create booking")}
                  />
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">Empty đơn giản:</Paragraph>
                  <SimpleEmpty />
                </div>
              </Space>
            </Card>
          </Col>

          {/* QR Code Component */}
          <Col xs={24} lg={12}>
            <Card title="📱 QR Code Component" className="h-full">
              <Space direction="vertical" className="w-full">
                <div>
                  <Paragraph className="mb-2">QR Code đặt xe:</Paragraph>
                  <div className="flex justify-center">
                    <QRCodeComponent value="https://bf-car-rental.com/booking/BF123456" />
                  </div>
                </div>
                <Divider />
                <div>
                  <Paragraph className="mb-2">
                    QR Code với các trạng thái:
                  </Paragraph>
                  <MultiStatusQRCode />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Advanced Components */}
        <Row gutter={[24, 24]} className="mt-6">
          {/* Booking QR Code */}
          <Col xs={24} lg={12}>
            <BookingQRCode />
          </Col>

          {/* Custom URL QR Code */}
          <Col xs={24} lg={12}>
            <Card title="🔗 QR Code tùy chỉnh">
              <CustomUrlQRCode />
            </Card>
          </Col>

          {/* Simple QR Code demo */}
          <Col xs={24}>
            <Card title="📋 QR Code mẫu gốc">
              <SimpleQRCode />
            </Card>
          </Col>
        </Row>

        {/* Summary Card */}
        <Card className="mt-6" title="📋 Tóm tắt Components">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Title level={5}>📢 Message</Title>
              <Paragraph className="text-sm">
                Hiển thị thông báo success, error, warning, info với hook
                useMessage
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5}>📄 Pagination</Title>
              <Paragraph className="text-sm">
                Phân trang với tùy chọn hiển thị số items, quick jump, size
                changer
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5}>📊 Steps</Title>
              <Paragraph className="text-sm">
                Hiển thị tiến trình với các bước: Đăng nhập → Chọn xe → Xác nhận
                → Thanh toán → Hoàn thành
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5}>⭐ Rate</Title>
              <Paragraph className="text-sm">
                Đánh giá sao với custom icons, tooltips và text hiển thị
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5}>🔽 Select</Title>
              <Paragraph className="text-sm">
                Dropdown chọn với search, multiple selection, options cho loại
                xe và thành phố
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5}>📅 DatePicker</Title>
              <Paragraph className="text-sm">
                Chọn ngày với RangePicker, DateTime, hỗ trợ thuê xe theo ngày và
                theo giờ
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5}>🎠 Carousel</Title>
              <Paragraph className="text-sm">
                Slideshow với autoplay, fade effect, hiển thị hình ảnh xe và
                dịch vụ
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5}>📭 Empty</Title>
              <Paragraph className="text-sm">
                Hiển thị trạng thái trống với custom message, actions cho các
                tình huống khác nhau
              </Paragraph>
            </Col>
            <Col xs={24} md={8}>
              <Title level={5}>📱 QR Code</Title>
              <Paragraph className="text-sm">
                Tạo QR Code với các trạng thái loading, expired, scanned và
                custom content
              </Paragraph>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default ComponentsDemo;
