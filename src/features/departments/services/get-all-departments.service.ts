import { departmentRepository } from '../department.repository';
import type { GetAllDepartmentsServiceResult } from '../types';

export async function getAllDepartments(): Promise<GetAllDepartmentsServiceResult> {
  return await departmentRepository.getAll();
}
