import { logger } from '@/lib/logger';
import { prisma } from '@/lib/prisma';
import { ROLE_NAMES } from '@/server/auth/constants/roles';
import { hashPassword } from '@/server/auth/lib/password';

// Dev-only login for every seeded employee — never used outside local seeding.
const SEED_PASSWORD = 'Passw0rd123!';

const EMPLOYEES = [
  {
    employeeCode: 'EMP-001',
    firstName: 'Amara',
    lastName: 'Okafor',
    email: 'amara.okafor@example.com',
    phone: '+1-555-0101',
    hireDate: new Date('2018-02-12'),
    role: ROLE_NAMES.ADMIN,
    departmentName: 'Human Resources',
    positionTitle: 'HR Manager',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-002',
    firstName: 'Daniel',
    lastName: 'Kim',
    email: 'daniel.kim@example.com',
    phone: '+1-555-0102',
    hireDate: new Date('2018-06-04'),
    role: ROLE_NAMES.MANAGER,
    departmentName: 'Engineering',
    positionTitle: 'Senior Software Engineer',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-003',
    firstName: 'Sofia',
    lastName: 'Marin',
    email: 'sofia.marin@example.com',
    phone: '+1-555-0103',
    hireDate: new Date('2020-01-15'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Engineering',
    positionTitle: 'Software Engineer',
    managerCode: 'EMP-002',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-004',
    firstName: 'Liam',
    lastName: 'Chen',
    email: 'liam.chen@example.com',
    phone: '+1-555-0104',
    hireDate: new Date('2021-04-19'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Engineering',
    positionTitle: 'Software Engineer',
    managerCode: 'EMP-002',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-005',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya.nair@example.com',
    phone: '+1-555-0105',
    hireDate: new Date('2021-09-01'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Engineering',
    positionTitle: 'DevOps Engineer',
    managerCode: 'EMP-002',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-006',
    firstName: 'Noah',
    lastName: 'Fischer',
    email: 'noah.fischer@example.com',
    phone: '+1-555-0106',
    hireDate: new Date('2022-02-08'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Quality Assurance',
    positionTitle: 'QA Engineer',
    managerCode: 'EMP-002',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-007',
    firstName: 'Elena',
    lastName: 'Popescu',
    email: 'elena.popescu@example.com',
    phone: '+1-555-0107',
    hireDate: new Date('2022-05-23'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Data & Analytics',
    positionTitle: 'Data Analyst',
    managerCode: 'EMP-002',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-008',
    firstName: 'Marcus',
    lastName: 'Webb',
    email: 'marcus.webb@example.com',
    phone: '+1-555-0108',
    hireDate: new Date('2022-11-14'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Research & Development',
    positionTitle: 'Data Scientist',
    managerCode: 'EMP-002',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-009',
    firstName: 'Yuki',
    lastName: 'Tanaka',
    email: 'yuki.tanaka@example.com',
    phone: '+1-555-0109',
    hireDate: new Date('2019-08-26'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Information Technology',
    positionTitle: 'DevOps Engineer',
    employmentStatus: 'ON_LEAVE',
  },
  {
    employeeCode: 'EMP-010',
    firstName: 'Grace',
    lastName: 'Adeyemi',
    email: 'grace.adeyemi@example.com',
    phone: '+1-555-0110',
    hireDate: new Date('2020-07-06'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Human Resources',
    positionTitle: 'Recruiter',
    managerCode: 'EMP-001',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-011',
    firstName: 'Omar',
    lastName: 'Haddad',
    email: 'omar.haddad@example.com',
    phone: '+1-555-0111',
    hireDate: new Date('2017-10-30'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Finance',
    positionTitle: 'Accountant',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-012',
    firstName: 'Isabella',
    lastName: 'Rossi',
    email: 'isabella.rossi@example.com',
    phone: '+1-555-0112',
    hireDate: new Date('2023-01-09'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Finance',
    positionTitle: 'Financial Analyst',
    managerCode: 'EMP-011',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-013',
    firstName: 'Chloe',
    lastName: 'Bennett',
    email: 'chloe.bennett@example.com',
    phone: '+1-555-0113',
    hireDate: new Date('2019-03-18'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Sales',
    positionTitle: 'Sales Representative',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-014',
    firstName: 'Ravi',
    lastName: 'Kumar',
    email: 'ravi.kumar@example.com',
    phone: '+1-555-0114',
    hireDate: new Date('2021-12-02'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Sales',
    positionTitle: 'Account Executive',
    managerCode: 'EMP-013',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-015',
    firstName: 'Mei',
    lastName: 'Lin',
    email: 'mei.lin@example.com',
    phone: '+1-555-0115',
    hireDate: new Date('2020-05-11'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Marketing',
    positionTitle: 'Marketing Specialist',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-016',
    firstName: 'Jonas',
    lastName: 'Weber',
    email: 'jonas.weber@example.com',
    phone: '+1-555-0116',
    hireDate: new Date('2022-08-15'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Communications',
    positionTitle: 'Content Writer',
    managerCode: 'EMP-015',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-017',
    firstName: 'Fatima',
    lastName: 'Zahra',
    email: 'fatima.zahra@example.com',
    phone: '+1-555-0117',
    hireDate: new Date('2021-06-28'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Customer Support',
    positionTitle: 'Customer Support Representative',
    employmentStatus: 'ACTIVE',
  },
  {
    employeeCode: 'EMP-018',
    firstName: 'Lucas',
    lastName: 'Silva',
    email: 'lucas.silva@example.com',
    phone: '+1-555-0118',
    hireDate: new Date('2016-09-05'),
    role: ROLE_NAMES.EMPLOYEE,
    departmentName: 'Administration',
    positionTitle: 'Office Administrator',
    employmentStatus: 'TERMINATED',
  },
] as const;

export async function seedEmployees() {
  logger.info('🌱 Seeding employees...');

  const passwordHash = await hashPassword(SEED_PASSWORD);

  const roles = await prisma.role.findMany({
    where: { name: { in: Object.values(ROLE_NAMES) } },
  });
  const roleIdByName = new Map(roles.map((role) => [role.name, role.id]));

  for (const employee of EMPLOYEES) {
    const roleId = roleIdByName.get(employee.role);

    if (!roleId) {
      throw new Error(`Role not found: ${employee.role}. Run seedRoles first.`);
    }

    const department = await prisma.department.findUniqueOrThrow({
      where: { name: employee.departmentName },
    });
    const position = await prisma.position.findUniqueOrThrow({
      where: { title: employee.positionTitle },
    });

    const user = await prisma.user.upsert({
      where: { email: employee.email },
      update: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
        roles: { set: [{ id: roleId }] },
      },
      create: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        passwordHash,
        provider: 'LOCAL',
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
        roles: { connect: { id: roleId } },
      },
    });

    await prisma.employee.upsert({
      where: { employeeCode: employee.employeeCode },
      update: {
        phone: employee.phone,
        hireDate: employee.hireDate,
        employmentStatus: employee.employmentStatus,
        userId: user.id,
        departmentId: department.id,
        positionId: position.id,
      },
      create: {
        employeeCode: employee.employeeCode,
        phone: employee.phone,
        hireDate: employee.hireDate,
        employmentStatus: employee.employmentStatus,
        userId: user.id,
        departmentId: department.id,
        positionId: position.id,
      },
    });

    logger.debug(`Employee synced: ${employee.employeeCode}`);
  }

  // Second pass: link managers now that every employee has a stable id.
  for (const employee of EMPLOYEES) {
    const managerCode = 'managerCode' in employee ? employee.managerCode : undefined;
    const manager = managerCode
      ? await prisma.employee.findUniqueOrThrow({ where: { employeeCode: managerCode } })
      : null;

    await prisma.employee.update({
      where: { employeeCode: employee.employeeCode },
      data: { managerId: manager?.id ?? null },
    });
  }

  logger.info(`✅ Employees seeded successfully (dev password: ${SEED_PASSWORD})`);
}
