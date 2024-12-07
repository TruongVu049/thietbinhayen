import { auth } from "@/auth";
import AddForm from "./addForm";
import { getNCCS } from "@/lib/db";
export default async function AddProductPage() {
  const session = await auth();
  const nccs = await getNCCS();
  return (
    <main className="bg-[rgb(241_245_249)] sm:p-4 p-2 space-y-6">
      <AddForm nccs={nccs} user={session?.user} />
    </main>
  );
}
