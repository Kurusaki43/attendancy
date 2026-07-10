import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const DEPARTMENTS = [
  {
    name: 'Engineering',
    description: 'Software development, infrastructure, architecture, and technical operations.',
    isActive: true,
  },
  {
    name: 'Information Technology',
    description: 'IT support, hardware, networking, and system administration.',
    isActive: true,
  },
  {
    name: 'Human Resources',
    description: 'Recruitment, onboarding, employee relations, benefits, and compliance.',
    isActive: true,
  },
  {
    name: 'Finance',
    description: 'Budgeting, accounting, payroll, financial planning, and reporting.',
    isActive: true,
  },
  {
    name: 'Sales',
    description: 'Business development, customer acquisition, and account management.',
    isActive: true,
  },
  {
    name: 'Marketing',
    description: 'Brand management, digital marketing, advertising, and market research.',
    isActive: true,
  },
  {
    name: 'Customer Support',
    description: 'Customer assistance, issue resolution, and technical support.',
    isActive: true,
  },
  {
    name: 'Legal',
    description: 'Contracts, litigation, regulatory compliance, and corporate governance.',
    isActive: true,
  },
  {
    name: 'Operations',
    description: 'Business operations, logistics, process optimization, and execution.',
    isActive: true,
  },
  {
    name: 'Procurement',
    description: 'Vendor management, purchasing, sourcing, and contract negotiations.',
    isActive: true,
  },
  {
    name: 'Research & Development',
    description: 'Innovation, product research, prototyping, and emerging technologies.',
    isActive: true,
  },
  {
    name: 'Quality Assurance',
    description: 'Quality control, testing, audits, and continuous improvement.',
    isActive: true,
  },
  {
    name: 'Product Management',
    description: 'Product strategy, roadmap planning, and stakeholder coordination.',
    isActive: true,
  },
  {
    name: 'Data & Analytics',
    description: 'Business intelligence, reporting, data engineering, and analytics.',
    isActive: true,
  },
  {
    name: 'Cybersecurity',
    description: 'Information security, risk management, incident response, and compliance.',
    isActive: true,
  },
  {
    name: 'Communications',
    description: 'Internal communications, public relations, and corporate messaging.',
    isActive: true,
  },
  {
    name: 'Administration',
    description: 'Administrative support, office management, and organizational services.',
    isActive: true,
  },
  {
    name: 'Facilities Management',
    description: 'Building maintenance, workplace services, and physical security.',
    isActive: true,
  },
  {
    name: 'Training & Development',
    description: 'Employee learning, professional development, and organizational training.',
    isActive: true,
  },
  {
    name: 'Internal Audit',
    description: 'Risk assessment, internal controls, compliance audits, and governance.',
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
