import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { eq, sql, desc } from 'drizzle-orm';

async function requireAdmin() {
  const request = getRequest();
  const headers = request ? request.headers : new Headers();
  const { auth } = await import('../auth/auth-handler');
  const sessionData = await auth.api.getSession({ headers });
  
  if (!sessionData?.user) throw new Error('Niet geautoriseerd');
  const user = sessionData.user as any;
  if (user.email !== 'surihealth@gmail.com' && user.role !== 'admin') {
    throw new Error('Toegang geweigerd. U bent geen beheerder.');
  }
  return sessionData;
}

export const adminGetContactMessages = createServerFn({ method: 'GET' })
  .handler(async () => {
    await requireAdmin();
    const { db } = await import('../db');
    const { contacts } = await import('../db/schema');
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  });

export const adminGetPlatformStats = createServerFn({ method: 'GET' })
  .handler(async () => {
    await requireAdmin();
    const { db } = await import('../db');
    const { users, contacts, favorites, recipes, profiles } = await import('../db/schema');

    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    const totalMessages = await db.select().from(contacts);
    const allRecipes = await db.select().from(recipes).orderBy(recipes.name);

    const topFavorites = await db
      .select({
        recipeId: favorites.recipeId,
        recipeName: recipes.name,
        imageUrl: recipes.imageUrl,
        category: recipes.category,
        count: sql<number>`count(${favorites.id})`.mapWith(Number),
      })
      .from(favorites)
      .innerJoin(recipes, eq(favorites.recipeId, recipes.id))
      .groupBy(favorites.recipeId, recipes.name, recipes.imageUrl, recipes.category)
      .orderBy(desc(sql`count(${favorites.id})`))
      .limit(5);

    const userProfiles = await db.select().from(profiles);
    const conditionCounts: Record<string, number> = { Diabetic: 0, 'Hoge Bloeddruk': 0, Cholesterol: 0, 'Hart- en vaatziekten': 0 };
    
    userProfiles.forEach(p => {
      const conds = (p.conditions as string[]) || [];
      conds.forEach(c => {
        if (c === 'Diabetic' || c === 'Diabeet (Suikerziekte)') conditionCounts['Diabetic']++;
        if (c.includes('Bloeddruk')) conditionCounts['Hoge Bloeddruk']++;
        if (c.includes('Cholesterol')) conditionCounts['Cholesterol']++;
        if (c.includes('Hart')) conditionCounts['Hart- en vaatziekten']++;
      });
    });

    const chartData = Object.entries(conditionCounts).map(([name, count]) => ({ name, count }));

    return {
      totalRegisteredUsers: allUsers.length,
      totalContactSubmissions: totalMessages.length,
      topFavorites: topFavorites || [],
      chartData,
      allRecipes: allRecipes || [],
      allUsersList: allUsers || [],
    };
  });

export const adminToggleTopPick = createServerFn({ method: 'POST' })
  .validator(z.object({ recipeId: z.string(), isTopPick: z.boolean() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { db } = await import('../db');
    const { recipes } = await import('../db/schema');

    await db
      .update(recipes)
      .set({ isTopPick: data.isTopPick })
      .where(eq(recipes.id, data.recipeId));

    return { success: true };
  });

export const adminReplyToMessage = createServerFn({ method: 'POST' })
  .validator(z.object({ messageId: z.string(), replyText: z.string().min(5) }))
  .handler(async () => {
    await requireAdmin();
    return { success: true };
  });

export const adminDeleteUser = createServerFn({ method: 'POST' })
  .validator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { db } = await import('../db');
    const { users } = await import('../db/schema');
    
    const request = getRequest();
    const headers = request ? request.headers : new Headers();
    const { auth } = await import('../auth/auth-handler');
    const currentSession = await auth.api.getSession({ headers });
    
    if (currentSession?.user?.id === data.userId) {
      throw new Error('U kunt uw eigen beheerdersaccount niet bannen.');
    }

    await db.delete(users).where(eq(users.id, data.userId));
    return { success: true };
  });
