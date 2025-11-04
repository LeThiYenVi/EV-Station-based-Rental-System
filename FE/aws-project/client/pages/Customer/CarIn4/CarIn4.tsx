import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMessage } from "@/components/ui/message";
import SuccessResult from "@/components/ui/result-success";
import CardCredit from "@/components/ui/CardCredit";
import {
  Heart,
  Share2,
  MapPin,
  Star,
  Shield,
  Users,
  Fuel,
  Settings,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Calendar,
  Clock,
  AlertCircle,
  CreditCard,
  Smartphone,
  QrCode,
  Copy,
  CheckCircle2,
} from "lucide-react";

// Mock data - sẽ thay bằng API call
const carData = {
  id: 1,
  name: "MAZDA 2 2024",
  rating: 4.9,
  trips: 50,
  location: "Phường Linh Đông, TP Thủ Đức",
  price: 602000,
  originalPrice: 722000,
  discount: 19,
  transmission: "Số tự động",
  seats: 5,
  fuel: "Xăng",
  fuelConsumption: "6L/100km",
  images: [
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
  ],
  features: {
    "Bản đồ": true,
    "Nắp thùng xe bán tải": false,
    "Camera hành trình": true,
    "Cảm biến va chạm": true,
    "Cảnh báo tốc độ": true,
    "Khe cắm USB": true,
    Bluetooth: true,
    "Túi khí an toàn": true,
    "Camera cửa sổ": false,
    "Camera 360": false,
    "Cảm biến lốp": true,
    "Cửa sổ trời": false,
    ETC: true,
  },
  description: "Xe mới, đẹp, sạch sẽ. Chủ xe thân thiện, nhiệt tình.",
  ownerVerified: true,
  deliveryAvailable: true,
  insuranceIncluded: true,
};

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 10.8494, // Tọa độ Phường Linh Đông, TP Thủ Đức
  lng: 106.7619,
};

export default function CarIn4() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contextHolder, showSuccess, showError, showWarning, showInfo } =
    useMessage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("qr");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);

  // Booking form states
  const [pickupDate, setPickupDate] = useState("2025-10-08");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnDate, setReturnDate] = useState("2025-10-09");
  const [returnTime, setReturnTime] = useState("08:00");
  const [deliveryOption, setDeliveryOption] = useState<"pickup" | "delivery">(
    "pickup",
  );
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Additional insurance state
  const [additionalInsurance, setAdditionalInsurance] = useState(false);
  const additionalInsuranceFee = 40000; // 40K/ngày

  // Terms acceptance state
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(false);

  // Store booking ID (generated once when booking starts)
  const [currentBookingId, setCurrentBookingId] = useState<string>("");

  // Login states
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    captcha: "",
  });
  const [captchaText] = useState("6d7mp");

  // Tài khoản test - giống Login.tsx
  const TEST_ACCOUNTS = {
    admin: { username: "admin", password: "admin123" },
    user: { username: "user", password: "user123" },
    staff: { username: "staff", password: "staff123" },
  };

  // Mock verified users (trong thực tế sẽ lưu trong database)
  const verifiedUsers = ["admin", "staff"];

  // Calculate rental details
  const calculateRentalDetails = () => {
    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const returnD = new Date(`${returnDate}T${returnTime}`);
    const diffMs = returnD.getTime() - pickup.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);

    // Tính giá thuê
    let rentalDays = diffDays > 0 ? diffDays : 1;
    const carPrice = carData.price * rentalDays;

    // Bảo hiểm thuê xe (10% giá xe)
    const insurance = Math.round(carPrice * 0.1);

    // Phí dịch vụ (5% giá xe)
    const serviceFee = Math.round(carPrice * 0.05);

    // Bảo hiểm bổ sung (nếu có)
    const additionalInsuranceCost = additionalInsurance
      ? additionalInsuranceFee * rentalDays
      : 0;

    // Tiền cọc (5 triệu mặc định)
    const deposit = 5000000;

    // Giảm giá (lấy từ carData.discount)
    const discountAmount = Math.round(carPrice * (carData.discount / 100));

    // Tổng tiền
    const total =
      carPrice +
      insurance +
      serviceFee +
      additionalInsuranceCost -
      discountAmount;

    return {
      duration: `${rentalDays} ngày`,
      carPrice,
      insurance,
      serviceFee,
      additionalInsurance: additionalInsuranceCost,
      deposit,
      discount: discountAmount,
      total,
      totalDeposit: deposit,
      rentalDays,
      diffHours: Math.floor(diffHours),
    };
  };

  // Check login status from localStorage on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const username = localStorage.getItem("username");

      if (loggedIn && username) {
        setIsLoggedIn(true);
        setCurrentUser(username);

        // Check if user is verified
        const hasVerified = verifiedUsers.includes(username);
        setIsVerified(hasVerified);
      }
    };

    checkLoginStatus();

    // Listen for login status changes
    window.addEventListener("loginStatusChanged", checkLoginStatus);

    return () => {
      window.removeEventListener("loginStatusChanged", checkLoginStatus);
    };
  }, []);

  // Mock data thanh toán - tính toán động
  const rentalCalc = calculateRentalDetails();
  const bookingDetails = {
    bookingId: currentBookingId || "BK" + Date.now(),
    renterName: currentUser || "Khách hàng",
    phone: "09xxxxx",
    email: "customer@gmail.com",
    pickupLocation:
      deliveryOption === "pickup"
        ? carData.location
        : deliveryAddress || "Giao xe tận nơi",
    pickupDate: pickupDate.split("-").reverse().join("/"),
    pickupTime: pickupTime,
    returnDate: returnDate.split("-").reverse().join("/"),
    returnTime: returnTime,
    duration: rentalCalc.duration,
    rentalType: "Theo ngày",
    driverService: false,
    carPrice: rentalCalc.carPrice,
    driverFee: 0,
    insurance: rentalCalc.insurance,
    additionalInsurance: 0,
    serviceFee: rentalCalc.serviceFee,
    deposit: rentalCalc.deposit,
    discount: rentalCalc.discount,
    useVPoints: false,
    total: rentalCalc.total,
    totalDeposit: rentalCalc.totalDeposit,
    qrCode:
      "00020101021238570010A00000072701270006970454011399961234560208QRIBFTTA53037045802VN62150811Thanh toan6304",
    bankAccount: {
      name: "Le Thi Yen Vi",
      bank: "Mb bank",
      number: "7980104151939",
      content: "BK" + Date.now(),
    },
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra captcha
    if (loginData.captcha.toLowerCase() !== captchaText.toLowerCase()) {
      showError("Captcha không đúng!");
      return;
    }

    // Kiểm tra tài khoản test và lấy role
    let userRole: string | null = null;

    const isValidAccount = Object.entries(TEST_ACCOUNTS).some(
      ([role, account]) => {
        if (
          account.username === loginData.username &&
          account.password === loginData.password
        ) {
          userRole = role;
          return true;
        }
        return false;
      },
    );

    if (isValidAccount && userRole) {
      // Save login status to localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", loginData.username);
      localStorage.setItem("userRole", userRole);

      // Dispatch custom event to notify header
      window.dispatchEvent(new Event("loginStatusChanged"));

      setIsLoggedIn(true);
      setCurrentUser(loginData.username);
      setShowLoginDialog(false);

      // Kiểm tra xem user đã xác thực GPLX chưa
      const hasVerified = verifiedUsers.includes(loginData.username);
      setIsVerified(hasVerified);

      if (hasVerified) {
        setShowPaymentDialog(true);
        showSuccess(`Đăng nhập thành công! Chào mừng ${loginData.username}`);
      } else {
        setShowVerifyDialog(true);
        showInfo("Đăng nhập thành công! Vui lòng xác thực GPLX để tiếp tục");
      }

      // Reset login form
      setLoginData({
        username: "",
        password: "",
        captcha: "",
      });
    } else {
      showError(
        "Tài khoản hoặc mật khẩu không đúng. Thử: admin/admin123, staff/staff123 hoặc user/user123",
      );
    }
  };

  const handleBookingClick = () => {
    // Generate booking ID once when starting booking process
    if (!currentBookingId) {
      const newBookingId = "BK" + Date.now();
      setCurrentBookingId(newBookingId);
      console.log("🆕 Tạo mã đơn hàng mới:", newBookingId);
    }

    if (!isLoggedIn) {
      setShowLoginDialog(true);
    } else if (!isVerified) {
      setShowVerifyDialog(true);
    } else {
      setShowPaymentDialog(true);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    side: "front" | "back",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (side === "front") {
        setFrontImage(file);
        setFrontPreview(URL.createObjectURL(file));
      } else {
        setBackImage(file);
        setBackPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleVerifySubmit = () => {
    if (!frontImage || !backImage) {
      toast({
        title: "Lỗi",
        description: "Vui lòng upload đầy đủ ảnh mặt trước và mặt sau GPLX",
        variant: "destructive",
      });
      return;
    }

    // Simulate verification process
    showInfo("Đang xác thực... Vui lòng đợi trong giây lát");

    setTimeout(() => {
      setIsVerified(true);
      setShowVerifyDialog(false);
      setShowPaymentDialog(true);

      showSuccess(
        "Xác thực thành công! GPLX của bạn đã được xác thực. Bạn có thể đặt xe ngay.",
      );
    }, 2000);
  };

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Save order to localStorage
      const newOrder = {
        bookingId: bookingDetails.bookingId,
        carName: carData.name,
        carImage: carData.images[0],
        renterName: bookingDetails.renterName,
        phone: bookingDetails.phone,
        email: bookingDetails.email,
        pickupDate: bookingDetails.pickupDate,
        pickupTime: bookingDetails.pickupTime,
        returnDate: bookingDetails.returnDate,
        returnTime: bookingDetails.returnTime,
        pickupLocation: bookingDetails.pickupLocation,
        duration: bookingDetails.duration,
        rentalType: bookingDetails.rentalType,
        driverService: bookingDetails.driverService,
        carPrice: bookingDetails.carPrice,
        driverFee: bookingDetails.driverFee,
        insurance: bookingDetails.insurance,
        additionalInsurance: bookingDetails.additionalInsurance,
        serviceFee: bookingDetails.serviceFee,
        deposit: bookingDetails.deposit,
        discount: bookingDetails.discount,
        total: bookingDetails.total,
        totalDeposit: bookingDetails.totalDeposit,
        status: "pending" as const,
        createdAt: new Date().toLocaleString("vi-VN"),
        paymentMethod: paymentMethod,
        transmission: carData.transmission,
        seats: carData.seats,
        fuel: carData.fuel,
      };

      // Get existing orders from localStorage
      const savedOrders = localStorage.getItem("bookingOrders");
      const orders = savedOrders ? JSON.parse(savedOrders) : [];

      // Add new order to the beginning of the array
      orders.unshift(newOrder);

      // Save back to localStorage
      localStorage.setItem("bookingOrders", JSON.stringify(orders));

      // Debug log
      console.log("✅ Đã lưu đơn hàng:", newOrder.bookingId);
      console.log(
        "📦 Tất cả đơn hàng:",
        orders.map((o) => o.bookingId),
      );

      toast({
        title: "Thanh toán thành công!",
        description: "Đặt xe của bạn đã được xác nhận.",
      });

      setTimeout(() => {
        setShowPaymentDialog(false);
        setPaymentSuccess(false);
        setCurrentStep(1);
      }, 3000);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Đã sao chép! Nội dung đã được sao chép vào clipboard.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {contextHolder}
      <div className="mx-auto px-6 sm:px-12 md:px-24 lg:px-[150px] py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Quay lại</span>
        </button>

        {/* Image Gallery Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Large Image */}
            <div className="lg:col-span-2">
              <div className="relative rounded-2xl overflow-hidden bg-gray-200 aspect-[16/10]">
                <img
                  src={carData.images[selectedImage]}
                  alt={carData.name}
                  className="w-full h-full object-cover"
                />
                {/* Navigation Arrows */}
                <button
                  onClick={() =>
                    setSelectedImage(
                      (prev) =>
                        (prev - 1 + carData.images.length) %
                        carData.images.length,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImage(
                      (prev) => (prev + 1) % carData.images.length,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {carData.images.length}
                </div>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {carData.images.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer aspect-[16/10] ${
                    selectedImage === index
                      ? "ring-4 ring-green-500"
                      : "ring-2 ring-gray-200 hover:ring-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 2 && carData.images.length > 3 && (
                    <button className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold hover:bg-black/60">
                      Xem tất cả ảnh
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Đặc điểm */}
            <Card className="shadow-sm border">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Đặc điểm
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Settings className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Truyền động</p>
                    <p className="font-bold text-gray-900">
                      {carData.transmission}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Số ghế</p>
                    <p className="font-bold text-gray-900">
                      {carData.seats} chỗ
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Fuel className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Nhiên liệu</p>
                    <p className="font-bold text-gray-900">{carData.fuel}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Fuel className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Tiêu hao</p>
                    <p className="font-bold text-gray-900">
                      {carData.fuelConsumption}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mô tả */}
            <Card className="shadow-sm border">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Mô tả</h3>
                <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
                  <p>
                    - Ngoài các ưu đãi về giá BF Car Rental còn hỗ trợ thêm cho
                    Quý Khách hàng các Chính sách như sau:
                  </p>
                  <p>* Hoàn Tiền do xăng dư.</p>
                  <p>* Miễn phí vượt dưới 1h.</p>
                  <p>* Miễn phí vượt dưới 10Km.</p>
                  <p className="text-gray-500">
                    - Sử dụng miễn phí: Nước- Đồ ăn vặt, Khăn giấy có trong gói
                    MICAR KIT khi thuê xe
                  </p>
                  <p className="text-gray-500">
                    - Mazda 2 là mẫu dòng xe Sedan hạng B. Xe được thiết kế thể
                    thao và hiện đại, với các đường cắt sắc, sảo và đồng bộ tạo
                    nên độ bóng bẩy và mạnh mẽ cho chiếc xe
                  </p>
                </div>
                <button className="text-green-600 text-sm font-semibold hover:underline mt-4">
                  Xem thêm
                </button>
              </CardContent>
            </Card>

            {/* Các tiện nghi khác */}
            <Card className="shadow-sm border">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Các tiện nghi khác
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4">
                  {[
                    { name: "Bluetooth", icon: "bluetooth" },
                    { name: "Camera hành trình", icon: "camera" },
                    { name: "Định vị GPS", icon: "map-pin" },
                    { name: "Camera lùi", icon: "camera" },
                    { name: "Khe cắm USB", icon: "usb" },
                    { name: "Cảm biến lốp", icon: "gauge" },
                    { name: "Lốp dự phòng", icon: "circle" },
                    { name: "Màn hình DVD", icon: "tv" },
                    { name: "ETC", icon: "ticket" },
                    { name: "Túi khí an toàn", icon: "shield" },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <Check className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                      <span>{feature.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Giấy tờ thuê xe */}
            <Card className="shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Giấy tờ thuê xe
                  </h3>
                  <button className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 text-xs font-bold hover:border-gray-600 hover:text-gray-600">
                    ?
                  </button>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Chọn 1 trong 2 hình thức
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm mb-1">
                        GPLX (đối chiếu) & Passport (giữ lại)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm mb-1">
                        GPLX (đối chiếu) & CCCD (đối chiếu VNeID)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tài sản thế chấp */}
            <Card className="shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Tài sản thế chấp
                  </h3>
                  <button className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 text-xs font-bold hover:border-gray-600 hover:text-gray-600">
                    ?
                  </button>
                </div>

                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <p className="text-sm text-gray-700">
                    Không yêu cầu khách thuê thế chấp Tiền mặt hoặc Xe máy
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Điều khoản */}
            <Card className="shadow-sm border">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Điều khoản
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">
                    # Thanh toán tiền thuê ngay khi bàn giao xe
                  </p>
                  <p>Quy định khác:</p>
                  <p>- Sử dụng xe đúng mục đích.</p>
                  <p>
                    - Không sử dụng xe thuê vào mục đích phi pháp, trái pháp
                    luật.
                  </p>
                  <p>- Không sử dụng xe thuê để cầm cố, thế chấp.</p>
                  <p>- Không hút thuốc, nhả kẹo cao su, xả rác trong xe.</p>
                </div>
                <button className="text-green-600 text-sm font-semibold hover:underline mt-4">
                  Xem thêm
                </button>
              </CardContent>
            </Card>

            {/* Chính sách huỷ chuyến */}
            <Card className="shadow-sm border">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Chính sách huỷ chuyến
                </h3>
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">
                          Thời Điểm Hủy Chuyến
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-900 border-b">
                          Phí Hủy Chuyến
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y">
                      <tr>
                        <td className="px-4 py-3 text-gray-700">
                          Trong Vòng 1h Sau Giữ Chỗ
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-semibold">
                              Miễn phí
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="text-gray-700">
                            Trước Chuyến Đi &gt;7 Ngày
                          </div>
                          <div className="text-xs text-gray-500">
                            (Sau 1h Giữ Chỗ)
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-semibold">
                              10% giá trị chuyến đi
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          <div className="text-gray-700">
                            Trong Vòng 7 Ngày Trước Chuyến Đi
                          </div>
                          <div className="text-xs text-gray-500">
                            (Sau 1h Giữ Chỗ)
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <X className="w-4 h-4 text-red-600" />
                            <span className="text-red-600 font-semibold">
                              40% giá trị chuyến đi
                            </span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 space-y-2 text-xs text-gray-600">
                  <p>
                    * Chính sách hủy chuyến áp dụng chung cho cả khách thuê và
                    chủ xe (ngoại ra, tùy vào thời điểm hủy chuyến, chủ xe có
                    thể bị đánh giá từ 2-3* trên hệ thống).
                  </p>
                  <p>
                    * Khách thuê không nhận xe sẽ mất phí hủy chuyến (40% giá
                    trị chuyến đi).
                  </p>
                  <p>
                    * Chủ xe không giao xe sẽ hoàn tiền giữ chỗ & bồi thường phí
                    hủy chuyến cho khách thuê (40% giá trị chuyến đi).
                  </p>
                  <p>
                    * Tiền giữ chỗ & bồi thường do chủ xe hủy chuyến (nếu có) sẽ
                    được BF Car Rental hoàn trả đến khách thuê bằng chuyển khoản
                    ngân hàng trong vòng 1-3 ngày làm việc kể tiếp. Xem thêm{" "}
                    <button className="text-green-600 font-semibold hover:underline">
                      Thủ tục hoàn tiền & bồi thường hủy chuyến
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vị trí xe */}
            <Card className="shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Vị trí xe</h3>
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    {showMap ? "Ẩn bản đồ" : "Xem bản đồ"}
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        showMap ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Phường Linh Đông, TP Thủ Đức
                    </p>
                  </div>
                </div>

                <p className="text-sm text-blue-600 mb-4">
                  Địa chỉ cụ thể sẽ được hiển thị sau khi thanh toán giữ chỗ
                </p>

                {/* Google Map */}
                {showMap && (
                  <div className="mt-4 rounded-lg overflow-hidden border-2 border-gray-200">
                    {/* Google Map api */}
                    <LoadScript googleMapsApiKey="AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
                        zoom={15}
                        options={{
                          zoomControl: true,
                          streetViewControl: true,
                          mapTypeControl: true,
                          fullscreenControl: true,
                        }}
                      >
                        <Marker position={center} />
                      </GoogleMap>
                    </LoadScript>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Car Info (Same width as main image) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Bảo hiểm thuê xe */}
              <Card className="border-2 border-green-100 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">
                        Bảo hiểm thuê xe
                      </h3>
                      <p className="text-gray-600 text-xs mb-2">
                        Chuyến đi có mua bảo hiểm. Khách thuê bồi thường tối đa{" "}
                        <span className="font-semibold text-gray-900">
                          2.000.000 VNĐ
                        </span>{" "}
                        trong trường hợp có sự cố ngoài ý muốn.
                      </p>
                      <button className="text-green-600 text-xs font-semibold hover:underline">
                        Xem thêm ›
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bảo hiểm bổ sung */}
              <Card className="border-2 shadow-lg">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-900">
                      Bảo hiểm bổ sung
                    </h3>
                    <Badge className="bg-red-500 text-white text-xs">MỚI</Badge>
                  </div>

                  <div className="space-y-3">
                    {/* Insurance Option 1 */}
                    <div
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        additionalInsurance
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-500"
                      }`}
                      onClick={() =>
                        setAdditionalInsurance(!additionalInsurance)
                      }
                    >
                      <input
                        type="checkbox"
                        checked={additionalInsurance}
                        onChange={(e) =>
                          setAdditionalInsurance(e.target.checked)
                        }
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-gray-900">
                            Bảo hiểm người trên xe
                          </p>
                          <p className="text-green-600 font-bold text-xs">
                            40.000đ/ngày
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          Trường hợp xảy ra sự cố đáng tiếc, tất cả người ngồi
                          trên xe được bảo hiểm với giá trị lên đến{" "}
                          <span className="font-semibold">
                            300.000.000 VNĐ/người
                          </span>
                          .
                        </p>
                        <button
                          className="text-green-600 text-xs font-semibold hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Xem thêm ›
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border">
                <CardContent className="p-5">
                  {/* Car Title & Actions */}
                  <div className="flex items-start justify-between mb-3">
                    <h1 className="text-xl font-bold text-gray-900">
                      {carData.name}
                    </h1>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        <Heart
                          className="w-5 h-5 text-gray-600"
                          fill={isFavorite ? "currentColor" : "none"}
                        />
                      </button>
                      <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                        <Share2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Rating & Trips */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-sm">
                        {carData.rating}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {carData.trips} chuyến
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {carData.location}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b">
                    <Badge className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-100">
                      <Check className="w-3 h-3 mr-1" />
                      Miễn thế chấp
                    </Badge>
                    <Badge className="bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100">
                      <MapPin className="w-3 h-3 mr-1" />
                      Giao xe tận nơi
                    </Badge>
                  </div>

                  {/* Price Section */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-400 line-through text-sm">
                        {carData.originalPrice.toLocaleString()}K
                      </span>
                      <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                        {carData.discount}%
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {carData.price.toLocaleString()}K
                      </span>
                      <span className="text-gray-500">/ngày</span>
                    </div>
                  </div>

                  {/* Date & Time Picker */}
                  <div className="space-y-3 mb-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block font-medium">
                          Nhận xe
                        </label>
                        <Input
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="h-9 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block font-medium">
                          <span className="invisible">.</span>
                        </label>
                        <Input
                          type="time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block font-medium">
                          Trả xe
                        </label>
                        <Input
                          type="date"
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="h-9 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block font-medium">
                          <span className="invisible">.</span>
                        </label>
                        <Input
                          type="time"
                          value={returnTime}
                          onChange={(e) => setReturnTime(e.target.value)}
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg mb-4">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700">
                      Chủ xe hỗ trợ thuê xe theo giờ.{" "}
                      <button className="text-blue-600 font-semibold hover:underline">
                        Tìm hiểu thêm
                      </button>
                    </p>
                  </div>

                  {/* Delivery Location */}
                  <div className="mb-4 pb-4 border-b">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Địa điểm giao nhận xe
                    </h4>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryOption === "pickup"}
                          onChange={() => setDeliveryOption("pickup")}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">
                              Tôi tự đến lấy xe
                            </span>
                            <Badge className="bg-green-50 text-green-700 text-xs border-0">
                              Miễn phí
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {carData.location}
                          </p>
                        </div>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryOption === "delivery"}
                          onChange={() => setDeliveryOption("delivery")}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">
                            Tôi muốn được giao xe tận nơi
                          </span>
                          {deliveryOption === "delivery" && (
                            <Input
                              type="text"
                              placeholder="Nhập địa chỉ giao xe"
                              value={deliveryAddress}
                              onChange={(e) =>
                                setDeliveryAddress(e.target.value)
                              }
                              className="mt-2 text-sm"
                            />
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        Đơn giá thuê{" "}
                        <span className="text-gray-400">
                          ({rentalCalc.duration})
                        </span>
                      </span>
                      <span className="font-semibold text-gray-900">
                        {rentalCalc.carPrice.toLocaleString()}đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Bảo hiểm thuê xe</span>
                      <span className="font-semibold text-gray-900">
                        {rentalCalc.insurance.toLocaleString()}đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Phí dịch vụ</span>
                      <span className="font-semibold text-gray-900">
                        {rentalCalc.serviceFee.toLocaleString()}đ
                      </span>
                    </div>
                    {additionalInsurance &&
                      rentalCalc.additionalInsurance > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            Bảo hiểm người trên xe{" "}
                            <span className="text-gray-400">
                              (40.000đ x {rentalCalc.rentalDays} ngày)
                            </span>
                          </span>
                          <span className="font-semibold text-gray-900">
                            {rentalCalc.additionalInsurance.toLocaleString()}đ
                          </span>
                        </div>
                      )}
                    {rentalCalc.discount > 0 && (
                      <div className="flex items-center justify-between text-sm text-green-600">
                        <span>Giảm giá ({carData.discount}%)</span>
                        <span className="font-semibold">
                          -{rentalCalc.discount.toLocaleString()}đ
                        </span>
                      </div>
                    )}
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-gray-900">
                        Tổng cộng
                      </span>
                      <span className="text-xl font-bold text-green-600">
                        {rentalCalc.total.toLocaleString()}đ
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={handleBookingClick}
                    className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-semibold text-base"
                  >
                    {isLoggedIn ? "Chọn thuê" : "Đăng nhập để đặt xe"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Login Dialog */}
        <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center text-gray-900">
                Đăng nhập
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Vui lòng đăng nhập để tiếp tục đặt xe
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleLoginSubmit} className="space-y-3 mt-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="username"
                  className="text-gray-700 font-medium text-sm"
                >
                  Tài khoản<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin, staff hoặc user"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                  className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-gray-700 font-medium text-sm"
                >
                  Mật khẩu<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="admin123, staff123 hoặc user123"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                  className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="captcha"
                  className="text-gray-700 font-medium text-sm"
                >
                  Captcha<span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="captcha"
                    type="text"
                    placeholder="Nhập captcha"
                    value={loginData.captcha}
                    onChange={(e) =>
                      setLoginData({ ...loginData, captcha: e.target.value })
                    }
                    className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    required
                  />
                  <div
                    className="h-10 px-4 bg-white border-2 border-gray-300 rounded-md flex items-center justify-center font-bold text-lg tracking-widest select-none"
                    style={{
                      fontFamily: "monospace",
                      letterSpacing: "0.2em",
                      textDecoration: "line-through",
                    }}
                  >
                    {captchaText}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm"
              >
                TRUY CẬP HỆ THỐNG
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginDialog(false);
                    navigate("/login");
                  }}
                  className="text-sm text-blue-600 hover:underline font-medium block w-full"
                >
                  Quên mật khẩu?
                </button>
                <p className="text-xs text-gray-500">
                  Tài khoản test:{" "}
                  <span className="font-semibold">admin/admin123</span>,{" "}
                  <span className="font-semibold">staff/staff123</span> hoặc{" "}
                  <span className="font-semibold">user/user123</span>
                </p>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* GPLX Verification Dialog */}
        <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-600">
                Xin chào Quý khách hàng
              </DialogTitle>
              <DialogDescription className="text-base text-gray-700 mt-3">
                Để đảm bảo an toàn cho chuyến đi của bạn, chúng tôi cần xác thực
                Giấy phép lái xe (GPLX) của bạn. Vui lòng tải lên ảnh chụp rõ
                nét cả hai mặt của GPLX.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Instructions Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Hướng dẫn
                </h3>
                <ul className="text-sm text-blue-900 space-y-1 ml-7">
                  <li>• Chụp ảnh GPLX rõ ràng, không mờ, không chói sáng</li>
                  <li>• Đảm bảo tất cả thông tin trên GPLX có thể đọc được</li>
                  <li>• Ảnh phải là bản gốc, không chỉnh sửa</li>
                  <li>• Định dạng: JPG, PNG, JPEG (tối đa 5MB)</li>
                </ul>
              </div>

              {/* Upload Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Front Image Upload */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    Mặt trước GPLX<span className="text-red-500">*</span>
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                    {frontPreview ? (
                      <div className="space-y-2">
                        <img
                          src={frontPreview}
                          alt="Front preview"
                          className="w-full h-48 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFrontImage(null);
                            setFrontPreview(null);
                          }}
                          className="w-full"
                        >
                          Chọn ảnh khác
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <div className="space-y-2 py-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-sm text-gray-600">
                            <span className="text-green-600 font-semibold">
                              Chọn ảnh
                            </span>
                            <br />
                            hoặc kéo thả vào đây
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={(e) => handleFileChange(e, "front")}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Back Image Upload */}
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">
                    Mặt sau GPLX<span className="text-red-500">*</span>
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-500 transition-colors">
                    {backPreview ? (
                      <div className="space-y-2">
                        <img
                          src={backPreview}
                          alt="Back preview"
                          className="w-full h-48 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setBackImage(null);
                            setBackPreview(null);
                          }}
                          className="w-full"
                        >
                          Chọn ảnh khác
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <div className="space-y-2 py-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-sm text-gray-600">
                            <span className="text-green-600 font-semibold">
                              Chọn ảnh
                            </span>
                            <br />
                            hoặc kéo thả vào đây
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={(e) => handleFileChange(e, "back")}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ghi chú
                </h3>
                <ul className="text-sm text-yellow-900 space-y-1 ml-7">
                  <li>
                    • GPLX phải còn hiệu lực và phù hợp với loại xe bạn thuê
                  </li>
                  <li>
                    • Thông tin trên GPLX phải khớp với thông tin tài khoản
                  </li>
                  <li>• Quá trình xác thực có thể mất 1-2 phút</li>
                  <li>• Thông tin của bạn được bảo mật tuyệt đối</li>
                </ul>
              </div>

              {/* Submit Button */}
              <Button
                type="button"
                onClick={handleVerifySubmit}
                disabled={!frontImage || !backImage}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Xác thực ngay
              </Button>

              <p className="text-xs text-center text-gray-500">
                Bằng việc xác thực, bạn đồng ý cho phép chúng tôi sử dụng thông
                tin GPLX của bạn để xác minh danh tính
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto">
            {!paymentSuccess ? (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    Thanh toán đặt xe
                  </DialogTitle>
                  <DialogDescription>
                    Hoàn tất các bước để xác nhận đặt xe của bạn
                  </DialogDescription>
                </DialogHeader>

                {/* Steps Indicator */}
                <div className="flex items-center justify-center gap-4 my-6">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentStep >= 1
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      1
                    </div>
                    <span className="ml-2 text-sm font-medium">Xác nhận</span>
                  </div>
                  <div className="w-16 h-1 bg-gray-200">
                    <div
                      className={`h-full ${
                        currentStep >= 2 ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentStep >= 2
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      2
                    </div>
                    <span className="ml-2 text-sm font-medium">Thanh toán</span>
                  </div>
                  <div className="w-16 h-1 bg-gray-200">
                    <div
                      className={`h-full ${
                        currentStep >= 3 ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentStep >= 3
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      3
                    </div>
                    <span className="ml-2 text-sm font-medium">Hoàn tất</span>
                  </div>
                </div>

                <Separator />

                {/* Step 1: Xác nhận thông tin */}
                {currentStep === 1 && (
                  <div className="space-y-6 py-4">
                    {/* Thông tin người thuê */}
                    <div>
                      <h3 className="text-base font-bold mb-3">
                        Tên người thuê<span className="text-red-500">*</span>
                      </h3>
                      <Input
                        value={bookingDetails.renterName}
                        placeholder="Chú bộ đội"
                        className="mb-3"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-base font-bold mb-3">
                          Số điện thoại<span className="text-red-500">*</span>
                        </h3>
                        <Input
                          value={bookingDetails.phone}
                          placeholder="Nhập 09xxxxx"
                        />
                        <p className="text-xs text-red-500 mt-1">
                          Vui lòng xác thực số điện thoại để sử dụng các dịch vụ
                          của Green Future
                        </p>
                      </div>
                      <div>
                        <h3 className="text-base font-bold mb-3">
                          Email<span className="text-red-500">*</span>
                        </h3>
                        <Input
                          value={bookingDetails.email}
                          placeholder="Xác thực"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="vingroup"
                        className="rounded"
                      />
                      <label htmlFor="vingroup" className="text-sm">
                        Tôi là CBNV tập đoàn Vingroup
                      </label>
                    </div>

                    {/* Nơi nhận xe */}
                    <div>
                      <h3 className="text-base font-bold mb-3">
                        Nơi nhận xe<span className="text-red-500">*</span>
                      </h3>
                      <div className="bg-gray-50 border rounded-lg p-3 flex items-start gap-2">
                        <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold">
                            {bookingDetails.pickupLocation}
                          </p>
                          <p className="text-sm text-gray-600">
                            {bookingDetails.duration} •{" "}
                            {bookingDetails.pickupDate}{" "}
                            {bookingDetails.pickupTime} →{" "}
                            {bookingDetails.returnDate}{" "}
                            {bookingDetails.returnTime}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Hình thức thuê: {bookingDetails.rentalType}
                          </p>
                        </div>
                        <button className="text-blue-600 hover:underline text-sm">
                          ✎
                        </button>
                      </div>
                    </div>

                    {/* Thêm dịch vụ */}
                    <div>
                      <h3 className="text-base font-bold mb-3">Thêm dịch vụ</h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-gray-600" />
                          <span className="text-sm">Thuê tài xế</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Bảng kê chi tiết */}
                    <div>
                      <h3 className="text-base font-bold mb-3">
                        Bảng kê chi tiết
                      </h3>
                      <Card>
                        <CardContent className="p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Đơn giá thuê ({bookingDetails.duration})
                            </span>
                            <span className="font-semibold">
                              {bookingDetails.carPrice.toLocaleString()}đ
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Bảo hiểm thuê xe
                            </span>
                            <span className="font-semibold">
                              {bookingDetails.insurance.toLocaleString()}đ
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Phí dịch vụ</span>
                            <span className="font-semibold">
                              {bookingDetails.serviceFee.toLocaleString()}đ
                            </span>
                          </div>
                          {additionalInsurance &&
                            bookingDetails.additionalInsurance > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  Bảo hiểm người trên xe{" "}
                                  <span className="text-gray-400">
                                    (40.000đ x {rentalCalc.rentalDays} ngày)
                                  </span>
                                </span>
                                <span className="font-semibold">
                                  {bookingDetails.additionalInsurance.toLocaleString()}
                                  đ
                                </span>
                              </div>
                            )}
                          {bookingDetails.discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                              <span>Giảm giá ({carData.discount}%)</span>
                              <span className="font-semibold">
                                -{bookingDetails.discount.toLocaleString()}đ
                              </span>
                            </div>
                          )}
                          <Separator className="my-2" />
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tiền đặt cọc</span>
                            <span className="font-semibold text-orange-600">
                              {bookingDetails.deposit.toLocaleString()}đ
                            </span>
                          </div>
                          <Separator className="my-2" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-orange-400 text-white text-xs flex items-center justify-center">
                                ★
                              </span>
                              <span className="text-sm">Sử dụng Vpoints</span>
                              <button className="text-blue-600 hover:underline text-xs">
                                ℹ️
                              </button>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            Bạn không có Vpoints để sử dụng
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Thanh toán */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg">
                          Thanh toán<span className="text-red-500">*</span>
                        </span>
                        <span className="font-bold text-2xl text-green-600">
                          {bookingDetails.total.toLocaleString()}đ
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        *Giá thuê xe đã bao gồm VAT và bảo hiểm.
                      </p>
                    </div>

                    {/* Mã giới thiệu và Voucher */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">
                          Mã giới thiệu
                        </Label>
                        <Input placeholder="Nhập mã" />
                      </div>
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">
                          Ghi chú
                        </Label>
                        <Input placeholder="Nhập ghi chú" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-2 block">
                        Phương thức thanh toán
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setPaymentMethod("qr")}
                          className={`border-2 rounded-lg p-4 text-left flex items-center gap-3 transition-all ${
                            paymentMethod === "qr"
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          <QrCode
                            className={`w-6 h-6 ${paymentMethod === "qr" ? "text-green-600" : "text-gray-500"}`}
                          />
                          <div>
                            <p className="font-semibold text-sm">Quét mã QR</p>
                            <p className="text-xs text-gray-500">
                              Thanh toán nhanh
                            </p>
                          </div>
                          {paymentMethod === "qr" && (
                            <Check className="w-5 h-5 text-green-600 ml-auto" />
                          )}
                        </button>
                        <button
                          onClick={() => setPaymentMethod("bank")}
                          className={`border-2 rounded-lg p-4 text-left flex items-center gap-3 transition-all ${
                            paymentMethod === "bank"
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          <CreditCard
                            className={`w-6 h-6 ${paymentMethod === "bank" ? "text-green-600" : "text-gray-500"}`}
                          />
                          <div>
                            <p className="font-semibold text-sm">
                              Chuyển khoản
                            </p>
                            <p className="text-xs text-gray-500">Ngân hàng</p>
                          </div>
                          {paymentMethod === "bank" && (
                            <Check className="w-5 h-5 text-green-600 ml-auto" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-2 block">
                        Chương trình khuyến mãi
                      </Label>
                      <button className="w-full border rounded-lg p-3 text-left flex justify-between items-center hover:border-green-500">
                        <span className="text-gray-500">
                          Chọn Chương trình khuyến mãi
                        </span>
                        <span className="text-gray-400">›</span>
                      </button>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-2 block">
                        Voucher
                      </Label>
                      <Input placeholder="Nhập mã voucher" />
                    </div>

                    {/* Điều khoản */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="terms1"
                          className="mt-1"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <label
                          htmlFor="terms1"
                          className="text-xs text-gray-700 cursor-pointer"
                        >
                          Đã đọc và đồng ý với{" "}
                          <a href="#" className="text-blue-600 underline">
                            Điều khoản thanh toán
                          </a>{" "}
                          của Green Future
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id="terms2"
                          className="mt-1"
                          checked={policyAccepted}
                          onChange={(e) => setPolicyAccepted(e.target.checked)}
                        />
                        <label
                          htmlFor="terms2"
                          className="text-xs text-gray-700 cursor-pointer"
                        >
                          Tôi đồng ý để lại thông tin tìm có nhận theo{" "}
                          <a href="#" className="text-blue-600 underline">
                            Điều khoản chia sẻ liệu cá nhân
                          </a>{" "}
                          của Green Future
                        </label>
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        if (!termsAccepted || !policyAccepted) {
                          showWarning(
                            "Vui lòng đồng ý với các điều khoản để tiếp tục",
                          );
                          return;
                        }
                        if (!paymentMethod) {
                          showWarning("Vui lòng chọn phương thức thanh toán");
                          return;
                        }
                        setCurrentStep(2);
                      }}
                      className={`w-full h-12 font-semibold ${
                        paymentMethod && termsAccepted && policyAccepted
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={
                        !paymentMethod || !termsAccepted || !policyAccepted
                      }
                    >
                      Thanh toán {bookingDetails.total.toLocaleString()}đ
                    </Button>
                  </div>
                )}

                {/* Step 2: Thanh toán */}
                {currentStep === 2 && (
                  <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">
                        {paymentMethod === "qr"
                          ? "Thanh toán bằng mã QR"
                          : "Chuyển khoản ngân hàng"}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentStep(1);
                        }}
                      >
                        Đổi phương thức
                      </Button>
                    </div>

                    {/* Credit Card Display */}
                    <div className="flex justify-center mb-6">
                      <CardCredit />
                    </div>

                    {/* QR Payment */}
                    {paymentMethod === "qr" && (
                      <div className="space-y-4">
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 flex flex-col items-center">
                          <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
                            <div className="w-64 h-64 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center rounded-lg">
                              <div className="text-center">
                                <QrCode className="w-32 h-32 mx-auto text-gray-600 mb-2" />
                                <p className="text-sm text-gray-600">
                                  Mã QR thanh toán
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-center font-semibold text-lg mb-2">
                            Số tiền: {bookingDetails.total.toLocaleString()}đ
                          </p>
                          <p className="text-center text-sm text-gray-600">
                            Mã đặt xe: {bookingDetails.bookingId}
                          </p>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                          <div className="flex items-start gap-2">
                            <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-700">
                              <p className="font-semibold mb-1">
                                Hướng dẫn thanh toán:
                              </p>
                              <p>1. Mở ứng dụng ngân hàng của bạn</p>
                              <p>2. Quét mã QR trên màn hình</p>
                              <p>3. Xác nhận thanh toán</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bank Transfer */}
                    {paymentMethod === "bank" && (
                      <div className="space-y-4">
                        <Card>
                          <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <Label className="text-sm text-gray-600">
                                  Ngân hàng
                                </Label>
                                <p className="font-semibold">
                                  {bookingDetails.bankAccount.bank}
                                </p>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <Label className="text-sm text-gray-600">
                                  Số tài khoản
                                </Label>
                                <p className="font-semibold">
                                  {bookingDetails.bankAccount.number}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(
                                    bookingDetails.bankAccount.number,
                                  )
                                }
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <Label className="text-sm text-gray-600">
                                  Chủ tài khoản
                                </Label>
                                <p className="font-semibold">
                                  {bookingDetails.bankAccount.name}
                                </p>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <Label className="text-sm text-gray-600">
                                  Số tiền
                                </Label>
                                <p className="font-semibold text-green-600">
                                  {bookingDetails.total.toLocaleString()}đ
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(
                                    bookingDetails.total.toString(),
                                  )
                                }
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <Label className="text-sm text-gray-600">
                                  Nội dung chuyển khoản
                                </Label>
                                <p className="font-semibold text-orange-600">
                                  {bookingDetails.bankAccount.content}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  copyToClipboard(
                                    bookingDetails.bankAccount.content,
                                  )
                                }
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-orange-700">
                              <p className="font-semibold mb-1">Quan trọng:</p>
                              <p>
                                Vui lòng chuyển khoản ĐÚNG nội dung để hệ thống
                                tự động xác nhận thanh toán
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        className="flex-1"
                      >
                        Quay lại
                      </Button>
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {isProcessing ? "Đang xử lý..." : "Xác nhận thanh toán"}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Payment Success
              <SuccessResult
                title="Đặt xe thành công!"
                subTitle={`Mã đơn hàng: ${bookingDetails.bookingId}. Chúng tôi đã gửi xác nhận qua email và tin nhắn. Chủ xe sẽ liên hệ với bạn trong thời gian sớm nhất.`}
                onGoConsole={() => {
                  setShowPaymentDialog(false);
                  setPaymentSuccess(false);
                  navigate(`/order/${bookingDetails.bookingId}`);
                }}
                onBuyAgain={() => {
                  setShowPaymentDialog(false);
                  setPaymentSuccess(false);
                  navigate("/");
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
