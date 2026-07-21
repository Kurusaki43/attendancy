import { createTypedQueue } from '@/infrastructure/queues/typed.queue';

export const attendanceQueue = createTypedQueue('attendance');
