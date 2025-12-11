import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMessage } from "@/components/ui/message";
import { useAuth } from "@/hooks/useAuth";
import { authService } from "@/service/auth/authService";

// Tài khoản test (fallback khi API không khả dụng)
const TEST_ACCOUNTS = {
  admin: { username: "admin", password: "admin123" },
  user: { username: "user", password: "user123" },
  staff: { username: "staff", password: "staff123" },
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { contextHolder, showSuccess, showError, showWarning } = useMessage();

  // Sử dụng API thực tế
  const { login, register, verifyOtp, loginWithGoogle, loading } = useAuth();

  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login";
  const [activeTab, setActiveTab] = useState(initialMode);

  // Register OTP state
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Gọi API login thực tế
      const result = await login({
        email: loginData.username, // Backend expects email
        password: loginData.password,
      });

      if (result && result.user) {
        const user = result.user;

        // Save login status to localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", user.email);
        localStorage.setItem("userRole", user.role || "user");
        localStorage.setItem("userId", user.id);

        // Dispatch custom event to notify header
        window.dispatchEvent(new Event("loginStatusChanged"));

        showSuccess(
          `Đăng nhập thành công! Chào mừng ${user.fullName || user.email}`,
        );

        // Điều hướng dựa vào role
        setTimeout(() => {
          const userRole = user.role?.toLowerCase();
          if (userRole === "admin") {
            navigate("/admin");
          } else if (userRole === "staff") {
            navigate("/staff");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        // Fallback: Kiểm tra tài khoản test
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
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", loginData.username);
          localStorage.setItem("userRole", userRole);
          window.dispatchEvent(new Event("loginStatusChanged"));
          showSuccess(`Đăng nhập thành công! Chào mừng ${loginData.username}`);

          setTimeout(() => {
            if (userRole === "admin") {
              navigate("/admin");
            } else if (userRole === "staff") {
              navigate("/staff");
            } else {
              navigate("/");
            }
          }, 1000);
        } else {
          showError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      showError("Lỗi kết nối đến server. Vui lòng thử lại sau.");
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== REGISTER SUBMIT START ===");

    // Kiểm tra mật khẩu khớp
    if (registerData.password !== registerData.confirmPassword) {
      showError("Mật khẩu xác nhận không khớp!");
      return;
    }

    // Clear any existing tokens before registration
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");

    // Also clear all cookies to avoid authentication conflicts
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    console.log("Cleared localStorage tokens and cookies");

    // CRITICAL: Also clear sessionStorage
    sessionStorage.clear();

    // Debug: Check all cookies
    console.log("Current cookies:", document.cookie);
    console.log("Current localStorage:", { ...localStorage });

    console.log("=== STARTING FRESH REGISTRATION (no auth data) ===");

    try {
      const requestData = {
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
        fullName: registerData.fullName,
        phone: registerData.phone,
        role: "RENTER" as const,
      };

      console.log("Submitting registration with data:", requestData);

      // TEMPORARY FIX: Check if backend is properly configured
      // If you see 401 on /auth/register, backend config is wrong
      // Register endpoint SHOULD NOT require authentication

      const result = await register(requestData);

      console.log("Register result:", result);
      console.log("=== REGISTER SUBMIT SUCCESS ===");

      if (result) {
        showSuccess(
          result.message ||
            "Đăng ký thành công! Vui lòng kiểm tra email để nhận mã OTP.",
        );

        // Show OTP verification form
        setRegisteredEmail(registerData.email);
        setShowOtpForm(true);
      } else {
        showError(
          "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin hoặc email đã được sử dụng.",
        );
      }
    } catch (error: any) {
      console.error("Register error:", error);
      console.error("Error response:", error?.response);

      // Parse error message from backend response
      let errorMessage = "Lỗi kết nối đến server. Vui lòng thử lại sau.";

      if (error?.response?.data?.errors) {
        // Backend returns: {statusCode, message, errors}
        errorMessage = error.response.data.errors;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 401) {
        errorMessage =
          "Email này đã được đăng ký. Vui lòng đăng nhập hoặc sử dụng email khác.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode || otpCode.length !== 6) {
      showError("Vui lòng nhập mã OTP 6 số!");
      return;
    }

    try {
      const result = await verifyOtp({
        email: registeredEmail,
        otpCode: otpCode,
      });

      // Backend returns {statusCode: 200/201, message: "verified account", data: null}
      // Check for successful status codes
      if (result && (result.statusCode === 200 || result.statusCode === 201)) {
        showSuccess("Xác thực thành công! Vui lòng đăng nhập.");

        // Reset OTP form and switch to login tab
        setShowOtpForm(false);
        setOtpCode("");
        setActiveTab("login");

        // Pre-fill login username with registered email
        setLoginData({
          ...loginData,
          username: registeredEmail,
        });
      } else {
        showError("Mã OTP không đúng. Vui lòng thử lại.");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);

      let errorMessage = "Lỗi xác thực OTP. Vui lòng thử lại.";

      if (error?.response?.data?.errors) {
        // Backend error format: {statusCode, message, errors}
        errorMessage = error.response.data.errors;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      showError(errorMessage);
    }
  };

  const handleBackToRegister = () => {
    setShowOtpForm(false);
    setOtpCode("");
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // User will be redirected to Google OAuth page
    } catch (error) {
      console.error("Google login error:", error);
      showError("Không thể kết nối với Google. Vui lòng thử lại.");
    }
  };

  // const handleGoogleCallback = async (code: string, state: string) => {
  //   try {
  //     // Verify state to prevent CSRF attacks
  //     const savedState = sessionStorage.getItem("oauth_state");
  //     if (savedState !== state) {
  //       showError("Xác thực không hợp lệ. Vui lòng thử lại.");
  //       navigate("/login", { replace: true });
  //       return;
  //     }

  //     // Call API to exchange code for tokens
  //     const result = await authService.loginWithGoogle(code, state);

  //     if (result && result.user) {
  //       const user = result.user;

  //       // Save login status
  //       localStorage.setItem("isLoggedIn", "true");
  //       localStorage.setItem("username", user.email);
  //       localStorage.setItem("userRole", user.role || "user");
  //       localStorage.setItem("userId", user.id);

  //       // Dispatch event to notify header
  //       window.dispatchEvent(new Event("loginStatusChanged"));

  //       showSuccess(
  //         `Đăng nhập Google thành công! Chào mừng ${user.fullName || user.email}`,
  //       );

  //       // Clean up
  //       sessionStorage.removeItem("oauth_state");

  //       // Navigate based on role
  //       setTimeout(() => {
  //         const userRole = user.role?.toLowerCase();
  //         if (userRole === "admin") {
  //           navigate("/admin", { replace: true });
  //         } else if (userRole === "staff") {
  //           navigate("/staff", { replace: true });
  //         } else {
  //           navigate("/", { replace: true });
  //         }
  //       }, 1000);
  //     } else {
  //       showError("Đăng nhập Google thất bại. Vui lòng thử lại.");
  //       navigate("/login", { replace: true });
  //     }
  //   } catch (error: any) {
  //     console.error("Google callback error:", error);
  //     const errorMessage =
  //       error?.response?.data?.message || "Đăng nhập Google thất bại.";
  //     showError(errorMessage);
  //     navigate("/login", { replace: true });
  //   }
  // };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8">
      {contextHolder}
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1562774053-701939374585?w=1920&h=1080&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-blue-400/30 backdrop-blur-sm"></div>
      </div>

      {/* Login Card - Centered Layout */}
      <Card className="relative w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-md overflow-hidden">
        <div className="p-8 md:p-10">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                {/* Soft glow effect for transparent logo */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full blur-2xl opacity-10 scale-110"></div>
                <img
                  src="/voltgo_logo.jpg"
                  alt="VoltGo Logo"
                  className="relative w-24 h-24 object-contain drop-shadow-lg"
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">VoltGo</h1>
            <p className="text-gray-600 text-sm">
              Xe điện thông minh - Tương lai xanh
            </p>
          </div>

          <CardContent className="p-0 space-y-6">
            {/* Login/Register Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                <TabsTrigger
                  value="login"
                  className="text-sm font-semibold data-[state=active]:bg-green-700 data-[state=active]:text-white"
                >
                  ĐĂNG NHẬP
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="text-sm font-semibold data-[state=active]:bg-green-700 data-[state=active]:text-white"
                >
                  ĐĂNG KÝ
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLoginSubmit} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="login-username"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Tài khoản<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="login-username"
                      type="text"
                      placeholder="admin, staff hoặc user"
                      value={loginData.username}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          username: e.target.value,
                        })
                      }
                      className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="login-password"
                      className="text-gray-700 font-medium text-sm"
                    >
                      Mật khẩu<span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="admin123, staff123 hoặc user123"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                      className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm"
                    disabled={loading}
                  >
                    {loading ? "Đang xử lý..." : "TRUY CẬP HỆ THỐNG"}
                  </Button>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">
                        Hoặc đăng nhập với
                      </span>
                    </div>
                  </div>

                  {/* Google Login Button */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 border-gray-300 hover:bg-gray-50"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Đăng nhập với Google
                  </Button>

                  <div className="text-center space-y-2">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-green-800
                         hover:underline font-medium block"
                    >
                      Quên mật khẩu?
                    </Link>
                    <p className="text-sm text-gray-600">
                      Chưa có tài khoản?{" "}
                      <button
                        type="button"
                        onClick={() => setActiveTab("register")}
                        className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                      >
                        Đăng ký ngay
                      </button>
                    </p>
                    {/* <p className="text-xs text-gray-500">
                        Tài khoản test:{" "}
                        <span className="font-semibold">admin/admin123</span>,{" "}
                        <span className="font-semibold">staff/staff123</span>{" "}
                        hoặc <span className="font-semibold">user/user123</span>
                      </p> */}
                  </div>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register">
                {showOtpForm ? (
                  /* OTP Verification Form */
                  <form onSubmit={handleOtpSubmit} className="space-y-4">
                    <div className="text-center space-y-2 mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Xác thực OTP
                      </h3>
                      <p className="text-sm text-gray-600">
                        Mã OTP đã được gửi đến email: <br />
                        <span className="font-semibold text-green-600">
                          {registeredEmail}
                        </span>
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="otp-code"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Mã OTP (6 số)<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="otp-code"
                        type="text"
                        placeholder="000000"
                        value={otpCode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          if (value.length <= 6) {
                            setOtpCode(value);
                          }
                        }}
                        className="h-12 text-center text-2xl tracking-widest border-gray-300 focus:border-green-500 focus:ring-green-500"
                        maxLength={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm"
                      disabled={loading || otpCode.length !== 6}
                    >
                      {loading ? "Đang xác thực..." : "XÁC THỰC OTP"}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11"
                      onClick={handleBackToRegister}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Quay lại đăng ký
                    </Button>

                    <div className="text-center text-xs text-gray-500">
                      Không nhận được mã? Kiểm tra email hoặc liên hệ hỗ trợ
                    </div>
                  </form>
                ) : (
                  /* Registration Form */
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-fullname"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Họ và tên<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="register-fullname"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={registerData.fullName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            fullName: e.target.value,
                          })
                        }
                        className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-email"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Email<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="example@email.com"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-phone"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Số điện thoại<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="register-phone"
                        type="tel"
                        placeholder="0912345678"
                        value={registerData.phone}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            phone: e.target.value,
                          })
                        }
                        className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-password"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Mật khẩu<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Tối thiểu 8 ký tự"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        minLength={8}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-confirm-password"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Xác nhận mật khẩu
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm"
                      disabled={loading}
                    >
                      {loading ? "Đang xử lý..." : "ĐĂNG KÝ TÀI KHOẢN"}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Đã có tài khoản?{" "}
                        <button
                          type="button"
                          onClick={() => setActiveTab("login")}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Đăng nhập ngay
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </TabsContent>
            </Tabs>

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 space-y-2 text-center text-xs text-gray-500">
              <p>Hỗ trợ: 0822.020.159 (Trần Văn An)</p>
              <p>© 2024 VoltGo - Hệ thống cho thuê xe điện</p>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
