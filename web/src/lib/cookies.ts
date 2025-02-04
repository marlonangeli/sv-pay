'use server'

import { cookies } from 'next/headers';

export async function getUserIdFromServer() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get('userId');

  return userIdCookie?.value || null;
}

export async function setUserIdCookieInServer(userId: string) {
  await deleteUserIdCookieInServer();

  const cookieStore = await cookies();
  cookieStore.set('userId', userId, {
    sameSite: 'strict',
    secure: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/'
  });
}

export async function deleteUserIdCookieInServer() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
}
