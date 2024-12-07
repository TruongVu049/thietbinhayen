import Link from "next/link";
import { FormatDate } from "@/helpers/utils";
import { getPopularBlogs } from "@/lib/db";
import ImageKit from "../imagekit";

export default async function PostWidget({ id }: { id: number }) {
  const popularBlog = await getPopularBlogs({ id: id });
  return (
    <ul className="flex flex-col gap-2">
      {popularBlog?.map((post) => (
        <Link
          href={`/blog/${post.slug}`}
          key={post.slug}
          className="flex items-center gap-1 border-b border-[#d4d4d4]"
        >
          <div className="relative h-16 w-16 rounded-lg mr-1 ">
            <ImageKit
              path={post.hinhanh}
              className="object-contain "
              alt="image"
              loading="lazy"
            />
          </div>
          <li className="hover:text-indigo-500 w-2/3">
            <p className="text-sm text-justify line-clamp-2">{post.tieude}</p>
            <p className="text-xs">
              {post.ngaytao && FormatDate({ isoDate: post.ngaytao })}
            </p>
          </li>
        </Link>
      ))}
    </ul>
  );
}
