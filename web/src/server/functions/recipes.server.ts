import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { db } from '../../db';
import { recipes, userHistory } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { filterRecipesByProfile } from '../../utils/recipeFilters';
import { auth } from '../../auth/auth';

const recipesInputSchema = z.object({
  category: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(20),
});

const recipeByIdSchema = z.object({
  id: z.number().int().positive(),
});

export const getRecipes = createServerFn()
  .validator(recipesInputSchema)
  .handler(async ({ data }) => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    const userId = session?.user?.id;

    let allRecipes = await db.select().from(recipes).orderBy(recipes.id);

    if (data.category) {
      const category = data.category.toLowerCase();
      allRecipes = allRecipes.filter(
        (r) => r.category.toLowerCase() === category,
      );
    }

    if (userId) {
      const numericUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
      const profile = await db.query.profiles.findFirst({
        where: (profiles, { eq }) => eq(profiles.userId, numericUserId),
      });
      allRecipes = filterRecipesByProfile(allRecipes, profile ?? null);
    }

    const total = allRecipes.length;
    const start = (data.page - 1) * data.limit;
    const paged = allRecipes.slice(start, start + data.limit);

    return {
      recipes: paged,
      pagination: {
        page: data.page,
        limit: data.limit,
        total,
        totalPages: Math.ceil(total / data.limit),
      },
    };
  });

export const getRecipeById = createServerFn()
  .validator(recipeByIdSchema)
  .handler(async ({ data }) => {
    const recipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, data.id),
    });
    if (!recipe) throw new Error('Recept niet gevonden');

    const session = await auth.api.getSession({
      headers: getRequest().headers,
    });
    if (session?.user?.id) {
      const numericUserId =
        typeof session.user.id === 'string'
          ? parseInt(session.user.id, 10)
          : session.user.id;
      await db.insert(userHistory).values([
        { userId: numericUserId, recipeId: data.id },
      ]);
    }

    return recipe;
  });