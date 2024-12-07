export type productType = {
  id: number;
  ten: string;
  mota?: string;
  gia: number;
  hinhanh: string;
};

export interface XuatXu {
  id: number;
  tennuoc: string;
}

export interface DanhMuc {
  id?: number; // id có thể null
  ten: string; // Required
  mota: string; // Required
  trangthai: boolean;
  ngaytao?: Date | null; // Có thể null
}

export interface HinhAnhSanPham {
  id?: number; // Có thể null
  duongdan: string; // Required
  sanpham_id?: number | null; // Có thể null
}

export interface SanPham {
  id?: number; // Có thể null
  ten: string; // Required
  mota: string; // Required
  soluong: number; // Required
  gia: number; // Required
  hinhanh: string; // Required
  khoiluong: number; // Required
  kichthuoc: string; // Required
  thongsokythuat: string; // Required
  thuonghieu: string; // Required
  baohanh: number; // Required
  trangthai: boolean; // Required
  danhmuc_id?: number | null; // Có thể null
  xuatxu_id?: number | null; // Có thể null
  ngaytao?: Date | null; // Có thể null
  ngaycapnhat?: Date | null; // Có thể null
  danhmuc?: string | null;
  xuatxu?: string | null;
  luotmua?: number;
  avgDanhGia?: number;
  hinhAnhSanPhams?: HinhAnhSanPham[]; // Tập hợp các ảnh sản phẩm
}

export interface SanPhamThanhToan {
  id?: number;
  ten: string;
  gia: number;
  hinhanh: string;
  khoiluong: number;
  kichthuoc: string;
  soluongmua?: number;
}

export type SanPhamOperation = {
  dssp: SanPham[];
  tongtrang: number;
};

export type GioHang = {
  id: string | undefined;
  dong: ChiTietGioHang[];
};

export type ChiTietGioHang = {
  id: number | undefined;
  soluong: number;
  ngaytao?: Date | null;
  ngaycapnhat?: Date | null;
  ten: string;
  hinhanh: string;
  gia: number;
  isLocal?: boolean;
};

export type PhanQuyen = {
  id: number;
  ten: string;
  ngaytao?: Date | null;
  ngaycapnhat?: Date | null;
};

export type ManHinh = {
  id: number;
  ten: string;
  duongdan: string;
};

export type NhanVien = {
  id: number;
  hoten: string;
  email: string;
  matkhau?: string;
  token?: string;
  trangthai: boolean;
  phanquyen_id?: number | null;
  ngaytao?: Date | null;
  ngaycapnhat?: Date | null;
  phanQuyen?: PhanQuyen;
};

export type PhanQuyenManHinh = {
  manhinh_id: number;
  phanquyen_id: number;
  manHinh?: ManHinh[] | null;
  phanQuyen: PhanQuyen[] | null;
};

export type DiaChi = {
  id: number;
  idtinhthanh: number;
  tinhthanh: string;
  idquanhuyen: number;
  quanhuyen: string;
  idphuongxa: number;
  phuongxa: string;
  diachicuthe: string;
  tennguoinhan: string;
  sdt: string;
  isMacDinh: boolean;
  ngaytao?: Date | null;
  ngaycapnhat?: Date | null;
  khachhang_id?: number;
};

export type NCC = {
  id?: number;
  ten: string;
  sdt: string;
  diachi: string;
  ngaytao?: Date | null;
  ngaycapnhat?: Date | null;
  nCC_SPs?: NCCSP[];
  PhieuNhaps?: PhieuNhap[];
};

export type NCCSP = {
  ncc_id: number;
  sanpham_id: number;
  gianhap?: number | null;
  ten: string;
  gia: number;
  hinhanh: string;
  ngaytao?: Date | null;
  ngaycapnhat?: Date | null;
};
export type PhieuNhap = {
  id?: number;
  tongsoluong: number;
  tongtien: number;
  trangthaiphieunhap: boolean;
  trangthaithanhtoan: boolean;
  soluonghoantra?: number | null;
  tongtienhoantra?: number | null;
  ngaytao?: Date | null;
  ngaycapnhat?: Date | null;
  nhanvien_id?: number | null;
  ncc_id?: number | null;
  nhanvien_ten?: string;
  ncc_ten: string;
  chiTietPhieuNhaps?: ChiTietPhieuNhap[];
};

export type ChiTietPhieuNhap = {
  sanpham_id: number;
  phieunhap_id: number;
  soluong: number;
  soluonghoantra?: number | null;
  dongia: number;
  ten?: string;
  hinhanh?: string;
};

export type ChiTietHoaDon = {
  sanpham_id: number;
  hoadon_id?: number;
  soluong: number;
  dongia?: number;
  tensanpham?: string;
  hinhanh?: string;
  isDanhGia?: boolean;
};

export type HoaDon = {
  id?: number;
  tongtien: number;
  phivanchuyen: number;
  diachinhanhang: string;
  ngaytao?: Date | null;
  ngaycapnhat?: Date | null;
  khachhang_id: number;
  chiTietHoaDons?: ChiTietHoaDon[];
  nhatKyDonHangs?: NhatKyDonHang[];
  vanChuyen?: VanChuyen;
  thanhToan?: ThanhToan;
  tenkhachhang?: string;
};

export type ThanhToan = {
  id?: number;
  tongtien: number;
  trangthai?: boolean;
  magiaodich?: string | null;
  ngaytao?: Date | null;
  hoadon_id?: number;
  loaithanhtoan_id?: number;
  tenloaithanhtoan?: string;
};

export type NhatKyDonHang = {
  hoadon_id?: number;
  trangthaidonhang_id?: number;
  nhanvien_id?: number;
  ngaytao?: Date | null;
  tentrangthai?: string;
};

export type VanChuyen = {
  id?: number;
  ngaytao?: Date | null;
  ngaynhan?: Date | null;
  trangthaigiao: string; // "Đang giao hàng", "Đã giao hàng", "Không thành công"
  hoadon_id?: number;
  nhanvien_id?: number;
  tennhanviengiao?: string;
};

export type TrangThaiDonHang = {
  id: number;
  ten: string;
};

export type DanhGia = {
  id: number;
  sosao: number;
  noidung: string;
  hinhanh?: string;
  traloi?: string;
  tenkhachhang?: string;
  trangthai?: boolean;
  khachhang_id?: number;
  sanpham_id?: number;
  hoadon_id?: number;
  ngaytao?: Date | null;
  ngaytraloi?: Date | null;
  chiTietHoaDon?: ChiTietHoaDon;
};

export type BaiViet = {
  id: number;
  tieude: string;
  noidung: string;
  hinhanh: string;
  slug: string;
  luotxem?: number;
  luotthich?: number;
  trangthai: boolean | null;
  ngaytao?: Date | null;
  ngaycapnhat?: Date | null;
};

export type DoiTra = {
  id: number;
  trangthai: string;
  ngaytao: Date | null;
  hoadon_id: number;
  nhanvien_id: number;
  hoaDonDTO?: HoaDon;
  chiTietDoiTras: ChiTietDoiTra[];
};

export type ChiTietDoiTra = {
  sanpham_id: number;
  doitra_id: number;
  trangthai: string;
  hinhanhdoitra: string;
  lydodoitra: string;
  soluong: number;
  loaiyeucaudoitra_id?: number | null; // Nullable trong C#
  giaiphapdoitra_id?: number | null; // Nullable trong C#
  tensanpham?: string | null; // Nullable trong C#
  hinhanhsanpham?: string | null; // Nullable trong C#
  tengiaiphapdoitra?: string | null; // Nullable trong C#
  tenloaiyeucaudoitra?: string | null; // Nullable trong C#
  doiTraDTO?: DoiTra;
};

export type GiaiPhapDoiTra = {
  id: number;
  ten: boolean; // Lưu ý: "ten" trong C# là bool
  chiTietDoiTras: ChiTietDoiTra[];
};

export type LoaiYeuCauDoiTra = {
  id: number;
  ten: string; // Lưu ý: "ten" trong C# là string
  chiTietDoiTras: ChiTietDoiTra[];
};
