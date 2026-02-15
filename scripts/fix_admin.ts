
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'support@autoshowlist.com';
    console.log(`Checking role for: ${email}`);

    const user = await prisma.user.findFirst({
        where: { email }
    });

    if (!user) {
        console.log("❌ User not found!");
        return;
    }

    console.log(`✅ User Found: ${user.id}`);
    console.log(`   - Name: ${user.name}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - Current Role: ${user.role}`);

    if (user.role !== 'ADMIN') {
        console.log(`\n⚠️ User is not ADMIN. Updating role...`);
        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { role: 'ADMIN' }
        });
        console.log(`✅ Role updated to: ${updated.role}`);
    } else {
        console.log(`\n✅ User is already ADMIN.`);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
