import { createQueue } from '@/infrastructure/queues/base.queue';
import { TypedQueue } from '@/infrastructure/queues/typed.queue';

const rawQueue = createQueue('email');

export const emailQueue = new TypedQueue<'email'>(rawQueue);
