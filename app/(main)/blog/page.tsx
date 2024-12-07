import CustomPagination from "@/components/customPagination";
import { Suspense } from "react";
import { getpublicBlogs } from "@/lib/db";
import { PostCardSkeleton } from "@/components/post/postCard";
import PostList from "@/components/post/postList";

export default async function ProductPage({
  searchParams,
}: {
  searchParams?: {
    p?: number;
  };
}) {
  const currentPage: number = searchParams?.p || 1;
  const { dsbv, tongtrang } = await getpublicBlogs({
    page: currentPage,
  });
  return (
    <>
      <div className="flex-1 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 lg:gap-y-8 lg:gap-4 md:px-4 mx-3">
        <Suspense
          fallback={new Array(3).fill(null).map((item, index) => (
            <PostCardSkeleton key={`skeloton-${index}`} />
          ))}
        >
          <PostList posts={dsbv} />
        </Suspense>
      </div>
      <div className="mb-5 mt-3">
        <Suspense fallback={null}>
          {tongtrang ? (
            <div className="flex flex-col md:flex-row justify-end px-6 py-4 gap-2">
              <Suspense>
                <CustomPagination totalPages={Number(tongtrang)} />
              </Suspense>
            </div>
          ) : null}
        </Suspense>
        <div className="clear-both"></div>
      </div>
    </>
  );
}
