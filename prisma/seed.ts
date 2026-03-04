import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  'Food & Drink',
  'Groceries',
  'Transport',
  'Rent',
  'Utilities',
  'Subscriptions',
  'Shopping',
  'Health',
  'Entertainment',
  'Travel',
  'Education',
  'Gifts',
  'Insurance',
  'Savings/Investing',
  'Other',
];

async function main() {
  console.log('Seeding default categories...');

  for (const name of DEFAULT_CATEGORIES) {
    try {
      const existingCategory = await prisma.category.findUnique({
        where: {
          userId_name: {
            userId: null as any,
            name,
          },
        },
      });

      if (!existingCategory) {
        await prisma.category.create({
          data: {
            name,
            isArchived: false,
          },
        });
        console.log(`✓ Created category: ${name}`);
      } else {
        console.log(`⊘ Category already exists: ${name}`);
      }
    } catch (error) {
      console.error(`✗ Error creating category ${name}:`, error);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
