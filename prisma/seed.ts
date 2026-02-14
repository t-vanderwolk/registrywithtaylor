import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL!;
  const password = process.env.ADMIN_PASSWORD!;

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      role: Role.ADMIN,
    },
    create: {
      email,
      password: hashed,
      role: Role.ADMIN,
    },
  });

  console.log('✨ Admin ready. Baby prep, simplified.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
