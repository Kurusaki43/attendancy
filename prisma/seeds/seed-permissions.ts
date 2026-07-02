import { PERMISSIONS } from '@/features/auth/constants/permissions';
import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

export async function seedPermissions() {
  logger.info('🌱 Seeding permissions...');

  for (const { resource, action, description } of Object.values(PERMISSIONS)) {
    await prisma.permission.upsert({
      where: {
        resource_action: {
          resource,
          action,
        },
      },

      update: {
        description,
      },

      create: {
        resource,
        action,
        description,
      },
    });

    logger.debug(`Permission synced: ${resource}:${action}`);
  }

  logger.info('✅ Permissions seeded successfully');
}
