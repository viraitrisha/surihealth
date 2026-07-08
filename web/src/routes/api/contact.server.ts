import { createServerFn } from '@tanstack/start';
import { z } from 'zod';
import { db } from '../../lib/db';
import { contacts } from '../../db/schema';

export const submitContact = createServerFn({ method: 'POST' })
  .validator(z.object({
    name: z.string().min(1),
    email: z.string().email(),
    message: z.string().min(1),
  }))
  .handler(async ({ data }) => {
    await db.insert(contacts).values(data);
    return { success: true };
  });