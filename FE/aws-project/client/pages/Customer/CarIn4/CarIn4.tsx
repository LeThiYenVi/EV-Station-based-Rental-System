import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
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
  TruckElectric,
} from "lucide-react";
import { useVehicle } from "@/hooks/useVehicle";
import { useBooking } from "@/hooks/useBooking";
import { useUser } from "@/hooks/useUser";
import { useStation } from "@/hooks/useStation";
import feedbackService from "@/service/feedback/feedbackService";
import type { BookingWithPaymentResponse } from "@/service/types/booking.types";
import type { FeedbackResponse } from "@/service/types/feedback.types";

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

// AWS Location Service configuration - Same as FindStations
const region = import.meta.env.VITE_AWS_LOCATION_REGION || "ap-southeast-1";
const mapName =
  import.meta.env.VITE_AWS_LOCATION_MAP_NAME || "voltgo-location-map";
const apiKey = import.meta.env.VITE_AWS_LOCATION_API_KEY || "";

// HERE Map configuration
const hereMapName =
  import.meta.env.VITE_AWS_LOCATION_MAP_NAME_HERE || "voltgo-location-map-here";
const hereApiKey = import.meta.env.VITE_AWS_LOCATION_API_KEY_HERE || "";

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
  const { getStationById, loading: stationLoading } = useStation();

  // Vehicle data from API
  const [vehicleData, setVehicleData] = useState<any>(null);

  // Station data from API
  const [stationData, setStationData] = useState<any>(null);

  // Current user data from API
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  // Booking API response
  const [bookingResponse, setBookingResponse] =
    useState<BookingWithPaymentResponse | null>(null);
  const [pickupNote, setPickupNote] = useState<string>("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showGalleryDialog, setShowGalleryDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [mapLayer, setMapLayer] = useState<"terrain" | "map">("terrain");

  // AWS Location Service map refs
  const stationMapRef = useRef<maplibregl.Map | null>(null);
  const stationMarkerRef = useRef<maplibregl.Marker | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showLicenseAlert, setShowLicenseAlert] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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

  // Feedback states
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    vehicleRating: 5,
    stationRating: 5,
    comment: "",
  });
  const [feedbackPage, setFeedbackPage] = useState(0);
  const [feedbackTotalPages, setFeedbackTotalPages] = useState(0);

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

  // Load station data when vehicle is loaded
  useEffect(() => {
    const loadStationData = async () => {
      if (!vehicleData?.stationId) return;

      const result = await getStationById(vehicleData.stationId);
      if (result.success && result.data) {
        setStationData(result.data);
      }
    };

    loadStationData();
  }, [vehicleData]);

  // Initialize AWS Location Service Map when showMap is true and stationData is available
  useEffect(() => {
    if (!showMap || !stationData?.latitude || !stationData?.longitude) {
      return;
    }

    const mapElement = document.getElementById("station-map");
    if (!mapElement) return;

    // Clean up existing map
    if (stationMapRef.current) {
      stationMapRef.current.remove();
      stationMapRef.current = null;
    }

    try {
      // Choose map style based on layer selection
      const currentMapName = mapLayer === "terrain" ? mapName : hereMapName;
      const currentApiKey = mapLayer === "terrain" ? apiKey : hereApiKey;

      // Initialize MapLibre GL map with AWS Location Service
      const map = new maplibregl.Map({
        container: "station-map",
        style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${currentMapName}/style-descriptor?key=${currentApiKey}`,
        center: [stationData.longitude, stationData.latitude],
        zoom: 15,
      });

      // Add navigation controls
      map.addControl(new maplibregl.NavigationControl(), "top-right");

      map.on("load", () => {
        stationMapRef.current = map;

        // Create custom station marker element using TruckElectric icon
        const markerEl = document.createElement("div");
        markerEl.innerHTML = `
          <div style="width: 40px; height: 40px; background: #10b981; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
              <path d="m13 11 1-3h2l-3 6h-3l1-3z"/>
            </svg>
          </div>
        `;
        markerEl.title = stationData.name;

        // Add station marker
        if (stationMarkerRef.current) {
          stationMarkerRef.current.remove();
        }

        stationMarkerRef.current = new maplibregl.Marker({
          element: markerEl,
        })
          .setLngLat([stationData.longitude, stationData.latitude])
          .addTo(map);
      });
    } catch (error) {
      console.error("Error initializing AWS Location Service map:", error);
    }

    return () => {
      if (stationMapRef.current) {
        stationMapRef.current.remove();
        stationMapRef.current = null;
      }
      if (stationMarkerRef.current) {
        stationMarkerRef.current.remove();
        stationMarkerRef.current = null;
      }
    };
  }, [showMap, stationData, mapLayer]);

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

  // Nếu thời gian trả <= thời gian nhận → tuỳ bạn xử lý (ở đây ép tối thiểu 1h)
  if (returnD.getTime() <= pickup.getTime()) {
    // Có thể: throw error, hoặc auto cộng 1h
    // Ở đây tạm thời return mặc định 1 ngày cho an toàn
    const dailyRate = vehicleData?.dailyRate || 0;
    const deposit = vehicleData?.depositAmount || 5000000;

    const carPrice = dailyRate;
    const insurance = Math.round(carPrice * 0.1);
    const serviceFee = Math.round(carPrice * 0.05);
    const additionalInsuranceCost = additionalInsurance ? additionalInsuranceFee * 1 : 0;
    const discountAmount = 0;
    const total = carPrice + insurance + serviceFee + additionalInsuranceCost - discountAmount;

    return {
      duration: `1 ngày`,
      carPrice,
      insurance,
      serviceFee,
      additionalInsurance: additionalInsuranceCost,
      deposit,
      discount: discountAmount,
      total,
      totalDeposit: deposit,
      rentalDays: 1,
      diffHours: 24,
    };
  }

  const diffMs = returnD.getTime() - pickup.getTime();
  const diffHoursFloat = diffMs / (1000 * 60 * 60);

  // Java Duration.toHours() TRUNCATE về integer → nên dùng floor cho giống backend
  const diffHours = Math.floor(diffHoursFloat);

  const dailyRate = vehicleData?.dailyRate || 0;
  const hourlyRate = vehicleData?.hourlyRate || 0;

  let rentalDays = 1;
  let remainingHours = 0;
  let carPrice = 0;

  if (diffHours <= 24) {
    // Rule: <= 24h tính như 1 ngày
    rentalDays = 1;
    remainingHours = 0;
    carPrice = dailyRate;
  } else {
    rentalDays = Math.floor(diffHours / 24);   // số ngày nguyên
    remainingHours = diffHours % 24;           // số giờ lẻ
    carPrice = dailyRate * rentalDays + hourlyRate * remainingHours;
  }

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

  const discountAmount = 0;

  const total =
    carPrice +
    insurance +
    serviceFee +
    additionalInsuranceCost -
    discountAmount;

  // Có thể cải thiện text duration: "2 ngày 1 giờ" thay vì chỉ "2 ngày"
  const durationText =
    remainingHours > 0
      ? `${rentalDays} ngày ${remainingHours} giờ`
      : `${rentalDays} ngày`;

  return {
    duration: durationText,
    carPrice,
    insurance,
    serviceFee,
    additionalInsurance: additionalInsuranceCost,
    deposit,
    discount: discountAmount,
    total,
    totalDeposit: deposit,
    rentalDays,
    diffHours,
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

              // Check if license is verified from backend
              const isLicenseVerified =
                result.data.licenseVerified ||
                result.data.isLicenseVerified ||
                false;

              console.log("📄 GPLX Check:", {
                licenseVerified: result.data.licenseVerified,
                isLicenseVerified: result.data.isLicenseVerified,
                licenseNumber: result.data.licenseNumber,
                front: result.data.licenseCardFrontImageUrl,
                back: result.data.licenseCardBackImageUrl,
                finalVerified: isLicenseVerified,
              });

              setIsVerified(isLicenseVerified);
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

  // Load feedbacks when vehicle ID changes
  useEffect(() => {
    if (id) {
      loadFeedbacks();
    }
  }, [id, feedbackPage]);

  const loadFeedbacks = async () => {
    if (!id) return;

    try {
      setFeedbackLoading(true);
      const response = await feedbackService.getFeedbacksByVehicle(
        id,
        feedbackPage,
        10,
      );
      setFeedbacks(response.content || []);
      setFeedbackTotalPages(response.page?.totalPages || 0);
    } catch (error) {
      console.error("Failed to load feedbacks:", error);
      showError("Không thể tải đánh giá");
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleCreateFeedback = async () => {
    if (!currentBookingId) {
      showError("Vui lòng đặt xe trước khi đánh giá");
      return;
    }

    if (!feedbackForm.comment.trim()) {
      showError("Vui lòng nhập nhận xét");
      return;
    }

    try {
      setIsProcessing(true);
      await feedbackService.createFeedback({
        bookingId: currentBookingId,
        vehicleRating: feedbackForm.vehicleRating,
        stationRating: feedbackForm.stationRating,
        comment: feedbackForm.comment,
      });

      showSuccess("Gửi đánh giá thành công!");
      setShowFeedbackDialog(false);
      setFeedbackForm({
        vehicleRating: 5,
        stationRating: 5,
        comment: "",
      });
      loadFeedbacks(); // Reload feedbacks
    } catch (error: any) {
      console.error("Create feedback error:", error);
      showError(error?.response?.data?.message || "Không thể gửi đánh giá");
    } finally {
      setIsProcessing(false);
    }
  };

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
      showSuccess(`Đăng nhập thành công! Chào mừng ${loginData.username}`);

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
      // Show alert asking user to update license in profile
      setShowLicenseAlert(true);
    } else {
      setShowPaymentDialog(true);
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
    <div className="min-h-screen bg-gray-50 mt-[60px] pb-12">
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
              <div className="relative rounded-2xl overflow-hidden bg-gray-200 h-[600px] text-black">
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

            {/* Thumbnail Grid - 3 images with total height = main image height */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:h-[600px]">
              {getVehicleImages()
                .slice(0, 3)
                .map((image, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (index === 2 && getVehicleImages().length > 3) {
                        setShowGalleryDialog(true);
                      } else {
                        setSelectedImage(index);
                      }
                    }}
                    className={`relative rounded-xl overflow-hidden cursor-pointer ${
                      selectedImage === index
                        ? "ring-4 ring-green-500"
                        : "ring-2 ring-gray-200 hover:ring-gray-300"
                    } ${
                      index === 0
                        ? "lg:h-[192px]"
                        : index === 1
                          ? "lg:h-[192px]"
                          : "lg:h-[192px]"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === 2 && getVehicleImages().length > 3 && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white hover:bg-black/60 transition-colors">
                        <span className="font-semibold text-lg">
                          +{getVehicleImages().length - 3}
                        </span>
                        <span className="text-sm mt-1">Xem tất cả ảnh</span>
                      </div>
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
                    - Ngoài các ưu đãi về giá VoltGo còn hỗ trợ thêm cho Quý
                    Khách hàng các Chính sách như sau:
                  </p>
                  <p>* Hoàn Tiền do xăng dư.</p>
                  <p>* Miễn phí vượt dưới 1h.</p>
                  <p>* Miễn phí vượt dưới 10Km.</p>
                  <p className="text-gray-500">
                    - Sử dụng miễn phí: Nước- Đồ ăn vặt, Khăn giấy có trong gói
                    VoltGo Kit khi thuê xe
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
                    được VoltGo hoàn trả đến khách thuê bằng chuyển khoản ngân
                    hàng trong vòng 1-3 ngày làm việc kể tiếp. Xem thêm{" "}
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
                  <h3 className="text-lg font-bold text-gray-900">
                    Vị trí xe - Trạm{" "}
                    {stationData?.name || vehicleData?.stationName}
                  </h3>
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

                {stationLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">
                      Đang tải thông tin trạm...
                    </p>
                  </div>
                ) : stationData ? (
                  <>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Địa chỉ trạm
                          </p>
                          <p className="font-semibold text-gray-900">
                            {stationData.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Giờ hoạt động
                          </p>
                          <p className="font-semibold text-gray-900">
                            {new Date(stationData.startTime).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" },
                            )}{" "}
                            -{" "}
                            {new Date(stationData.endTime).toLocaleTimeString(
                              "vi-VN",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Đánh giá trạm
                          </p>
                          <p className="font-semibold text-gray-900">
                            {stationData.rating?.toFixed(1) || "N/A"}/5
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-blue-600 mb-4">
                      📍 Địa chỉ chi tiết sẽ được hiển thị sau khi thanh toán
                      giữ chỗ
                    </p>

                    {/* AWS Location Service Map */}
                    {showMap && (
                      <div className="mt-4 space-y-2">
                        {/* Map Layer Toggle */}
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setMapLayer("terrain")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              mapLayer === "terrain"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Địa hình
                          </button>
                          <button
                            onClick={() => setMapLayer("map")}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                              mapLayer === "map"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            Bản đồ
                          </button>
                        </div>

                        {/* Map Container */}
                        <div className="rounded-lg overflow-hidden border-2 border-gray-200">
                          <div
                            id="station-map"
                            style={mapContainerStyle}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600">
                      Không tìm thấy thông tin trạm
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Feedback Section */}
            <Card className="shadow-sm border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Đánh giá từ khách hàng
                  </h3>
                  {/* <Button
                    size="sm"
                    onClick={() => setShowFeedbackDialog(true)}
                    disabled={!isLoggedIn || !currentBookingId}
                  >
                    Viết đánh giá
                  </Button> */}
                </div>

                {feedbackLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">
                      Đang tải đánh giá...
                    </p>
                  </div>
                ) : feedbacks.length > 0 ? (
                  <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">
                                {feedback.renterName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {feedback.createdAt
                                  ? new Date(
                                      feedback.createdAt,
                                    ).toLocaleDateString("vi-VN")
                                  : ""}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold">
                                  {feedback.vehicleRating}
                                </span>
                                <span className="text-xs text-gray-500">
                                  (Xe)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold">
                                  {feedback.stationRating}
                                </span>
                                <span className="text-xs text-gray-500">
                                  (Trạm)
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700">
                              {feedback.comment}
                            </p>
                            {feedback.response && (
                              <div className="mt-2 pl-4 border-l-2 border-green-200 bg-green-50 p-2 rounded">
                                <p className="text-xs font-semibold text-green-700 mb-1">
                                  Phản hồi từ {feedback.respondedByName}:
                                </p>
                                <p className="text-sm text-gray-700">
                                  {feedback.response}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {feedbackTotalPages > 1 && (
                      <div className="flex justify-center gap-2 pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setFeedbackPage((p) => Math.max(0, p - 1))
                          }
                          disabled={feedbackPage === 0}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-sm text-gray-600 flex items-center px-3">
                          {feedbackPage + 1} / {feedbackTotalPages}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setFeedbackPage((p) =>
                              Math.min(feedbackTotalPages - 1, p + 1),
                            )
                          }
                          disabled={feedbackPage >= feedbackTotalPages - 1}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có đánh giá nào</p>
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
                        {feedbacks.length > 0
                          ? (
                              feedbacks.reduce(
                                (sum, f) => sum + f.vehicleRating,
                                0,
                              ) / feedbacks.length
                            ).toFixed(1)
                          : vehicleData?.rating?.toFixed(1) || "N/A"}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({feedbacks.length} đánh giá)
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
                      <label className="flex items-start gap-2 cursor-not-allowed opacity-60">
                        <input
                          type="radio"
                          name="delivery"
                          checked={deliveryOption === "delivery"}
                          onChange={() => setDeliveryOption("delivery")}
                          className="mt-1"
                          disabled
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              Tôi muốn được giao xe tận nơi
                            </span>
                            <Badge className="bg-yellow-100 text-yellow-700 text-xs border-0">
                              Sắp ra mắt
                            </Badge>
                          </div>
                          {deliveryOption === "delivery" && (
                            <Input
                              type="text"
                              placeholder="Nhập địa chỉ giao xe"
                              value={deliveryAddress}
                              onChange={(e) =>
                                setDeliveryAddress(e.target.value)
                              }
                              className="mt-2 text-sm"
                              disabled
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

        {/* License Alert Dialog */}
        <Dialog open={showLicenseAlert} onOpenChange={setShowLicenseAlert}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-yellow-600 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Yêu cầu xác thực GPLX
              </DialogTitle>
              <DialogDescription className="text-base text-gray-700 mt-3">
                Để đảm bảo an toàn và tuân thủ quy định, bạn cần cập nhật và xác
                thực Giấy phép lái xe (GPLX) trước khi đặt xe.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Hướng dẫn:</h3>
                <ul className="text-sm text-blue-900 space-y-1 ml-5">
                  <li>
                    • Truy cập trang <strong>Thông tin cá nhân</strong>
                  </li>
                  <li>
                    • Vào tab <strong>"Giấy phép lái xe"</strong>
                  </li>
                  <li>• Upload ảnh GPLX mặt trước và mặt sau</li>
                  <li>• Đợi Staff phê duyệt (thường trong 24h)</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLicenseAlert(false)}
                >
                  Để sau
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    setShowLicenseAlert(false);
                    navigate("/user/info");
                  }}
                >
                  Cập nhật ngay
                </Button>
              </div>
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
                <div className="flex items-center justify-center gap-2 my-8 px-4">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-md ${
                        currentStep >= 1
                          ? "bg-gradient-to-br from-green-500 to-green-600 text-white scale-105"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      1
                    </div>
                    <div className="ml-3">
                      <span
                        className={`block text-sm font-semibold ${
                          currentStep >= 1 ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        Bước 1
                      </span>
                      <span className="block text-xs text-gray-500">
                        Xác nhận
                      </span>
                    </div>
                  </div>
                  <div className="w-20 h-1 mx-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        currentStep >= 2
                          ? "bg-gradient-to-r from-green-500 to-green-600 w-full"
                          : "w-0"
                      }`}
                    />
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-md ${
                        currentStep >= 2
                          ? "bg-gradient-to-br from-green-500 to-green-600 text-white scale-105"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      2
                    </div>
                    <div className="ml-3">
                      <span
                        className={`block text-sm font-semibold ${
                          currentStep >= 2 ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        Bước 2
                      </span>
                      <span className="block text-xs text-gray-500">
                        Thanh toán
                      </span>
                    </div>
                  </div>
                  <div className="w-20 h-1 mx-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        currentStep >= 3
                          ? "bg-gradient-to-r from-green-500 to-green-600 w-full"
                          : "w-0"
                      }`}
                    />
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-md ${
                        currentStep >= 3
                          ? "bg-gradient-to-br from-green-500 to-green-600 text-white scale-105"
                          : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      3
                    </div>
                    <div className="ml-3">
                      <span
                        className={`block text-sm font-semibold ${
                          currentStep >= 3 ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        Bước 3
                      </span>
                      <span className="block text-xs text-gray-500">
                        Hoàn tất
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Step 1: Xác nhận thông tin */}
                {currentStep === 1 && (
                  <div className="space-y-6 py-4">
                    {/* Thông tin người thuê */}
                    <Card className="border-green-100 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Thông tin người thuê
                          </h3>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700 mb-2 block">
                              Tên người thuê
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              value={bookingDetails.renterName}
                              placeholder="Chú bộ đội"
                              className="bg-gray-50 cursor-not-allowed border-gray-200"
                              readOnly
                              disabled
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                Số điện thoại
                                <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                value={bookingDetails.phone}
                                placeholder="Nhập 09xxxxx"
                                className="bg-gray-50 cursor-not-allowed border-gray-200"
                                readOnly
                                disabled
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                Email<span className="text-red-500">*</span>
                              </Label>
                              <Input
                                value={bookingDetails.email}
                                placeholder="Xác thực"
                                className="bg-gray-50 cursor-not-allowed border-gray-200"
                                readOnly
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

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
                    <Card className="border-blue-100 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Nơi nhận xe<span className="text-red-500">*</span>
                          </h3>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-100 rounded-xl p-4 flex items-start gap-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                            <MapPin className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-base mb-1">
                              {bookingDetails.pickupLocation}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                              <span className="font-medium">
                                {bookingDetails.duration}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span>
                                {bookingDetails.pickupDate}{" "}
                                {bookingDetails.pickupTime}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span>
                                {bookingDetails.returnDate}{" "}
                                {bookingDetails.returnTime}
                              </span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-medium text-blue-700 border border-blue-200">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                              {bookingDetails.rentalType}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

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
                    <Card className="border-purple-100 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-purple-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Bảng kê chi tiết
                          </h3>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 font-medium">
                              Đơn giá thuê{" "}
                              <span className="text-sm text-gray-500">
                                ({bookingDetails.duration})
                              </span>
                            </span>
                            <span className="font-bold text-gray-900">
                              {bookingDetails.carPrice.toLocaleString()}đ
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 font-medium">
                              Bảo hiểm thuê xe
                            </span>
                            <span className="font-bold text-gray-900">
                              {bookingDetails.insurance.toLocaleString()}đ
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-gray-700 font-medium">
                              Phí dịch vụ
                            </span>
                            <span className="font-bold text-gray-900">
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
                          <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent my-3"></div>
                          <div className="flex justify-between items-center py-2 bg-orange-50 -mx-4 px-4 rounded-lg">
                            <span className="text-orange-700 font-semibold">
                              Tiền đặt cọc
                            </span>
                            <span className="font-bold text-orange-600 text-lg">
                              {bookingDetails.deposit.toLocaleString()}đ
                            </span>
                          </div>
                          <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent my-3"></div>
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
                        </div>
                      </CardContent>
                    </Card>

                    {/* Thanh toán */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="font-bold text-xl text-gray-900">
                            Tổng thanh toán
                          </span>
                          <p className="text-xs text-gray-600 mt-1">
                            *Giá đã bao gồm VAT và bảo hiểm
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {bookingDetails.deposit.toLocaleString()}đ
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Tiền đặt cọc
                          </p>
                        </div>
                      </div>
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
                      <Label className="text-sm font-bold mb-3 block text-gray-900">
                        Phương thức thanh toán
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setPaymentMethod("momo")}
                          className={`group relative border-2 rounded-xl p-5 text-left transition-all duration-300 ${
                            paymentMethod === "momo"
                              ? "border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100 shadow-lg scale-105"
                              : "border-gray-200 hover:border-pink-300 hover:shadow-md hover:scale-102"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform ${
                                paymentMethod === "momo"
                                  ? "bg-gradient-to-br from-pink-500 to-pink-600"
                                  : "bg-pink-500"
                              }`}
                            >
                              <span className="text-white font-bold text-lg">
                                M
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-base text-gray-900">
                                Ví MoMo
                              </p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Thanh toán nhanh chóng
                              </p>
                            </div>
                            {paymentMethod === "momo" && (
                              <div className="absolute top-3 right-3">
                                <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                        </button>
                        <button
                          onClick={() => setPaymentMethod("bank")}
                          className={`group relative border-2 rounded-xl p-5 text-left transition-all duration-300 ${
                            paymentMethod === "bank"
                              ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg scale-105"
                              : "border-gray-200 hover:border-green-300 hover:shadow-md hover:scale-102"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                                paymentMethod === "bank"
                                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                  : "bg-gray-200"
                              }`}
                            >
                              <CreditCard
                                className={`w-5 h-5 ${paymentMethod === "bank" ? "text-white" : "text-gray-500"}`}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-base text-gray-900">
                                Chuyển khoản
                              </p>
                              <p className="text-xs text-gray-600 mt-0.5">
                                Qua ngân hàng
                              </p>
                            </div>
                            {paymentMethod === "bank" && (
                              <div className="absolute top-3 right-3">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
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
                      className={`w-full h-14 font-bold text-lg rounded-xl shadow-lg transition-all duration-300 ${
                        paymentMethod &&
                        termsAccepted &&
                        policyAccepted &&
                        !isProcessing
                          ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transform hover:scale-105 hover:shadow-xl"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Đang tạo đơn...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Tiếp tục thanh toán</span>
                          <span className="text-xl">
                            {bookingDetails.deposit.toLocaleString()}đ
                          </span>
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      )}
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
                                    {bookingDetails.deposit.toLocaleString()}đ
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

        {/* Feedback Dialog */}
        <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Đánh giá chuyến đi</DialogTitle>
              <DialogDescription>
                Chia sẻ trải nghiệm của bạn với chiếc xe này
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <Label className="mb-2 block">Đánh giá xe</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setFeedbackForm((prev) => ({
                          ...prev,
                          vehicleRating: rating,
                        }))
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= feedbackForm.vehicleRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold">
                    {feedbackForm.vehicleRating}/5
                  </span>
                </div>
              </div>

              <div>
                <Label className="mb-2 block">Đánh giá trạm</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() =>
                        setFeedbackForm((prev) => ({
                          ...prev,
                          stationRating: rating,
                        }))
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= feedbackForm.stationRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm font-semibold">
                    {feedbackForm.stationRating}/5
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="feedback-comment" className="mb-2 block">
                  Nhận xét
                </Label>
                <textarea
                  id="feedback-comment"
                  value={feedbackForm.comment}
                  onChange={(e) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  placeholder="Chia sẻ cảm nhận của bạn về chuyến đi..."
                  className="w-full min-h-[120px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  maxLength={500}
                />
                <div className="text-xs text-gray-500 text-right mt-1">
                  {feedbackForm.comment.length}/500
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowFeedbackDialog(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={handleCreateFeedback}
                disabled={isProcessing || !feedbackForm.comment.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Gallery Dialog - View All Images */}
        <Dialog open={showGalleryDialog} onOpenChange={setShowGalleryDialog}>
          <DialogContent className="sm:max-w-[90vw] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                Tất cả hình ảnh xe ({getVehicleImages().length})
              </DialogTitle>
              <DialogDescription>
                Xem toàn bộ hình ảnh của {vehicleData?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto max-h-[70vh] p-4">
              {getVehicleImages().map((image, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setShowGalleryDialog(false);
                  }}
                  className={`relative rounded-lg overflow-hidden cursor-pointer aspect-[4/3] ${
                    selectedImage === index
                      ? "ring-4 ring-green-500"
                      : "ring-2 ring-gray-200 hover:ring-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${vehicleData?.name} - Ảnh ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedImage === index && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
