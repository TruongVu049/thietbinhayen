"use client";

import { SortFilterItem, sorting } from "@/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Sort({ sort = sorting }: { sort: SortFilterItem[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.currentTarget.value;
    params.set("s", selectedValue);
    router.push(pathname + "?" + params);
  };
  return (
    <div className="flex gap-2 items-center">
      <span className="md:text-base text-sm">Sắp xếp:</span>
      <div className="blo ck w-full">
        <select
          id="sort"
          name="s"
          onChange={handleChange}
          className=" border border-gray-300 text-gray-600 text-base rounded-lg block w-full py-2.5 px-4 focus:outline-none"
        >
          {sort.map((item: SortFilterItem) => (
            <option key={item.slug} value={item.slug ?? ""}>
              {item.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
