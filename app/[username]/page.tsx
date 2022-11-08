import { unstable_getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import Feed from "../../components/feed";
import { getLikesForUser } from "../../lib/likes";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import prisma from "../../lib/prisma";

export default async function Profile({
  params,
}: {
  params: { username: string; userId: string };
}) {
  const session = await unstable_getServerSession(authOptions);
  if (!session) {
    redirect("/login");
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
