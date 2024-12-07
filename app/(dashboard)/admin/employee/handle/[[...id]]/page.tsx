import EmployeeForm from "./employeeForm";
import { getEmployee, getPhanQuyen } from "@/lib/db";
export default async function AddProductPage({
  params,
}: {
  params: { id?: string };
}) {
  const pqs = await getPhanQuyen();
  console.log("parems", params.id);
  let nv = null;
  if (params.id) {
    nv = await getEmployee({ id: Number(params?.id) });
  }
  return (
    <main className="bg-[rgb(241_245_249)] sm:p-4 p-2 space-y-6">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <h1 className="xl:text-2xl text-xl font-semibold leading-6">
            {nv ? "Cập nhật" : "Thêm"} nhân viên
          </h1>
        </div>
      </div>
      <EmployeeForm employee={nv} phanquyens={pqs} />
    </main>
  );
}
