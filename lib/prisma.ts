import { PrismaClient } from "@prisma/client";

declare global {
  var globalPrisma: PrismaClient | undefined;
}

const prisma = globalThis.globalPrisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.globalPrisma = prisma;

export default prisma;
