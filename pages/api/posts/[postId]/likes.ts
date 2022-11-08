import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

import prisma from "../../../../lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";

type Output = {
  id?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>
) {
  const { query, method } = req;

  const postId = parseInt(`${query.postId}`, 10);

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401);
    return;
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: session.user.email as string,
    },
  });

  switch (method) {
    case "POST":
      await prisma.$transaction([
        prisma.like.create({
          data: {
            authorId: user.id,
            postId,
          },
        }),
        prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            numLikes: { increment: 1 },
          },
        }),
      ]);
      res.status(201).end();
      break;
    case "DELETE":
      await prisma.$transaction([
        prisma.like.deleteMany({
          where: {
            authorId: user.id,
            postId,
          },
        }),
        prisma.post.update({
          where: {
            id: postId,
          },
          data: {
            numLikes: { decrement: 1 },
          },
        }),
      ]);
      res.status(204).end();
      break;
    default:
      res.setHeader("Allow", ["POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
