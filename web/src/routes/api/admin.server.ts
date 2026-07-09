import { createServerFn } from '@tanstack/react-start';
import { auth } from '../../auth/auth';
import { exec } from 'child_process';
import path from 'path';

export const triggerImport = createServerFn().handler(async ({ context }) => {
  // Alleen admin mag dit
  const session = await auth.api.getSession({ headers: context.headers });
  if (!session?.user || session.user.email !== 'admin@example.com') {
    throw new Error('Geen toestemming');
  }
  exec('npx tsx src/db/seed.ts', (error, stdout, stderr) => {
    if (error) console.error(stderr);
    else console.log(stdout);
  });
  return { message: 'Import gestart' };
});