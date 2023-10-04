import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticProps, InferGetServerSidePropsType, InferGetStaticPropsType } from "next";
import { Infer } from "next/dist/compiled/superstruct";
import { PageLayout } from "~/components/layout";
import Image from "next/image";

const ProfilePage: NextPage = () => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "test",
  });
  if (isLoading) {return <div>Loading...</div>;}
  if (!data) {return <div>Not found</div>;}

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <PageLayout>
        <div className="h-48 border-b border-slate-300 bg-slate-400">
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
        <div className="w-full border-b border-slate-400"></div>
      </PageLayout>
    </>
  );
};


//TODO SSG helpers, dehydrate, StaticProps, and SSH
//https://trpc.io/docs/client/nextjs/ssg 
//https://trpc.io/docs/client/nextjs/server-side-helpers
//https://github.com/t3dotgg/chirp/blob/main/src/pages/%5Bslug%5D.tsx

/*
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: context,
    ctx: {},
    client: api,
  });
const slug = context.param?.slug;
if (typeof slug !== "string") throw new Error("no slug");

await ssg.profile.getUserByUsername.prefetch({ usernmae: slug})
  return{
    props: {
      trpcState: dehydrate(),
      username,
    }
  }

export const getStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
}


*/

export default ProfilePage;