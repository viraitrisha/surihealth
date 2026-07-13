import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { db } from '../../db';
import { userHistory, recipes } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '../../auth/auth';

export const getHistory = createServerFn()
  .handler(async () => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    const rows = await db
      .select({
        recipe: recipes,
        viewedAt: userHistory.viewedAt,
      })
      .from(userHistory)
      .innerJoin(recipes, eq(userHistory.recipeId, recipes.id))
      .where(eq(userHistory.userId, numericUserId))
      .orderBy(desc(userHistory.viewedAt))
      .limit(50);

    return rows.map(r => ({ ...r.recipe, viewedAt: r.viewedAt }));
  });