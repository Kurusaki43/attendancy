import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

import { seedRolePermissions } from './role-permissions';
import { seedPermissions } from './seed-permissions';
import { seedRoles } from './seed-roles';

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
