import { useState } from "react";
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
import { ArrowLeft, Mail, Lock, KeyRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMessage } from "@/components/ui/message";
import { authService } from "@/service/auth/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { contextHolder, showSuccess, showError } = useMessage();

  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError("Vui lòng nhập email!");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword({ email });

      showSuccess(
        "Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!",
      );
      setStep("reset");
    } catch (error: any) {
      console.error("Forgot password error:", error);

      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau.";

      if (error?.response?.data?.errors) {
        errorMessage = error.response.data.errors;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 404) {
        errorMessage = "Email không tồn tại trong hệ thống.";
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetCode || !newPassword || !confirmPassword) {
      showError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (newPassword.length < 8) {
      showError("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        code: resetCode,
        newPassword,
      });

      showSuccess(
        "Đặt lại mật khẩu thành công! Vui lòng đăng nhập với mật khẩu mới.",
      );

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Reset password error:", error);

      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại sau.";

      if (error?.response?.data?.errors) {
        errorMessage = error.response.data.errors;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 400) {
        errorMessage = "Mã xác thực không đúng hoặc đã hết hạn.";
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Forgot Password Card */}
      <Card className="relative w-full max-w-md shadow-2xl border-0 bg-white/95 backdrop-blur-md">
        <CardHeader className="space-y-4 text-center pb-6">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 rounded-full bg-green-700 flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <KeyRound className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Quên mật khẩu
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              {step === "email"
                ? "Nhập email để nhận mã xác thực"
                : "Nhập mã xác thực và mật khẩu mới"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "email" ? (
            /* Step 1: Send Email */
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-gray-700 font-medium flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Đang gửi..." : "Gửi mã xác thực"}
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          ) : (
            /* Step 2: Reset Password */
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="reset-code"
                  className="text-gray-700 font-medium flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  Mã xác thực<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reset-code"
                  type="text"
                  placeholder="Nhập mã 6 số từ email"
                  value={resetCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 6) {
                      setResetCode(value);
                    }
                  }}
                  className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  maxLength={6}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">
                  Mã xác thực đã được gửi đến: <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="new-password"
                  className="text-gray-700 font-medium flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Mật khẩu mới<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Tối thiểu 8 ký tự"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  minLength={8}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirm-password"
                  className="text-gray-700 font-medium flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Xác nhận mật khẩu<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-green-700 hover:bg-green-800 text-white font-semibold"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </Button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline"
                  disabled={loading}
                >
                  Gửi lại mã xác thực
                </button>
                <div>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
