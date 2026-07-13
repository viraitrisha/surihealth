import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { db } from '../../db';
import { profiles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '../../auth/auth';

const profileSchema = z.object({
  age: z.number().int().optional(),
  gender: z.string().optional(),
  height: z.number().int().optional(),
  weight: z.number().int().optional(),
  conditions: z.array(z.string()).optional(),
  diets: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  likes: z.array(z.string()).optional(),
  dislikes: z.array(z.string()).optional(),
});

export const getProfile = createServerFn()
  .handler(async () => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, numericUserId),
    });
    return profile ?? null;
  });

export const createOrUpdateProfile = createServerFn()
  .validator(profileSchema)
  .handler(async ({ data }) => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    const numericUserId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    const existing = await db.query.profiles.findFirst({
      where: eq(profiles.userId, numericUserId),
    });

    if (existing) {
      await db
        .update(profiles)
        .set({ ...data })
        .where(eq(profiles.userId, numericUserId));
    } else {
      await db
        .insert(profiles)
        .values({ userId: numericUserId, ...data });
    }

    return { success: true };
  });