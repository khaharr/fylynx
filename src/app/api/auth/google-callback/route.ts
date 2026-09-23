import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const redirectUri = `${appUrl}/api/auth/google-callback`;

    if (!code) {
      return NextResponse.json({ error: 'Code d\'autorisation manquant' }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    // Exchange OAuth code for Refresh Token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.refresh_token) {
      console.error('[Google OAuth Token Exchange Error]', tokenData);
      // If no refresh token returned, user might need to re-consent with prompt=consent
      const refreshToken = tokenData.refresh_token || tokenData.access_token;
      if (refreshToken) {
        tokenData.refresh_token = refreshToken;
      }
    }

    if (tokenData.refresh_token) {
      // Save GOOGLE_REFRESH_TOKEN to .env
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('GOOGLE_REFRESH_TOKEN=')) {
          envContent = envContent.replace(/GOOGLE_REFRESH_TOKEN=.*/, `GOOGLE_REFRESH_TOKEN="${tokenData.refresh_token}"`);
        } else {
          envContent += `\nGOOGLE_REFRESH_TOKEN="${tokenData.refresh_token}"\n`;
        }
        fs.writeFileSync(envPath, envContent);
      }
      process.env.GOOGLE_REFRESH_TOKEN = tokenData.refresh_token;
    }

    return NextResponse.redirect(`${appUrl}/dashboard/settings?google_drive=connected`);
  } catch (err) {
    console.error('[Google Callback Error]', err);
    return NextResponse.json({ error: 'Erreur d\'échange OAuth Google' }, { status: 500 });
  }
}
