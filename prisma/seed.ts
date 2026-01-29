import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // 1. Create Users
    const userUser = await prisma.user.upsert({
        where: { email: 'user@example.com' },
        update: {},
        create: {
            email: 'user@example.com',
            name: 'Regular User',
            role: 'USER',
        },
    })

    const organizerUser = await prisma.user.upsert({
        where: { email: 'organizer@example.com' },
        update: {},
        create: {
            email: 'organizer@example.com',
            name: 'Event Organizer',
            role: 'ORGANIZER',
        },
    })

    // 2. Create Organizer Profile
    const organizerProfile = await prisma.organizerProfile.upsert({
        where: { userId: organizerUser.id },
        update: {},
        create: {
            userId: organizerUser.id,
            organizerName: 'Classic Car Club',
            phone: '555-0100',
            website: 'https://example.com/club',
            verifiedStatus: 'VERIFIED',
        },
    })

    // 3. Create Events
    const event1 = await prisma.event.create({
        data: {
            organizerId: organizerProfile.id,
            title: 'Summer Classic Car Show',
            description: 'The biggest classic car show in the region. Join us for a day of fun, food, and amazing cars.',
            startDateTime: new Date('2024-07-20T10:00:00Z'),
            endDateTime: new Date('2024-07-20T16:00:00Z'),
            venueName: 'City Park',
            addressLine1: '123 Park Ave',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            latitude: 39.7817,
            longitude: -89.6501,
            contactEmail: 'contact@example.com',
            posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1649842407/sample.jpg', // Placeholder
            status: 'APPROVED',
            tier: 'STANDARD',
            judgedOrCruiseIn: 'JUDGED',
            entryFee: 25.00,
            spectatorFee: 5.00,
            votingEnabled: true,
        },
    })

    const event2 = await prisma.event.create({
        data: {
            organizerId: organizerProfile.id,
            title: 'Weekly Cruise Night',
            description: 'Bring your ride and hang out! Every Friday night.',
            startDateTime: new Date('2024-08-02T18:00:00Z'),
            endDateTime: new Date('2024-08-02T21:00:00Z'),
            venueName: 'Diner Parking Lot',
            addressLine1: '456 Main St',
            city: 'Springfield',
            state: 'IL',
            zip: '62701',
            latitude: 39.8000,
            longitude: -89.6400,
            contactEmail: 'cruise@example.com',
            posterUrl: 'https://res.cloudinary.com/demo/image/upload/v1649842407/sample.jpg',
            status: 'APPROVED',
            tier: 'FREE_BASIC',
            judgedOrCruiseIn: 'CRUISE_IN',
            entryFee: 0,
        },
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
