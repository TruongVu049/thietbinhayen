import { FormatDate, removeHTMLTags } from "@/helpers/utils";
import Link from "next/link";
import { BaiViet } from "@/lib/db/types";
import ImageKit from "../imagekit";
import { CalendarIcon } from "lucide-react";

export const PostCard = ({ post }: { post: BaiViet }) => {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className={`flex flex-col gap-2 rounded cursor-pointer h-full `}>
        <div>
          <div className="relative w-full sm:h-72 md:h-60 h-32 rounded">
            <ImageKit
              path={post.hinhanh}
              alt={post.slug}
              className="object-contain sm:object-cover object-top"
              loading="lazy"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 justify-between h-full">
          <h2 className="sm:text-xl line-clamp-2 font-bold">{post.tieude}</h2>
          {post.ngaytao && (
            <div className="flex items-center gap-1 mt-1">
              <CalendarIcon className="text-indigo-500 h-5 w-5" />
              <p className="text-[#7c7c7c] text-sm">
                {FormatDate({ isoDate: post.ngaytao })}
              </p>
            </div>
          )}

          <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
            {removeHTMLTags(post.noidung)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const PostCardSkeleton = () => {
  return (
    <div className={`flex flex-col gap-2 rounded cursor-pointer h-full  `}>
      <div className="w-full sm:h-72 md:h-60 rounded nimate-pulse bg-gray-200"></div>
      <div className="flex flex-col gap-2 justify-between ">
        <div>
          <div className="mt-1 h-9 w-full rounded nimate-pulse bg-gray-200"></div>
        </div>
        <div>
          <div className="h-5 w-full rounded nimate-pulse bg-gray-200"></div>
          <div className="mt-2 h-16 w-full rounded nimate-pulse bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};
