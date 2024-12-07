"use client";
import React, { useState } from "react";
import { Plus, Check, Edit, Trash } from "lucide-react";
import { Row } from "@/lib/types";

export default function TableEditing({
  rows,
  onChangeRows,
}: {
  rows: Row[];
  onChangeRows: (rows: Row[]) => void;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [newRow, setNewRow] = useState<Row>({ id: 0, ten: "", thongso: "" });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = () => {
    if (newRow.ten && newRow.thongso) {
      onChangeRows([...rows, { ...newRow, id: rows.length + 1 }]);
      setNewRow({ id: 0, ten: "", thongso: "" });
    }
  };

  const handleEdit = (index: number) => {
    setNewRow(rows[index]);
    setEditIndex(index);
    setIsEdit(true);
  };

  const handleSave = () => {
    if (editIndex !== null) {
      const updatedRows = [...rows];
      updatedRows[editIndex] = newRow;
      onChangeRows(updatedRows);
      setNewRow({ id: 0, ten: "", thongso: "" });
      setEditIndex(null);
      setIsEdit(false);
    }
  };

  const handleDelete = (index: number) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    onChangeRows(updatedRows);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-2">
        <input
          type="text"
          value={newRow.ten}
          onChange={(e) => setNewRow({ ...newRow, ten: e.target.value })}
          placeholder="Tên"
          className="border p-2 rounded-md"
        />
        <input
          type="text"
          value={newRow.thongso}
          onChange={(e) => setNewRow({ ...newRow, thongso: e.target.value })}
          placeholder="Thông số"
          className="border p-2 rounded-md"
        />
        {isEdit ? (
          <button
            type="button"
            title="Lưu"
            onClick={handleSave}
            className="py-3 px-6 rounded-lg bg-indigo-500"
          >
            <Check className="w-5 h-5 text-white" />
          </button>
        ) : (
          <button
            type="button"
            title="Thêm"
            onClick={handleAdd}
            className="py-3 px-6 rounded-lg bg-indigo-500"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
      {/* <span className="inline-block md:test-base text-sm text-rose-500 mb-2">
        Lỗi
      </span> */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tên
              </th>
              <th scope="col" className="px-6 py-3">
                Thông số
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b "
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  {row.ten}
                </th>
                <td className="px-6 py-4">{row.thongso}</td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="mr-2"
                  >
                    <Edit className="w-5 h-5 text-gray-900" />
                  </button>
                  <button type="button" onClick={() => handleDelete(index)}>
                    <Trash className="w-5 h-5 text-gray-900" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
