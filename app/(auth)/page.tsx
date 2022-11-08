import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

import prisma from "../../lib/prisma";
import Feed from "../../components/feed";
import PostInput from "../../components/post-input";
import { getLikesForUser } from "../../lib/likes";
import { getServerSession } from "../../lib/auth";

export const dynamic = "force-dynamic";
export default async function Home() {
  const resp = await getServerSession();
  if (!resp) {
    redirect("/login");
  }

  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  const likes = resp
    ? await getLikesForUser({
        postList: posts,
        userId: resp.user.id,
      })
    : [];

  return (
    <>
      <div className="border-b-[0.2px] sticky top-0 z-50 border-zinc-700 p-3">
        <h1 className="text-2xl font-bold ">Home</h1>
      </div>

      <PostInput />

      <Feed posts={posts.map((p) => JSON.parse(JSON.stringify(p)))} likes={likes} />
    </>
  );
}
