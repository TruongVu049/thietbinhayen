"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

export default function CustomPagination({
  totalPages = 4,
}: {
  totalPages?: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("p")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("p", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={currentPage <= 1 ? "pointer-events-none opacity-75" : ""}
            href={currentPage <= 1 ? "#" : createPageURL(currentPage - 1)}
          />
        </PaginationItem>

        {new Array(totalPages).fill(1).map((item: number, index: number) => {
          return (
            <PaginationItem key={item + index}>
              <PaginationLink
                className={
                  index + 1 === currentPage
                    ? "hover:bg-rose-500 text-white bg-rose-500 hover:text-white pointer-events-none"
                    : ""
                }
                href={
                  index + 1 === currentPage ? "#" : createPageURL(index + 1)
                }
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}
        <PaginationItem>
          <PaginationNext
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-75" : ""
            }
            href={
              currentPage >= totalPages ? "#" : createPageURL(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
