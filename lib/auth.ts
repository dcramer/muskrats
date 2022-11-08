import { Session } from "next-auth";
import { cookies } from "next/headers";

const wrapURL = (str: string) => {
  if (str.startsWith("http")) {
    return str;
  }

  return `https://${str}`;
};

const baseURL = wrapURL(process.env.VERCEL_URL || process.env.NEXTAUTH_URL || "");

export const getServerSession = async () => {
  const res = await fetch(`${baseURL}/api/auth/session`, {
    cache: "no-store",
    headers: {
      cookie: cookies()
        .getAll()
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join(";"),
    },
  });

  const session = await res.json();
  if (session?.user) {
    return session as Session;
  }

  return null;
};
