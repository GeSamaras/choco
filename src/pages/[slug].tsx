import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticProps, InferGetServerSidePropsType, InferGetStaticPropsType } from "next";
import { Infer } from "next/dist/compiled/superstruct";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postview";
import { generateSSGHelpers } from "~/server/helpers/ssgHelper";


const ProfileFeed = (props: { userId: string}) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    userId: props.userId,
  });
  if ( isLoading ) return <LoadingPage />;

  if (!data || data.length === 0) return <div>No posts</div>;

  return ( 
  <div className="flex flex-col">
    {data.map((fullPost) => (
      <PostView {...fullPost} key={fullPost.post.id} />
    ))}
  </div>
  );
};

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });
  if (isLoading) {return <div>Loading...</div>;}
  if (!data) {return <div>Not found</div>;}

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 border-b border-slate-300 bg-gradient-to-r from-yellow-500 to-amber-600">
          <Image
            src={data.profilePictureUrl} 
            alt="Profile image" 
            width={128}
            height={128}
            className="rounded-full absolute bottom-0 left-0 -mb-[64px] ml-4 border-4 border-red-700"
          />
          <div className="h-[64px]"></div>
          <div className="p-4 text-2xl font-bold">{`@${data.username ?? ""}`}</div>
        </div>
        <div className="w-full border-b border-amber-400"></div>
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};


export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelpers();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};




export default ProfilePage;