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
import { RefreshCw } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Tài khoản test
const TEST_ACCOUNTS = {
  admin: { username: "admin", password: "admin123" },
  user: { username: "user", password: "user123" },
  staff: { username: "staff", password: "staff123" },
};

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialMode =
    searchParams.get("mode") === "register" ? "register" : "login";
  const [activeTab, setActiveTab] = useState(initialMode);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    captcha: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    captcha: "",
  });

  const [captchaText] = useState("6d7mp");

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "register") {
      setActiveTab("register");
    }
  }, [searchParams]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra captcha
    if (loginData.captcha.toLowerCase() !== captchaText.toLowerCase()) {
      toast({
        title: "Lỗi",
        description: "Captcha không đúng!",
        variant: "destructive",
      });
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
      toast({
        title: "Đăng nhập thành công!",
        description: `Chào mừng ${loginData.username}`,
      });
      // Điều hướng dựa vào role sau khi đăng nhập thành công
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
      toast({
        title: "Đăng nhập thất bại",
        description:
          "Tài khoản hoặc mật khẩu không đúng. Thử: admin/admin123, staff/staff123 hoặc user/user123",
        variant: "destructive",
      });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra captcha
    if (registerData.captcha.toLowerCase() !== captchaText.toLowerCase()) {
      toast({
        title: "Lỗi",
        description: "Captcha không đúng!",
        variant: "destructive",
      });
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp!",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Đăng ký thành công!",
      description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
    });

    // Chuyển sang tab đăng nhập
    setActiveTab("login");
  };

  const refreshCaptcha = () => {
    toast({
      title: "Captcha đã được làm mới",
      description: "Captcha mới: " + captchaText,
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 md:p-8">
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

      {/* Login Card - Wide Layout */}
      <Card className="relative w-full max-w-5xl shadow-2xl border-0 bg-white/95 backdrop-blur-md overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Logo & Instructions */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 md:p-10 flex flex-col justify-center">
            <CardHeader className="space-y-4 text-center pb-6 px-0">
              {/* Logo */}
              <div className="flex justify-center mb-2">
                <div className="w-20 h-20 rounded-full bg-green-700 flex items-center justify-center shadow-lg">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                    <span className="text-green-700 font-bold text-2xl">S</span>
                  </div>
                </div>
              </div>

              <div>
                <CardTitle className="text-3xl font-bold text-green-700 tracking-wide">
                  BF Car Rental
                </CardTitle>
                <CardDescription className="text-green-700 font-medium mt-2">
                  Thuê xe dễ, đi chơi mê!
                </CardDescription>
              </div>
            </CardHeader>

            {/* Instructions Section */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">
                    Hướng dẫn sử dụng:
                  </p>
                  <p className="text-gray-600 mt-1">
                    File hướng dẫn:{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Tải xuống
                    </a>
                  </p>
                  <p className="text-gray-600">
                    Google Chrome:{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Tải xuống
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Hỗ trợ</p>
                  <p className="text-gray-600 mt-1">
                    Số điện thoại: 0822.020.159 (Trần Văn An)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-700 text-green-700">
                    CỔNG THÔNG TIN ĐIỆN TỬ
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-pink-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-pink-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">BF Car Rental</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-10">
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

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="login-captcha"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Captcha<span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="login-captcha"
                          type="text"
                          placeholder="Nhập captcha"
                          value={loginData.captcha}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              captcha: e.target.value,
                            })
                          }
                          className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                        <div className="flex items-center gap-1">
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={refreshCaptcha}
                            className="h-10 w-10 hover:bg-green-50"
                          >
                            <RefreshCw className="h-4 w-4 text-gray-600" />
                          </Button>
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
                      <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:underline font-medium block"
                      >
                        Quên mật khẩu?
                      </Link>
                      <p className="text-xs text-gray-500">
                        Tài khoản test:{" "}
                        <span className="font-semibold">admin/admin123</span>,{" "}
                        <span className="font-semibold">staff/staff123</span>{" "}
                        hoặc <span className="font-semibold">user/user123</span>
                      </p>
                    </div>
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
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
                        htmlFor="register-username"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Tài khoản<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="username"
                        value={registerData.username}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            username: e.target.value,
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
                        placeholder="Tối thiểu 6 ký tự"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        minLength={6}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-confirm-password"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Xác nhận mật khẩu<span className="text-red-500">*</span>
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

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="register-captcha"
                        className="text-gray-700 font-medium text-sm"
                      >
                        Captcha<span className="text-red-500">*</span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="register-captcha"
                          type="text"
                          placeholder="Nhập captcha"
                          value={registerData.captcha}
                          onChange={(e) =>
                            setRegisterData({
                              ...registerData,
                              captcha: e.target.value,
                            })
                          }
                          className="h-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          required
                        />
                        <div className="flex items-center gap-1">
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
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={refreshCaptcha}
                            className="h-10 w-10 hover:bg-green-50"
                          >
                            <RefreshCw className="h-4 w-4 text-gray-600" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-semibold text-sm"
                    >
                      ĐĂNG KÝ TÀI KHOẢN
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
