"use client";
import { ThumbsUp } from "lucide-react";
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon,
} from "next-share";

const baseUrl = process.env.NEXT_PUBLIC_URL_HOST
  ? `${process.env.NEXT_PUBLIC_URL_HOST}`
  : "localhost:3000";

const Social = ({
  slug,
  content,
}: {
  slug: string;
  content: string | undefined;
}) => {
  return (
    <div className="flex items-center justify-between">
      <button className="bg-blue-500 group rounded-md flex items-center gap-2 px-3 py-1.5 text-white hover:opacity-80">
        <ThumbsUp className="w-5 h-5 group-focus:text-blue-900" />
        Thích
      </button>
      <div className=" flex gap-4">
        <FacebookShareButton url={`${baseUrl}/blog/${slug}`} quote={content}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={`${baseUrl}/blog/${slug}`}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton url={`${baseUrl}/blog/${slug}`}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>
    </div>
  );
};

export default Social;
