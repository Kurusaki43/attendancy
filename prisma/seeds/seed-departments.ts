import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const DEPARTMENTS = [
  {
    name: 'Engineering',
    description: 'Software development, infrastructure, and technical operations.',
    isActive: true,
  },
  {
    name: 'Human Resources',
    description: 'Recruitment, onboarding, employee relations, and compliance.',
    isActive: true,
  },
  {
    name: 'Finance',
    description: 'Budgeting, payroll, accounting, and financial reporting.',
    isActive: true,
  },
  {
    name: 'Sales',
    description: 'Business development, account management, and revenue growth.',
    isActive: true,
  },
  {
    name: 'Marketing',
    description: 'Brand strategy, campaigns, content, and market research.',
    isActive: true,
  },
  {
    name: 'Customer Support',
    description: 'Customer service, technical support, and issue resolution.',
    isActive: true,
  },
  {
    name: 'Legal',
    description: 'Contract management, regulatory compliance, and corporate governance.',
    isActive: true,
  },
  {
    name: 'Operations',
    description: 'Day-to-day business operations, logistics, and process improvement.',
    isActive: false,
  },
] as const;

export async function seedDepartments() {
  logger.info('🌱 Seeding departments...');

  for (const { name, description, isActive } of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { name },
      update: { description, isActive },
      create: { name, description, isActive },
    });

    logger.debug(`Department synced: ${name}`);
  }

  logger.info('✅ Departments seeded successfully');
}
