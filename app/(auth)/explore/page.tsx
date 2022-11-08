import SuperJSON from "superjson";
import Feed from "../../../components/feed";
import { getServerSession } from "../../../lib/auth";
import { getLikesForUser } from "../../../lib/likes";
import prisma from "../../../lib/prisma";

export default async function Explore() {
  const session = await getServerSession();
  const posts = await prisma.post.findMany({
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
        <h1 className="text-2xl font-bold ">Explore</h1>
      </div>

      <Feed posts={SuperJSON.serialize(posts)} likes={likes} />
    </>
  );
}
