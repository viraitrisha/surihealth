import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { db } from '../../db';
import { favorites, recipes } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '../../auth/auth';

export const getFavorites = createServerFn()
  .handler(async () => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    const rows = await db
      .select({ recipe: recipes })
      .from(favorites)
      .innerJoin(recipes, eq(favorites.recipeId, recipes.id))
      .where(eq(favorites.userId, numericUserId));

    return rows.map(r => r.recipe);
  });

export const addFavorite = createServerFn()
  .validator(z.object({ recipeId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    await db
      .insert(favorites)
      .values({ userId: numericUserId, recipeId: data.recipeId })
      .onConflictDoNothing();

    return { success: true };
  });

export const removeFavorite = createServerFn()
  .validator(z.object({ recipeId: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, numericUserId),
          eq(favorites.recipeId, data.recipeId)
        )
      );

    return { success: true };
  });