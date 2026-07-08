import { createAPIFileRoute } from '@tanstack/start/api';
import { auth } from '../../../auth/auth';

export const APIRoute = createAPIFileRoute('/api/auth/$')({
  GET: auth.handler,
  POST: auth.handler,
});