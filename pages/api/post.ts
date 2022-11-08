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

  let content = body.content;
  if (content && content.length > 275) {
    res.status(400).send({ error: "Content is too dang long" });
  }

  const parentId = body.parent;
  if (parentId) {
    const parent = await prisma.post.findUniqueOrThrow({
      where: {
        id: parentId,
      },
    });
    const replyUsername = `@elonmusk#${parent.authorId}`;
    if (!content) content = replyUsername;
    else if (content.indexOf(replyUsername) !== 0) {
      content = `${replyUsername} ${content}`;
    }
  }

  const regex = /(?:^|[^@\w])@(\w{1,15}#([\d]+))\b/g;
  const mentionsUserIds = content
    ? Array.from((content as string).matchAll(regex), (m) => {
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

  const queries = [
    prisma.post.create({
      data: {
        content: content,
        authorId: user.id,
        parentId: body.parent || null,
        image: body.image || null,
        mentions: {
          create: mentions.map((m) => ({
            userId: m.id,
          })),
        },
      },
    }),
  ];

  // TODO: should we recurse? ooof
  if (parentId) {
    queries.push(
      prisma.post.update({
        where: {
          id: parentId,
        },
        data: {
          numReplies: {
            increment: 1,
          },
        },
      })
    );
  }

  const [newPost] = await prisma.$transaction(queries);

  if (newPost.id) {
    res.status(201).json({ id: newPost.id });
  } else {
    res.status(409).send({ error: "Unable to create post" });
  }
}
