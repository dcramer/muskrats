import { notFound, redirect } from "next/navigation";
import { Post as PostType } from "@prisma/client";

import prisma from "../../../../../lib/prisma";
import PostExpanded from "../../../../../components/post-expanded";
import { getServerSession } from "../../../../../lib/auth";
import { getLikesForUser } from "../../../../../lib/likes";

export default async function PostDetails({
  params,
}: {
  params: {
    username: string;
    userId: string;
    postId: string;
  };
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const postId = parseInt(params.postId, 10);
  if (!postId) {
    notFound();
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
      id: postId,
      authorId: userId,
    },
    include: {
      parent: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const allPosts: PostType[] = [
    ...posts,
    ...(posts.map((p) => p.parent).filter((p) => !!p) as PostType[]),
  ];

  const likes = session
    ? await getLikesForUser({
        postList: allPosts,
        userId: session!.user!.id,
      })
    : [];

  const post = posts[0];

  return (
    <>
      <div className="border-b-[0.2px] sticky top-0 z-50 border-zinc-700 p-3">
        back arrow
        <h1 className="text-2xl font-bold">Post</h1>
      </div>
      <PostExpanded post={post} likes={likes} />
    </>
  );
}
