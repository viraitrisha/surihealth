import { createServerFn } from '@tanstack/start';
import { requireUser } from '../../lib/auth-utils';
import { db } from '../../lib/db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { importRecipes } from '../../db/seed';

export const triggerImport = createServerFn({ method: 'POST' })
  .handler(async () => {
    const user = await requireUser();
    const userRecord = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
    if (userRecord[0]?.email !== 'admin@example.com') {
      throw new Error('Geen admin-rechten');
    }
    importRecipes().catch(console.error);
    return { message: 'Import gestart' };
  });