import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { deflateSync } from "zlib";

import prisma from "../../lib/prisma";
import { authOptions } from "./auth/[...nextauth]";

type Output = {
  id?: number;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Output>
) {
  if (req.method !== "PUT") {
    res.status(405).send({ error: "Only PUT requests allowed" });
    return;
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  const body = JSON.parse(req.body);
  if (!body.image) {
    res.status(400).send({ error: "Missing image" });
    return;
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      image: deflateSync(body.image),
      onboarded: true,
    },
  });
  res.status(201).json({});
}
