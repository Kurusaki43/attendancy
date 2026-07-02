import { ROLES } from '@/features/auth/constants/roles';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

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
