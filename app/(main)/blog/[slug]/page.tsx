import { getBlog } from "@/lib/db";
import { notFound } from "next/navigation";
import PostContent from "./postContent";
import { Suspense } from "react";
import PostWidget from "@/components/post/postWidget";

export default async function PostDetail({
  params,
}: {
  params: { slug?: string };
}) {
  const post = !params.slug ? null : await getBlog({ slug: params.slug });

  if (!post) return notFound();

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "Post",
    name: post.tieude,
    description: post.noidung,
    image: post.hinhanh,
  };

  return (
    <main className="max-w-screen-xl block mx-auto px-3 mt-4 ">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(postJsonLd),
        }}
      />
      <div className="flex md:flex-row flex-col gap-5 relative">
        <div className="md:flex-[1_1_70%] w-full  rounded-md">
          <Suspense fallback={null}>
            <PostContent post={post} />
          </Suspense>
        </div>
        <div className="w-1 hidden md:block border-r border-neutral-200"></div>
        <div className="relative   top-2 left-0 right-0 flex-2 md:w-64 lg:w-72 h-fit flex flex-col gap-10">
          <div className="bg-[#f7f7f7] text-[#1d1e20] p-3">
            <h2 className="mb-3 pb-3 text-sm font-semibold border-b border-[#d4d4d4] text-gray-700">
              Các bài viết nổi bật
            </h2>
            <div>
              <Suspense
                fallback={new Array(3).fill(null).map((item, index) => (
                  <div key={index} className="flex items-center gap-1 pb-2">
                    <div className="rounded-full w-10 h-10 nimate-pulse bg-gray-200"></div>
                    <div className="w-full">
                      <div className="rounded w-full h-8 nimate-pulse bg-gray-200"></div>
                      <div className="rounded mt-1 w-14 h-4 nimate-pulse bg-gray-200"></div>
                    </div>
                  </div>
                ))}
              >
                <PostWidget id={post.id} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
