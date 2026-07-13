import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '../../db';
import { contacts } from '../../db/schema';

export const submitContact = createServerFn()
  .validator(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      message: z.string().min(1),
    })
  )
  .handler(async ({ data }) => {
    await db.insert(contacts).values(data);
    return { success: true };
  });