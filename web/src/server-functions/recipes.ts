// src/server-functions/recipes.ts
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server'; 
import { z } from 'zod';
import { db } from '../db';
import { recipes, userHistory } from '../db/schema';
import { eq } from 'drizzle-orm';
import { filterRecipesByProfile } from '../utils/recipeFilters';
import { auth } from '../auth/auth-handler';
import crypto from 'crypto';

const recipesInputSchema = z.object({
  category: z.string().optional(),
  mealType: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(500),
});

const recipeByIdSchema = z.object({
  id: z.string(),
});

export const getRecipes = createServerFn({ method: 'GET' })
  .validator(recipesInputSchema)
  .handler(async ({ data }) => {
    const request = getRequest();
    const headers = request ? request.headers : new Headers();
    
    const session = await auth.api.getSession({ headers });
    const userId = session?.user?.id;

    let query = db.select().from(recipes).$dynamic();
    
    if (data.category) {
      query = query.where(eq(recipes.category, data.category));
    }
    
    query = query.orderBy(recipes.id);
    const allRecipes = await query;

    let preFilteredRecipes = allRecipes;

    // 🛡️ CRUCIALE Full-Stack FIX: Failsafe JSON array parser to stop row data bleeding
    if (data.mealType) {
      const targetMeal = data.mealType.toLowerCase().trim();
      
      preFilteredRecipes = allRecipes.filter((recipe: any) => {
        let cleanTypes: string[] = [];
        
        try {
          if (Array.isArray(recipe.mealTypes)) {
            cleanTypes = recipe.mealTypes;
          } else if (typeof recipe.mealTypes === 'string') {
            // Handle cases where PostgreSQL returns a stringified JSON array
            const parsed = JSON.parse(recipe.mealTypes);
            cleanTypes = Array.isArray(parsed) ? parsed : [String(parsed)];
          } else if (recipe.mealTypes) {
            cleanTypes = [String(recipe.mealTypes)];
          }
        } catch (e) {
          // Absolute fallback: search the text directly using a loose regex match
          cleanTypes = [String(recipe.mealTypes)];
        }

        // Normalize all items to lowercase
        const normalizedTypes = cleanTypes.map(t => String(t).toLowerCase().trim());
        
        // Handle common layout overrides for snacks and desserts
        if (targetMeal === 'dessert' || targetMeal === 'snack' || targetMeal === 'snacks') {
          return normalizedTypes.includes('dessert') || normalizedTypes.includes('snack') || normalizedTypes.includes('snacks');
        }
        
        return normalizedTypes.includes(targetMeal);
      });
    }

    // Apply medical profile restrictions (High Blood Pressure, Diabetes, etc.)
    if (userId) {
      const profile = await db.query.profiles.findFirst({
        where: (profiles, { eq }) => eq(profiles.userId, userId),
      });
      
      const filtered = filterRecipesByProfile(preFilteredRecipes, profile ?? null);
      const total = filtered.length;
      const start = (data.page - 1) * data.limit;
      const paged = filtered.slice(start, start + data.limit);
      
      return {
        recipes: paged,
        pagination: { page: data.page, limit: data.limit, total, totalPages: Math.ceil(total / data.limit) },
      };
    }

    const total = preFilteredRecipes.length;
    const start = (data.page - 1) * data.limit;
    const paged = preFilteredRecipes.slice(start, start + data.limit);
    
    return {
      recipes: paged,
      pagination: { page: data.page, limit: data.limit, total, totalPages: Math.ceil(total / data.limit) },
    };
  });

export const getRecipeById = createServerFn({ method: 'GET' })
  .validator(recipeByIdSchema)
  .handler(async ({ data }) => {
    const recipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, data.id),
    });
    if (!recipe) throw new Error('Recept niet gevonden');

    const request = getRequest();
    const headers = request ? request.headers : new Headers();
    const session = await auth.api.getSession({ headers });
    
    if (session?.user?.id) {
      await db.insert(userHistory).values({
        id: crypto.randomUUID(), 
        userId: session.user.id,
        recipeId: data.id, 
      });
    }

    return recipe;
  });

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const getAutomaticDailyMenu = createServerFn({ method: 'GET' })
  .handler(async () => {
    const request = getRequest();
    const headers = request ? request.headers : new Headers();
    const session = await auth.api.getSession({ headers });
    const userId = session?.user?.id;

    const allRecipes = await db.select().from(recipes);
    let allowedRecipes = allRecipes;

    if (userId) {
      const profile = await db.query.profiles.findFirst({
        where: (profiles, { eq }) => eq(profiles.userId, userId),
      });
      if (profile) {
        allowedRecipes = filterRecipesByProfile(allRecipes, profile);
      }
    }

    const randomizedPool = shuffleArray(allowedRecipes);

    const ontbijt = randomizedPool.find(r => {
      const ts = Array.isArray(r.mealTypes) ? r.mealTypes : JSON.parse(String(r.mealTypes) || '[]');
      return ts.map((t: string) => String(t).toLowerCase()).includes('ontbijt');
    }) || null;

    const lunch = randomizedPool.find(r => {
      const ts = Array.isArray(r.mealTypes) ? r.mealTypes : JSON.parse(String(r.mealTypes) || '[]');
      return ts.map((t: string) => String(t).toLowerCase()).includes('lunch') && r.id !== ontbijt?.id;
    }) || null;

    const middagmaaltijd = randomizedPool.find(r => {
      const ts = Array.isArray(r.mealTypes) ? r.mealTypes : JSON.parse(String(r.mealTypes) || '[]');
      return ts.map((t: string) => String(t).toLowerCase()).includes('middagmaaltijd') && r.id !== ontbijt?.id && r.id !== lunch?.id;
    }) || null;

    const avondeten = randomizedPool.find(r => {
      const ts = Array.isArray(r.mealTypes) ? r.mealTypes : JSON.parse(String(r.mealTypes) || '[]');
      return ts.map((t: string) => String(t).toLowerCase()).includes('avondeten') && r.id !== ontbijt?.id && r.id !== lunch?.id && r.id !== middagmaaltijd?.id;
    }) || null;

    const snack = randomizedPool.find(r => {
      const ts = Array.isArray(r.mealTypes) ? r.mealTypes : JSON.parse(String(r.mealTypes) || '[]');
      const normalized = ts.map((t: string) => String(t).toLowerCase());
      return normalized.includes('dessert') || normalized.includes('snack');
    }) || null;

    return {
      menu: {
        ontbijt,
        lunch,
        middagmaaltijd,
        avondeten,
        snack
      }
    };
  });
