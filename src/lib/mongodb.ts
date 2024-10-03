// ts-ignore 7017 is used to ignore the error that the global object is not
// defined in the global scope. This is because the global object is only
// defined in the global scope in Node.js and not in the browser.

import { PrismaClient } from "@prisma-mongodb/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrismaMongodb = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrismaMongodb.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production")
	globalForPrismaMongodb.prisma = prisma;

export default prisma;
