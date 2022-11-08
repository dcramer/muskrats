import { PrismaClient } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";
import Feed from "../../components/feed";
import { getLikesForUser } from "../../lib/likes";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function Profile({
  params,
}: {
  params: { username: string; userId: string };
}) {
  const session = await unstable_getServerSession(authOptions);

  const username = params.username;
  if (username.indexOf("#") === -1) {
    return <div>404</div>;
  }

  const userId = parseInt(username.split("#")[1], 10);
  if (!userId) {
    return <div>404</div>;
  }

  const prisma = new PrismaClient();
  const posts = await prisma.post.findMany({
    where: {
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
        <h1 className="text-2xl font-bold ">Elon Musk</h1>
      </div>

      <Feed
        posts={posts.map((p) => JSON.parse(JSON.stringify(p)))}
        likes={likes}
      />
    </>
  );
}
