import { PrismaPg } from '@prisma/adapter-pg';

import { logger } from '@/lib/logger';

import { PrismaClient } from '../src/generated/prisma/client';
import { env } from '../src/lib/env/env';
import { seedRolePermissions } from './seeds/role-permissions';
import { seedPermissions } from './seeds/seed-permissions';
import { seedRoles } from './seeds/seed-roles';

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  logger.info('🌱 Starting database seeding...');

  await seedRoles();
  await seedPermissions();
  await seedRolePermissions();

  logger.info('🎉 Database seeded successfully.');
}

main()
  .catch((error) => {
    logger.error(error, 'Error seeding database');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
