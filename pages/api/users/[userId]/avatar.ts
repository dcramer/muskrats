import type { NextApiRequest, NextApiResponse } from "next";
import seedrandom from "seedrandom";

const avatarChoices = ["/avatar.jpg", "/avatar2.jpg", "/avatar3.jpg"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<null>
) {
  const {
    query: { userId },
    method,
  } = req;

  if (method !== "GET") {
    res.status(405).end(`Method ${method} Not Allowed`);
  }

  const rng = seedrandom(`${userId}`);
  const avatarUrl = avatarChoices[Math.floor(rng() * avatarChoices.length)];
  res.redirect(avatarUrl);
}
