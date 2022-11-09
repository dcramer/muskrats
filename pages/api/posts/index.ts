import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import SuperJSON from "superjson";
import { getLikesForUser } from "../../../lib/likes";
import prisma from "../../../lib/prisma";

import { authOptions } from "../auth/[...nextauth]";

type Output = {
  id?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>
) {
  const { query, method } = req;

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401);
    return;
  }

  switch (method) {
    case "GET":
      const results = await prisma.post.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 100,
      });

      const likes = await getLikesForUser({
        postList: results,
        userId: session.user.id,
      });

      const output = SuperJSON.stringify(
        results.map((p) => {
          return {
            ...p,
            isLiked: likes.indexOf(p.id) !== -1,
          };
        })
      );

      res.status(200).send(output as Output);
      break;

    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
