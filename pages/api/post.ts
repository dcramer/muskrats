import { User } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";

import prisma from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

type Output = {
  id?: number;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Output>) {
  if (req.method !== "POST") {
    res.status(405).send({ error: "Only POST requests allowed" });
    return;
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  const body = JSON.parse(req.body);
  if (!body.content && !body.image) {
    res.status(400).send({ error: "Missing content" });
    return;
  }

  const regex = /(?:^|[^@\w])@(\w{1,15}#([\d]+))\b/g;
  const mentionsUserIds = body.content
    ? Array.from((body.content as string).matchAll(regex), (m) => {
        const userId = parseInt(m[2], 10);
        if (!userId) return null;
        return userId;
      })
    : [];

  // lol how to type
  const mentions: User[] = (
    await Promise.all(
      mentionsUserIds.map(async (userId) => {
        if (!userId) return null;
        return await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
      })
    )
  ).filter((m) => !!m) as User[];

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: session.user.email as string,
    },
  });

  const newPost = await prisma.post.create({
    data: {
      content: body.content || null,
      authorId: user.id,
      parentId: body.parent || null,
      image: body.image || null,
      mentions: {
        create: mentions.map((m) => ({
          userId: m.id,
        })),
      },
    },
  });

  if (newPost.id) {
    res.status(201).json({ id: newPost.id });
  } else {
    res.status(409).send({ error: "Unable to create post" });
  }
}
