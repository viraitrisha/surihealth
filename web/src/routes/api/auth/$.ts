import { createAPIFileRoute } from '@tanstack/start/api';
import { handleAuth } from '../../../auth/auth-handler';

export const Route = createAPIFileRoute('/api/auth/$')({
  GET: ({ request }) => handleAuth(request),
  POST: ({ request }) => handleAuth(request),
});