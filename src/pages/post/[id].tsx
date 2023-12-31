import type { NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import type { GetStaticProps } from "next";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postview";
import { generateSSGHelpers } from "~/server/helpers/ssgHelper";

/*
TODO: literally doesn't work. I don't know why. I'm not sure if it's because of the way I am. TRPC stop being so cringe
*/


const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  });
  if (!data) return <div>Not found</div>;

  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};


export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelpers();
  const id = context.params?.id;
  if (typeof id !== "string") throw new Error("no id");

  await ssg.posts.getById.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};


export default SinglePostPage;