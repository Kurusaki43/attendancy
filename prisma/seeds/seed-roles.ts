import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { ROLES } from '@/server/auth/constants/roles';

export async function seedRoles() {
  logger.info('🌱 Seeding roles...');

  for (const { name, description } of Object.values(ROLES)) {
    await prisma.role.upsert({
      where: { name },

      update: {
        description,
      },

      create: {
        name,
        description,
      },
    });

    logger.debug(`Role synced: ${name}`);
  }

  logger.info('✅ Roles seeded successfully');
}
