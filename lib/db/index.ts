"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { TAGS } from "../constants";
import {
  SanPhamOperation,
  DanhMuc,
  XuatXu,
  ChiTietGioHang,
  NhanVien,
  PhanQuyen,
  ManHinh,
  DiaChi,
  NCC,
  NCCSP,
  PhieuNhap,
  SanPhamThanhToan,
  ChiTietHoaDon,
  HoaDon,
  TrangThaiDonHang,
  DanhGia,
  BaiViet,
  DoiTra,
  GiaiPhapDoiTra,
  LoaiYeuCauDoiTra,
  ChiTietDoiTra,
} from "./types";
import {
  contactSchema,
  EmployeeFormData,
  ProductFormData,
  supplierSchema,
} from "@/schemas";
import { FileInput, Row } from "@/lib/types";
import { HinhAnhSanPham, SanPham } from "./types";
import { z } from "zod";
import { revalidateTag } from "next/cache";

const endpoint =
  process.env.NEXT_PUBLIC_SERVER_HOST ?? "https://localhost:44381";

export async function FetchGet({
  cache = "force-cache",
  headers,
  query,
  tags,
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
}) {
  try {
    const result = await fetch(endpoint + query, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      cache,
      ...(tags && { next: { tags } }),
    });
    const body = await result.json();
    if (body.errors) {
      throw new Error(body.errors[0].message || "Unknown API Error");
    }
    return body;
  } catch (e) {
    console.error("Fetch Error:", e);
    throw {
      error: e,
    };
  }
}

export async function FetchPost<T>({
  method,
  headers,
  query,
  data,
}: {
  method?: "POST" | "DELETE" | "PUT";
  headers?: HeadersInit;
  query: string;
  data: any;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(endpoint + query, {
      method: method ?? "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });

    const body = await result.json();

    if (result.status === 200) {
      return {
        status: result.status,
        body,
      };
    } else {
      throw {
        status: result.status,
        body: body.message || "Có lỗi xảy ra.",
      };
    }
  } catch (e: any) {
    console.error("Fetch Error:", e);
    return {
      status: e.status,
      body: e.body || "Có lỗi xảy ra.",
    };
  }
}

export async function getProducts({
  timkiem = "",
  trang = 1,
  sapxep = "",
  giatoithieu = 0,
  giatoida = 0,
  danhmuc_ids = "",
  trangthai = true,
}: {
  timkiem?: string;
  trang?: number;
  sapxep?: string;
  giatoithieu?: number;
  giatoida?: number;
  danhmuc_ids?: string;
  xuatxu_id?: number;
  trangthai?: boolean;
}): Promise<SanPhamOperation> {
  const tags = [TAGS.sanphams];
  const query =
    danhmuc_ids === ""
      ? `/api/SanPham?timkiem=${timkiem}&trang=${trang}&sapxep=${sapxep}&giatoithieu=${giatoithieu}&trangthai=${trangthai}&giatoida=${giatoida}`
      : `/api/SanPham?timkiem=${timkiem}&trang=${trang}&sapxep=${sapxep}&giatoithieu=${giatoithieu}&trangthai=${trangthai}&giatoida=${giatoida}&danhmuc_ids=${danhmuc_ids}`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res.value;
}

export async function getProduct(id: string): Promise<SanPham> {
  const tags = [TAGS.sanphams];
  const res = await FetchGet({
    cache: "no-store",
    query: `/api/SanPham/${id}`,
    tags: tags,
  });
  return res;
}

export async function getViewedProductsData(ids: string): Promise<SanPham[]> {
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/SanPham/LayDSSanPhamDaXem?sanpham_ids=${ids}`,
  });
  return res;
}

export async function getProductsByCategory(id: string): Promise<SanPham[]> {
  const tags = [TAGS.danhmucs, TAGS.sanphams];
  const res = await FetchGet({
    query: `/api/SanPham/LayDSSanPhamDanhMuc/${id}`,
    tags: tags,
  });
  return res;
}

export async function createProducts({
  data,
  image,
  imageList,
  rows,
  description,
}: {
  data: ProductFormData;
  image: FileInput | null;
  imageList: FileInput[];
  rows: Row[];
  description: string;
}): Promise<{ status: number; body: any } | never> {
  const product: SanPham = {
    ten: data.ten,
    mota: description,
    soluong: 0,
    gia: data.gia,
    hinhanh: image?.url ?? "",
    khoiluong: data.khoiluong,
    kichthuoc: data.kichthuoc,
    thongsokythuat: JSON.stringify(rows),
    thuonghieu: data.thuonghieu,
    baohanh: data.baohanh,
    trangthai: true,
    danhmuc_id: Number(data.danhmuc_id),
    xuatxu_id: Number(data.xuatxu_id),
    hinhAnhSanPhams: !imageList[0].url
      ? [
          {
            id: 0,
            duongdan: "string",
            sanpham_id: 0,
          },
        ]
      : imageList.map((item: FileInput): HinhAnhSanPham => {
          return {
            duongdan: item.url ?? "",
          };
        }),
  };
  const res = await FetchPost({
    query: "/api/SanPham/ThemSanPham",
    data: product,
  });
  revalidateTag(TAGS.sanphams);
  return res;
}

export async function createMultipleProducts({
  data,
}: {
  data: SanPham[];
}): Promise<{ status: number; body: any } | never> {
  const products: SanPham[] = data.map((item: SanPham) => {
    return {
      id: item.id,
      ten: item.ten,
      mota: item.mota,
      soluong: 0,
      gia: item.gia,
      hinhanh: item.hinhanh,
      khoiluong: item.khoiluong,
      kichthuoc: item.kichthuoc,
      thongsokythuat: item.thongsokythuat,
      thuonghieu: item.thuonghieu,
      baohanh: item.baohanh,
      trangthai: item.trangthai ? item.trangthai : true,
      danhmuc_id: item.danhmuc_id,
      xuatxu_id: item.xuatxu_id,
      hinhAnhSanPhams: [
        {
          id: 0,
          duongdan: "string",
          sanpham_id: 0,
        },
      ],
    };
  });
  const res = await FetchPost({
    query: "/api/SanPham/ThemNhieuSanPham",
    data: products,
  });
  revalidateTag(TAGS.sanphams);

  return res;
}

// update product

export async function updateProducts({
  product,
}: {
  product: SanPham;
}): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "PUT",

    query: "/api/SanPham/CapNhatSanPham",
    data: {
      id: product.id,
      ten: product.ten,
      mota: product.mota,
      soluong: product.soluong,
      gia: product.gia,
      hinhanh: product.hinhanh,
      khoiluong: product.khoiluong,
      kichthuoc: product.kichthuoc,
      thongsokythuat: product.thongsokythuat,
      thuonghieu: product.thuonghieu,
      baohanh: product.baohanh,
      trangthai: product.trangthai,
      danhmuc_id: product.danhmuc_id,
      xuatxu_id: product.xuatxu_id,
      hinhAnhSanPhams: product.hinhAnhSanPhams,
    },
  });
  revalidateTag(TAGS.sanphams);
  return res;
}

// remove product
export async function removeProducts({
  id,
}: {
  id: number;
}): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "DELETE",
    query: `/api/SanPham/XoaSanPham/${id}`,
    data: {
      id: id,
    },
  });
  revalidateTag(TAGS.sanphams);
  return res;
}

export async function getDanhmucs(): Promise<DanhMuc[]> {
  const tags = [TAGS.danhmucs];
  const query = "/api/DanhMucs?trangthai=true";
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

export async function getNewProducts(): Promise<SanPham[]> {
  const tags = [TAGS.sanphams];
  const query = "/api/SanPham/LayDSSanPhamMoiRa";
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

export async function getTopSellingProducts(): Promise<SanPham[]> {
  const tags = [TAGS.sanphams];
  const query = "/api/SanPham/LayDSSanPhamMuaNhieu";
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res.products;
}

export async function getXuatXus(): Promise<XuatXu[]> {
  const tags = [TAGS.xuatxus];
  const query = "/api/XuatXus";
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

// cart

export async function getCart(
  userId: number | undefined
): Promise<ChiTietGioHang[]> {
  if (!userId) {
    return [];
  }
  const cache = "no-store";
  const query = `/api/GioHang/LaySPGioHangGanDay?khachhang_id=${userId}`;
  const res = await FetchGet({
    cache: cache,
    query: query,
  });

  if (!res) {
    return [];
  }

  const combineData = res.map((item: any) => {
    return {
      id: item.sanpham_id,
      soluong: item.soluong,
      ngaytao: item.ngaytao,
      ngaycapnhat: item.ngaycapnhat,
      ten: item?.sanPham?.ten,
      hinhanh: item?.sanPham?.hinhanh,
      gia: item?.sanPham?.gia,
    };
  });
  return combineData;
}

export async function addToCart({
  userId,
  productId,
  quantity,
}: {
  userId: number;
  productId: number;
  quantity: number;
}): Promise<{ status: number; body: any } | never> {
  const cart = {
    sanpham_id: productId,
    khachhang_id: userId,
    soluong: quantity,
  };
  const res = await FetchPost({
    query: "/api/GioHang/ThemSPGioHang",
    data: cart,
  });
  return res;
}

export async function removeFromCart(
  userId: number,
  productId: number
): Promise<{ status: number; body: any } | never> {
  const cart = {
    sanpham_id: productId,
    khachhang_id: userId,
    soluong: 0,
  };
  console.log("server action", cart);
  const res = await FetchPost({
    method: "DELETE",
    query: "/api/GioHang/XoaSPGioHang",
    data: cart,
  });
  return res;
}

export async function updateCart(
  userId: number,
  productId: number,
  quantity: number
): Promise<{ status: number; body: any } | never> {
  const cart = {
    sanpham_id: productId,
    khachhang_id: userId,
    soluong: quantity,
  };
  const res = await FetchPost({
    method: "PUT",
    query: "/api/GioHang/SuaSPGioHang",
    data: cart,
  });
  return res;
}

// Nhan vien

// get
export async function getEmployees({
  timkiem = "",
  sapxep = "",
  trangthai = true,
}: {
  timkiem?: string;
  sapxep?: string;
  trangthai?: boolean;
}): Promise<NhanVien[]> {
  const tags = [TAGS.nhanvien];
  const query = `/api/NhanVien/LayDSNhanVien?timkiem=${timkiem}&sapxep=${sapxep}&trangthai=${trangthai}`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

export async function getDeliveryEmployees(): Promise<NhanVien[]> {
  const tags = [TAGS.nhanvien];
  const query = `/api/NhanVien/LayNhanVienGiaoHang`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

export async function getEmployee({ id }: { id: number }): Promise<NhanVien> {
  const tags = [TAGS.nhanvien];
  const query = `/api/NhanVien/LayNhanVien?id=${id}`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

export async function getPhanQuyen(): Promise<PhanQuyen[]> {
  const tags = [TAGS.phanquyen];
  const query = `/api/PhanQuyens`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

// post
export async function createEmployee({
  data,
}: {
  data: EmployeeFormData;
}): Promise<{ status: number; body: any } | never> {
  const employee: NhanVien = {
    id: 0,
    hoten: data.hoten,
    email: data.email,
    matkhau: data.password ?? "",
    trangthai: true,
    phanquyen_id: Number(data.phanquyen_id),
  };
  const res = await FetchPost({
    query: "/api/NhanVien/ThemNhanVien",
    data: employee,
  });
  revalidateTag(TAGS.nhanvien);
  return res;
}

// put
export async function updateEmployee({
  id,
  data,
}: {
  id: number;
  data: EmployeeFormData;
}): Promise<{ status: number; body: any } | never> {
  const employee: NhanVien = {
    id: id,
    hoten: data.hoten,
    email: data.email,
    matkhau: data.password || data.password != "" ? data.password : "-1",
    trangthai: true,
    phanquyen_id: Number(data.phanquyen_id),
  };

  const res = await FetchPost({
    method: "PUT",
    query: "/api/NhanVien/SuaNhanVien",
    data: employee,
  });
  revalidateTag(TAGS.nhanvien);
  return res;
}

// put
export async function removeEmployee({
  id,
}: {
  id: number;
}): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "PUT",
    query: `/api/NhanVien/SuaNhanVien/${id}`,
    data: {
      id: id,
    },
  });
  revalidateTag(TAGS.nhanvien);

  return res;
}

// get
export async function getScreens(): Promise<ManHinh[]> {
  const tags = [TAGS.manhinh];
  const query = `/api/ManHinhs`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

// post
export async function createScreen(
  formData: FormData
): Promise<{ status: number; body: any } | never> {
  const data = {
    ten: formData.get("ten"),
    duongdan: formData.get("duongdan"),
  };
  const res = await FetchPost({
    method: "POST",
    query: `/api/ManHinhs`,
    data: data,
  });
  revalidateTag(TAGS.manhinh);
  return res;
}

export async function createCategory(
  formData: FormData
): Promise<{ status: number; body: any } | never> {
  const data = {
    id: 0,
    ten: formData.get("ten"),
    mota: "string",
    trangthai: Boolean(formData.get("trangthai")),
    ngaytao: "2024-11-28T06:37:56.779Z",
  };
  const res = await FetchPost({
    method: "POST",
    query: `/api/DanhMucs`,
    data: data,
  });
  revalidateTag(TAGS.danhmucs);
  return res;
}

// put
export async function updateScreen(
  formData: FormData
): Promise<{ status: number; body: any } | never> {
  const data = {
    id: formData.get("id"),
    ten: formData.get("ten"),
    duongdan: formData.get("duongdan"),
  };
  const res = await FetchPost({
    method: "PUT",
    query: `/api/ManHinhs/${data.id}`,
    data: data,
  });
  revalidateTag(TAGS.manhinh);

  return res;
}

export async function updateCategory(
  formData: FormData
): Promise<{ status: number; body: any } | never> {
  const data = {
    id: Number(formData.get("id")),
    ten: formData.get("ten"),
    mota: "string",
    trangthai: Boolean(formData.get("trangthai")),
    ngaytao: "2024-11-28T06:37:56.779Z",
  };
  const res = await FetchPost({
    method: "PUT",
    query: `/api/DanhMucs/${data.id}`,
    data: data,
  });
  revalidateTag(TAGS.danhmucs);

  return res;
}

// delete
export async function deleteScreen(
  formData: FormData
): Promise<{ status: number; body: any } | never> {
  const data = {
    id: formData.get("id"),
  };
  const res = await FetchPost({
    method: "DELETE",
    query: `/api/ManHinhs/${data.id}`,
    data: data,
  });
  revalidateTag(TAGS.manhinh);

  return res;
}

// get
export async function getRoles(): Promise<PhanQuyen[]> {
  const tags = [TAGS.phanquyen];
  const query = `/api/PhanQuyens`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

export async function getCategoryList(): Promise<DanhMuc[]> {
  const tags = [TAGS.danhmucs];
  const query = `/api/DanhMucs`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

// post
export async function createRole(
  formData: FormData
): Promise<{ status: number; body: any } | never> {
  const data = {
    ten: formData.get("ten"),
  };
  const res = await FetchPost({
    method: "POST",
    query: `/api/PhanQuyens`,
    data: data,
  });
  revalidateTag(TAGS.phanquyen);
  return res;
}

// put
export async function updateRole(
  formData: FormData
): Promise<{ status: number; body: any } | never> {
  const data = {
    id: formData.get("id"),
    ten: formData.get("ten"),
  };
  const res = await FetchPost({
    method: "PUT",
    query: `/api/PhanQuyens/${data.id}`,
    data: data,
  });
  revalidateTag(TAGS.phanquyen);

  return res;
}

// delete
export async function deleteRole(
  formData: FormData
): Promise<{ status: number; body: any } | never> {
  const data = {
    id: formData.get("id"),
  };
  const res = await FetchPost({
    method: "DELETE",
    query: `/api/PhanQuyens/${data.id}`,
    data: data,
  });
  revalidateTag(TAGS.phanquyen);

  return res;
}

export async function updateRoleScreen(
  formData: FormData
): Promise<{ status: number; body: any } | never> {
  const pq_id = formData.get("id");
  const data = formData.getAll("screens").map((item) => {
    return {
      manhinh_id: Number(item),
      phanquyen_id: pq_id,
    };
  });
  const res = await FetchPost({
    method: "PUT",
    query: `/api/PhanQuyens/PutPhanQuyenManHinhs/${pq_id}`, // Ensure URL is correct
    data: data, // Ensure data matches API expectations
  });

  revalidateTag(TAGS.manhinh);

  return res;
}

// diachi

export const CreateAddress = async (userId: number, data: DiaChi) => {
  const res = await FetchPost({
    method: "POST",
    query: `/api/DiaChis`,
    data: {
      ...data,
      khachhang_id: userId,
    },
  });
  revalidateTag(TAGS.diachi);

  return res;
};

export const updateAddress = async (userId: number, data: DiaChi) => {
  const res = await FetchPost({
    method: "PUT",
    query: `/api/DiaChis/${userId}`,
    data: {
      ...data,
      khachhang_id: userId,
    },
  });
  revalidateTag(TAGS.diachi);

  return res;
};

export const deleteAddress = async (address: DiaChi) => {
  const res = await FetchPost({
    method: "DELETE",
    query: `/api/DiaChis`,
    data: {
      ...address,
    },
  });
  revalidateTag(TAGS.diachi);

  return res;
};

export async function getDiaChis(userId: number): Promise<DiaChi[]> {
  const query = `/api/DiaChis/${userId}`;
  const res = await FetchGet({
    cache: "no-store",
    query: query,
  });
  return res;
}

// import
// get
export async function getNCCS(): Promise<NCC[]> {
  const tags = [TAGS.NCC];
  const query = `/api/NCCs`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

// get
export const CreateSupplier = async (data: z.infer<typeof supplierSchema>) => {
  console.log({
    id: 0,
    ...data,
  });
  const res = await FetchPost({
    method: "POST",
    query: `/api/NCCs`,
    data: {
      id: 0,
      ...data,
    },
  });
  revalidateTag(TAGS.NCC);

  return res;
};

export async function GetSanPhamsNotInNCCSP(id: number): Promise<SanPham[]> {
  const tags = [TAGS.NCCSP];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/NCCs/GetSanPhamsNotInNCCSP/${id}`,
    tags: tags,
  });
  return res;
}

export async function GetSanPhamsInNCCSP(id: number): Promise<NCCSP[]> {
  const tags = [TAGS.NCCSP];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/NCCs/GetSanPhamsInNCCSP/${id}`,
    tags: tags,
  });
  console.log(res);
  return res;
}

// post
export async function createSupplierProducts(
  formData: FormData
): Promise<{ status: number; body: any } | never> {
  const id = formData.get("id");
  const data = formData.getAll("productnotinsupplier");
  const res = await FetchPost({
    method: "POST",
    query: `/api/NCCs/CreateNCCSP/${id}`,
    data: data,
  });
  revalidateTag(TAGS.NCCSP);
  return res;
}

// post
export async function createPurchaseOrder(
  data: any
): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "POST",
    query: `/api/NhapHang/ThemPhieuNhapHang`,
    data: data,
  });
  revalidateTag(TAGS.nhaphang);

  return res;
}

export async function getPurchaseOrder({
  timkiem = "",
  trang = 1,
  sapxep = "",
  loaiTimKiem = "",
  trangthainhap = "",
  trangthaithanhtoan = "",
}: {
  timkiem: string;
  trang: number;
  sapxep?: string;
  loaiTimKiem: string;
  trangthainhap: string;
  trangthaithanhtoan: string;
}) {
  const tags = [TAGS.nhaphang];
  const cache = "no-store";
  const query = `/api/NhapHang/LayDSNhapHang?timkiem=${timkiem}&trang=${trang}&sapxep=${sapxep}&loaiTimKiem=${loaiTimKiem}&trangthainhap=${trangthainhap}&trangthaithanhtoan=${trangthaithanhtoan}`;
  const res = await FetchGet({
    cache: cache,
    query: query,
    tags: tags,
  });
  return res;
}

export async function getPurchaseOrderDetail(id: number): Promise<PhieuNhap> {
  const tags = [TAGS.nhaphang];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/NhapHang/${id}`,
    tags: tags,
  });
  return res;
}

// post
export async function updatePurchaseOrder(
  udQuantity: boolean,
  udQuantityState: boolean,
  udQuantityStatePm: boolean,
  data: PhieuNhap
): Promise<{ status: number; body: any } | never> {
  const ip = {
    capnhatsoluong: udQuantity,
    capnhattrangthai: udQuantityState,
    capnhatthanhtoan: udQuantityStatePm,
    phieuNhapDTO: data,
  };
  const res = await FetchPost({
    method: "PUT",
    query: `/api/NhapHang/${data.id}`,
    data: ip,
  });
  revalidateTag(TAGS.nhaphang);
  return res;
}

//checkout
// export async function getProductCheckout(
//   orderdetail: ChiTietHoaDon[]
// ): Promise<SanPhamThanhToan[]> {
//   const res = await FetchPost({
//     method: "POST",
//     query: `/api/SanPham/LayDSSanPhamThanhToan`,
//     data: orderdetail,
//   });
//   const data: any = res.body;
//   return data.value as SanPhamThanhToan[];
// }

export async function getProductCheckout(
  orderdetail: ChiTietHoaDon[]
): Promise<SanPhamThanhToan[]> {
  // Gọi duy nhất 1 lần API
  const res = await FetchPost({
    method: "POST",
    query: `/api/SanPham/LayDSSanPhamThanhToan`,
    data: orderdetail,
  });
  if (res.status !== 200) {
    throw new Error("Lỗi lấy danh sách sản phẩm thanh toán");
  }
  const data: any = res.body;
  return data.value as SanPhamThanhToan[];
}

export async function CreateOrder(
  data: HoaDon
): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "POST",
    query: `/api/DonHang`,
    data: data,
  });
  revalidateTag(TAGS.dathang);
  return res;
}

export async function getVPNSecureHash1(
  secret: string,
  data: string
): Promise<{ vpn_secureHash: string }> {
  const tags = [TAGS.vnp];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/DonHang/GetVPNSecureHash?key=${secret}&inputData=${data}`,
    tags: tags,
  });
  return res;
}

export async function postSendmail(data: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL_HOST}/api/send-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    }
  );
  return response;
}

export async function getVPNSecureHash(
  secret: string,
  data: string
): Promise<{ vpn_secureHash: string }> {
  const res = await FetchPost({
    method: "POST",
    query: `/api/DonHang/GetVPNSecureHash`,
    data: {
      key: secret,
      data: data,
    },
  });
  const datares: any = res.body;
  revalidateTag(TAGS.dathang);
  return datares as { vpn_secureHash: string };
}

export async function orderpayment(data: {
  OrderId: string;
  VnpResponseCode: string;
  VnpTransactionStatus: string;
  VnpTxnRef: string;
  hashData?: string;
  VnpSecureHash?: string;
  VnpPayDate?: string;
}): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "POST",
    query: `/api/DonHang/ThanhToanDonHang`,
    data: data,
  });

  revalidateTag(TAGS.dathang);
  return res;
}

// donhang

export async function getOrderStatus(
  type: string
): Promise<TrangThaiDonHang[]> {
  const tags = [TAGS.trangthaidonhang];
  const query = `/api/DonHang/LayTrangThaiDonHang?loai=${type}`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

//checkout
export async function getOrderOfUser(
  userId: number,
  orderStatus: number
): Promise<HoaDon[]> {
  const tags = [TAGS.donhang];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/DonHang?KhachHangId=${userId}&trangthai=${orderStatus}`,
    tags: tags,
  });
  return res;
}

// order

export async function getOrder(orderStatus: number): Promise<HoaDon[]> {
  const tags = [TAGS.donhang];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/DonHang/LayDSDonHang?trangthai=${orderStatus}`,
    tags: tags,
  });
  return res;
}

export async function getOrderDelivery(
  orderStatus: number,
  empId: number
): Promise<HoaDon[]> {
  const tags = [TAGS.donhang];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/DonHang/LayDSDonHang?trangthai=${orderStatus}&vanchuyenid=${empId}`,
    tags: tags,
  });
  return res;
}

// confirmOrder

export async function confirmOrder(
  hdid: number,
  nvid: number
): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "PUT",
    query: `/api/DonHang/XacNhanDonHang/${hdid}?nvid=${nvid}`,
    data: {
      nvid: nvid,
    },
  });
  return res;
}

export async function CreateDeliveryOrder(
  hdid: number,
  nvxnid: number,
  nvghid: number
): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "PUT",
    query: `/api/DonHang/VanChuyenDonHang/${hdid}?nvxnid=${nvxnid}&nvghid=${nvghid}`,
    data: {
      nvxnid: nvxnid,
      nvghid: nvghid,
    },
  });
  return res;
}

//cancelOrder
export async function cancelOrder(
  hdid: number
): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "PUT",
    query: `/api/DonHang/HuyDonHang/${hdid}`,
    data: {},
  });
  return res;
}

// order detail

export async function getOrderDetail(id: number): Promise<HoaDon> {
  const tags = [TAGS.donhang];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/DonHang/LayDonHang/${id}`,
    tags: tags,
  });
  return res;
}

// delivery order

export async function updateDeliveryOrder(
  hdid: number,
  nvid: number,
  trangthai: number
): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "PUT",
    query: `/api/DonHang/CapNhatDonHangVanChuyen/${hdid}?nvid=${nvid}&trangthai=${trangthai}`,
    data: {
      nvid: nvid,
      trangthai: trangthai,
    },
  });
  return res;
}

// resetpassword
// resetpassword

export async function putPasswordReset(
  email: string,
  password: string
): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "PUT",
    query: `/api/Auth/ConfirmPassword`,
    data: {
      email: email,
      password: password,
    },
  });
  return res;
}

export async function CreateRating(
  ratingData: DanhGia
): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "POST",
    query: `/api/DanhGia`,
    data: ratingData,
  });
  return res;
}

export async function getRatingList(type: string): Promise<DanhGia[]> {
  const tags = [TAGS.danhgia];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/DanhGia?loai=${type}`,
    tags: tags,
  });
  return res;
}

export async function updateRating(
  id: number,
  isPpprove: boolean
): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "PUT",
    query: `/api/DanhGia/CapNhatDanhGia/${id}?isDuyet=${isPpprove}`,
    data: {
      isPpprove: isPpprove,
    },
  });
  return res;
}

export async function replyRating(
  id: number,
  mes: string
): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "PUT",
    query: `/api/DanhGia/TraLoiDanhGia/${id}?traloi=${mes}`,
    data: {
      mes: mes,
    },
  });
  return res;
}

export async function getRatingOfProduct(
  id: number,
  star: number,
  page: number
): Promise<{ dsdg: DanhGia[]; tongtrang: number }> {
  const tags = [TAGS.danhgia];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/DanhGia/${id}?sosao=${star}&trang=${page}`,
    tags: tags,
  });
  return res;
}

export async function getPublicBlogs(page: number): Promise<BaiViet[]> {
  const tags = [TAGS.baiviet];
  const query = `/api/BaiViets/LayDSBaiViet?trang=${page}`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

export async function getAllBlogs(): Promise<BaiViet[]> {
  const cache = "no-store";
  const query = `/api/BaiViets`;
  const res = await FetchGet({
    cache: cache,
    query: query,
  });
  return res;
}

export async function getBlog({ slug }: { slug: string }): Promise<BaiViet> {
  const tags = [TAGS.baiviet];
  const query = `/api/BaiViets/${slug}`;
  const res = await FetchGet({
    query: query,
    tags: tags,
  });
  return res;
}

// post
export async function createPost({
  data,
}: {
  data: BaiViet;
}): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "POST",
    query: "/api/BaiViets",
    data: data,
  });
  revalidateTag(TAGS.baiviet);
  return res;
}

export async function deletePost({
  id,
}: {
  id: number;
}): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "DELETE",
    query: `/api/BaiViets/${id}`,
    data: {
      id: id,
    },
  });
  revalidateTag(TAGS.baiviet);

  return res;
}

export async function updatePost({
  id,
  data,
}: {
  id: number;
  data: BaiViet;
}): Promise<{ status: number; body: any } | never> {
  const res = await FetchPost({
    method: "PUT",
    query: `/api/BaiViets/${id}`,
    data: data,
  });
  revalidateTag(TAGS.baiviet);
  return res;
}

export async function getpublicBlogs({ page }: { page: number }): Promise<{
  dsbv: BaiViet[];
  tongtrang: number;
}> {
  const tags = [TAGS.baiviet];
  const cache = "no-store";
  const query = `/api/BaiViets/LayDSBaiViet?trang=${page}`;
  const res = await FetchGet({
    cache: cache,
    query: query,
    tags: tags,
  });
  return res;
}

export async function getPopularBlogs({
  id,
}: {
  id: number;
}): Promise<BaiViet[]> {
  const tags = [TAGS.baiviet];
  const cache = "no-store";
  const query = `/api/BaiViets/LayDSBaiVietNoiBat?idbvht=${id}`;
  const res = await FetchGet({
    cache: cache,
    query: query,
    tags: tags,
  });
  return res;
}

export async function getQuantityReport(): Promise<any> {
  const tags = [TAGS.thongke];
  const cache = "no-store";
  const query = `/api/ThongKe/ThongKeSoLuong`;
  const res = await FetchGet({
    cache: cache,
    query: query,
    tags: tags,
  });
  return res;
}

export async function getRevenue({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<HoaDon[]> {
  const tags = [TAGS.thongke];
  const cache = "no-store";
  const query = `/api/ThongKe/ThongKeDoanhThuGop?nam=${year}&thang=${month}`;
  const res = await FetchGet({
    cache: cache,
    query: query,
    tags: tags,
  });
  return res;
}

export async function getProfit(): Promise<HoaDon[]> {
  const tags = [TAGS.thongke];
  const cache = "no-store";
  const query = "/api/ThongKe/ThongKeLoiNhuanGop";
  const res = await FetchGet({
    cache: cache,
    query: query,
    tags: tags,
  });
  return res;
}

export async function getTopUser(): Promise<
  {
    id: number;
    ten: string;
    email: string;
    tongtien: number;
  }[]
> {
  const tags = [TAGS.thongke];
  const cache = "no-store";
  const query = `/api/ThongKe/ThongKeKhachHangMuaNhieu`;
  const res = await FetchGet({
    cache: cache,
    query: query,
    tags: tags,
  });
  return res;
}
export async function getImport(): Promise<any> {
  const tags = [TAGS.thongke];
  const cache = "no-store";
  const query = `/api/ThongKe/ThongKeChiPhiNhapHang`;
  const res = await FetchGet({
    cache: cache,
    query: query,
    tags: tags,
  });
  return res;
}

// doi tra
export async function getReturnRequestInfo({
  orderId,
  productId,
}: {
  orderId: number;
  productId: number;
}): Promise<
  | {
      status: number;
      body:
        | {
            sanpham: SanPham;
            phuongphap: GiaiPhapDoiTra[];
            loaiyeucau: LoaiYeuCauDoiTra[];
          }
        | any;
    }
  | never
> {
  const data = {
    id: 0,
    trangthai: "string",
    ngaytao: "2024-11-16T10:01:32.376Z",
    hoadon_id: orderId,
    nhanvien_id: 0,
    chiTietDoiTras: [
      {
        sanpham_id: productId,
        doitra_id: 0,
        trangthai: "string",
        lydodoitra: "string",
        soluong: 0,
        loaiyeucaudoitra_id: 0,
        giaiphapdoitra_id: 0,
        tensanpham: "string",
        gia: 0,
        hinhanhsanpham: "string",
        tengiaiphapdoitra: "string",
        tenloaiyeucaudoitra: "string",
        hinhanhdoitra: "string",
      },
    ],
  };

  const res = await FetchPost({
    method: "POST",
    query: `/api/DoiTra/LayThongTinYeuCauDoiTra`,
    data: data,
  });
  return res;
}

export async function createRequestReturn({
  payload: { orderId, productId, quantity, images, reason, content, solution },
}: {
  payload: {
    orderId: number;
    productId: number;
    quantity: number;
    images: FileInput[];
    reason: string;
    content: string;
    solution: string;
  };
}): Promise<
  | {
      status: number;
      body: DoiTra | any;
    }
  | never
> {
  const data = {
    id: 0,
    trangthai: "string",
    ngaytao: null,
    hoadon_id: orderId,
    nhanvien_id: 0,
    chiTietDoiTras: [
      {
        sanpham_id: productId,
        doitra_id: 0,
        trangthai: "string",
        lydodoitra: content,
        soluong: quantity,
        loaiyeucaudoitra_id: Number(reason),
        giaiphapdoitra_id: Number(solution),
        tensanpham: "string",
        gia: 0,
        hinhanhsanpham: "string",
        tengiaiphapdoitra: "string",
        tenloaiyeucaudoitra: "string",
        hinhanhdoitra: images.map((item) => item.url).join("____"),
      },
    ],
  };

  const res = await FetchPost({
    method: "POST",
    query: `/api/DoiTra/YeuCauDoiTra`,
    data: data,
  });
  return res;
}

export async function getReturnOrder(
  orderStatus: number
): Promise<ChiTietDoiTra[]> {
  const tags = [TAGS.doitra];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/DoiTra/LayDSDoiTra?trangthai=${orderStatus}`,
    tags: tags,
  });
  return res;
}

export async function getReturnOrderDetail(
  id: number,
  productId: number
): Promise<ChiTietDoiTra> {
  const tags = [TAGS.doitra];
  const cache = "no-store";
  const res = await FetchGet({
    cache: cache,
    query: `/api/DoiTra/LayChiTietDoiTra?dtid=${id}&spid=${productId}`,
    tags: tags,
  });
  return res;
}

export async function refusedExchange({
  payload: { exchangeOrderId, orderId, productId, empId },
}: {
  payload: {
    exchangeOrderId: number;
    orderId: number;
    productId: number;
    empId: number;
  };
}): Promise<
  | {
      status: number;
      body: DoiTra | any;
    }
  | never
> {
  const data = {
    id: exchangeOrderId,
    trangthai: "string",
    ngaytao: "2024-11-24T05:05:01.630Z",
    hoadon_id: orderId,
    nhanvien_id: empId,
    hoaDonDTO: {
      id: 0,
      tongtien: 0,
      phivanchuyen: 0,
      diachinhanhang: "string",
      tenkhachhang: "string",
      ngaytao: "2024-11-24T05:05:01.630Z",
      ngaycapnhat: "2024-11-24T05:05:01.630Z",
      khachhang_id: 0,
      chiTietHoaDons: [
        {
          sanpham_id: 0,
          hoadon_id: 0,
          soluong: 0,
          dongia: 0,
          tensanpham: "string",
          hinhanh: "string",
          isDanhGia: true,
        },
      ],
      nhatKyDonHangs: [
        {
          hoadon_id: 0,
          trangthaidonhang_id: 0,
          nhanvien_id: 0,
          tentrangthai: "string",
          ngaytao: "2024-11-24T05:05:01.630Z",
        },
      ],
      vanChuyen: {
        id: 0,
        ngaytao: "2024-11-24T05:05:01.630Z",
        ngaynhan: "2024-11-24T05:05:01.630Z",
        trangthaigiao: "string",
        hoadon_id: 0,
        nhanvien_id: 0,
        tennhanviengiao: "string",
      },
      thanhToan: {
        id: 0,
        tongtien: 0,
        trangthai: true,
        magiaodich: "string",
        ngaytao: "2024-11-24T05:05:01.630Z",
        hoadon_id: 0,
        loaithanhtoan_id: 0,
        tenloaithanhtoan: "string",
      },
    },
    chiTietDoiTras: [
      {
        sanpham_id: productId,
        doitra_id: 0,
        trangthai: "string",
        lydodoitra: "string",
        hinhanhdoitra: "string",
        soluong: 0,
        loaiyeucaudoitra_id: 0,
        giaiphapdoitra_id: 0,
        tensanpham: "string",
        hinhanhsanpham: "string",
        tengiaiphapdoitra: "string",
        tenloaiyeucaudoitra: "string",
      },
    ],
  };

  const res = await FetchPost({
    method: "PUT",
    query: `/api/DoiTra/TuChoiDoiTra`,
    data: data,
  });
  return res;
}

export async function acceptExchange({
  payload: { exchangeOrderId, orderId, productId, empId },
}: {
  payload: {
    exchangeOrderId: number;
    orderId: number;
    productId: number;
    empId: number;
  };
}): Promise<
  | {
      status: number;
      body: DoiTra | any;
    }
  | never
> {
  const data = {
    id: exchangeOrderId,
    trangthai: "string",
    ngaytao: "2024-11-24T05:05:01.630Z",
    hoadon_id: orderId,
    nhanvien_id: empId,
    hoaDonDTO: {
      id: 0,
      tongtien: 0,
      phivanchuyen: 0,
      diachinhanhang: "string",
      tenkhachhang: "string",
      ngaytao: "2024-11-24T05:05:01.630Z",
      ngaycapnhat: "2024-11-24T05:05:01.630Z",
      khachhang_id: 0,
      chiTietHoaDons: [
        {
          sanpham_id: 0,
          hoadon_id: 0,
          soluong: 0,
          dongia: 0,
          tensanpham: "string",
          hinhanh: "string",
          isDanhGia: true,
        },
      ],
      nhatKyDonHangs: [
        {
          hoadon_id: 0,
          trangthaidonhang_id: 0,
          nhanvien_id: 0,
          tentrangthai: "string",
          ngaytao: "2024-11-24T05:05:01.630Z",
        },
      ],
      vanChuyen: {
        id: 0,
        ngaytao: "2024-11-24T05:05:01.630Z",
        ngaynhan: "2024-11-24T05:05:01.630Z",
        trangthaigiao: "string",
        hoadon_id: 0,
        nhanvien_id: 0,
        tennhanviengiao: "string",
      },
      thanhToan: {
        id: 0,
        tongtien: 0,
        trangthai: true,
        magiaodich: "string",
        ngaytao: "2024-11-24T05:05:01.630Z",
        hoadon_id: 0,
        loaithanhtoan_id: 0,
        tenloaithanhtoan: "string",
      },
    },
    chiTietDoiTras: [
      {
        sanpham_id: productId,
        doitra_id: 0,
        trangthai: "string",
        lydodoitra: "string",
        hinhanhdoitra: "string",
        soluong: 0,
        loaiyeucaudoitra_id: 0,
        giaiphapdoitra_id: 0,
        tensanpham: "string",
        hinhanhsanpham: "string",
        tengiaiphapdoitra: "string",
        tenloaiyeucaudoitra: "string",
      },
    ],
  };
  const res = await FetchPost({
    method: "PUT",
    query: `/api/DoiTra/ChapNhanDoiTra`,
    data: data,
  });
  return res;
}

export async function completeExchange({
  payload: { exchangeOrderId, orderId, productId, empId },
}: {
  payload: {
    exchangeOrderId: number;
    orderId: number;
    productId: number;
    empId: number;
  };
}): Promise<
  | {
      status: number;
      body: DoiTra | any;
    }
  | never
> {
  const data = {
    id: exchangeOrderId,
    trangthai: "string",
    ngaytao: "2024-11-24T05:05:01.630Z",
    hoadon_id: orderId,
    nhanvien_id: empId,
    hoaDonDTO: {
      id: 0,
      tongtien: 0,
      phivanchuyen: 0,
      diachinhanhang: "string",
      tenkhachhang: "string",
      ngaytao: "2024-11-24T05:05:01.630Z",
      ngaycapnhat: "2024-11-24T05:05:01.630Z",
      khachhang_id: 0,
      chiTietHoaDons: [
        {
          sanpham_id: 0,
          hoadon_id: 0,
          soluong: 0,
          dongia: 0,
          tensanpham: "string",
          hinhanh: "string",
          isDanhGia: true,
        },
      ],
      nhatKyDonHangs: [
        {
          hoadon_id: 0,
          trangthaidonhang_id: 0,
          nhanvien_id: 0,
          tentrangthai: "string",
          ngaytao: "2024-11-24T05:05:01.630Z",
        },
      ],
      vanChuyen: {
        id: 0,
        ngaytao: "2024-11-24T05:05:01.630Z",
        ngaynhan: "2024-11-24T05:05:01.630Z",
        trangthaigiao: "string",
        hoadon_id: 0,
        nhanvien_id: 0,
        tennhanviengiao: "string",
      },
      thanhToan: {
        id: 0,
        tongtien: 0,
        trangthai: true,
        magiaodich: "string",
        ngaytao: "2024-11-24T05:05:01.630Z",
        hoadon_id: 0,
        loaithanhtoan_id: 0,
        tenloaithanhtoan: "string",
      },
    },
    chiTietDoiTras: [
      {
        sanpham_id: productId,
        doitra_id: 0,
        trangthai: "string",
        lydodoitra: "string",
        hinhanhdoitra: "string",
        soluong: 0,
        loaiyeucaudoitra_id: 0,
        giaiphapdoitra_id: 0,
        tensanpham: "string",
        hinhanhsanpham: "string",
        tengiaiphapdoitra: "string",
        tenloaiyeucaudoitra: "string",
      },
    ],
  };

  const res = await FetchPost({
    method: "PUT",
    query: `/api/DoiTra/DoiTraThanhCong`,
    data: data,
  });
  return res;
}

export async function cancelExchange({
  payload: { exchangeOrderId, orderId, productId },
}: {
  payload: {
    exchangeOrderId: number;
    orderId: number;
    productId: number;
  };
}): Promise<
  | {
      status: number;
      body: DoiTra | any;
    }
  | never
> {
  const data = {
    id: exchangeOrderId,
    trangthai: "string",
    ngaytao: "2024-11-24T05:05:01.630Z",
    hoadon_id: orderId,
    nhanvien_id: 0,
    hoaDonDTO: {
      id: 0,
      tongtien: 0,
      phivanchuyen: 0,
      diachinhanhang: "string",
      tenkhachhang: "string",
      ngaytao: "2024-11-24T05:05:01.630Z",
      ngaycapnhat: "2024-11-24T05:05:01.630Z",
      khachhang_id: 0,
      chiTietHoaDons: [
        {
          sanpham_id: 0,
          hoadon_id: 0,
          soluong: 0,
          dongia: 0,
          tensanpham: "string",
          hinhanh: "string",
          isDanhGia: true,
        },
      ],
      nhatKyDonHangs: [
        {
          hoadon_id: 0,
          trangthaidonhang_id: 0,
          nhanvien_id: 0,
          tentrangthai: "string",
          ngaytao: "2024-11-24T05:05:01.630Z",
        },
      ],
      vanChuyen: {
        id: 0,
        ngaytao: "2024-11-24T05:05:01.630Z",
        ngaynhan: "2024-11-24T05:05:01.630Z",
        trangthaigiao: "string",
        hoadon_id: 0,
        nhanvien_id: 0,
        tennhanviengiao: "string",
      },
      thanhToan: {
        id: 0,
        tongtien: 0,
        trangthai: true,
        magiaodich: "string",
        ngaytao: "2024-11-24T05:05:01.630Z",
        hoadon_id: 0,
        loaithanhtoan_id: 0,
        tenloaithanhtoan: "string",
      },
    },
    chiTietDoiTras: [
      {
        sanpham_id: productId,
        doitra_id: 0,
        trangthai: "string",
        lydodoitra: "string",
        hinhanhdoitra: "string",
        soluong: 0,
        loaiyeucaudoitra_id: 0,
        giaiphapdoitra_id: 0,
        tensanpham: "string",
        hinhanhsanpham: "string",
        tengiaiphapdoitra: "string",
        tenloaiyeucaudoitra: "string",
      },
    ],
  };

  const res = await FetchPost({
    method: "PUT",
    query: `/api/DoiTra/HuyDoiTra`,
    data: data,
  });
  return res;
}

export async function sendContact(
  data: z.infer<typeof contactSchema>
): Promise<{ success?: string; error?: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL_HOST}/api/send-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: process.env.EMAIL_USER,
        from: data.email,
        subject: "Thư phản hồi",
        text: "Thư phản hồi",
        html: `<!DOCTYPE html> <html> <head> <meta charset="utf-8" /> <title></title> </head> <body> <h1 style="text-align: center; font-size: 32px;">Thư phản hồi</h1> <div style="display: flex; align-items: center; gap: 12px;">Thông tin người gửi: <span>${data.fullName}</span> <span>- ${data.email}</span> <span>- ${data.phone}</span> </div> <p style="text-align: justify; font-size: 16px;">${data.content}</p> </body> </html>`,
      }),
    }
  );

  if (!response.ok)
    return {
      error: "Gửi không thành công. Vui lòng thực hiện lại!",
    };
  return {
    success: "Gửi thành công",
  };
}
