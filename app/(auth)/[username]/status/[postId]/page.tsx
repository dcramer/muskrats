import { unstable_getServerSession } from "next-auth";
import Feed from "../../../../../components/feed";
import { getLikesForUser } from "../../../../../lib/likes";
import prisma from "../../../../../lib/prisma";
import { authOptions } from "../../../../../pages/api/auth/[...nextauth]";
import { notFound } from "next/navigation";
import { getServerSession } from "../../../../../lib/auth";

export default async function PostDetails({
  params,
}: {
  params: {
    username: string;
    userId: string;
    postId: string;
  };
}) {
  const session = await getServerSession();

  const postId = parseInt(params.postId, 10);
  if (!postId) {
    notFound();
  }

  const username = params.username;
  if (username.indexOf("#") === -1) {
    notFound();
  }

  const userId = parseInt(username.split("#")[1], 10);
  if (!userId) {
    notFound();
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

      <Feed posts={posts.map((p) => JSON.parse(JSON.stringify(p)))} likes={likes} />
    </>
  );
}
