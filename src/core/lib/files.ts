import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_CLOUDFLARE_SECRET_ACCESS_KEY;
const bucketName = process.env.NEXT_PUBLIC_CLOUDFLARE_BUCKET_NAME;

if (!accessKeyId) {
  throw new Error("CLOUDFLARE_ACCESS_KEY_ID is required");
}

if (!secretAccessKey) {
  throw new Error("CLOUDFLARE_SECRET_ACCESS_KEY is required");
}

if (!bucketName) {
  throw new Error("CLOUDFLARE_BUCKET_NAME is required");
}

if (!accountId) {
  throw new Error("CLOUDFLARE_ACCOUNT_ID is required");
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

export async function uploadImageToR2(file: File) {
  const fileKey = `${Date.now()}-${file.name.replace(/\.[^/.]+$/, "")}.webp`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type,
    })
  );

  return fileKey;
}

export const uploadSelectedImages = async (files: File[]) => {
  if (!files.length) return [];

  const uploadedImages: { url: string; fileKey: string }[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/files", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw Error("Image upload failed");

    const { url, fileKey } = await res.json();
    uploadedImages.push({ url, fileKey });
  }

  return uploadedImages;
};

export async function generatePresignedUrl(fileKey: string) {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  // URL expires in 7 days
  return await getSignedUrl(s3Client, command, { expiresIn: 604800 });
}

export async function deleteImagesFromR2(fileKeys: string[]) {
  if (!fileKeys.length) return;

  try {
    await Promise.all(
      fileKeys.map((key) =>
        s3Client.send(
          new DeleteObjectCommand({
            Bucket: bucketName,
            Key: key,
          })
        )
      )
    );

    console.log(`Successfully deleted ${fileKeys.length} files from R2`);
  } catch (error) {
    console.error("Error deleting files from R2:", error);
    throw error;
  }
}
