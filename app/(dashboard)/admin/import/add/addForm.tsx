"use client";
import { NCC, NCCSP, SanPham } from "@/lib/db/types";

import { Loader2, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPurchaseOrder,
  CreateSupplier,
  createSupplierProducts,
  GetSanPhamsInNCCSP,
  GetSanPhamsNotInNCCSP,
} from "@/lib/db";
import { SupplierFormData, supplierSchema } from "@/schemas";
import ImageKit from "@/components/imagekit";
import { FormatVND } from "@/helpers/utils";
import { SubmitButton } from "@/components/submitButton";
import Counter from "@/components/Counter";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { User } from "next-auth";

type PurchaseOrderDetail = NCCSP & {
  soluong: number;
};

export default function AddForm({ nccs, user }: { nccs: NCC[]; user: User }) {
  const [suppliers, setSuppliers] = useState<NCC[] | []>(nccs ?? []);
  const [openModalSupplier, setOpenModalSupplier] = useState(false);
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [isUpdatePrice, setisUpdatePrice] = useState(false);
  const [supplierSelected, setSupplierSelected] = useState<NCC | null>(null);

  const [productsSelected, setProductsSelected] = useState<
    PurchaseOrderDetail[] | []
  >([]);

  const [productInSupplier, setProductInSupplier] = useState<NCCSP[] | []>([]);
  const [productNotInSupplier, setProductNotInSupplier] = useState<
    SanPham[] | []
  >([]);

  const actionCreate = createSupplierProducts.bind(null);

  async function handleAddSupplier(ncc: NCC) {
    setSuppliers([ncc, ...suppliers]);
  }

  async function handleChangeSelected(e: React.FormEvent<HTMLSelectElement>) {
    if (Number(e.currentTarget.value) !== supplierSelected?.id) {
      const newItem = suppliers.find(
        (item) => item.id === Number(e.currentTarget.value)
      );
      if (newItem) {
        setSupplierSelected(newItem);
        if (newItem.id) {
          const res = await GetSanPhamsInNCCSP(newItem?.id);
          res && setProductInSupplier(res);
          setProductsSelected([]);
        }
      }
    }
  }

  async function handleOpenModalEdit() {
    if (supplierSelected?.id) {
      const res = await GetSanPhamsNotInNCCSP(supplierSelected.id);
      res && setProductNotInSupplier(res);
      setOpenModalEdit(true);
    }
  }

  function removeProductsSelected(id: number) {
    setProductsSelected(
      productsSelected.filter((item) => item.sanpham_id !== id)
    );
  }

  function updateProductsSelected(id: number, quantity: number) {
    setProductsSelected(
      productsSelected.map((item) => {
        if (item.sanpham_id === id) {
          return {
            ...item,
            soluong: quantity,
          };
        }
        return item;
      })
    );
  }
  function updatePriceProductSelected(id: number, price: number) {
    setProductsSelected(
      productsSelected.map((item) => {
        if (item.sanpham_id === id) {
          return {
            ...item,
            gianhap: price,
          };
        }
        return item;
      })
    );
  }

  const totalPrice = !productsSelected.length
    ? 0
    : productsSelected.reduce(
        (prev, cur) => prev + cur.soluong * (cur.gianhap ?? 0),
        0
      );

  const { toast } = useToast();

  async function handleSubmit() {
    setIsLoading(true);
    let mesError = null;
    if (!supplierSelected?.id) {
      mesError = "Vui lòng chọn nhà cung cấp sản phẩm trước khi tạo phiếu";
    } else {
      if (!productsSelected.length) {
        mesError = "Vui lòng thêm sản phẩm cần nhập trước khi tạo phiếu";
      } else {
        if (
          productsSelected.some(
            (item) => (item.gianhap ?? 0) <= 0 || item.soluong < 1
          )
        )
          mesError =
            "Vui lòng kiểm tra lại giá nhập và số lượng sản phẩm nhập trước khi tạo phiếu";
      }
    }
    if (mesError) {
      toast({
        title: `Thông báo`,
        description: mesError,
        action: (
          <ToastAction className="border-none" altText="Try again">
            <div className="flex gap-2 items-center">
              <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                Thử lại
              </button>
            </div>
          </ToastAction>
        ),
        className: "bg-white border-rose-500",
      });
      setIsLoading(false);
    } else {
      const data = {
        phieuNhap: {
          id: 0,
          tongsoluong: productsSelected.reduce(
            (prev, cur) => prev + cur.soluong,
            0
          ),
          tongtien: totalPrice,
          nhanvien_id: Number(user.id),
          ncc_id: supplierSelected?.id,
        },
        chiTietPhieuNhaps: productsSelected.map((item) => {
          return {
            sanpham_id: item.sanpham_id,
            phieunhap_id: 0,
            soluong: item.soluong,
            dongia: item.gianhap,
          };
        }),
        isCapNhatGiaNhap: isUpdatePrice,
      };
      const res = await createPurchaseOrder(data);
      setIsLoading(false);
      if (res.status === 200) {
        toast({
          title: `Thông báo`,
          description: "Tạo phiếu nhập hàng thành công",
          action: (
            <ToastAction className="border-none" altText="Try again">
              <div className="flex gap-2 items-center">
                <Link
                  href={"/admin/import"}
                  className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive"
                >
                  Xem
                </Link>
              </div>
            </ToastAction>
          ),
          className: "bg-white border-green-500",
        });
      } else {
        toast({
          title: `Thông báo`,
          description: "Đã có lỗi xảy ra. Vui lòng thực hiện lại!",
          action: (
            <ToastAction className="border-none" altText="Try again">
              <div className="flex gap-2 items-center">
                <button className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive">
                  Thử lại
                </button>
              </div>
            </ToastAction>
          ),
          className: "bg-white border-rose-500",
        });
      }
    }
  }

  return (
    <>
      <div className="">
        <div className="mr-6 flex items-center justify-between">
          <h1 className="xl:text-2xl text-xl font-semibold leading-6">
            Tạo phiếu nhập hàng
          </h1>
          <Button
            disabled={isLoading}
            onClick={handleSubmit}
            className="bg-indigo-500 text-white hover:text-white hover:bg-indigo-400"
          >
            <Loader2
              className={`mr-2 h-4 w-4 animate-spin ${!isLoading && "hidden"}`}
            />
            Tạo & nhập hàng
          </Button>
        </div>
      </div>
      <div className="grid md:grid-cols-6 grid-cols-1 gap-3">
        <div className="grid gap-3 md:col-span-4 p-3 bg-white rounded-md text-gray-700">
          <div className="flex items-center justify-between">
            <h4 className=" pb-3 text-gray-900 md:text-lg text-base">
              Thông tin nhà cung cấp
            </h4>
            <Button
              variant={"outline"}
              onClick={() => setOpenModalSupplier(true)}
              className="bg-gray-800 text-white hover:bg-gray-700 hover:text-white"
            >
              Thêm nhà cung cấp
            </Button>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <label
                htmlFor="countries"
                className="block w-2/12  text-sm font-medium text-gray-900 "
              >
                Nhà cung cấp
              </label>
              <select
                id="countries"
                name="supplierName"
                onChange={handleChangeSelected}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
              >
                <option value={""}>Chọn nhà cung cấp</option>
                {suppliers
                  ? suppliers.map((item) => {
                      if (item.id === supplierSelected?.id) {
                        return (
                          <option key={item.id} selected value={item.id}>
                            {item.ten}
                          </option>
                        );
                      }
                      return (
                        <option key={item.id} value={item.id}>
                          {item.ten}
                        </option>
                      );
                    })
                  : null}
              </select>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 p-3 bg-white rounded-md text-gray-700">
          <h4 className=" pb-3 text-gray-900 md:text-lg text-base">
            Thông tin đơn nhập hàng
          </h4>
          <div className="grid gap-2">
            <div className="flex items-center  gap-3 text-gray-900">
              <label className="block font-bold text-base">Nhân viên:</label>
              <span>{user.name}</span>
            </div>

            <div className="flex items-center  gap-3 text-gray-900">
              <label className="block font-bold text-base">
                Cập nhật giá nhập:
              </label>
              <label className="inline items-center cursor-pointer">
                <input
                  checked={isUpdatePrice}
                  onChange={() => {
                    setisUpdatePrice(!isUpdatePrice);
                  }}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center  gap-3 text-gray-900">
              <label htmlFor="countries" className="block font-bold text-base">
                Tổng tiền nhập hàng:
              </label>
              <strong className="md:text-2xl text-xl text-rose-500 font-bold">
                {FormatVND({ amount: totalPrice })}
              </strong>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 rounded-md bg-white">
        <div className="flex items-center justify-between mb-3">
          <h4 className=" pb-3 text-gray-900 md:text-lg text-base">
            Thông tin sản phẩm
          </h4>
          <Button
            variant={"outline"}
            onClick={() => setOpenModalProduct(true)}
            className={`${
              supplierSelected ? "" : "pointer-events-none opacity-80"
            } bg-gray-800 text-white hover:bg-gray-700 hover:text-white`}
          >
            Thêm sản phẩm nhập
          </Button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="text-left w-full whitespace-nowrap">
            <thead className="bg-gray-200 text-gray-700">
              <tr className="border-b border-gray-300">
                <th className="listjs-sorter px-6 py-3">SST</th>
                <th className="listjs-sorter px-6 py-3">Sản phẩm</th>
                <th className="listjs-sorter px-6 py-3">Đơn giá nhập</th>
                <th className="listjs-sorter px-6 py-3">Số lượng</th>
                <th className="listjs-sorter px-6 py-3">Tổng tiền</th>
                <th
                  className="listjs-sorter px-6 py-3"
                  data-sort="action_info"
                ></th>
              </tr>
            </thead>
            <tbody className="list">
              {productsSelected.map(
                (item: PurchaseOrderDetail, index: number) => (
                  <tr
                    key={item.sanpham_id}
                    className="border-b border-gray-300"
                  >
                    <td className="product_name px-6 py-3">{index + 1}</td>
                    <td className="category_name px-6 py-3">
                      <div className="flex items-center">
                        <div className="relative h-12 w-12 rounded-lg">
                          <ImageKit
                            path={item.hinhanh}
                            alt="image"
                            loading="lazy"
                          />
                        </div>
                        <div className="ml-3">
                          <h5 className="">{item.ten}</h5>
                        </div>
                      </div>
                    </td>
                    <td className="added_data px-6 py-3">
                      <input
                        type="number"
                        value={item.gianhap ?? ""}
                        className="py-2 border "
                        onChange={(e: React.FormEvent<HTMLInputElement>) => {
                          if (Number(e.currentTarget.value) >= 0) {
                            updatePriceProductSelected(
                              item.sanpham_id,
                              Number(e.currentTarget.value)
                            );
                          }
                        }}
                      />
                    </td>
                    <td className="text-rose-500 font-bold px-6 py-3">
                      <Counter
                        value={item.soluong}
                        onDecrease={() => {
                          if (item.soluong > 1) {
                            updateProductsSelected(
                              item.sanpham_id,
                              item.soluong - 1
                            );
                          }
                        }}
                        onIncrease={() => {
                          updateProductsSelected(
                            item.sanpham_id,
                            item.soluong + 1
                          );
                        }}
                      />
                    </td>
                    <td className="quantity_numbers px-6 py-3 text-rose-500 font-bold">
                      {FormatVND({
                        amount: item.soluong * (item.gianhap ?? 0),
                      })}
                    </td>

                    <td className="action_info px-6 py-3 flex items-center gap-1 mt-2">
                      <button
                        type="button"
                        className="group p-1 rounded-md hover:bg-gray-100"
                        onClick={() => removeProductsSelected(item.sanpham_id)}
                      >
                        <Trash className="h-6 w-6text-gray-600  group-hover:text-rose-600" />
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={openModalSupplier} onOpenChange={setOpenModalSupplier}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <SupplierForm
            onCloseModal={() => setOpenModalSupplier(false)}
            onAddSupplier={handleAddSupplier}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={openModalProduct} onOpenChange={setOpenModalProduct}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-2xl bg-white">
          <DialogHeader className="">
            <DialogTitle className="flex items-center justify-between mt-4">
              Sản phẩm
              <button
                type="button"
                onClick={handleOpenModalEdit}
                className="btn-change font-normal cursor-pointer bg-blue-600 text-white rounded-md py-3 px-6 hover:bg-blue-400 "
              >
                Điều chỉnh sản phẩm
              </button>
            </DialogTitle>
          </DialogHeader>
          <div>
            <form
              className={`flex flex-col gap-4 text-gray-700 `}
              action={async (formdata: FormData) => {
                const pdslt = formdata.getAll("productnotinsupplier");
                if (pdslt.length) {
                  const pds = pdslt.map((item) => {
                    const newItem = productInSupplier.find(
                      (x) => x.sanpham_id === Number(item)
                    );
                    return {
                      ...newItem,
                      soluong: 1,
                    };
                  });

                  setProductsSelected([
                    ...productsSelected,
                    ...(pds as PurchaseOrderDetail[]),
                  ]);

                  setOpenModalProduct(false);
                }
              }}
            >
              <div className=" h-[45vh] overflow-y-auto border-t divide-y">
                {productInSupplier.length
                  ? productInSupplier.map((item) => {
                      const existingPd = productsSelected.some(
                        (pd) => pd.sanpham_id === item.sanpham_id
                      );
                      return (
                        <div
                          key={`${item.sanpham_id}`}
                          className={`${
                            existingPd
                              ? "pointer-events-none opacity-75 bg-green-200"
                              : ""
                          }  flex items-center gap-3`}
                        >
                          <input
                            type="checkbox"
                            defaultValue={item.sanpham_id}
                            name="productnotinsupplier"
                            className="inline-block w-1/12 accent-rose-500 h-6"
                          />
                          <div className="w-3/4 flex items-center gap-3">
                            <div className="relative h-16 w-16 rounded-lg">
                              <ImageKit
                                path={item.hinhanh}
                                alt="image"
                                loading="lazy"
                                height={300}
                                width={400}
                                className="md:h-full h-auto w-full object-cover rounded-xl"
                              />
                            </div>
                            <div className="w-full flex justify-between items-center">
                              <div>
                                <h5 className="md:text-lg text-base md:leading-6 line-clamp-1 leading-4  text-black">
                                  {item.ten}
                                </h5>
                                <h6 className="font-bold md:text-lg text-base md:leading-6 leading-4 text-rose-500">
                                  {FormatVND({ amount: item.gia })}
                                </h6>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-800 md:text-lg text-base">
                              Giá nhập:
                              <strong className="text-rose-500">
                                {FormatVND({ amount: item.gianhap ?? 0 })}
                              </strong>
                            </span>
                          </div>
                        </div>
                      );
                    })
                  : null}
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={() => setOpenModalProduct(false)}
                  className={"w-1/2"}
                  type="button"
                  variant={"outline"}
                >
                  Trở lại
                </Button>
                <SubmitButton label={"Chọn"} cName="w-1/2" />
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openModalEdit} onOpenChange={setOpenModalEdit}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-2xl bg-white">
          <DialogHeader className="">
            <DialogTitle className="flex items-center justify-between mt-4">
              Thêm sản phẩm nhà cung cấp
            </DialogTitle>
          </DialogHeader>
          <div>
            <form
              className={`flex flex-col gap-4 text-gray-700 `}
              action={async (formdata: FormData) => {
                const pdslt = formdata.getAll("productnotinsupplier");
                if (pdslt.length) {
                  formdata.append("id", String(supplierSelected?.id));
                  const res = await actionCreate(formdata);
                  if ((await res).status === 200) {
                    console.log(res);
                    setProductInSupplier([...res.body, ...productInSupplier]);
                    setOpenModalEdit(false);
                  }
                }
              }}
            >
              <div className=" h-[45vh] overflow-y-auto border-t divide-y">
                {productNotInSupplier.length
                  ? productNotInSupplier.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          defaultValue={item.id}
                          name="productnotinsupplier"
                          className="inline-block w-1/12 accent-rose-500 h-6"
                        />
                        <div className="w-3/4 flex items-center gap-3">
                          <div className="relative h-16 w-16 rounded-lg">
                            <ImageKit
                              path={item.hinhanh}
                              alt="image"
                              loading="lazy"
                              height={300}
                              width={400}
                              className="md:h-full h-auto w-full object-cover rounded-xl"
                            />
                          </div>
                          <div className="w-full flex justify-between items-center">
                            <div>
                              <h5 className="md:text-lg text-base md:leading-6 line-clamp-1 leading-4  text-black">
                                {item.ten}
                              </h5>
                              <h6 className="font-bold md:text-lg text-base md:leading-6 leading-4 text-rose-500">
                                {FormatVND({ amount: item.gia })}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button
                  onClick={() => setOpenModalEdit(false)}
                  className={"w-1/2"}
                  type="button"
                  variant={"outline"}
                >
                  Trở lại
                </Button>
                <SubmitButton label={"Chọn"} cName="w-1/2" />
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SupplierForm({
  onCloseModal,
  onAddSupplier,
}: {
  onCloseModal: () => void;
  onAddSupplier: (ncc: NCC) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const actionCreate = CreateSupplier.bind(null);

  const onSubmit: SubmitHandler<SupplierFormData> = async (data) => {
    setIsLoading(true);
    actionCreate(data)
      .then((res) => {
        onAddSupplier(res?.body as NCC);
        setIsLoading(false);
        onCloseModal();
      })
      .catch(() => {
        setIsLoading(false);
      })
      .finally(() => {});
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <div>
          <Label htmlFor="ten">Tên nhà cung cấp</Label>
          <Input type="text" {...register("ten")} />
          {errors.ten && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.ten.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <div>
          <Label htmlFor="sdt">Số điện thoại</Label>
          <Input type="text" {...register("sdt")} />
          {errors.sdt && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.sdt.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-2">
        <div>
          <Label htmlFor="diachi">Địa chỉ</Label>
          <Input type="text" {...register("diachi")} />
          {errors.diachi && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.diachi.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={"outline"}
          className="w-1/2"
          onClick={onCloseModal}
        >
          Trở lại
        </Button>
        <Button disabled={isLoading} className={"w-1/2"} type="submit">
          <Loader2
            className={`mr-2 h-4 w-4 animate-spin ${!isLoading && "hidden"}`}
          />
          Thêm
        </Button>
      </div>
    </form>
  );
}
