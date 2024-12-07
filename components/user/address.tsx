"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { DiaChi } from "@/lib/db/types";
import { User } from "next-auth";
import React, { useEffect, useRef, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormData } from "@/schemas";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CreateAddress, deleteAddress, updateAddress } from "@/lib/db";
import Spinner from "../Spinner";

export default function Address({
  user,
  selectedAddress,
  onUpdateSelectedAddress,
}: {
  user: User | null;
  selectedAddress: DiaChi | null;
  onUpdateSelectedAddress: (address: DiaChi) => void;
}) {
  const [dataAddress, setDataAddress] = useState<DiaChi[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openUpdateModalAddress, setOpenUpdateModalAddress] = useState(false);
  const [openModalAddress, setOpenModalAddress] = useState(false);
  const addressRef = useRef<DiaChi | null>(null);

  function handleAddAddress(newAddress: DiaChi) {
    const newArr = [...dataAddress, newAddress].sort((a, b) => {
      return Number(b.isMacDinh) - Number(a.isMacDinh);
    });
    setDataAddress(newArr);
  }

  function handleUpdateAddress(newAddress: DiaChi) {
    const newArr = dataAddress
      .map((item) => {
        if (item.id === newAddress.id) {
          return newAddress;
        } else {
          if (newAddress.isMacDinh === true) {
            return {
              ...item,
              isMacDinh: false,
            };
          }
          return item;
        }
      })
      .sort((a, b) => {
        return Number(b.isMacDinh) - Number(a.isMacDinh);
      });
    setDataAddress(newArr);
  }

  function handleUpdateSelectedAddress(address: DiaChi) {
    if (!dataAddress.length) {
      onUpdateSelectedAddress(address);
    }
  }

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      console.log("fetch");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/DiaChis/${user?.id}`
      );
      console.log(res);

      const data = await res.json();
      if (data) {
        setDataAddress(data);
        onUpdateSelectedAddress(data[0]);
      }
      setIsLoading(false);
    }
    fetchPosts();
  }, []);

  const actionDeleteAdress = deleteAddress.bind(null);

  function handleDeleteAddress(address: DiaChi) {
    setIsLoading(true);
    actionDeleteAdress(address)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setDataAddress(dataAddress.filter((item) => item.id !== address.id));
        }
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Đã có lỗi xảy ra. Vui lòng thực hiện lại.";
        console.log(errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-rose-500 md:text-xl text-lg capitalize flex items-center gap-3">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth={0}
              viewBox="0 0 384 512"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path>
            </svg>
            Địa Chỉ Nhận Hàng
          </h2>
          {dataAddress?.length ? (
            <button
              onClick={() => setOpenModalAddress(true)}
              type="button"
              className="btn-change cursor-pointer bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-400 focus:bg-blue-400"
            >
              Thay đổi
            </button>
          ) : (
            <button
              onClick={() => {
                addressRef.current = null;
                setOpenUpdateModalAddress(true);
              }}
              type="button"
              className="btn-change cursor-pointer bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-400 focus:bg-blue-400"
            >
              Thêm địa chỉ
            </button>
          )}
        </div>
        <div className="mt-2 text-gray-800">
          {selectedAddress ? (
            <>
              <div className="flex items-center md:text-lg text-base gap-3 ">
                <strong>{selectedAddress.tennguoinhan} </strong> |
                <span className="addressPhone"> {selectedAddress.sdt}</span>
              </div>
              <p className="flex flex-col md:text-lg text-base">
                {dataAddress.length &&
                  dataAddress.length &&
                  selectedAddress.diachicuthe}
                {
                  <span>{`${selectedAddress.phuongxa}, ${selectedAddress.quanhuyen}, ${selectedAddress.tinhthanh}`}</span>
                }
              </p>
            </>
          ) : null}
        </div>
      </div>

      <Dialog open={openModalAddress} onOpenChange={setOpenModalAddress}>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-2xl bg-white">
          <DialogHeader className="">
            <DialogTitle className="flex items-center justify-between mt-4">
              Địa chỉ
              <button
                onClick={() => {
                  addressRef.current = null;
                  setOpenUpdateModalAddress(true);
                }}
                type="button"
                className="btn-change cursor-pointer bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-400 focus:bg-blue-400"
              >
                Thêm địa chỉ
              </button>
            </DialogTitle>
          </DialogHeader>
          <div>
            <form
              onSubmit={(e: React.SyntheticEvent) => {
                e.preventDefault();
                const target = e.target as typeof e.target & {
                  addressSelected: { value: string };
                };
                const newSlAddress = dataAddress.find(
                  (item) => item.id === Number(target.addressSelected.value)
                ) as any;
                onUpdateSelectedAddress(newSlAddress);
                setOpenModalAddress(false);
              }}
              className={`${
                isLoading ? "pointer-events-none opacity-50" : ""
              } flex flex-col gap-4 text-gray-700 pt-4 `}
            >
              <div className=" h-[45vh] overflow-y-auto border-t divide-y">
                {dataAddress.length
                  ? dataAddress.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <input
                          defaultChecked={
                            item.id === selectedAddress?.id ? true : false
                          }
                          type="radio"
                          defaultValue={item.id}
                          name="addressSelected"
                          className="inline-block w-1/12 accent-rose-500 h-6"
                        />
                        <div className="w-3/4">
                          <div className="flex items-center md:text-lg text-base gap-3 ">
                            <strong className="text-gray-900">
                              {item.tennguoinhan}{" "}
                            </strong>{" "}
                            |<span className="addressPhone"> {item.sdt}</span>
                          </div>
                          <p className="flex flex-col md:text-lg text-base">
                            {dataAddress.length &&
                              dataAddress.length &&
                              item.diachicuthe}
                            {
                              <span>{`${item.phuongxa}, ${item.quanhuyen}, ${item.tinhthanh}`}</span>
                            }
                          </p>
                        </div>
                        <div className="w-1/6">
                          <button
                            onClick={() => {
                              addressRef.current = item;
                              setOpenUpdateModalAddress(true);
                            }}
                            type="button"
                            className=" cursor-pointer  text-gray-800 rounded-md py-2 px-4 hover:underline hover:text-blue-400 focus:text-blue-400"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(item)}
                            className=" cursor-pointer  text-gray-800 rounded-md py-2 px-4 hover:underline hover:text-rose-400 focus:text-rose-400"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))
                  : null}
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button className={"w-1/2 mt-3"} type="submit">
                  Chọn
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openUpdateModalAddress}
        onOpenChange={setOpenUpdateModalAddress}
      >
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className="sm:max-w-xl bg-white">
          <DialogHeader>
            <DialogTitle>Địa chỉ</DialogTitle>
          </DialogHeader>
          <AddressForm
            userId={Number(user?.id)}
            onAddAddress={handleAddAddress}
            onCloseUpdateModalAddress={() => setOpenUpdateModalAddress(false)}
            editAddress={addressRef.current}
            onUpdateAddress={handleUpdateAddress}
            onUpdateSelectedAddress={handleUpdateSelectedAddress}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

type Province = {
  idProvince: number;
  name: string;
};
type District = {
  idDistrict: number;
  name: string;
};
type Commune = {
  idCommune: number;
  name: string;
};

function AddressForm({
  userId,
  onCloseUpdateModalAddress,
  onAddAddress,
  editAddress,
  onUpdateAddress,
  onUpdateSelectedAddress,
}: {
  userId: number | undefined;
  onCloseUpdateModalAddress: () => void;
  onAddAddress: (address: DiaChi) => void;
  editAddress: DiaChi | null;
  onUpdateAddress: (address: DiaChi) => void;
  onUpdateSelectedAddress: (address: DiaChi) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      tinhthanh: editAddress ? String(editAddress.idtinhthanh) : "",
      quanhuyen: editAddress ? String(editAddress.idquanhuyen) : "",
      phuongxa: editAddress ? String(editAddress.idphuongxa) : "",
    },
  });
  const [isPending, startTransition] = useTransition();

  const [province, setProvince] = useState<Province[] | []>([]);
  const [district, setDistrict] = useState<District[] | []>([]);
  const [commune, setCommune] = useState<Commune[] | []>([]);

  const [addressSelected, setAddressSelected] = useState<{
    province: {
      id: number | null;
      name: string | null;
    };
    district: {
      id: number | null;
      name: string | null;
    };
    commune: {
      id: number | null;
      name: string | null;
    };
  }>({
    province: {
      id: editAddress?.idtinhthanh ?? null,
      name: editAddress?.tinhthanh ?? null,
    },
    district: {
      id: editAddress?.idquanhuyen ?? null,
      name: editAddress?.quanhuyen ?? null,
    },
    commune: {
      id: editAddress?.idphuongxa ?? null,
      name: editAddress?.phuongxa ?? null,
    },
  });

  // load data address
  useEffect(() => {
    async function getProvince() {
      const res = await fetch(
        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Token: process.env.NEXT_PUBLIC_GHN_TOKEN || "",
          },
        }
      );
      return res.json();
    }
    startTransition(() => {
      getProvince().then((res) => {
        console.log(res);
        if (res?.code === 200) {
          const combineData = res.data.map((item: any) => {
            return {
              idProvince: String(item.ProvinceID),
              name: item.ProvinceName,
            };
          });
          setProvince(combineData);
          if (editAddress) {
            Promise.all([
              getDistrict(editAddress.idtinhthanh),
              getCommune(editAddress.idquanhuyen),
            ]).then((results) => {
              if (results) {
                const convertDistrict = results[0]?.data?.map((item: any) => {
                  return {
                    idDistrict: item.DistrictID,
                    name: item.DistrictName,
                  };
                });
                const convertCommune = results[1]?.data?.map((item: any) => {
                  return {
                    idCommune: Number(item.WardCode),
                    name: item.WardName,
                  };
                });
                console.log(convertCommune);
                setDistrict(convertDistrict);
                setCommune(convertCommune);
                console.log("finally", addressSelected);
              }
            });
          }
        }
      });
    });
  }, []);

  const actionCreateAddress = CreateAddress.bind(null, userId ?? 0);
  const actionUpdateAddress = updateAddress.bind(null, userId ?? 0);

  const onSubmit: SubmitHandler<AddressFormData> = async (data) => {
    const convertData: DiaChi = {
      id: editAddress?.id ?? 0,
      idtinhthanh: addressSelected.province.id ?? 0,
      tinhthanh: addressSelected.province.name ?? "",
      idquanhuyen: addressSelected.district.id ?? 0,
      quanhuyen: addressSelected.district.name ?? "",
      idphuongxa: addressSelected.commune.id ?? 0,
      phuongxa: addressSelected.commune.name ?? "",
      diachicuthe: data.diachicuthe,
      tennguoinhan: data.tennguoinhan,
      sdt: data.sdt,
      isMacDinh: data.isMacDinh,
    };

    if (editAddress) {
      startTransition(() => {
        actionUpdateAddress(convertData)
          .then((res) => {
            onUpdateAddress(res.body as DiaChi);

            onCloseUpdateModalAddress();
          })
          .catch((err: any) => {
            console.log(err);
          })
          .finally(() => {});
      });
    } else {
      startTransition(() => {
        actionCreateAddress(convertData)
          .then((res) => {
            onAddAddress(res.body as DiaChi);
            onUpdateSelectedAddress(res.body as DiaChi);
            onCloseUpdateModalAddress();
          })
          .catch((err: any) => {
            console.log(err);
          })
          .finally(() => {});
      });
    }
  };

  async function getDistrict(id: number) {
    const res = await fetch(
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: process.env.NEXT_PUBLIC_GHN_TOKEN || "",
        },
        body: JSON.stringify({
          province_id: id,
        }),
      }
    );
    return res.json();
  }
  async function getCommune(id: number) {
    const res = await fetch(
      "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: process.env.NEXT_PUBLIC_GHN_TOKEN || "",
        },
        body: JSON.stringify({
          district_id: id,
        }),
      }
    );
    return res.json();
  }

  return (
    <>
      <Spinner isPending={isPending} />
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="tennguoinhan">Tên người nhận</Label>
            <Input
              type="text"
              {...register("tennguoinhan")}
              defaultValue={editAddress?.tennguoinhan ?? ""}
            />
            {errors.tennguoinhan && (
              <p className="md:text-base text-sm text-rose-500">
                {errors.tennguoinhan.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="sdt">Số điện thoại</Label>
            <Input
              type="text"
              {...register("sdt")}
              defaultValue={editAddress?.sdt ?? ""}
            />
            {errors.sdt && (
              <p className="md:text-base text-sm text-rose-500">
                {errors.sdt.message}
              </p>
            )}
          </div>
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="tinhthanh"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Tỉnh thành
          </label>
          <select
            {...register("tinhthanh")}
            value={addressSelected.province.id ?? ""}
            onChange={(e: React.FormEvent<HTMLSelectElement>) => {
              setAddressSelected({
                province: {
                  id: Number(e.currentTarget.value),
                  name: e.currentTarget.selectedOptions[0].text,
                },
                district: {
                  id: null,
                  name: null,
                },
                commune: {
                  id: null,
                  name: null,
                },
              });
              getDistrict(Number(e.currentTarget.value)).then((res) => {
                if (res?.code === 200) {
                  const convertData = res.data.map((item: any) => {
                    return {
                      idDistrict: item.DistrictID,
                      name: item.DistrictName,
                    };
                  });
                  setDistrict(convertData);
                }
              });
            }}
            id="tinhthanh"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value={""}>Chọn tỉnh thành</option>
            {province.length
              ? province.map((item) => {
                  if (
                    addressSelected &&
                    addressSelected.province.id === item.idProvince
                  ) {
                    return (
                      <option
                        key={item.idProvince}
                        selected={true}
                        value={item.idProvince}
                      >
                        {item.name}
                      </option>
                    );
                  }
                  return (
                    <option key={item.idProvince} value={item.idProvince}>
                      {item.name}
                    </option>
                  );
                })
              : null}
          </select>
          {errors.tinhthanh && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.tinhthanh.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="quanhuyen"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            QUận huyện
          </label>
          <select
            {...register("quanhuyen")}
            value={addressSelected.district.id ?? ""}
            onChange={(e: React.FormEvent<HTMLSelectElement>) => {
              setAddressSelected({
                ...addressSelected,
                district: {
                  id: Number(e.currentTarget.value),
                  name: e.currentTarget.selectedOptions[0].text,
                },
                commune: {
                  id: null,
                  name: null,
                },
              });
              getCommune(Number(e.currentTarget.value)).then((res) => {
                if (res?.code === 200) {
                  const convertData = res?.data?.map((item: any) => {
                    return {
                      idCommune: Number(item.WardCode),
                      name: item.WardName,
                    };
                  });
                  setCommune(convertData);
                }
              });
            }}
            id="quanhuyen"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value={""}>Chọn quận huyện</option>
            {addressSelected.province.id && district.length
              ? district.map((item) => {
                  return (
                    <option key={item.idDistrict} value={item.idDistrict}>
                      {item.name}
                    </option>
                  );
                })
              : null}
          </select>
          {errors.quanhuyen && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.quanhuyen.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="phuongxa"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phường xã
          </label>
          <select
            {...register("phuongxa")}
            value={addressSelected.commune.id ?? ""}
            onChange={(e: React.FormEvent<HTMLSelectElement>) => {
              setAddressSelected({
                ...addressSelected,
                commune: {
                  id: Number(e.currentTarget.value),
                  name: e.currentTarget.selectedOptions[0].text,
                },
              });
            }}
            id="quanhuyen"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value={""}>Chọn phường xã</option>
            {addressSelected.district.id && commune?.length
              ? commune.map((item) => {
                  return (
                    <option key={item.idCommune} value={item.idCommune}>
                      {item.name}
                    </option>
                  );
                })
              : null}
          </select>
          {errors.phuongxa && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.phuongxa.message}
            </p>
          )}
        </div>
        <div className="grid gap-2">
          <label
            htmlFor="diachicuthe"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Địa chỉ cụ thể
          </label>
          <textarea
            defaultValue={editAddress?.diachicuthe ?? ""}
            {...register("diachicuthe")}
            id="diachicuthe"
            rows={2}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
          ></textarea>
          {errors.diachicuthe && (
            <p className="md:text-base text-sm text-rose-500">
              {errors.diachicuthe.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="isMacDinh"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Địa chỉ mặc định
          </label>
          <span>
            <label className="inline items-center cursor-pointer">
              <input
                {...register("isMacDinh")}
                type="checkbox"
                defaultChecked={
                  editAddress && editAddress.isMacDinh ? true : false
                }
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant={"outline"}
            className="w-1/2"
            onClick={onCloseUpdateModalAddress}
          >
            Trở lại
          </Button>
          <Button className={"w-1/2"} type="submit">
            {editAddress ? "Cập nhật" : "Thêm"}
          </Button>
        </div>
      </form>
    </>
  );
}
