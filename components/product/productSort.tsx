"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { SortFilterItem, sorting } from "@/lib/constants";
import { createUrl } from "@/helpers/utils";
import { useRouter } from "next/navigation";

export default function ProductSort({
  sort = sorting,
}: {
  sort?: SortFilterItem[];
}) {
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const category = searchParams.get("categories");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    const newUrl = createUrl(
      pathname,
      new URLSearchParams({
        ...(q && { q }),
        ...(category && { category }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(selectedValue && { sort: selectedValue }),
      })
    );
    router.push(newUrl);
  };
  return (
    <div className="flex gap-2 items-center">
      <span className="block w-1/4 md:text-base text-sm whitespace-nowrap">
        Sắp xếp:
      </span>
      <div className="block ck w-3/4">
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
