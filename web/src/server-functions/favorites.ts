import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { db } from '../db';
import { favorites, recipes } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { getUserSession } from './auth';
import crypto from 'crypto';

export const getFavoriteRecipes = createServerFn({ method: 'GET' })
  .handler(async () => {
    const sessionData = await getUserSession();
    if (!sessionData) throw new Error('Niet geautoriseerd');

    return await db
      .select({
        favoriteId: favorites.id,
        recipe: recipes,
      })
      .from(favorites)
      .innerJoin(recipes, eq(favorites.recipeId, recipes.id))
      .where(eq(favorites.userId, sessionData.user.id));
  });

export const toggleFavorite = createServerFn({ method: 'POST' })
  .validator(z.object({ recipeId: z.string() }))
  .handler(async ({ data }) => {
    const sessionData = await getUserSession();
    if (!sessionData) throw new Error('Niet geautoriseerd');

    const userId = sessionData.user.id;

    const existing = await db.query.favorites.findFirst({
      where: and(eq(favorites.userId, userId), eq(favorites.recipeId, data.recipeId)),
    });

    if (existing) {
      await db
        .delete(favorites)
        .where(and(eq(favorites.userId, userId), eq(favorites.recipeId, data.recipeId)));
      return { isFavorite: false };
    } else {
      await db.insert(favorites).values({
        id: crypto.randomUUID(),
        userId: userId,
        recipeId: data.recipeId,
      });
      return { isFavorite: true };
    }
  });
