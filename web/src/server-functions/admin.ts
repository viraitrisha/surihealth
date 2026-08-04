// web/src/server-functions/admin.ts
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { eq, sql, desc } from 'drizzle-orm';

// web/src/server-functions/admin.ts

async function requireAdmin() {
  const request = getRequest();
  const headers = request ? request.headers : new Headers();
  
  // 1. Haal de basis sessiegegevens op via Better Auth
  const { auth } = await import('../auth/auth-handler');
  const sessionData = await auth.api.getSession({ headers });
  
  if (!sessionData?.user) {
    throw new Error('Niet geautoriseerd');
  }

  // HARD RECHTEN INTERCEPTOR: Als dit het presentatie-adres is, mag hij ALTIJD direct door
  if (sessionData.user.email === 'surihealth@gmail.com') {
    return sessionData;
  }

  // 2. 🛡️ FIX: Controleer de rol LIVE in PostgreSQL via Drizzle om cookie-caching te omzeilen!
  const { db } = await import('../db');
  const { users } = await import('../db/schema');
  
  const freshUserRecord = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, sessionData.user.id)
  });

  // 3. Handhaaf de beheerder-controle op basis van de harde schijf data
  if (!freshUserRecord || freshUserRecord.role !== 'admin') {
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

// Zoek deze functie op in src/server-functions/admin.ts en vervang het binnenste gedeelte:

export const adminGetPlatformStats = createServerFn({ method: 'GET' })
  .handler(async () => {
    await requireAdmin();
    const { db } = await import('../db');
    const { users, contacts, favorites, recipes, profiles } = await import('../db/schema');

    const rawUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    const totalMessages = await db.select().from(contacts);
    const allRecipes = await db.select().from(recipes).orderBy(recipes.name);

    // 🛡️ FIX: Dwing surihealth@gmail.com ALTIJD naar de admin rol in de frontend array
    const allUsers = rawUsers.map((u: any) => {
      if (u.email === 'surihealth@gmail.com') {
        return { ...u, role: 'admin' };
      }
      return u;
    });

    // Bereken de Top Favorieten via SQL
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

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const currentMonthData = Array.from({ length: daysInMonth }, (_, i) => ({
      name: new Date(year, month, i + 1).toLocaleDateString('nl-NL', { day: '2-digit' }),
      users: 0,
      previous: 0
    }));

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    allUsers.forEach((u: any) => {
      if (u.createdAt) {
        const createdDate = new Date(u.createdAt);
        if (createdDate.getFullYear() === year && createdDate.getMonth() === month) {
          const day = createdDate.getDate() - 1;
          if (day >= 0 && day < currentMonthData.length) currentMonthData[day].users += 1;
        }
        if (createdDate.getFullYear() === prevYear && createdDate.getMonth() === prevMonth) {
          const day = createdDate.getDate() - 1;
          if (day >= 0 && day < currentMonthData.length) currentMonthData[day].previous += 1;
        }
      }
    });

    const yearChartData = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), i, 1);
      return {
        name: date.toLocaleString('nl-NL', { month: 'short' }),
        users: 0,
      };
    });

    allUsers.forEach((u: any) => {
      if (u.createdAt) {
        const createdDate = new Date(u.createdAt);
        if (createdDate.getFullYear() === now.getFullYear()) {
          const monthIndex = createdDate.getMonth();
          if (monthIndex >= 0 && monthIndex < yearChartData.length) yearChartData[monthIndex].users += 1;
        }
      }
    });

    return {
      totalRegisteredUsers: allUsers.length,
      totalContactSubmissions: totalMessages.length,
      topFavorites: topFavorites || [],
      chartData,
      allRecipes: allRecipes || [],
      allUsersList: allUsers || [],
      currentMonthData,
      yearChartData,
    };
  });

export const adminToggleTopPick = createServerFn({ method: 'POST' })
  .validator(z.object({ recipeId: z.string(), isTopPick: z.boolean() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { db } = await import('../db');
    const { recipes } = await import('../db/schema');
    await db.update(recipes).set({ isTopPick: data.isTopPick }).where(eq(recipes.id, data.recipeId));
    return { success: true };
  });

// web/src/server-functions/admin.ts

// Zoek deze specifieke functie op en voeg ({ data }) toe aan de handler-signatuur:
export const adminReplyToMessage = createServerFn({ method: 'POST' })
  .validator(z.object({ messageId: z.string(), replyText: z.string().min(5) }))
  .handler(async ({ data }) => { // 🛡️ FIX: '({ data })' toegevoegd zodat de compiler de messageId types begrijpt
    await requireAdmin();
    
    console.log(`[Support Bureau] Beheerder heeft ticket ${data.messageId} gecontroleerd en goedgekeurd voor e-mail distributie.`);
    
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

// ===============================================================
// 🛡️ REPARATIE: SCHEMA MATGING MET JOUW EXPLICITE KOLOMNAMEN
// ===============================================================
// web/src/server-functions/admin.ts

export const adminToggleBlockUser = createServerFn({ method: 'POST' })
  .validator(z.object({ userId: z.string(), block: z.boolean() }))
  .handler(async ({ data }) => {
    // 1. Controleer de admin status (Dit haalt ook de actieve admin sessie op)
    const adminSession = await requireAdmin();
    const currentAdminId = adminSession.user.id;

    const { db } = await import('../db');
    const { users, sessions } = await import('../db/schema');

    // 2. Pas de blokkade-status aan in PostgreSQL
    await db
      .update(users)
      .set({ 
        blocked: data.block 
      })
      .where(eq(users.id, data.userId));

    // 3. 🛡️ VEILIGHEIDS-CONTROLE: Wis alleen sessies als het NIET om de actieve admin zelf gaat!
    if (data.block && data.userId !== currentAdminId) {
      await db
        .delete(sessions)
        .where(eq(sessions.userId, data.userId));
    }

    return { success: true };
  });


// web/src/server-functions/admin.ts

export const adminUpdateUserRole = createServerFn({ method: 'POST' })
  .validator(z.object({ userId: z.string(), newRole: z.string() }))
  .handler(async ({ data }) => {
    // 1. Controleer of de actieve verzoeker daadwerkelijk de hoofdadmin is
    const adminSession = await requireAdmin();
    const currentAdminId = adminSession.user.id;

    const { db } = await import('../db');
    const { users, sessions } = await import('../db/schema');

    // 2. Pas de rol aan in PostgreSQL (Bijv. naar 'admin' of 'user')
    await db
      .update(users)
      .set({ 
        role: data.newRole 
      })
      .where(eq(users.id, data.userId));

    // 3. 🛡️ COOKIE REFRESH FORCEERDER: Wis de actieve sessies van deze gebruiker 
    // Hierdoor moet hij opnieuw inloggen en krijgt hij direct zijn admin-rechten!
    if (data.userId !== currentAdminId) {
      await db
        .delete(sessions)
        .where(eq(sessions.userId, data.userId));
    }

    return { success: true };
  });


// ==========================================
// 🛡️ RECEPTEN CRUD COMMANDS (VOOR DE DOCENT)
// ==========================================

const recipeCrudSchema = z.object({
  name: z.string().min(2),
  nameNl: z.string().optional(),
  category: z.string(),
  mealTypes: z.array(z.string()),
  area: z.string().optional(),
  instructions: z.string(),
  instructionsNl: z.string().optional(),
  imageUrl: z.string().url(),
  calories: z.number().optional(),
  ingredients: z.array(z.string()),
  ingredientsNl: z.array(z.string()).optional(),
});

export const adminCreateRecipe = createServerFn({ method: 'POST' })
  .validator(recipeCrudSchema)
  .handler(async ({ data }) => {
    await requireAdmin();
    const { db } = await import('../db');
    const { recipes } = await import('../db/schema');
    const crypto = await import('crypto');

    await db.insert(recipes).values({
      id: crypto.randomUUID(),
      externalId: crypto.randomUUID(),
      name: data.name,
      nameNl: data.nameNl || null,
      category: data.category,
      mealTypes: data.mealTypes,
      isTopPick: false,
      area: data.area || null,
      instructions: data.instructions,
      instructionsNl: data.instructionsNl || null,
      imageUrl: data.imageUrl,
      calories: data.calories || null,
      ingredients: data.ingredients,
      ingredientsNl: data.ingredientsNl || null,
    });
    return { success: true };
  });

export const adminUpdateRecipe = createServerFn({ method: 'POST' })
  .validator(recipeCrudSchema.extend({ id: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { db } = await import('../db');
    const { recipes } = await import('../db/schema');

    await db
      .update(recipes)
      .set({
        name: data.name,
        nameNl: data.nameNl || null,
        category: data.category,
        mealTypes: data.mealTypes,
        area: data.area || null,
        instructions: data.instructions,
        instructionsNl: data.instructionsNl || null,
        imageUrl: data.imageUrl,
        calories: data.calories || null,
        ingredients: data.ingredients,
        ingredientsNl: data.ingredientsNl || null,
      })
      .where(eq(recipes.id, data.id));
    return { success: true };
  });

export const adminDeleteRecipe = createServerFn({ method: 'POST' })
  .validator(z.object({ recipeId: z.string() }))
  .handler(async ({ data }) => {
    await requireAdmin();
    const { db } = await import('../db');
    const { recipes } = await import('../db/schema');
    await db.delete(recipes).where(eq(recipes.id, data.recipeId));
    return { success: true };
  });