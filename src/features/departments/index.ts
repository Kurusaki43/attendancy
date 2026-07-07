// Actions (server actions for client-side consumption)
export { createDepartmentAction } from '@/server/departments/actions/create-department.action';
export { deleteDepartmentAction } from '@/server/departments/actions/delete-department.action';
export { getAllDepartmentsAction } from '@/server/departments/actions/get-all-departments.action';
export { getDepartmentAction } from '@/server/departments/actions/get-department.action';
export { updateDepartmentAction } from '@/server/departments/actions/update-department.action';

// Components
export { AddDepartmentDialog } from './components/AddDepartmentDialog';
export { DepartmentForm } from './components/DepartmentForm';
export { EditDepartmentDialog } from './components/EditDepartmentDialog';

// Schemas (for client-side validation)
export {
  type CreateDepartmentInput,
  createDepartmentSchema,
} from './schemas/create-department.schema';
export {
  type UpdateDepartmentInput,
  updateDepartmentSchema,
} from './schemas/update-department.schema';

// Types (action result types for client-side consumption)
export type {
  CreateDepartmentActionResult,
  DeleteDepartmentActionResult,
  DepartmentResult,
  GetAllDepartmentsActionResult,
  GetDepartmentActionResult,
  UpdateDepartmentActionResult,
} from './types';
