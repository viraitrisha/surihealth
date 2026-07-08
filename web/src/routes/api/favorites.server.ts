import { createServerFn } from '@tanstack/start';
import { z } from 'zod';
import { db } from '../../lib/db';
import { favorites } from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { requireUser } from '../../lib/auth-utils';

export const getFavorites = createServerFn({ method: 'GET' })
  .handler(async () => {
    const user = await requireUser();
    const favs = await db.query.favorites.findMany({
      where: eq(favorites.userId, user.id),
      with: { recipe: true },
    });
    return favs.map(f => f.recipe);
  });

export const addFavorite = createServerFn({ method: 'POST' })
  .validator(z.object({ recipeId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const user = await requireUser();
    await db.insert(favorites).values({ userId: user.id, recipeId: data.recipeId });
    return { success: true };
  });

export const removeFavorite = createServerFn({ method: 'POST' })
  .validator(z.object({ recipeId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const user = await requireUser();
    await db.delete(favorites)
      .where(and(eq(favorites.userId, user.id), eq(favorites.recipeId, data.recipeId)));
    return { success: true };
  });