import { Post } from "@prisma/client";
import prisma from "./prisma";

export async function getLikesForUser({
  postList,
  userId,
}: {
  postList: Post[];
  userId: number;
}): Promise<number[]> {
  return (
    await prisma.like.findMany({
      select: {
        postId: true,
      },
      where: {
        postId: { in: postList.map((p) => p.id) },
        authorId: userId,
      },
    })
  ).map((r) => r.postId);
}
