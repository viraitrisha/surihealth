import { auth } from '../auth/auth';
import { getEvent } from 'vinxi/http';

export async function getSession() {
  const event = getEvent();
  return auth.api.getSession({ headers: event.headers });
}

export async function requireUser() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error('Niet ingelogd');
  }
  return session.user;
}