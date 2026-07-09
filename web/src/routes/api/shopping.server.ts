import { createServerFn } from '@tanstack/react-start';
import { db } from '../../lib/db';
import { shoppingListItems } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '../../auth/auth';

export const getItems = createServerFn().handler(async ({ context }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session?.user) throw new Error('Niet ingelogd');
  return db.select().from(shoppingListItems)
    .where(eq(shoppingListItems.userId, session.user.id))
    .orderBy(shoppingListItems.id);
});

export const addItem = createServerFn()
  .validator((data: { name: string; quantity?: string }) => data)
  .handler(async ({ data, context }) => {
    const session = await auth.api.getSession({ headers: context.headers });
    if (!session?.user) throw new Error('Niet ingelogd');
    await db.insert(shoppingListItems).values({
      userId: session.user.id,
      name: data.name,
      quantity: data.quantity,
    });
});

export const deleteItem = createServerFn()
  .validator((id: number) => id)
  .handler(async ({ data, context }) => {
    const session = await auth.api.getSession({ headers: context.headers });
    if (!session?.user) throw new Error('Niet ingelogd');
    await db.delete(shoppingListItems)
      .where(and(
        eq(shoppingListItems.id, data),
        eq(shoppingListItems.userId, session.user.id)
      ));
});

export const toggleChecked = createServerFn()
  .validator((id: number) => id)
  .handler(async ({ data, context }) => {
    const session = await auth.api.getSession({ headers: context.headers });
    if (!session?.user) throw new Error('Niet ingelogd');
    const item = await db.query.shoppingListItems.findFirst({
      where: (i, { eq, and }) => and(eq(i.id, data), eq(i.userId, session.user.id)),
    });
    if (!item) throw new Error('Item niet gevonden');
    await db.update(shoppingListItems)
      .set({ checked: !item.checked })
      .where(eq(shoppingListItems.id, data));
});

export const clearChecked = createServerFn().handler(async ({ context }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session?.user) throw new Error('Niet ingelogd');
  await db.delete(shoppingListItems)
    .where(and(
      eq(shoppingListItems.userId, session.user.id),
      eq(shoppingListItems.checked, true)
    ));
});