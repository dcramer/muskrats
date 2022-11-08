import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Feed from "../../../components/feed";
import { getLikesForUser } from "../../../lib/likes";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import prisma from "../../../lib/prisma";
import SuperJSON from "superjson";

export default async function Explore() {
  const session = await unstable_getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

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
        <p className="mt-8 text-center text-sm text-gray-600">
          {`It looks like you're not popular enough yet, Elon.`}
        </p>
      )}
    </>
  );
}
