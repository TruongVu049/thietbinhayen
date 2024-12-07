export type NavType = {
  id: number;
  title: string;
  path: string;
};

export const NavList: NavType[] = [
  {
    id: 1,
    title: "Trang chủ",
    path: "/",
  },
  {
    id: 2,
    title: "Sản phẩm",
    path: "/search",
  },
];

export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: "Default" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export const sorting: SortFilterItem[] = [
  {
    title: "Mặc định",
    slug: "",
    sortKey: "Default",
    reverse: false,
  }, // asc
  {
    title: "Giá tăng dần",
    slug: "gia-tang-dan",
    sortKey: "PRICE",
    reverse: false,
  }, // asc
  {
    title: "Giá giảm dần",
    slug: "gia-giam-dan",
    sortKey: "PRICE",
    reverse: true,
  }, // asc
  {
    title: "Sản phẩm mới",
    slug: "ngay-tao",
    sortKey: "CREATED_AT",
    reverse: false,
  },
];

export const TAGS = {
  danhmucs: "danhmucs",
  sanphams: "sanphams",
  xuatxus: "xuatxus",
  giohang: "giohang",
  nhanvien: "nhanvien",
  phanquyen: "phanquyen",
  manhinh: "manhinh",
  diachi: "diachi",
  nhaphang: "nhaphang",
  NCC: "NCC",
  NCCSP: "NCCSP",
  dathang: "dathang",
  vnp: "vnp",
  donhang: "donhang",
  danhgia: "danhgia",
  baiviet: "baiviet",
  trangthaidonhang: "trangthaidonhang",
  thongke: "thongke",
  doitra: "doitra",
};
