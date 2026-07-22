import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';

// icon/color values mirror the picker options in
// src/features/departments/lib/department-visuals.ts. Child departments reuse their parent's
// color so the hierarchy reads as a color family in the UI, distinguished by icon.
//
// Employees can only be assigned to leaf departments (see seed-employees.ts), so every
// top-level department that needs its own general headcount (Engineering, Information
// Technology, Human Resources, Finance, Marketing) gets one plain leaf child — Software
// Engineering, IT Support, HR Operations, Accounting, Marketing Operations — alongside its
// more specialized children, instead of holding employees on the parent row itself.
const DEPARTMENTS = [
  {
    name: 'Engineering',
    code: 'ENG',
    description: 'Software development, infrastructure, architecture, and technical operations.',
    icon: 'code-2',
    color: 'bg-blue-500',
    isActive: true,
  },
  {
    name: 'Information Technology',
    code: 'IT',
    description: 'IT support, hardware, networking, and system administration.',
    icon: 'settings',
    color: 'bg-slate-500',
    isActive: true,
  },
  {
    name: 'Human Resources',
    code: 'HR',
    description: 'Recruitment, onboarding, employee relations, benefits, and compliance.',
    icon: 'users',
    color: 'bg-emerald-500',
    isActive: true,
  },
  {
    name: 'Finance',
    code: 'FIN',
    description: 'Budgeting, accounting, payroll, financial planning, and reporting.',
    icon: 'briefcase',
    color: 'bg-amber-500',
    isActive: true,
  },
  {
    name: 'Sales',
    code: 'SALES',
    description: 'Business development, customer acquisition, and account management.',
    icon: 'trending-up',
    color: 'bg-orange-500',
    isActive: true,
  },
  {
    name: 'Marketing',
    code: 'MKT',
    description: 'Brand management, digital marketing, advertising, and market research.',
    icon: 'megaphone',
    color: 'bg-pink-500',
    isActive: true,
  },
  {
    name: 'Customer Support',
    code: 'CS',
    description: 'Customer assistance, issue resolution, and technical support.',
    icon: 'headphones',
    color: 'bg-cyan-500',
    isActive: true,
  },
  {
    name: 'Legal',
    code: 'LEGAL',
    description: 'Contracts, litigation, regulatory compliance, and corporate governance.',
    icon: 'flag',
    color: 'bg-indigo-500',
    isActive: true,
  },
  {
    name: 'Operations',
    code: 'OPS',
    description: 'Business operations, logistics, process optimization, and execution.',
    icon: 'archive',
    color: 'bg-teal-500',
    isActive: true,
  },
  {
    name: 'Product Management',
    code: 'PM',
    description: 'Product strategy, roadmap planning, and stakeholder coordination.',
    icon: 'building-2',
    color: 'bg-violet-500',
    isActive: true,
  },
  {
    name: 'Software Engineering',
    code: 'SWE',
    description: 'Core product engineering — application development and platform infrastructure.',
    icon: 'code-2',
    color: 'bg-blue-500',
    isActive: true,
    parentName: 'Engineering',
  },
  {
    name: 'Quality Assurance',
    code: 'QA',
    description: 'Quality control, testing, audits, and continuous improvement.',
    icon: 'shield',
    color: 'bg-blue-500',
    isActive: true,
    parentName: 'Engineering',
  },
  {
    name: 'Research & Development',
    code: 'RD',
    description: 'Innovation, product research, prototyping, and emerging technologies.',
    icon: 'package',
    color: 'bg-blue-500',
    isActive: true,
    parentName: 'Engineering',
  },
  {
    name: 'Data & Analytics',
    code: 'DATA',
    description: 'Business intelligence, reporting, data engineering, and analytics.',
    icon: 'trending-up',
    color: 'bg-blue-500',
    isActive: true,
    parentName: 'Engineering',
  },
  {
    name: 'IT Support',
    code: 'ITSUP',
    description: 'Helpdesk, hardware provisioning, and day-to-day infrastructure operations.',
    icon: 'settings',
    color: 'bg-slate-500',
    isActive: true,
    parentName: 'Information Technology',
  },
  {
    name: 'Cybersecurity',
    code: 'SEC',
    description: 'Information security, risk management, incident response, and compliance.',
    icon: 'shield',
    color: 'bg-slate-500',
    isActive: true,
    parentName: 'Information Technology',
  },
  {
    name: 'HR Operations',
    code: 'HROPS',
    description: 'Core HR administration, recruitment, employee relations, and benefits.',
    icon: 'users',
    color: 'bg-emerald-500',
    isActive: true,
    parentName: 'Human Resources',
  },
  {
    name: 'Training & Development',
    code: 'TD',
    description: 'Employee learning, professional development, and organizational training.',
    icon: 'graduation-cap',
    color: 'bg-emerald-500',
    isActive: true,
    parentName: 'Human Resources',
  },
  {
    name: 'Accounting',
    code: 'ACCT',
    description: 'General ledger, accounts payable/receivable, and financial analysis.',
    icon: 'briefcase',
    color: 'bg-amber-500',
    isActive: true,
    parentName: 'Finance',
  },
  {
    name: 'Procurement',
    code: 'PROC',
    description: 'Vendor management, purchasing, sourcing, and contract negotiations.',
    icon: 'shopping-cart',
    color: 'bg-amber-500',
    isActive: true,
    parentName: 'Finance',
  },
  {
    name: 'Internal Audit',
    code: 'AUDIT',
    description: 'Risk assessment, internal controls, compliance audits, and governance.',
    icon: 'flag',
    color: 'bg-amber-500',
    isActive: false,
    parentName: 'Finance',
  },
  {
    name: 'Marketing Operations',
    code: 'MKTOPS',
    description: 'Campaign execution, marketing programs, and channel management.',
    icon: 'megaphone',
    color: 'bg-pink-500',
    isActive: true,
    parentName: 'Marketing',
  },
  {
    name: 'Communications',
    code: 'COMMS',
    description: 'Internal communications, public relations, and corporate messaging.',
    icon: 'megaphone',
    color: 'bg-pink-500',
    isActive: true,
    parentName: 'Marketing',
  },
  {
    name: 'Facilities Management',
    code: 'FAC',
    description: 'Building maintenance, workplace services, and physical security.',
    icon: 'wrench',
    color: 'bg-teal-500',
    isActive: true,
    parentName: 'Operations',
  },
  {
    name: 'Administration',
    code: 'ADMIN',
    description: 'Administrative support, office management, and organizational services.',
    icon: 'building-2',
    color: 'bg-teal-500',
    isActive: true,
    parentName: 'Operations',
  },
] as const;

export async function seedDepartments() {
  logger.info('🌱 Seeding departments...');

  for (const { name, code, description, icon, color, isActive } of DEPARTMENTS) {
    await prisma.department.upsert({
      where: { name },
      update: { code, description, icon, color, isActive },
      create: { name, code, description, icon, color, isActive },
    });

    logger.debug(`Department synced: ${name}`);
  }

  // Second pass: link parents now that every department has a stable id. Mirrors the
  // create/update-department services' rule that an inactive department can never be a
  // parent — fail loudly rather than seed data the app itself would reject.
  for (const department of DEPARTMENTS) {
    const parentName = 'parentName' in department ? department.parentName : undefined;
    const parent = parentName
      ? await prisma.department.findUniqueOrThrow({ where: { name: parentName } })
      : null;

    if (parent && !parent.isActive) {
      throw new Error(
        `Seed error: "${parentName}" is inactive and cannot be the parent of "${department.name}".`,
      );
    }

    await prisma.department.update({
      where: { name: department.name },
      data: { parentId: parent?.id ?? null },
    });
  }

  logger.info('✅ Departments seeded successfully');
}
