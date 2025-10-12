import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    if (!process.env.OWNER_PASSWORD || !process.env.ADMIN_PASSWORD) {
        throw new Error(
            'OWNER_PASSWORD and ADMIN_PASSWORD must be set in your .env file'
        );
    }

    const saltRounds = 10;

    const ownerPassword = await bcrypt.hash(
        process.env.OWNER_PASSWORD,
        saltRounds
    );
    const adminPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        saltRounds
    );

    const owner = await prisma.user.upsert({
        where: { username: 'bogrom' },
        update: {},
        create: {
            username: 'bogrom',
            password: ownerPassword,
            role: Role.OWNER,
            mail: 'biuro@bogrom.pl',
        },
    });

    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: adminPassword,
            role: Role.ADMIN,
            mail: 'xpietru@gmail.com',
        },
    });

    console.log({ owner, admin });
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
