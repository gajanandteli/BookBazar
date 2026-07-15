import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Aarav Singh', email: 'aarav@example.com', role: 'USER', isVerified: true },
      { name: 'Neha Rao', email: 'neha@example.com', role: 'ADMIN', isVerified: true },
    ],
    skipDuplicates: true,
  });

  const seller = await prisma.user.findUnique({ where: { email: 'aarav@example.com' } });
  if (seller) {
    await prisma.book.createMany({
      data: [
        {
          title: 'The Alchemist',
          author: 'Paulo Coelho',
          category: 'Novel',
          description: 'Excellent condition paperback.',
          condition: 'Good',
          price: 320,
          originalPrice: 450,
          negotiable: true,
          location: 'Delhi',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          pickupAvailable: true,
          deliveryAvailable: true,
          phoneNumber: '+91 9876543210',
          whatsappNumber: '+91 9876543210',
          images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794'],
          sellerId: seller.id,
        },
      ],
    });
  }
}

main().finally(() => prisma.$disconnect());
