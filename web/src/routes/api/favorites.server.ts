import { createServerFn } from '@tanstack/react-start';
import { db } from '../../lib/db';
import { favorites, recipes } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '../../auth/auth';

export const getFavorites = createServerFn().handler(async ({ context }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session?.user) throw new Error('Niet ingelogd');
  const favs = await db.select().from(favorites)
    .where(eq(favorites.userId, session.user.id))
    .innerJoin(recipes, eq(favorites.recipeId, recipes.id));
  return favs.map(f => f.recipe);
});

export const addFavorite = createServerFn()
  .validator((recipeId: number) => recipeId)
  .handler(async ({ data, context }) => {
    const session = await auth.api.getSession({ headers: context.headers });
    if (!session?.user) throw new Error('Niet ingelogd');
    await db.insert(favorites).values({
      userId: session.user.id,
      recipeId: data,
    });
});

export const removeFavorite = createServerFn()
  .validator((recipeId: number) => recipeId)
  .handler(async ({ data, context }) => {
    const session = await auth.api.getSession({ headers: context.headers });
    if (!session?.user) throw new Error('Niet ingelogd');
    await db.delete(favorites)
      .where(and(
        eq(favorites.userId, session.user.id),
        eq(favorites.recipeId, data)
      ));
});