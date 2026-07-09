import { createServerFn } from '@tanstack/react-start';
import { db } from '../../lib/db';
import { userHistory, recipes } from '../../db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '../../auth/auth';

export const getRecentViews = createServerFn()
  .validator((limit: number = 10) => limit)
  .handler(async ({ data, context }) => {
    const session = await auth.api.getSession({ headers: context.headers });
    if (!session?.user) throw new Error('Niet ingelogd');
    const rows = await db.select()
      .from(userHistory)
      .where(eq(userHistory.userId, session.user.id))
      .innerJoin(recipes, eq(userHistory.recipeId, recipes.id))
      .orderBy(desc(userHistory.viewedAt))
      .limit(data);
    return rows.map(r => r.recipe);
});