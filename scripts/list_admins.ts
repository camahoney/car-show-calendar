
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Listing all ADMIN users...");
    const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' }
    });

    if (admins.length === 0) {
        console.log("❌ No ADMIN users found.");
    } else {
        console.log(`✅ Found ${admins.length} ADMIN users:`);
        for (const u of admins) {
            // @ts-ignore
            console.log(`   - ${u.email} (${u.name}) [ID: ${u.id}]`);

            // Remove admin if not support@autoshowlist.com
            // @ts-ignore
            if (u.email !== 'support@autoshowlist.com') {
                console.log(`     ⚠️ Removing ADMIN role from ${u.email}...`);
                await prisma.user.update({
                    where: { id: u.id },
                    data: { role: 'USER' }
                });
                console.log(`     ✅ Removed.`);
            }
        }
    }

    const email = 'support@autoshowlist.com';
    const supportUser = await prisma.user.findFirst({ where: { email } });
    if (supportUser) {
        console.log(`\n🔍 Checking 'support@autoshowlist.com':`);
        console.log(`   - Role: ${supportUser.role}`);
        if (supportUser.role !== 'ADMIN') {
            console.log(`   ⚠️ Restoring ADMIN role...`);
            await prisma.user.update({
                where: { id: supportUser.id },
                data: { role: 'ADMIN' }
            });
            console.log(`   ✅ Restored.`);
        }
    } else {
        console.log(`\n❌ 'support@autoshowlist.com' NOT found.`);
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
