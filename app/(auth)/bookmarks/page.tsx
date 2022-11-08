import Feed from "../../../components/feed";
import prisma from "../../../lib/prisma";
import { getServerSession } from "../../../lib/auth";
import { getLikesForUser } from "../../../lib/likes";

export default async function Bookmarks() {
  const session = await getServerSession();
  const posts = await prisma.post.findMany({
    where: {
      likes: {
        some: {
          authorId: session?.user.id,
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
      <div className="border-b-[0.2px] sticky top-0 z-50 border-zinc-700 p-3">
        <h1 className="text-2xl font-bold ">Explore</h1>
      </div>

      <Feed posts={posts.map((p) => JSON.parse(JSON.stringify(p)))} likes={likes} />
    </>
  );
}
