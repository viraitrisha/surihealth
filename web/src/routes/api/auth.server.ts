import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { auth } from '../../auth/auth';
import { db } from '../../lib/db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '../../lib/auth-utils';

// Registreer
export const register = createServerFn({ method: 'POST' })
  .validator(z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
  }))
  .handler(async ({ data }) => {
    const existing = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existing.length > 0) {
      throw new Error('Deze e-mail is al geregistreerd');
    }
    const user = await auth.api.signUpEmail({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
    return { success: true, userId: user.id };
  });

// Login
export const login = createServerFn({ method: 'POST' })
  .validator(z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }))
  .handler(async ({ data }) => {
    const session = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });
    return { success: true, token: session?.session?.token };
  });

export const logout = createServerFn({ method: 'POST' })
  .handler(async () => {
    const session = await getSession();
    if (session) {
      await auth.api.signOut({ headers: getEvent().headers });
    }
    return { success: true };
  });

export const changePassword = createServerFn({ method: 'POST' })
  .validator(z.object({
    oldPassword: z.string().min(1),
    newPassword: z.string().min(6),
  }))
  .handler(async ({ data }) => {
    const user = await requireUser();
    await auth.api.changePassword({
      body: {
        userId: user.id,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
    });
    return { success: true };
  });