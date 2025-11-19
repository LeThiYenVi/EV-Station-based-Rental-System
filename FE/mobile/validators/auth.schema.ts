import * as yup from "yup";

// Vietnamese phone number regex (10 digits starting with 0)
const phoneRegex = /^0\d{9}$/;

// Email regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email là bắt buộc")
    .matches(emailRegex, "Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email là bắt buộc")
    .matches(emailRegex, "Email không hợp lệ"),
  password: yup
    .string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được quá 50 ký tự"),
  confirmPassword: yup
    .string()
    .required("Xác nhận mật khẩu là bắt buộc")
    .oneOf([yup.ref("password")], "Mật khẩu không khớp"),
  fullName: yup
    .string()
    .required("Họ tên là bắt buộc")
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được quá 100 ký tự"),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(phoneRegex, "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email là bắt buộc")
    .matches(emailRegex, "Email không hợp lệ"),
});

export const resetPasswordSchema = yup.object().shape({
  code: yup
    .string()
    .required("Mã xác nhận là bắt buộc")
    .length(6, "Mã xác nhận phải có 6 ký tự"),
  newPassword: yup
    .string()
    .required("Mật khẩu mới là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được quá 50 ký tự"),
  confirmPassword: yup
    .string()
    .required("Xác nhận mật khẩu là bắt buộc")
    .oneOf([yup.ref("newPassword")], "Mật khẩu không khớp"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type ForgotPasswordFormData = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>;
