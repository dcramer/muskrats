import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import seedrandom from "seedrandom";
import { inflateSync } from "zlib";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";

const avatarChoices = ["/avatar.jpg", "/avatar2.jpg", "/avatar3.jpg"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<null>
) {
  const {
    query: { userId: rawUserId },
    method,
  } = req;

  if (method !== "GET") {
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  let userId: any = rawUserId;
  if (rawUserId === "me") {
    const session = await unstable_getServerSession(req, res, authOptions);
    userId = session?.user?.id;
  }

  if (!userId) {
    res.status(404).end();
  }

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(userId, 10),
    },
  });

  if (!user) {
    res.status(404).end();
  } else if (user.image !== null) {
    const dataUri = inflateSync(user.image).toString();
    const [mimeTypeBit, base64Bit] = dataUri.split(";base64,");
    const buf = Buffer.from(base64Bit, "base64");
    res.setHeader("Content-Type", mimeTypeBit.substring(5));
    res.status(200).send(buf);
  } else {
    const rng = seedrandom(`${userId}`);
    const avatarUrl = avatarChoices[Math.floor(rng() * avatarChoices.length)];
    res.redirect(avatarUrl);
  }
}
