import * as yup from "yup";

// Date must be in the future
const futureDateValidator = (
  value: Date | undefined,
  context: yup.TestContext
) => {
  if (!value) return false;
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset to start of day
  return value >= now;
};

// End date must be after start date
const endAfterStartValidator = function (
  this: yup.TestContext,
  value: Date | undefined
) {
  const { startDate } = this.parent;
  if (!value || !startDate) return true;
  return value > startDate;
};

export const bookingSearchSchema = yup.object().shape({
  city: yup.string().required("Vui lòng chọn tỉnh/thành phố"),
  district: yup.string().optional(),
  startDate: yup
    .date()
    .required("Ngày bắt đầu là bắt buộc")
    .test(
      "is-future",
      "Ngày bắt đầu phải từ hôm nay trở đi",
      futureDateValidator
    ),
  endDate: yup
    .date()
    .required("Ngày kết thúc là bắt buộc")
    .test(
      "is-after-start",
      "Ngày kết thúc phải sau ngày bắt đầu",
      endAfterStartValidator
    ),
});

export const bookingCreateSchema = yup.object().shape({
  stationId: yup.number().required("Vui lòng chọn trạm"),
  vehicleId: yup.number().required("Vui lòng chọn xe"),
  startDate: yup
    .date()
    .required("Ngày bắt đầu là bắt buộc")
    .test(
      "is-future",
      "Ngày bắt đầu phải từ hôm nay trở đi",
      futureDateValidator
    ),
  endDate: yup
    .date()
    .required("Ngày kết thúc là bắt buộc")
    .test(
      "is-after-start",
      "Ngày kết thúc phải sau ngày bắt đầu",
      endAfterStartValidator
    ),
  notes: yup.string().optional().max(500, "Ghi chú không được quá 500 ký tự"),
  promoCode: yup.string().optional().max(50, "Mã giảm giá không hợp lệ"),
});

export const bookingCancelSchema = yup.object().shape({
  reason: yup
    .string()
    .required("Vui lòng nhập lý do hủy")
    .min(10, "Lý do hủy phải có ít nhất 10 ký tự")
    .max(500, "Lý do hủy không được quá 500 ký tự"),
});

export const bookingReviewSchema = yup.object().shape({
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
});

export type BookingSearchFormData = yup.InferType<typeof bookingSearchSchema>;
export type BookingCreateFormData = yup.InferType<typeof bookingCreateSchema>;
export type BookingCancelFormData = yup.InferType<typeof bookingCancelSchema>;
export type BookingReviewFormData = yup.InferType<typeof bookingReviewSchema>;
