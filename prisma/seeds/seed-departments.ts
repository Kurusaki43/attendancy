import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const DEPARTMENTS = [
  {
    name: 'Engineering',
    code: 'ENG',
    description: 'Software development, infrastructure, architecture, and technical operations.',
    isActive: true,
  },
  {
    name: 'Information Technology',
    code: 'IT',
    description: 'IT support, hardware, networking, and system administration.',
    isActive: true,
  },
  {
    name: 'Human Resources',
    code: 'HR',
    description: 'Recruitment, onboarding, employee relations, benefits, and compliance.',
    isActive: true,
  },
  {
    name: 'Finance',
    code: 'FIN',
    description: 'Budgeting, accounting, payroll, financial planning, and reporting.',
    isActive: true,
  },
  {
    name: 'Sales',
    code: 'SALES',
    description: 'Business development, customer acquisition, and account management.',
    isActive: true,
  },
  {
    name: 'Marketing',
    code: 'MKT',
    description: 'Brand management, digital marketing, advertising, and market research.',
    isActive: true,
  },
  {
    name: 'Customer Support',
    code: 'CS',
    description: 'Customer assistance, issue resolution, and technical support.',
    isActive: true,
  },
  {
    name: 'Legal',
    code: 'LEGAL',
    description: 'Contracts, litigation, regulatory compliance, and corporate governance.',
    isActive: true,
  },
  {
    name: 'Operations',
    code: 'OPS',
    description: 'Business operations, logistics, process optimization, and execution.',
    isActive: true,
  },
  {
    name: 'Procurement',
    code: 'PROC',
    description: 'Vendor management, purchasing, sourcing, and contract negotiations.',
    isActive: true,
  },
  {
    name: 'Research & Development',
    code: 'RD',
    description: 'Innovation, product research, prototyping, and emerging technologies.',
    isActive: true,
  },
  {
    name: 'Quality Assurance',
    code: 'QA',
    description: 'Quality control, testing, audits, and continuous improvement.',
    isActive: true,
  },
  {
    name: 'Product Management',
    code: 'PM',
    description: 'Product strategy, roadmap planning, and stakeholder coordination.',
    isActive: true,
  },
  {
    name: 'Data & Analytics',
    code: 'DATA',
    description: 'Business intelligence, reporting, data engineering, and analytics.',
    isActive: true,
  },
  {
    name: 'Cybersecurity',
    code: 'SEC',
    description: 'Information security, risk management, incident response, and compliance.',
    isActive: true,
  },
  {
    name: 'Communications',
    code: 'COMMS',
    description: 'Internal communications, public relations, and corporate messaging.',
    isActive: true,
  },
  {
    name: 'Administration',
    code: 'ADMIN',
    description: 'Administrative support, office management, and organizational services.',
    isActive: true,
  },
  {
    name: 'Facilities Management',
    code: 'FAC',
    description: 'Building maintenance, workplace services, and physical security.',
    isActive: true,
  },
  {
    name: 'Training & Development',
    code: 'TD',
    description: 'Employee learning, professional development, and organizational training.',
    isActive: true,
  },
  {
    name: 'Internal Audit',
    code: 'AUDIT',
    description: 'Risk assessment, internal controls, compliance audits, and governance.',
    isActive: false,
  },
] as const;

export async function seedDepartments() {
  logger.info('🌱 Seeding departments...');

  for (const { name, code, description, isActive } of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { name },
      update: { code, description, isActive },
      create: { name, code, description, isActive },
    });

    logger.debug(`Department synced: ${name}`);
  }

  logger.info('✅ Departments seeded successfully');
}
