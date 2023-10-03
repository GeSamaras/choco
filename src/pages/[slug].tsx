import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const ProfilePage: NextPage = () => {

  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username: "test",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Not found</div>;
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="flex justify-center h-screen">
        <div>{data.username}</div>
      </main>
    </>
  );
};

export default ProfilePage;