import { google } from 'googleapis';
import { Readable } from 'stream';

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const apiKey = process.env.GOOGLE_API_KEY;
const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

function getDriveClient() {
  // Option 1: Service Account Key (Best for server-to-server uploads)
  if (serviceAccountEmail && privateKey) {
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive'],
    });
    return google.drive({ version: 'v3', auth });
  }

  // Option 2: OAuth2 Client with Refresh Token
  if (clientId && clientSecret && refreshToken) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, `${appUrl}/api/auth/google-callback`);
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    return google.drive({ version: 'v3', auth: oauth2Client });
  }

  // Option 3: API Key fallback
  if (apiKey) {
    return google.drive({ version: 'v3', auth: apiKey });
  }

  return null;
}

export async function uploadFileToGoogleDrive({
  fileName,
  mimeType,
  buffer,
}: {
  fileName: string;
  mimeType: string;
  buffer: Buffer;
}): Promise<{ fileId: string; webViewLink: string } | null> {
  const drive = getDriveClient();
  if (!drive) {
    console.log('[Google Drive] Authentification non configurée. Fichier sauvegardé localement.');
    return null;
  }

  try {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    const requestBody: { name: string; parents?: string[] } = {
      name: fileName,
    };

    if (folderId) {
      requestBody.parents = [folderId];
    }

    const response = await drive.files.create({
      requestBody,
      media: {
        mimeType,
        body: stream,
      },
      fields: 'id, webViewLink, webContentLink',
    });

    console.log(`[Google Drive Success] Fichier "${fileName}" téléversé avec l'ID : ${response.data.id}`);

    return {
      fileId: response.data.id!,
      webViewLink: response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[Google Drive Upload Error]', errorMsg);
    return null;
  }
}

export async function getFileBufferFromGoogleDrive(fileId: string): Promise<Buffer | null> {
  const drive = getDriveClient();
  if (!drive) return null;

  try {
    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'arraybuffer' }
    );
    return Buffer.from(response.data as ArrayBuffer);
  } catch (err) {
    console.error(`[Google Drive Fetch Error] fileId: ${fileId}`, err);
    return null;
  }
}

export async function getGoogleDriveFileMetadata(fileId: string) {
  const drive = getDriveClient();
  if (!drive) return null;

  try {
    const response = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, webViewLink, webContentLink',
    });
    return response.data;
  } catch (err) {
    console.error(`[Google Drive Metadata Error] fileId: ${fileId}`, err);
    return null;
  }
}
