const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin user.");
  }

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

  console.log("Admin ready. Baby prep, simplified.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
