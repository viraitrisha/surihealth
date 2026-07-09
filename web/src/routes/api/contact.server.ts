import { createServerFn } from '@tanstack/react-start';
import { db } from '../../lib/db';
import { contacts } from '../../db/schema';

export const submitContact = createServerFn()
  .validator((data: { name: string; email: string; message: string }) => data)
  .handler(async ({ data }) => {
    await db.insert(contacts).values(data);
    return { success: true };
});