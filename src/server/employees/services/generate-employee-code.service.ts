import { employeeRepository } from '@/server/employees/repositories/employee.repository';

const CODE_PREFIX = 'EMP-';
const CODE_DIGITS = 5;

function formatEmployeeCode(sequence: number): string {
  return `${CODE_PREFIX}${String(sequence).padStart(CODE_DIGITS, '0')}`;
}

export async function generateEmployeeCode(): Promise<string> {
  let sequence = (await employeeRepository.count()) + 1;
  let code = formatEmployeeCode(sequence);

  while (await employeeRepository.findByEmployeeCode(code)) {
    sequence += 1;
    code = formatEmployeeCode(sequence);
  }

  return code;
}
