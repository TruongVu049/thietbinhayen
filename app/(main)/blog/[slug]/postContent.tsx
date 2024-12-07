import "react-quill/dist/quill.bubble.css";
import "./style.css";
import { FormatDate, removeHTMLTags } from "@/helpers/utils";
import { Suspense } from "react";
import { BaiViet } from "@/lib/db/types";
import Social from "@/components/post/social";
const PostContent = async ({ post }: { post: BaiViet }) => {
  return (
    <>
      <h1 className="md:text-4xl text-2xl font-bold my-5 md:ml-3 ml-0 text-justify">
        {post.tieude}
      </h1>
      <div className="overflow-hidden md:mx-3 mx-0">
        <div className="w-full  flex justify-between items-center">
          <span>{post.ngaytao && FormatDate({ isoDate: post.ngaytao })}</span>
        </div>
      </div>
      <div className="mt-4 mb-2 md:px-3 px-0">
        <Suspense fallback={null}>
          <Social slug={post.slug} content={removeHTMLTags(post.noidung)} />
        </Suspense>
      </div>
      <Suspense fallback={null}>
        <div
          className="content view ql-editor "
          style={{ paddingLeft: 0, paddingRight: 0 }}
          dangerouslySetInnerHTML={{ __html: post?.noidung }}
        />
      </Suspense>
    </>
  );
};

export default PostContent;
