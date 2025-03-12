import { PrismaClient } from "../generated/client/index.js";


const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prismaClient = globalForPrisma.prisma || new PrismaClient();

