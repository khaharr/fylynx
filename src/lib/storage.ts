import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const isS3Configured = Boolean(
  process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY && process.env.S3_BUCKET_NAME
);

const s3Client = isS3Configured
  ? new S3Client({
      region: process.env.S3_REGION || 'auto',
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    })
  : null;

export async function generatePresignedUploadUrl({
  fileKey,
  mimeType,
}: {
  fileKey: string;
  mimeType: string;
}): Promise<{ uploadUrl: string; isLocal: boolean }> {
  if (s3Client && process.env.S3_BUCKET_NAME) {
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      ContentType: mimeType,
    });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return { uploadUrl, isLocal: false };
  }

  // Fallback dev local upload endpoint
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return {
    uploadUrl: `${appUrl}/api/upload/local?key=${encodeURIComponent(fileKey)}`,
    isLocal: true,
  };
}

export async function getFileViewUrl(fileKey: string): Promise<string> {
  if (s3Client && process.env.S3_BUCKET_NAME) {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
    });
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }

  // Fallback dev local retrieval
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${appUrl}/api/upload/local?key=${encodeURIComponent(fileKey)}`;
}
