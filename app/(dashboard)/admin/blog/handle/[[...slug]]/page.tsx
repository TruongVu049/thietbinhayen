import BlogForm from "./blogForm";
import { getBlog } from "@/lib/db";
export default async function HandleBlogPage({
  params,
}: {
  params: { slug?: string };
}) {
  const blog = !params.slug ? null : await getBlog({ slug: params.slug });
  return (
    <main className="bg-[rgb(241_245_249)] sm:p-4 p-2 space-y-6">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
        <div className="mr-6">
          <h1 className="xl:text-2xl text-xl font-semibold leading-6">
            {blog ? "Cập nhật" : "Thêm"} Bài Viết
          </h1>
        </div>
      </div>
      <BlogForm blog={blog} />
    </main>
  );
}
