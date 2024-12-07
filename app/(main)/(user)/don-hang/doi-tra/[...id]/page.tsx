import ReturnRequestForm from "./ReturnRequestForm";
import { getReturnRequestInfo } from "@/lib/db";

export default async function ReturnRequestPage({
  params,
}: {
  params: { id: string[] };
}) {
  console.log(params.id);
  const getInfo = await getReturnRequestInfo({
    orderId: Number(params.id[0]),
    productId: Number(params.id[1]),
  });

  if (getInfo.status !== 200) {
    return (
      <div className="bg-white p-3 border rounded-md">
        <h2 className="md:text-lg text-base text-gray-700 text-center font-bold">
          Yêu Cầu Đổi - Trả sản phẩm
        </h2>
        <p className="text-base text-rose-500 mt-6">
          {getInfo.body ?? "Đã có lỗi xảy ra!"}
        </p>
      </div>
    );
  }
  console.log(getInfo);

  return (
    <div className="bg-white p-3 border rounded-md">
      <h2 className="md:text-lg text-base text-gray-700 text-center font-bold">
        Yêu Cầu Đổi - Trả sản phẩm
      </h2>
      <ReturnRequestForm
        orderId={Number(params.id[0])}
        productData={getInfo.body.sanpham}
        solutinData={getInfo.body.phuongphap}
        typeData={getInfo.body.loaiyeucau}
      />
    </div>
  );
}
