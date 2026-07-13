import { createAPIFileRoute } from '@tanstack/start/api';
import { GET as authGet, POST as authPost } from '../../../auth/auth-handler';

export const Route = createAPIFileRoute('/api/auth/$')({
  GET: ({ request }) => authGet(request),
  POST: ({ request }) => authPost(request),
});