import { createServerFn } from '@tanstack/start';
import { z } from 'zod';
import { db } from '../../lib/db';
import { shoppingListItems } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { requireUser } from '../../lib/auth-utils';

export const getItems = createServerFn({ method: 'GET' })
  .handler(async () => {
    const user = await requireUser();
    return db.select().from(shoppingListItems).where(eq(shoppingListItems.userId, user.id));
  });

export const addItem = createServerFn({ method: 'POST' })
  .validator(z.object({ name: z.string().min(1), quantity: z.string().optional() }))
  .handler(async ({ data }) => {
    const user = await requireUser();
    await db.insert(shoppingListItems).values({ userId: user.id, name: data.name, quantity: data.quantity });
    return { success: true };
  });