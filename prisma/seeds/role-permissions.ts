import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { ROLE_PERMISSIONS } from '@/server/auth/constants/role_permissions';

export async function seedRolePermissions() {
  logger.info('🌱 Assigning permissions to roles...');

  for (const [roleName, permissions] of Object.entries(ROLE_PERMISSIONS)) {
    await prisma.role.update({
      where: {
        name: roleName,
      },

      data: {
        permissions: {
          set: [],

          connect: permissions.map(({ resource, action }) => ({
            resource_action: {
              resource,
              action,
            },
          })),
        },
      },
    });

    logger.debug(`Assigned ${permissions.length} permissions to ${roleName}`);
  }

  logger.info('✅ Role permissions assigned successfully');
}
