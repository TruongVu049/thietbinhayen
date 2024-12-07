import { BaiViet } from "@/lib/db/types";
import { PostCard } from "./postCard";
const PostList = ({ posts }: { posts: BaiViet[] }) => {
  return (
    <>
      {posts.length
        ? posts.map((post) => <PostCard post={post} key={post.id} />)
        : null}
    </>
  );
};

export default PostList;
