export type roleType = {
  id: number;
  ten: string;
  duongdan: string;
};

export type productType = {
  id: number;
  ten: string;
  mota?: string;
  hinhanh: string;
  gia: number;
};

export interface FileInput {
  id: number;
  url: string | null;
}

export interface Row {
  id: number;
  ten: string;
  thongso: string;
}

export interface FileOutput {
  url: string;
  outputName: string;
}

export interface WarehouseReceipt extends FileOutput {
  data: {
    table: {
      index: number;
      ten: string;
      soluong: number;
      soluongthuc: number;
      sanpham_id: number;
      dongia: number;
      thanhtien: number;
    }[];
    tongthanhtien: number;
    tongsoluong: number;
    tongsoluongthuc: number;
  };
}
