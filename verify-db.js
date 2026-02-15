
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to database...");
        // Try to create an event with a slug to see if the column exists
        const count = await prisma.event.count();
        console.log(`Successfully connected. Event count: ${count}`);

        // Check if we can query by slug (proves column exists)
        const event = await prisma.event.findFirst({
            where: { slug: { not: "non-existent" } },
            select: { id: true, slug: true }
        });
        console.log("Successfully queried 'slug' column.");

        // Check one event to see if it has a slug
        if (event) {
            console.log(`Found event: ${event.id}, Slug: ${event.slug}`);
        } else {
            console.log("No events found with slug (expected if all are old), but query succeeded.");
        }

    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
