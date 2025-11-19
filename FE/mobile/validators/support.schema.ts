import * as yup from "yup";

// Vietnamese phone number regex (10 digits starting with 0)
const phoneRegex = /^0\d{9}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const supportContactSchema = yup.object().shape({
  subject: yup
    .string()
    .required("Tiêu đề là bắt buộc")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(200, "Tiêu đề không được quá 200 ký tự"),
  message: yup
    .string()
    .required("Nội dung là bắt buộc")
    .min(20, "Nội dung phải có ít nhất 20 ký tự")
    .max(2000, "Nội dung không được quá 2000 ký tự"),
  category: yup
    .string()
    .required("Vui lòng chọn danh mục")
    .oneOf(
      ["booking", "payment", "vehicle", "account", "other"],
      "Danh mục không hợp lệ"
    ),
  contactEmail: yup
    .string()
    .optional()
    .matches(emailRegex, "Email không hợp lệ"),
  contactPhone: yup
    .string()
    .optional()
    .matches(phoneRegex, "Số điện thoại không hợp lệ"),
});

export const feedbackSchema = yup.object().shape({
  rating: yup
    .number()
    .required("Vui lòng chọn số sao")
    .min(1, "Đánh giá tối thiểu 1 sao")
    .max(5, "Đánh giá tối đa 5 sao"),
  comment: yup
    .string()
    .required("Vui lòng nhập nhận xét")
    .min(10, "Nhận xét phải có ít nhất 10 ký tự")
    .max(1000, "Nhận xét không được quá 1000 ký tự"),
  improvements: yup
    .string()
    .optional()
    .max(500, "Đề xuất cải thiện không được quá 500 ký tự"),
});

export const reportIssueSchema = yup.object().shape({
  issueType: yup
    .string()
    .required("Vui lòng chọn loại sự cố")
    .oneOf(
      ["vehicle_damage", "accident", "breakdown", "other"],
      "Loại sự cố không hợp lệ"
    ),
  description: yup
    .string()
    .required("Vui lòng mô tả sự cố")
    .min(20, "Mô tả phải có ít nhất 20 ký tự")
    .max(1000, "Mô tả không được quá 1000 ký tự"),
  location: yup.string().optional().max(200, "Vị trí không được quá 200 ký tự"),
  bookingCode: yup.string().required("Mã đặt xe là bắt buộc"),
});

export type SupportContactFormData = yup.InferType<typeof supportContactSchema>;
export type FeedbackFormData = yup.InferType<typeof feedbackSchema>;
export type ReportIssueFormData = yup.InferType<typeof reportIssueSchema>;
