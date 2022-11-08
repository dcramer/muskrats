import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import Feed from "../../components/feed";
import { getLikesForUser } from "../../lib/likes";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function Explore() {
  const session = await unstable_getServerSession(authOptions);

  const prisma = new PrismaClient();
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
        <Feed
          posts={posts.map((p) => JSON.parse(JSON.stringify(p)))}
          likes={likes}
        />
      ) : (
        <p className="mt-2 text-center text-sm text-gray-600">
          {`It looks like you're not popular enough yet, Elon.`}
        </p>
      )}
    </>
  );
}
