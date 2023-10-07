import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";
import { LoadingPage, LoadingSpinner } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";
import { PageLayout } from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {

  const { user } = useUser();

  const [ input, setInput ] = useState("");

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
      toast.error("Something went wrong");
      }
    },
  });

  console.log(user);

  if (!user) return null;

  return (
    <div className="flex gap-3 w-full">
      <Image 
        src={user.imageUrl}
        alt="Profile image"
        className="h-16 w-16 rounded-full"
        width={56}
        height={56}
      />
      <input placeholder="type some emojis!" 
      className="grow bg-transparent outline-none text-orange-800"
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (input !== ""){
            mutate({ content: input });
          }
        }
      }}
      disabled={isPosting}
      />
      {input !== "" && !isPosting && (
        <button onClick={() => 
        mutate({ content: input })}
        className="bg-orange-800 text-white px-4 py-2 rounded-md"
        >
          Post
      </button>
      )}

      {isPosting && ( 
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
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

const Feed = () => {

  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div className = "flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))};
    </div>
  );

};

const Home: NextPage = () => {

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  // return empty div if user is not loaded
  if (!userLoaded) return <div />;


  return (
    <PageLayout>
      <div className = "border-b border-black p-4 flex">
        {!isSignedIn && (
        <div className = "flex justify-center">
          <SignInButton />
        </div>
        )}
        {isSignedIn && <CreatePostWizard />}
      </div>
      <Feed />
    </PageLayout>
  );
};
export default Home;