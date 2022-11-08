import { unstable_getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Feed from "../../components/feed";
import { getLikesForUser } from "../../lib/likes";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import prisma from "../../lib/prisma";

export default async function Bookmarks() {
  const session = await unstable_getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

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

      <Feed
        posts={posts.map((p) => JSON.parse(JSON.stringify(p)))}
        likes={likes}
      />
    </>
  );
}
