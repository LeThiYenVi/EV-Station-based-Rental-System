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
  Zap,
} from "lucide-react";
import { useVehicle } from "@/hooks/useVehicle";
import { useBooking } from "@/hooks/useBooking";
import { useUser } from "@/hooks/useUser";
import type { BookingWithPaymentResponse } from "@/service/types/booking.types";

// Default images when API returns null photos
const defaultImages = [
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 10.8494,
  lng: 106.7619,
};

export default function CarIn4() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contextHolder, showSuccess, showError, showWarning, showInfo } =
    useMessage();

  // API hooks
  const { getVehicleById, loading: vehicleLoading } = useVehicle();
  const { createBooking, loading: bookingLoading } = useBooking();
  const {
    getMyStats,
    uploadLicenseCardFront,
    uploadLicenseCardBack,
    loading: userLoading,
  } = useUser();

  // Vehicle data from API
  const [vehicleData, setVehicleData] = useState<any>(null);

  // Current user data from API
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  // Booking API response
  const [bookingResponse, setBookingResponse] =
    useState<BookingWithPaymentResponse | null>(null);
  const [pickupNote, setPickupNote] = useState<string>("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("momo");
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
  const [isUploadingLicense, setIsUploadingLicense] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    front: boolean;
    back: boolean;
  }>({ front: false, back: false });

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

  // Load vehicle data from API
  useEffect(() => {
    const loadVehicleData = async () => {
      if (!id) return;

      const result = await getVehicleById(id);
      if (result.success && result.data) {
        setVehicleData(result.data);
      }
    };

    loadVehicleData();
  }, [id]);

  // Helper function to get vehicle images
  const getVehicleImages = () => {
    if (vehicleData?.photos && vehicleData.photos.length > 0) {
      return vehicleData.photos;
    }
    return defaultImages;
  };

  // Calculate rental details
  const calculateRentalDetails = () => {
    const pickup = new Date(`${pickupDate}T${pickupTime}`);
    const returnD = new Date(`${returnDate}T${returnTime}`);
    const diffMs = returnD.getTime() - pickup.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);

    // Tính giá thuê - sử dụng dailyRate từ API
    let rentalDays = diffDays > 0 ? diffDays : 1;
    const dailyRate = vehicleData?.dailyRate || 0;
    const carPrice = dailyRate * rentalDays;

    // Bảo hiểm thuê xe (10% giá xe)
    const insurance = Math.round(carPrice * 0.1);

    // Phí dịch vụ (5% giá xe)
    const serviceFee = Math.round(carPrice * 0.05);

    // Bảo hiểm bổ sung (nếu có)
    const additionalInsuranceCost = additionalInsurance
      ? additionalInsuranceFee * rentalDays
      : 0;

    // Tiền cọc - sử dụng depositAmount từ API
    const deposit = vehicleData?.depositAmount || 5000000;

    // Giảm giá (không có discount trong API, để 0)
    const discountAmount = 0;

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
    const checkLoginStatus = async () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const username = localStorage.getItem("username");
      const token = localStorage.getItem("accessToken");

      if (loggedIn && username) {
        setIsLoggedIn(true);
        setCurrentUser(username);

        // If user has token, fetch user data from API to check GPLX
        if (token) {
          try {
            const result = await getMyStats();
            if (result.success && result.data) {
              setCurrentUserData(result.data);

              // Check if user has uploaded GPLX (both front and back)
              const hasGPLX = !!(
                result.data.licenseCardFrontImageUrl &&
                result.data.licenseCardBackImageUrl
              );
              console.log("📄 GPLX Check:", {
                front: result.data.licenseCardFrontImageUrl,
                back: result.data.licenseCardBackImageUrl,
                hasGPLX,
              });

              setIsVerified(hasGPLX);
            }
          } catch (error) {
            console.error("Error fetching user data for GPLX check:", error);
            // Fallback to mock check if API fails
            const hasVerified = verifiedUsers.includes(username);
            setIsVerified(hasVerified);
          }
        } else {
          // No token, use mock verification
          const hasVerified = verifiedUsers.includes(username);
          setIsVerified(hasVerified);
        }
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
    renterName: currentUserData?.fullName || currentUser || "Khách hàng",
    phone: currentUserData?.phone || currentUserData?.phoneNumber || "09xxxxx",
    email: currentUserData?.email || "customer@gmail.com",
    pickupLocation:
      deliveryOption === "pickup"
        ? vehicleData?.stationName || "Trạm xe"
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
      name: "LE DUY KHANG",
      bank: "Sacombank bank",
      number: "050106092004",
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
    // Validate dates before proceeding
    const pickupDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const returnDateTime = new Date(`${returnDate}T${returnTime}`);
    const now = new Date();

    // Check if pickup date/time is in the past
    if (pickupDateTime < now) {
      showError(
        "Thời gian nhận xe không được trong quá khứ! Vui lòng chọn thời gian hợp lệ.",
      );
      return;
    }

    // Check if return date/time is before pickup
    if (returnDateTime <= pickupDateTime) {
      showError(
        "Thời gian trả xe phải sau thời gian nhận xe! Vui lòng chọn lại.",
      );
      return;
    }

    // Check minimum rental duration (at least 1 hour)
    const durationMs = returnDateTime.getTime() - pickupDateTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    if (durationHours < 1) {
      showError("Thời gian thuê tối thiểu là 1 giờ! Vui lòng chọn lại.");
      return;
    }

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
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      showError("Chỉ chấp nhận file ảnh định dạng JPG, PNG, JPEG!");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showError("Kích thước file không được vượt quá 5MB!");
      return;
    }

    if (side === "front") {
      setFrontImage(file);
      setFrontPreview(URL.createObjectURL(file));
    } else {
      setBackImage(file);
      setBackPreview(URL.createObjectURL(file));
    }
  };

  const handleVerifySubmit = async () => {
    if (!frontImage || !backImage) {
      showError("Vui lòng upload đầy đủ ảnh mặt trước và mặt sau GPLX!");
      return;
    }

    if (!currentUserData?.id) {
      showError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
      return;
    }

    setIsUploadingLicense(true);
    showInfo("Đang upload và xác thực GPLX... Vui lòng đợi!");

    try {
      // Upload front image
      setUploadProgress({ front: true, back: false });
      const frontResult = await uploadLicenseCardFront(
        currentUserData.id,
        frontImage,
      );

      if (!frontResult.success) {
        throw new Error(
          frontResult.error || "Không thể upload ảnh mặt trước GPLX!",
        );
      }

      // Upload back image
      setUploadProgress({ front: true, back: true });
      const backResult = await uploadLicenseCardBack(
        currentUserData.id,
        backImage,
      );

      if (!backResult.success) {
        throw new Error(
          backResult.error || "Không thể upload ảnh mặt sau GPLX!",
        );
      }

      // Success - update user data
      setCurrentUserData((prev: any) => ({
        ...prev,
        licenseCardFrontImageUrl:
          frontResult.data?.licenseCardFrontImageUrl || "",
        licenseCardBackImageUrl: backResult.data?.licenseCardBackImageUrl || "",
      }));

      // Close verify dialog and show payment dialog immediately
      setShowVerifyDialog(false);
      setIsVerified(true);

      // Show success toast
      showSuccess(
        "Xác thực thành công! GPLX của bạn đã được upload. Vui lòng đợi Staff phê duyệt trước khi đặt xe.",
      );

      // Reset upload state
      setFrontImage(null);
      setBackImage(null);
      setFrontPreview(null);
      setBackPreview(null);

      // Open payment dialog after a short delay to show toast first
      setTimeout(() => {
        setShowPaymentDialog(true);
      }, 500);
    } catch (error: any) {
      console.error("Error uploading license:", error);
      showError(error.message || "Có lỗi xảy ra khi upload GPLX!");
    } finally {
      setIsUploadingLicense(false);
      setUploadProgress({ front: false, back: false });
    }
  };

  // Create booking via API
  const handleCreateBooking = async (): Promise<boolean> => {
    if (!vehicleData?.id || !vehicleData?.stationId) {
      showError("Không tìm thấy thông tin xe hoặc trạm. Vui lòng thử lại.");
      return false;
    }

    setIsProcessing(true);

    try {
      // Build ISO datetime strings
      const startTime = new Date(
        `${pickupDate}T${pickupTime}:00`,
      ).toISOString();
      const expectedEndTime = new Date(
        `${returnDate}T${returnTime}:00`,
      ).toISOString();

      const bookingRequest = {
        vehicleId: vehicleData.id,
        stationId: vehicleData.stationId,
        startTime,
        expectedEndTime,
        pickupNote: pickupNote || undefined,
      };

      console.log("📤 Creating booking with:", bookingRequest);

      const result = await createBooking(bookingRequest);

      if (result) {
        console.log("✅ Booking created successfully:", result);
        setBookingResponse(result);

        // Update currentBookingId with actual booking code from API
        setCurrentBookingId(result.bookingCode);

        // Show success message - user still needs to complete payment
        if (result.momoPayment?.payUrl) {
          showSuccess(
            "Tạo đơn hàng thành công! Vui lòng hoàn tất thanh toán MoMo.",
          );
        } else {
          showSuccess("Tạo đơn hàng thành công! Vui lòng hoàn tất thanh toán.");
        }

        toast({
          title: "Tạo đơn hàng thành công!",
          description: `Mã đơn hàng: ${result.bookingCode}. Vui lòng hoàn tất thanh toán.`,
        });
        return true;
      } else {
        showError("Đặt xe thất bại. Vui lòng thử lại.");
        return false;
      }
    } catch (error: any) {
      console.error("❌ Error creating booking:", error);
      console.log("📋 Full error object:", error);
      console.log("📋 Error response:", error?.response);
      console.log("📋 Error data:", error?.response?.data);

      // Get error data from response
      const errorData = error?.response?.data;
      const errorText = errorData?.errors || errorData?.message || "";

      console.log("📋 Error text to check:", errorText);

      // Check for license verification error - comprehensive check
      const isLicenseError =
        errorText === "License number is required before booking" ||
        errorText?.includes?.("License number is required") ||
        errorText?.toLowerCase?.()?.includes?.("license");

      console.log("📋 Is license error?", isLicenseError);

      // Show error message to user
      if (isLicenseError) {
        console.log(
          "✅ Detected license error - showing toast and closing dialog",
        );
        showError(
          "Bằng lái xe chưa được xác thực! Vui lòng đợi Staff hoặc người có thẩm quyền phê duyệt GPLX của bạn trước khi đặt xe.",
        );
        setIsVerified(false);
      } else {
        console.log("❌ API error - showing error message and closing dialog");
        // Show specific error from backend if available
        const errorMessage = errorText || "Đặt xe thất bại. Vui lòng thử lại.";
        showError(errorMessage);
      }

      // Close payment dialog immediately and reset state
      setShowPaymentDialog(false);
      setCurrentStep(1);

      return false;
    } finally {
      setIsProcessing(false);
    }
    return false;
  };

  const handlePayment = () => {
    // Call API to create booking
    handleCreateBooking();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess("Đã sao chép! Nội dung đã được sao chép vào clipboard.");
  };

  // Get images for display
  const vehicleImages = getVehicleImages();

  // Loading state
  if (vehicleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin xe...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!vehicleData && !vehicleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Không tìm thấy xe</h2>
            <p className="text-gray-600 mb-6">
              Xe bạn tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate("/services/self-drive")}>
              Xem các xe khác
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                  src={vehicleImages[selectedImage]}
                  alt={vehicleData?.name}
                  className="w-full h-full object-cover"
                />
                {/* Navigation Arrows */}
                <button
                  onClick={() =>
                    setSelectedImage(
                      (prev) =>
                        (prev - 1 + vehicleImages.length) %
                        vehicleImages.length,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => {
                    const images = getVehicleImages();
                    setSelectedImage((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImage + 1} / {getVehicleImages().length}
                </div>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {getVehicleImages()
                .slice(0, 3)
                .map((image, index) => (
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
                    {index === 2 && getVehicleImages().length > 3 && (
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
                    <p className="font-bold text-gray-900">Tự động</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Số ghế</p>
                    <p className="font-bold text-gray-900">
                      {vehicleData?.capacity || 5} chỗ
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Zap className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Nhiên liệu</p>
                    <p className="font-bold text-gray-900">
                      {vehicleData?.fuelType === "ELECTRICITY"
                        ? "Điện"
                        : vehicleData?.fuelType || "Điện"}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      <Zap className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-500 mb-1">Tiêu hao</p>
                    <p className="font-bold text-gray-900">
                      {vehicleData?.fuelType === "ELECTRICITY"
                        ? "15kWh/100km"
                        : "7L/100km"}
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
              {/* Bảo hiểm bổ sung */}

              <Card className="shadow-lg border">
                <CardContent className="p-5">
                  {/* Car Title & Actions */}
                  <div className="flex items-start justify-between mb-3">
                    <h1 className="text-xl font-bold text-gray-900">
                      {vehicleData?.name || "Loading..."}
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
                        {vehicleData?.rating || 0}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center gap-1">
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">
                        {vehicleData?.rentCount || 0} chuyến
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">
                      {vehicleData?.stationName || "Đang tải..."}
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
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {(
                          (vehicleData?.dailyRate || 0) / 1000
                        ).toLocaleString()}
                        K
                      </span>
                      <span className="text-gray-500">/ngày</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Giá theo giờ:{" "}
                      {((vehicleData?.hourlyRate || 0) / 1000).toLocaleString()}
                      K/giờ
                    </p>
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
                          min={new Date().toISOString().split("T")[0]}
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
                          min={pickupDate}
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
                            {vehicleData?.stationName || "Đang tải..."}
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
                        <span>Giảm giá</span>
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
                disabled={!frontImage || !backImage || isUploadingLicense}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isUploadingLicense ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>
                      {uploadProgress.front && uploadProgress.back
                        ? "Đang xác thực..."
                        : uploadProgress.front
                          ? "Đang upload mặt sau..."
                          : "Đang upload mặt trước..."}
                    </span>
                  </div>
                ) : (
                  "Xác thực ngay"
                )}
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
                        readOnly
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
                          readOnly
                        />
                        {/* <p className="text-xs text-red-500 mt-1">
                          Vui lòng xác thực số điện thoại để sử dụng các dịch vụ
                          của Green Future
                        </p> */}
                      </div>
                      <div>
                        <h3 className="text-base font-bold mb-3">
                          Email<span className="text-red-500">*</span>
                        </h3>
                        <Input
                          value={bookingDetails.email}
                          placeholder="Xác thực"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="vingroup"
                        className="rounded"
                      />
                      <label htmlFor="vingroup" className="text-sm">
                        Tôi là CBNV tập đoàn Vingroup
                      </label>
                    </div> */}

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
                    {/* <div>
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
                    </div> */}

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
                              <span>Giảm giá</span>
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
                          {/* <div className="flex items-center justify-between">
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
                          </div> */}
                          {/* <p className="text-xs text-gray-500">
                            Bạn không có Vpoints để sử dụng
                          </p> */}
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
                          {bookingDetails.deposit.toLocaleString()}đ
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">
                        *Giá thuê xe đã bao gồm VAT và bảo hiểm.
                      </p>
                    </div>

                    {/* Mã giới thiệu và Ghi chú nhận xe */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold mb-2 block">
                          Ghi chú nhận xe
                        </Label>
                        <Input
                          placeholder="Nhập ghi chú khi nhận xe"
                          value={pickupNote}
                          onChange={(e) => setPickupNote(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-2 block">
                        Phương thức thanh toán
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => setPaymentMethod("momo")}
                          className={`border-2 rounded-lg p-4 text-left flex items-center gap-3 transition-all ${
                            paymentMethod === "momo"
                              ? "border-pink-500 bg-pink-50"
                              : "border-gray-200 hover:border-pink-300"
                          }`}
                        >
                          <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              M
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">Ví MoMo</p>
                            <p className="text-xs text-gray-500">
                              Thanh toán nhanh
                            </p>
                          </div>
                          {paymentMethod === "momo" && (
                            <Check className="w-5 h-5 text-pink-600 ml-auto" />
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
                      onClick={async () => {
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

                        // Create booking first to get booking code and payment info
                        const success = await handleCreateBooking();
                        // Only go to step 2 if booking was created successfully
                        if (success) {
                          setCurrentStep(2);
                        }
                      }}
                      disabled={
                        isProcessing ||
                        !paymentMethod ||
                        !termsAccepted ||
                        !policyAccepted
                      }
                      className={`w-full h-12 font-semibold ${
                        paymentMethod &&
                        termsAccepted &&
                        policyAccepted &&
                        !isProcessing
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isProcessing
                        ? "Đang tạo đơn..."
                        : `Tiếp tục thanh toán ${bookingDetails.deposit.toLocaleString()}đ`}
                    </Button>
                  </div>
                )}

                {/* Step 2: Thanh toán */}
                {currentStep === 2 && (
                  <div className="space-y-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">
                        {paymentMethod === "momo"
                          ? "Thanh toán qua MoMo"
                          : "Chuyển khoản ngân hàng"}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentStep(1);
                          // Reset booking response if going back
                          if (paymentMethod === "momo") {
                            setBookingResponse(null);
                          }
                        }}
                      >
                        Đổi phương thức
                      </Button>
                    </div>

                    {/* MoMo Payment */}
                    {paymentMethod === "momo" && (
                      <div className="space-y-4">
                        {bookingResponse?.momoPayment?.payUrl ? (
                          <>
                            {/* MoMo Payment iframe/link */}
                            <div className="bg-pink-50 border-2 border-pink-200 rounded-lg p-6">
                              <div className="text-center mb-4">
                                <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                  <span className="text-white font-bold text-2xl">
                                    M
                                  </span>
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">
                                  Thanh toán MoMo
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  Mã đơn: {bookingResponse.bookingCode}
                                </p>
                              </div>

                              <div className="bg-white rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-gray-600">
                                    Số tiền thanh toán:
                                  </span>
                                  <span className="text-xl font-bold text-pink-600">
                                    {bookingResponse.totalAmount?.toLocaleString() ||
                                      bookingDetails.deposit.toLocaleString()}
                                    đ
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-500">
                                    Trạng thái:
                                  </span>
                                  <span className="text-orange-600 font-medium">
                                    Chờ thanh toán
                                  </span>
                                </div>
                              </div>

                              {/* QR Code from MoMo */}
                              {bookingResponse.momoPayment.qrCodeUrl && (
                                <div className="bg-white p-4 rounded-lg mb-4 flex flex-col items-center">
                                  <p className="text-sm text-gray-600 mb-3">
                                    Quét mã QR bằng ứng dụng MoMo
                                  </p>
                                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                                    <img
                                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(bookingResponse.momoPayment.qrCodeUrl)}`}
                                      alt="MoMo QR Code"
                                      className="w-44 h-44"
                                    />
                                  </div>
                                </div>
                              )}

                              <Button
                                onClick={() =>
                                  window.open(
                                    bookingResponse.momoPayment!.payUrl,
                                    "_blank",
                                  )
                                }
                                className="w-full h-12 bg-pink-500 hover:bg-pink-600 text-white font-semibold"
                              >
                                Mở ứng dụng MoMo để thanh toán
                              </Button>

                              <p className="text-xs text-center text-gray-500 mt-3">
                                Hoặc nhấn vào nút trên để mở trang thanh toán
                                MoMo
                              </p>
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                              <div className="flex items-start gap-2">
                                <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-blue-700">
                                  <p className="font-semibold mb-1">
                                    Hướng dẫn thanh toán:
                                  </p>
                                  <p>1. Mở ứng dụng MoMo trên điện thoại</p>
                                  <p>
                                    2. Quét mã QR hoặc nhấn nút "Mở ứng dụng
                                    MoMo"
                                  </p>
                                  <p>3. Xác nhận thanh toán trong ứng dụng</p>
                                  <p>4. Quay lại trang này để hoàn tất</p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                              Đang tạo đơn thanh toán MoMo...
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Bank Transfer with VietQR */}
                    {paymentMethod === "bank" && (
                      <div className="space-y-4">
                        {bookingResponse ? (
                          <>
                            {/* VietQR Code */}
                            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 flex flex-col items-center">
                              <h4 className="font-semibold text-lg mb-4">
                                Quét mã QR để chuyển khoản
                              </h4>
                              <div className="bg-white p-2 rounded-lg shadow-lg mb-4">
                                {/* VietQR API - Tạo QR code chuyển khoản */}
                                <img
                                  src={`https://img.vietqr.io/image/STB-${bookingDetails.bankAccount.number}-compact2.png?amount=${bookingResponse.depositPaid || bookingDetails.deposit}&addInfo=${encodeURIComponent(bookingResponse.bookingCode)}&accountName=${encodeURIComponent(bookingDetails.bankAccount.name)}`}
                                  alt="VietQR Code"
                                  className="w-64 h-64 object-contain"
                                  onError={(e) => {
                                    // Fallback nếu VietQR không load được
                                    (e.target as HTMLImageElement).src =
                                      `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(`Chuyen khoan: ${bookingDetails.bankAccount.number} - ${bookingDetails.bankAccount.name} - ${bookingResponse.depositPaid || bookingDetails.deposit}d - ${bookingResponse.bookingCode}`)}`;
                                  }}
                                />
                              </div>
                              <p className="text-center font-semibold text-lg mb-2">
                                Số tiền:{" "}
                                <span className="text-green-600">
                                  {(
                                    bookingResponse.depositPaid ||
                                    bookingDetails.deposit
                                  ).toLocaleString()}
                                  đ
                                </span>
                              </p>
                              <p className="text-center text-sm text-gray-600">
                                Nội dung:{" "}
                                <span className="font-medium text-orange-600">
                                  {bookingResponse.bookingCode}
                                </span>
                              </p>
                            </div>

                            {/* Bank info details */}
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
                                      {(
                                        bookingResponse.depositPaid ||
                                        bookingDetails.deposit
                                      ).toLocaleString()}
                                      đ
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      copyToClipboard(
                                        (
                                          bookingResponse.depositPaid ||
                                          bookingDetails.deposit
                                        ).toString(),
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
                                      {bookingResponse.bookingCode}
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      copyToClipboard(
                                        bookingResponse.bookingCode,
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
                                  <p className="font-semibold mb-1">
                                    Quan trọng:
                                  </p>
                                  <p>
                                    Vui lòng chuyển khoản ĐÚNG nội dung để hệ
                                    thống tự động xác nhận thanh toán
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                              Đang tạo đơn hàng...
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentStep(1);
                          // Reset booking response when going back - user needs to create new booking
                          setBookingResponse(null);
                        }}
                        className="flex-1"
                      >
                        Quay lại
                      </Button>
                      {paymentMethod === "bank" && bookingResponse && (
                        <Button
                          onClick={() => {
                            setPaymentSuccess(true);
                            showSuccess(
                              "Cảm ơn bạn! Đơn hàng đang chờ xác nhận thanh toán. Hệ thống sẽ tự động cập nhật khi nhận được chuyển khoản.",
                            );
                          }}
                          disabled={isProcessing}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          Tôi đã chuyển khoản
                        </Button>
                      )}
                      {paymentMethod === "momo" &&
                        bookingResponse?.momoPayment && (
                          <Button
                            onClick={() => {
                              setPaymentSuccess(true);
                              showSuccess(
                                "Cảm ơn bạn! Đơn hàng đang chờ xác nhận thanh toán.",
                              );
                            }}
                            className="flex-1 bg-pink-500 hover:bg-pink-600"
                          >
                            Tôi đã thanh toán MoMo
                          </Button>
                        )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Payment Success
              <SuccessResult
                title="Đặt xe thành công!"
                subTitle={`Mã đơn hàng: ${bookingResponse?.bookingCode || currentBookingId}. ${bookingResponse?.momoPayment ? "Vui lòng hoàn tất thanh toán qua MoMo." : "Chúng tôi đã gửi xác nhận qua email và tin nhắn."} Chủ xe sẽ liên hệ với bạn trong thời gian sớm nhất.`}
                onGoConsole={() => {
                  setShowPaymentDialog(false);
                  setPaymentSuccess(false);
                  setBookingResponse(null);
                  navigate(
                    `/order/${bookingResponse?.bookingCode || currentBookingId}`,
                  );
                }}
                onBuyAgain={() => {
                  setShowPaymentDialog(false);
                  setPaymentSuccess(false);
                  setBookingResponse(null);
                  setCurrentBookingId("");
                  setPickupNote("");
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
