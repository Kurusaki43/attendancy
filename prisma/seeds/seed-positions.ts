import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

const POSITIONS = [
  {
    title: 'Software Engineer',
    code: 'SWE',
    description: 'Designs, builds, and maintains software applications and services.',
    isActive: true,
  },
  {
    title: 'Senior Software Engineer',
    code: 'SR-SWE',
    description: 'Leads technical design and mentors engineers on complex projects.',
    isActive: true,
  },
  {
    title: 'DevOps Engineer',
    code: 'DEVOPS',
    description: 'Manages infrastructure, deployment pipelines, and system reliability.',
    isActive: true,
  },
  {
    title: 'QA Engineer',
    code: 'QAE',
    description: 'Tests software to identify defects and ensure release quality.',
    isActive: true,
  },
  {
    title: 'Data Analyst',
    code: 'DA',
    description: 'Analyzes data to surface insights and support business decisions.',
    isActive: true,
  },
  {
    title: 'Data Scientist',
    code: 'DS',
    description: 'Builds models and applies statistical methods to solve business problems.',
    isActive: true,
  },
  {
    title: 'Product Manager',
    code: 'PM',
    description: 'Owns product strategy, roadmap, and cross-functional delivery.',
    isActive: true,
  },
  {
    title: 'Project Manager',
    code: 'PJM',
    description: 'Plans and coordinates projects, timelines, and resources.',
    isActive: true,
  },
  {
    title: 'UX/UI Designer',
    code: 'UXD',
    description: 'Designs user interfaces and experiences for products.',
    isActive: true,
  },
  {
    title: 'HR Manager',
    code: 'HRM',
    description: 'Oversees HR operations, policy, and employee relations.',
    isActive: true,
  },
  {
    title: 'Recruiter',
    code: 'RECRUIT',
    description: 'Sources, screens, and hires candidates for open roles.',
    isActive: true,
  },
  {
    title: 'Accountant',
    code: 'ACCT',
    description: 'Handles bookkeeping, financial records, and reporting.',
    isActive: true,
  },
  {
    title: 'Financial Analyst',
    code: 'FINA',
    description: 'Analyzes financial data and supports budgeting and forecasting.',
    isActive: true,
  },
  {
    title: 'Sales Representative',
    code: 'SALESREP',
    description: 'Generates leads and closes deals with prospective customers.',
    isActive: true,
  },
  {
    title: 'Account Executive',
    code: 'AE',
    description: 'Manages client relationships and grows existing accounts.',
    isActive: true,
  },
  {
    title: 'Marketing Specialist',
    code: 'MKTSPEC',
    description: 'Plans and executes marketing campaigns across channels.',
    isActive: true,
  },
  {
    title: 'Content Writer',
    code: 'CW',
    description: 'Writes copy and content for marketing and product materials.',
    isActive: true,
  },
  {
    title: 'Customer Support Representative',
    code: 'CSR',
    description: 'Assists customers with issues, questions, and troubleshooting.',
    isActive: true,
  },
  {
    title: 'Office Administrator',
    code: 'OFFADMIN',
    description: 'Manages day-to-day office operations and administrative support.',
    isActive: true,
  },
  {
    title: 'Webmaster',
    code: 'WM',
    description:
      'Legacy role for maintaining company websites, superseded by dedicated engineering roles.',
    isActive: false,
  },
] as const;

export async function seedPositions() {
  logger.info('🌱 Seeding positions...');

  for (const { title, code, description, isActive } of POSITIONS) {
    await prisma.position.upsert({
      where: { title },
      update: { code, description, isActive },
      create: { title, code, description, isActive },
    });

    logger.debug(`Position synced: ${title}`);
  }

  logger.info('✅ Positions seeded successfully');
}
