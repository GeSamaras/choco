import Link from "next/link";
import dayjs from "dayjs";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const {post, author} = props;
  return (
    <div key ={post.id} className="border-b border-black p-4 flex gap-3 ">
      <Image 
        src={author.profilePictureUrl}
        alt={`@${author.username} profile image`}
        className="h-16 w-16 rounded-full"
        width={56}
        height={56}
        />
        <div className="flex flex-col">
          <div className="flex text-orange-900 gap-2 font-semibold ">
            <Link href={`/@${author.username}`}>  
              <span>
                {`@${author.username}`}
              </span>
            </Link>
            <Link href={`/posts/${post.id}`}>
              <span className="font-extralight">
                {`  .  ${dayjs(post.createdAt).fromNow()}`}
              </span>
            </Link>
          </div>
          <span className="text-2xl">{post.content}</span>
        </div>
    </div>
  );
};