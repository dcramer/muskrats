import { redirect } from "next/navigation";
import SuperJSON from "superjson";

import prisma from "../../../lib/prisma";
import Feed from "../../../components/feed";
import { getServerSession } from "../../../lib/auth";
import { getLikesForUser } from "../../../lib/likes";

export default async function Explore() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

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
