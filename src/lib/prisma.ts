import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

// Fix for "MaxClientsInSessionMode": Bypass Pooler entirely by using DIRECT_URL
const getDbUrl = () => {
    // Prefer DIRECT_URL to avoid Neon Pooler limits during Serverless/Testing
    // This allows creating sessions without "MaxClients" errors.
    if (process.env.DIRECT_URL) {
        console.log("Using DIRECT_URL for Prisma Connection");
        return process.env.DIRECT_URL;
    }

    let url = process.env.DATABASE_URL || "";
    if (!url.includes("connection_limit")) {
        url += url.includes("?") ? "&connection_limit=1" : "?connection_limit=1";
    }
    return url;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["query"],
        datasources: {
            db: {
                url: getDbUrl(),
            },
        },
    })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
