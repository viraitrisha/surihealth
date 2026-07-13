import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { db } from '../../db';
import { shoppingListItems } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '../../auth/auth';

export const getItems = createServerFn()
  .handler(async () => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    return db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.userId, numericUserId))
      .orderBy(shoppingListItems.id);
  });

export const addItem = createServerFn()
  .validator(
    z.object({
      name: z.string().min(1),
      quantity: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    const [item] = await db
      .insert(shoppingListItems)
      .values({
        userId: numericUserId,
        name: data.name,
        quantity: data.quantity,
      })
      .returning();

    return item;
  });

export const deleteItem = createServerFn()
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    await db
      .delete(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.id, data.id),
          eq(shoppingListItems.userId, numericUserId)
        )
      );

    return { success: true };
  });

export const toggleChecked = createServerFn()
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    const [item] = await db
      .select()
      .from(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.id, data.id),
          eq(shoppingListItems.userId, numericUserId)
        )
      );

    if (!item) throw new Error('Item niet gevonden');

    await db
      .update(shoppingListItems)
      .set({ checked: !item.checked })
      .where(eq(shoppingListItems.id, data.id));

    return { success: true };
  });

export const clearChecked = createServerFn()
  .handler(async () => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    await db
      .delete(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.userId, numericUserId),
          eq(shoppingListItems.checked, true)
        )
      );

    return { success: true };
  });