import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

import { seedRolePermissions } from './role-permissions';
import { seedDepartments } from './seed-departments';
import { seedEmployees } from './seed-employees';
import { seedPermissions } from './seed-permissions';
import { seedPositions } from './seed-positions';
import { seedRoles } from './seed-roles';

async function main() {
  logger.info('🌱 Starting database seeding...');

  await seedRoles();
  await seedPermissions();
  await seedRolePermissions();
  await seedDepartments();
  await seedPositions();
  await seedEmployees();

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
