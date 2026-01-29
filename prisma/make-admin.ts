import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log("Found users:", users.length);

    if (users.length === 0) {
        console.log("No users found.");
        return;
    }

    console.log("Users:");
    users.forEach((u) => console.log(`- ${u.email} (${u.role})`));

    // Promote the first user or specific email
    // You can change this filter
    const targetEmail = "deathlesscourage@gmail.com";

    const user = await prisma.user.findUnique({ where: { email: targetEmail } });

    if (user) {
        console.log(`Promoting ${targetEmail} to ADMIN...`);
        await prisma.user.update({
            where: { email: targetEmail },
            data: { role: "ADMIN" },
        });
        console.log("Success! Role updated.");
    } else {
        console.log(`User ${targetEmail} not found yet. Sign in first.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
