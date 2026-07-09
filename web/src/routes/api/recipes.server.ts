import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';
import { db } from '../../lib/db';
import { recipes, userHistory } from '../../db/schema';
import { recipePassesFilters } from '../../lib/filter';
import { auth } from '../../auth/auth';

export const getRecipes = createServerFn()
  .validator((data: { category?: string; page?: number; limit?: number }) => data)
  .handler(async ({ data }) => {
    const { category, page = 1, limit = 20 } = data;
    const req = getWebRequest();
    const session = await auth.api.getSession({ headers: req?.headers });
    const user = session?.user;

    let allRecipes = await db.select().from(recipes);

    if (category) {
      allRecipes = allRecipes.filter(
        (r) => r.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (user) {
      const profile = await db.query.profiles.findFirst({
        where: (p, { eq }) => eq(p.userId, user.id),
      });
      if (profile) {
        allRecipes = allRecipes.filter((r) => recipePassesFilters(r, profile));
      }
    }

    const total = allRecipes.length;
    const start = (page - 1) * limit;
    const paginated = allRecipes.slice(start, start + limit);

    return {
      recipes: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  });

export const getRecipeById = createServerFn()
  .validator((id: number) => id)
  .handler(async ({ data }) => {
    const recipe = await db.query.recipes.findFirst({
      where: (r, { eq }) => eq(r.id, data),
    });
    if (!recipe) throw new Error('Recept niet gevonden');

    const req = getWebRequest();
    const session = await auth.api.getSession({ headers: req?.headers });
    if (session?.user) {
      await db.insert(userHistory).values({
        userId: session.user.id,
        recipeId: recipe.id,
      });
    }

    return recipe;
  });
