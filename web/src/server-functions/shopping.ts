import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '../db';
import { shoppingListItems } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { getUserSession } from './auth';
import crypto from 'crypto';

export const getShoppingList = createServerFn({ method: 'GET' })
  .handler(async () => {
    const sessionData = await getUserSession();
    if (!sessionData) throw new Error('Niet geautoriseerd');

    return await db
      .select()
      .from(shoppingListItems)
      .where(eq(shoppingListItems.userId, sessionData.user.id));
  });

export const addShoppingItem = createServerFn({ method: 'POST' })
  .validator(z.object({ 
    name: z.string(), 
    quantity: z.string().optional() 
  }))
  .handler(async ({ data }) => {

    const sessionData = await getUserSession();
    if (!sessionData) throw new Error('Niet geautoriseerd');


    const existingItem = await db
      .select()
      .from(shoppingListItems)
      .where(
        and(
          eq(shoppingListItems.userId, sessionData.user.id),
          eq(shoppingListItems.name, data.name)
        )
      );


    if (existingItem.length > 0) {

      const currentQuantity = Number(existingItem[0].quantity || 1);

      const updated = await db
        .update(shoppingListItems)
        .set({
          quantity: String(currentQuantity + 1)
        })
        .where(
          eq(shoppingListItems.id, existingItem[0].id)
        )
        .returning();


      return updated[0];

    }


    const newItem = await db
      .insert(shoppingListItems)
      .values({
        id: crypto.randomUUID(),
        userId: sessionData.user.id,
        name: data.name,
        quantity: data.quantity || "1",
        checked: false,
      })
      .returning();


    return newItem[0];

  });

export const toggleShoppingItem = createServerFn({ method: 'POST' })
  .validator(z.object({ id: z.string(), checked: z.boolean() }))
  .handler(async ({ data }) => {
    const sessionData = await getUserSession();
    if (!sessionData) throw new Error('Niet geautoriseerd');

    await db
      .update(shoppingListItems)
      .set({ checked: data.checked })
      .where(
        and(
          eq(shoppingListItems.id, data.id),
          eq(shoppingListItems.userId, sessionData.user.id)
        )
      );

    return { success: true };
  });

export const clearShoppingList = createServerFn({ method: 'POST' })
  .handler(async () => {
    const sessionData = await getUserSession();
    if (!sessionData) throw new Error('Niet geautoriseerd');

    await db
      .delete(shoppingListItems)
      .where(eq(shoppingListItems.userId, sessionData.user.id));

    return { success: true };
  });