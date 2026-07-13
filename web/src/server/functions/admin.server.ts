import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import { exec } from 'child_process';
import { auth } from '../../auth/auth';

export const importRecipes = createServerFn()
  .handler(async () => {
    const headers = getRequest().headers;
    const session = await auth.api.getSession({ headers });
    if (!session?.user?.id) throw new Error('Niet geauthenticeerd');
    if (session.user.email !== 'admin@example.com')
      throw new Error('Verboden: alleen admin');

    // Start import asynchronously
    exec('npx tsx src/db/seed.ts', (error, stdout) => {
      if (error) console.error('Seed error:', error);
      else console.log('Seed output:', stdout);
    });

    return { started: true };
  });