import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import crypto from 'crypto';

const updateProfileSchema = z.object({
  name: z.string().min(2),
  imageUrl: z.string().url().or(z.literal('')).optional(),
  age: z.number(),
  gender: z.string(),
  height: z.number(),
  weight: z.number(),
  conditions: z.array(z.string()),
  diets: z.array(z.string()),
  allergies: z.array(z.string()),
  likes: z.array(z.string()),
  dislikes: z.array(z.string()),
});

export const submitProfileSetup = createServerFn({ method: 'POST' })
  .validator(updateProfileSchema)
  .handler(async ({ data }) => {
    const request = getRequest();
    const headers = request ? request.headers : new Headers();
    
    const { auth } = await import('../auth/auth-handler');
    const sessionData = await auth.api.getSession({ headers });
    
    if (!sessionData?.user?.id) {
      throw new Error('Niet geautoriseerd: Geen actieve sessie.');
    }

    const userId = sessionData.user.id;
    const { db } = await import('../db');
    const { users, profiles } = await import('../db/schema');

    await db
      .update(users)
      .set({
        name: data.name,
        image: data.imageUrl || null,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId));

    await db
      .insert(profiles)
      .values({
        id: crypto.randomUUID(),
        userId: userId,
        age: data.age,
        gender: data.gender,
        height: data.height,
        weight: data.weight,
        conditions: data.conditions,
        diets: data.diets,
        allergies: data.allergies,
        likes: data.likes,
        dislikes: data.dislikes,
      })
      .onConflictDoUpdate({
        target: profiles.userId,
        set: {
          age: data.age,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          conditions: data.conditions,
          diets: data.diets,
          allergies: data.allergies,
          likes: data.likes,
          dislikes: data.dislikes,
        }
      });

    return { success: true };
  });