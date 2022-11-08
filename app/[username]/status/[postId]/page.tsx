import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Feed from "../../../../components/feed";
import Sidebar from "../../../../components/sidebar";
import { getLikesForUser } from "../../../../lib/likes";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

export default async function PostDetails({
  params,
}: {
  params: {
    username: string;
    userId: string;
    postId: string;
  };
}) {
  const session = await unstable_getServerSession(authOptions);

  const postId = parseInt(params.postId, 10);
  if (!postId) {
    return <div>404</div>;
  }

  const username = params.username;
  if (username.indexOf("#") === -1) {
    return {
      notFound: true,
    };
  }

  const userId = parseInt(username.split("#")[1], 10);
  if (!userId) {
    return <div>404</div>;
  }

  const posts = await prisma.post.findMany({
    where: {
      id: postId,
      authorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const likes = session
    ? await getLikesForUser({
        postList: posts,
        userId: session!.user!.id,
      })
    : [];

  return (
    <>
      <div className="border-b-[0.2px] sticky top-0 z-50 border-zinc-700 p-3">
        back arrow
        <h1 className="text-2xl font-bold">Post</h1>
      </div>

      <Feed
        posts={posts.map((p) => JSON.parse(JSON.stringify(p)))}
        likes={likes}
      />
    </>
  );
}
