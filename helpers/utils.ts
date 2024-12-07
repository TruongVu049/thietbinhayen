import { ReadonlyURLSearchParams } from "next/navigation";

/* eslint-disable no-nested-ternary */
import { roleType } from "@/lib/types";
import React from "react";
import { HoaDon } from "@/lib/db/types";
import { fileURLToPath } from "url";
export const displayDate = (timestamp: string) => {
  const date = new Date(timestamp);

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  return `${day} ${monthNames[monthIndex]} , ${year}`;
};

export const FormatDate: React.FC<{ isoDate: Date }> = ({ isoDate }) => {
  const date = new Date(isoDate);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

export const FormatVND: React.FC<{ amount: number }> = ({ amount }) => {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formatter.format(amount);
};
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};
export const groupRoute = (routes: roleType[]) => {
  const groupedRoutes: (roleType | roleType[])[] = [];

  const grouped: { [key: string]: roleType[] } = {};

  routes.forEach((route) => {
    const basePath = route.duongdan.split("/").slice(0, 3).join("/");
    if (!grouped[basePath]) {
      grouped[basePath] = [];
    }
    grouped[basePath].push(route);
  });

  for (const key in grouped) {
    if (grouped[key].length > 1) {
      groupedRoutes.push(grouped[key]);
    } else {
      groupedRoutes.push(grouped[key][0]);
    }
  }
  return groupedRoutes;
};

export function getVietnamDateTime(timePlus?: number | null): string {
  const now = new Date();

  // Tính lại thời gian hiện tại với múi giờ Việt Nam
  const vnOffsetInMinutes = 7 * 60; // UTC+7 cho Việt Nam
  now.setUTCMinutes(now.getUTCMinutes() + vnOffsetInMinutes + (timePlus ?? 0));

  // Sử dụng lại logic định dạng của hàm `getVietnamDateTime()`
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export function removeHTMLTags(str: string) {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

export function groupByMonthAndCalculateTotal(month: number | null, data: any) {
  // Khởi tạo mảng 12 tháng với doanhthu = 0
  let fullYearData = !month
    ? Array.from({ length: 12 }, (_, i) => ({
        month: `Tháng ${i + 1}`,
        doanhthu: 0,
      }))
    : [
        {
          month: `Tháng ${month}`,
          doanhthu: 0,
        },
      ];

  // Tính toán doanh thu cho từng tháng dựa trên dữ liệu
  data.forEach((hoaDon: any) => {
    if (month) {
      if (hoaDon.ngaytao) {
        const date = `Tháng ${new Date(hoaDon.ngaytao).getMonth() + 1}`;
        fullYearData = fullYearData.map((item) => {
          if (item.month == date)
            return {
              ...item,
              doanhthu:
                item.doanhthu +
                (hoaDon.doanhthu ? hoaDon.doanhthu : hoaDon.tongtien),
            };
          return item;
        });
      }
    } else {
      if (hoaDon.ngaytao) {
        const date = new Date(hoaDon.ngaytao);
        const monthIndex = date.getMonth(); // Lấy tháng (0-11)
        fullYearData[monthIndex].doanhthu +=
          hoaDon?.doanhthu ?? hoaDon.tongtien;
      }
    }
  });

  return fullYearData;
}

export function calculateRevenueChange(data: any): {
  currentMonth: string;
  change: number | null;
} {
  const now = new Date();
  const currentMonthIndex = now.getMonth(); // Lấy tháng hiện tại (0-11)
  const previousMonthIndex = (currentMonthIndex - 1 + 12) % 12; // Tìm tháng trước (0-11)

  const currentMonthRevenue = data[currentMonthIndex]?.doanhthu ?? 0;
  const previousMonthRevenue = data[previousMonthIndex]?.doanhthu ?? 0;

  // Tính tỷ lệ thay đổi (so sánh doanh thu hiện tại với tháng trước)
  let change: number | null = null;
  if (previousMonthRevenue > 0) {
    change =
      ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
      100;
  } else if (currentMonthRevenue > 0) {
    change = 100; // Tăng 100% nếu tháng trước không có doanh thu
  }

  return {
    currentMonth: `Tháng ${currentMonthIndex + 1}`,
    change,
  };
}

export function checkExistingRoute(routes: string[], pathname: string) {
  let isExisting = false;
  routes.forEach((route) => {
    if (route === pathname) isExisting = true;
    else if (
      route !== "/" &&
      route + pathname.substring(route.length) === pathname
    )
      isExisting = true;
  });

  return isExisting;
}
