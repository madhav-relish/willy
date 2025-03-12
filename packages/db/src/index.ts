import { PrismaClient, Prisma } from "../generated/client/index.js";


export const prismaClient = new PrismaClient()
export { Prisma };