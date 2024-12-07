// pages/index.tsx
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FileOutput, Loader2 } from "lucide-react";
import React, { useState } from "react";
import * as XLSX from "xlsx";

type ExportExcelProps = {
  outputName: string;
  data: any;
  children?: React.ReactNode;
  className?: string;
};

const ExportExcel: React.FC<ExportExcelProps> = ({
  outputName,
  data,
  children,
  className,
}) => {
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);

    // Tạo worksheet từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(data);

    // Tạo workbook và thêm worksheet vào
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, outputName);

    // Xuất file Excel
    XLSX.writeFile(wb, `${outputName}.xlsx`);
    setLoading(false);
  };

  return (
    <button
      title={"Xuất file"}
      type="button"
      disabled={loading}
      onClick={handleExport}
      className={`hover:shadow-form flex items-center justify-center w-full rounded-md ${
        loading ? "bg-indigo-400" : "bg-[#6A64F1]"
      } hover:bg-indigo-400 py-2 px-4 text-center text-base font-semibold text-white outline-none ${className}`}
    >
      <Loader2
        className={`mr-2 h-4 w-4 animate-spin ${loading ? "block" : "hidden"}`}
      />
      <FileOutput className="w-5 h-5 text-white mr-2" />
      {children}
    </button>
  );
};

export default ExportExcel;
