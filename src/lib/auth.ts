import { cache } from 'react';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { db } from './db';

const COOKIE_NAME = 'fylynx_session';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Simple Base64-encoded session token helper with expiration & payload
export function createSessionToken(userId: string): string {
  const payload = {
    userId,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function parseSessionToken(token: string): { userId: string } | null {
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonStr);
    if (parsed.exp && parsed.exp > Date.now()) {
      return { userId: parsed.userId };
    }
  } catch (err) {
    return null;
  }
  return null;
}

export const getCurrentUser = cache(async () => {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionToken) return null;

  const parsed = parseSessionToken(sessionToken);
  if (!parsed) return null;

  const user = await db.user.findUnique({
    where: { id: parsed.userId },
    select: {
      id: true,
      email: true,
      name: true,
      companyName: true,
      role: true,
      subscriptionStatus: true,
      companyLogo: true,
      customWelcomeMsg: true,
      brandColor: true,
    },
  });

  return user;
});

export function setSessionCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
}

export function removeSessionCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
