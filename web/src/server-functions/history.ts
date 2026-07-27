import { createServerFn } from '@tanstack/react-start';
import { db } from '../db';
import { userHistory, recipes } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { getUserSession } from './auth';

export const getViewHistory = createServerFn({ method: 'GET' })
  .handler(async () => {
    const sessionData = await getUserSession();
    if (!sessionData) throw new Error('Niet geautoriseerd');

    return await db
      .select({
        historyId: userHistory.id,
        viewedAt: userHistory.viewedAt,
        recipe: recipes,
      })
      .from(userHistory)
      .innerJoin(recipes, eq(userHistory.recipeId, recipes.id))
      .where(eq(userHistory.userId, sessionData.user.id))
      .orderBy(desc(userHistory.viewedAt))
      .limit(15);
  });
