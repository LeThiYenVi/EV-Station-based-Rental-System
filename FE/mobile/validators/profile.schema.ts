import * as yup from "yup";

// Vietnamese phone number regex (10 digits starting with 0)
const phoneRegex = /^0\d{9}$/;

export const profileEditSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Họ tên là bắt buộc")
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được quá 100 ký tự")
    .trim(),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(phoneRegex, "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)"),
});

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Mật khẩu hiện tại là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  newPassword: yup
    .string()
    .required("Mật khẩu mới là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
    .max(50, "Mật khẩu không được quá 50 ký tự")
    .notOneOf(
      [yup.ref("currentPassword")],
      "Mật khẩu mới phải khác mật khẩu hiện tại"
    ),
  confirmPassword: yup
    .string()
    .required("Xác nhận mật khẩu là bắt buộc")
    .oneOf([yup.ref("newPassword")], "Mật khẩu không khớp"),
});

export const addressSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Họ tên người nhận là bắt buộc")
    .min(2, "Họ tên phải có ít nhất 2 ký tự")
    .max(100, "Họ tên không được quá 100 ký tự"),
  phone: yup
    .string()
    .required("Số điện thoại là bắt buộc")
    .matches(phoneRegex, "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)"),
  address: yup
    .string()
    .required("Địa chỉ là bắt buộc")
    .min(10, "Địa chỉ phải có ít nhất 10 ký tự")
    .max(200, "Địa chỉ không được quá 200 ký tự"),
  city: yup.string().required("Tỉnh/Thành phố là bắt buộc"),
  district: yup.string().required("Quận/Huyện là bắt buộc"),
  ward: yup.string().required("Phường/Xã là bắt buộc"),
  isDefault: yup.boolean(),
});

export type ProfileEditFormData = yup.InferType<typeof profileEditSchema>;
export type ChangePasswordFormData = yup.InferType<typeof changePasswordSchema>;
export type AddressFormData = yup.InferType<typeof addressSchema>;
