import { Suspense } from "react";
import { getPopularBlogs } from "@/lib/db";
import { PostCardSkeleton } from "@/components/post/postCard";
import PostList from "@/components/post/postList";

export default async function PopularPost() {
  const posts = await getPopularBlogs({ id: 0 });
  return (
    <>
      <div className="flex-1 grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4 lg:gap-y-8 lg:gap-4">
        <Suspense
          fallback={new Array(3).fill(null).map((item, index) => (
            <PostCardSkeleton key={`skeloton-${index}`} />
          ))}
        >
          <PostList posts={posts} />
        </Suspense>
      </div>
    </>
  );
}
