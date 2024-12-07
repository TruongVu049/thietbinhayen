import * as z from "zod";
import { object, string } from "zod";
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!@#$%^&*?<>])[A-Za-z\d@!@#$%^&*?<>]{8,}$/;

export const registerSchema = z
  .object({
    email: z.string().email("Email không hợp lệ."),
    fullName: z.string().min(1, "Tên không được để trống."),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
      .regex(
        passwordRegex,
        "Mật khẩu phải bao gồm ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số, và 1 ký tự đặc biệt."
      ),
    confirmPassword: z
      .string()
      .min(8, "Xác nhận mật khẩu phải có ít nhất 8 ký tự.")
      .regex(
        passwordRegex,
        "Xác nhận mật khẩu phải bao gồm ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số, và 1 ký tự đặc biệt."
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp.",
    path: ["confirmPassword"],
  });

export const emailType = string({ required_error: "Vui lòng nhập vào email!" })
  .min(1, "Vui lòng nhập vào email!")
  .email("Email không hợp lệ!");

export const signInSchema = object({
  email: emailType,
  password: z.string().min(4, "Mật khẩu phải có ít nhất 8 ký tự."),
});

export const forgotPasswordSchema = object({
  email: emailType,
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email("Email không hợp lệ."),
    token: z.string(),
    oldPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
      .regex(
        passwordRegex,
        "Mật khẩu phải bao gồm ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số, và 1 ký tự đặc biệt."
      ),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự.")
      .regex(
        passwordRegex,
        "Mật khẩu phải bao gồm ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số, và 1 ký tự đặc biệt."
      ),
    confirmPassword: z
      .string()
      .min(8, "Xác nhận mật khẩu phải có ít nhất 8 ký tự.")
      .regex(
        passwordRegex,
        "Xác nhận mật khẩu phải bao gồm ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số, và 1 ký tự đặc biệt."
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp.",
    path: ["confirmPassword"],
  });

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);
export const contactSchema = z.object({
  fullName: z.string().min(1, "Tên không được để trống."),
  email: z.string().email("Email không hợp lệ."),
  phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ."),
  content: z.string().min(8, "Nội dung không được để trống."),
});

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const productSchema = z.object({
  ten: z
    .string()
    .min(1, "Tên không được để trống.")
    .max(555, "Tên quá dài. Vui lòng điền lại!"),
  khoiluong: z.coerce
    .number({
      required_error: "Vui lòng điền vào khối lượng.",
      invalid_type_error: "Khối lượng bảo hành phải là một số.",
    })
    .int()
    .gt(0, "Khối lượng phải lớn hơn 0"),
  kichthuoc: z.string().min(1, "Vui lòng điền vào kích thước."),
  thuonghieu: z.string().min(1, "Vui lòng điền vào thương hiệu."),
  baohanh: z.coerce
    .number({
      required_error: "Vui lòng điền vào bảo hành.",
      invalid_type_error: "Thời gian bảo hành phải là một số.",
    })
    .int()
    .gt(0, "Thời gian bảo hành phải lớn hơn 0")
    .max(32, "Thời gian bảo hành không được vượt quá 32 tháng."),
  gia: z.coerce
    .number({
      required_error: "Vui lòng điền vào giá tiền.",
      invalid_type_error: "Giá tiền phải là một số.",
    })
    .gt(0, "Giá tiền phải lớn hơn 0")
    .max(999999999, "Giá tiền không được vượt quá 999.999.999 đ"),
  xuatxu_id: z.string(),
  danhmuc_id: z.string(),
  trangthai: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const employeeSchema = (isEdit: boolean) =>
  z
    .object({
      hoten: z
        .string()
        .min(1, "Tên không được để trống.")
        .max(555, "Tên quá dài. Vui lòng điền lại!"),
      email: z.string().email("Email không hợp lệ."),
      password: z
        .string()
        .optional()
        .refine((val) => isEdit || (val && val.length >= 8), {
          message: "Mật khẩu phải có ít nhất 8 ký tự.",
        })
        .refine((val) => !val || passwordRegex.test(val), {
          message:
            "Mật khẩu phải bao gồm ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số, và 1 ký tự đặc biệt.",
        }),
      confirmPassword: z
        .string()
        .optional()
        .refine((val) => isEdit || (val && val.length >= 8), {
          message: "Xác nhận mật khẩu phải có ít nhất 8 ký tự.",
        })
        .refine((val) => !val || passwordRegex.test(val), {
          message:
            "ác nhận mật khẩu phải bao gồm ít nhất 1 ký tự hoa, 1 ký tự thường, 1 ký tự số, và 1 ký tự đặc biệt.",
        }),
      phanquyen_id: z.string(),
    })
    .refine(
      (data) => data.password === data.confirmPassword, // Chỉ kiểm tra khi không phải edit
      {
        message: "Mật khẩu và xác nhận mật khẩu không khớp.",
        path: ["confirmPassword"],
      }
    );

export type EmployeeFormData = z.infer<ReturnType<typeof employeeSchema>>;

export const addressSchema = z.object({
  tinhthanh: z.string().min(1, "Tỉnh thành không được để trống."),
  quanhuyen: z.string().min(1, "Quận huyện không được để trống."),
  phuongxa: z.string().min(1, "Phường xá không được để trống."),
  diachicuthe: z
    .string()
    .min(1, "Địa chỉ cụ thể không được để trống.")
    .max(555, "Địa chỉ cụ thể quá dài. Vui lòng điền lại!"),
  tennguoinhan: z
    .string()
    .min(1, "Tên người nhận không được để trống.")
    .max(555, "Tên người nhận quá dài. Vui lòng điền lại!"),
  sdt: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ."),
  isMacDinh: z.boolean(),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export const supplierSchema = z.object({
  ten: z
    .string()
    .min(1, "Tên không được để trống.")
    .max(555, "Tên quá dài. Vui lòng điền lại!"),
  diachi: z
    .string()
    .min(1, "Địa chỉ không được để trống.")
    .max(555, "Địa chỉ quá dài. Vui lòng điền lại!"),
  sdt: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ."),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
