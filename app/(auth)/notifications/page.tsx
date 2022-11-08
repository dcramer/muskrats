import SuperJSON from "superjson";
import Feed from "../../../components/feed";
import { getServerSession } from "../../../lib/auth";
import { getLikesForUser } from "../../../lib/likes";
import prisma from "../../../lib/prisma";

export default async function Explore() {
  const session = await getServerSession();
  const posts = await prisma.post.findMany({
    where: {
      mentions: {
        some: {
          userId: session?.user.id,
        },
      },
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
      {posts.length ? (
        <Feed posts={SuperJSON.serialize(posts)} likes={likes} />
      ) : (
        <p className="mt-2 text-center text-sm text-gray-600">
          {`It looks like you're not popular enough yet, Elon.`}
        </p>
      )}
    </>
  );
}
