import { createServerFn } from '@tanstack/react-start';
import { db } from '../../lib/db';
import { profiles } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '../../auth/auth';
import { z } from 'zod';

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

export const createProfile = createServerFn()
  .validator(profileSchema)
  .handler(async ({ data, context }) => {
    const session = await auth.api.getSession({ headers: context.headers });
    if (!session?.user) throw new Error('Niet ingelogd');
    await db.insert(profiles).values({
      userId: session.user.id,
      ...data,
    });
});

export const getProfile = createServerFn().handler(async ({ context }) => {
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session?.user) throw new Error('Niet ingelogd');
  return db.query.profiles.findFirst({
    where: (p, { eq }) => eq(p.userId, session.user.id),
  });
});

export const updateProfile = createServerFn()
  .validator(profileSchema)
  .handler(async ({ data, context }) => {
    const session = await auth.api.getSession({ headers: context.headers });
    if (!session?.user) throw new Error('Niet ingelogd');
    await db.update(profiles)
      .set(data)
      .where(eq(profiles.userId, session.user.id));
});