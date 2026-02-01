
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const email = 'deathlesscourage@gmail.com'
    console.log(`Looking for user: ${email}...`)

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        console.error('User not found! Please log in first.')
        process.exit(1)
    }

    console.log(`Found user: ${user.name} (${user.id}). Updating to ADMIN...`)

    await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    })

    console.log('Success! User is now an ADMIN.')
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
