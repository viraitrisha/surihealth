import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { profiles } from '../db/schema';
import { eq } from 'drizzle-orm';

export const getUserSession = createServerFn({ method: 'GET' })
  .handler(async () => {
    const request = getRequest();
    const headers = request ? request.headers : new Headers();
    
    const { auth } = await import('../auth/auth-handler');
    const session = await auth.api.getSession({ headers });
    return session; 
  });

const serverRegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export const registerUserOnServer = createServerFn({ method: 'POST' })
  .validator(serverRegisterSchema)
  .handler(async ({ data }) => {
    try {
      const { auth } = await import('../auth/auth-handler');
      await auth.api.signUpEmail({
        body: {
          email: data.email,
          password: data.password,
          name: data.name,
        }
      });
      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || 'Registratie mislukt.');
    }
  });

export const checkDashboardGuard = createServerFn({ method: 'GET' })
  .handler(async () => {
    const request = getRequest();
    const headers = request ? request.headers : new Headers();
    
    const { auth } = await import('../auth/auth-handler');
    const sessionData = await auth.api.getSession({ headers });
    if (!sessionData) {
      return { authenticated: false, hasProfile: false, user: null, profile: null };
    }

    const { db } = await import('../db');
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, sessionData.user.id),
    });

    return {
      authenticated: true,
      hasProfile: !!profile,
      user: sessionData.user,
      profile: profile || null,
    };
  });

export const deleteUserAccountOnServer = createServerFn({ method: 'POST' })
  .handler(async () => {
    try {
      const request = getRequest();
      const headers = request ? request.headers : new Headers();
      
      const { auth } = await import('../auth/auth-handler');
      const sessionData = await auth.api.getSession({ headers });
      
      if (!sessionData?.user?.id) {
        throw new Error('Niet geautoriseerd: Geen actieve sessie gevonden.');
      }

      const userId = sessionData.user.id;

      const { db } = await import('../db');
      const { users } = await import('../db/schema');

      await db.delete(users).where(eq(users.id, userId));
      await auth.api.signOut({ headers });

      return { success: true };
    } catch (error: any) {
      console.error('SERVER ACCOUNT DELETE ERROR:', error);
      throw new Error(error.message || 'Kon account niet wissen van de server.');
    }
  });

export const seedAdminAccountOnDemand = createServerFn({ method: 'POST' })
  .handler(async () => {
    try {
      const { db } = await import('../db');
      const { users, profiles } = await import('../db/schema');
      const { eq } = await import('drizzle-orm');

      const existingAdmin = await db.query.users.findFirst({
        where: eq(users.email, 'surihealth@gmail.com')
      });

      if (!existingAdmin) {
        const { auth } = await import('../auth/auth-handler');
        
        const createdUser = await auth.api.signUpEmail({
          body: {
            email: 'surihealth@gmail.com',
            password: 'surihealth123',
            name: 'Admin SuriHealth',
          }
        });

        if (createdUser?.user?.id) {
          const crypto = await import('crypto');
          await db.insert(profiles).values({
            id: crypto.randomUUID(),
            userId: createdUser.user.id,
            age: 30,
            gender: 'Man',
            height: 175,
            weight: 75,
            conditions: ['admin'], 
            diets: [],
            allergies: [],
            likes: [],
            dislikes: [],
          });
          return { seeded: true };
        }
      }
      return { seeded: false };
    } catch (err) {
      console.error('Admin seeding overgeslagen:', err);
      return { seeded: false };
    }
  });

  export const checkUserBlockStatus = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    try {
      const { db } = await import('../db');
      const { users } = await import('../db/schema');
      const { eq } = await import('drizzle-orm');

      const userRecord = await db.query.users.findFirst({
        where: eq(users.email, data.email.trim().toLowerCase())
      });

      return { isBlocked: userRecord?.blocked === true };
    } catch (err) {
      return { isBlocked: false };
    }
  });