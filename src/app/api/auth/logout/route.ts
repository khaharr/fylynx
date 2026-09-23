import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { removeSessionCookie } from '@/lib/auth';

export async function POST() {
  removeSessionCookie();
  return NextResponse.json({ success: true });
}
