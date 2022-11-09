import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";

export const getServerSession = async () => {
  return unstable_getServerSession(authOptions);
};
