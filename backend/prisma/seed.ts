import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@example.com",
      phone: "9876543210",
    },
  });

  console.log("User Created:", user.id);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });