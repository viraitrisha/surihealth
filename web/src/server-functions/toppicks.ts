// server-functions/toppicks.ts
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

// Schema voor het ophalen van top picks met limit
const getTopPicksSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
});

// FUNCTIE 1: Alle top picks ophalen
export const getTopPicks = createServerFn({ method: 'GET' })
  .validator(getTopPicksSchema)
  .handler(async ({ data }) => {
    try {
      const { db } = await import('../db');
      const { recipes } = await import('../db/schema');

      const topPicks = await db
        .select()
        .from(recipes)
        .where(eq(recipes.isTopPick, true))
        .limit(data.limit);

      return {
        success: true,
        topPicks: topPicks,
        count: topPicks.length,
      };
    } catch (error: any) {
      console.error('Fout bij ophalen top picks:', error);
      throw new Error(error.message || 'Kon top picks niet ophalen.');
    }
  });