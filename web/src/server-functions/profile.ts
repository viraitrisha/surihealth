import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { z } from 'zod';
import { profiles } from '../db/schema';
import crypto from 'crypto';

const setupProfileSchema = z.object({
  age: z.number().int().min(1).max(120),
  gender: z.string(),
  height: z.number().int().positive(),
  weight: z.number().int().positive(),
  conditions: z.array(z.string()),
  diets: z.array(z.string()),
  allergies: z.array(z.string()),
  likes: z.array(z.string()),
  dislikes: z.array(z.string()),
});

export const submitProfileSetup = createServerFn({ method: 'POST' })
  .validator(setupProfileSchema)
  .handler(async ({ data }) => {
    const request = getRequest();
    const headers = request ? request.headers : new Headers();

    const { auth } = await import('../auth/auth-handler');
    const sessionData = await auth.api.getSession({ headers });
    
    if (!sessionData?.user?.id) {
      throw new Error('Niet geautoriseerd: Geen geldige sessie gevonden.');
    }

    const userId = sessionData.user.id;

    const { db } = await import('../db');

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
        },
      });

    return { success: true };
  });
