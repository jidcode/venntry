import { uploadImageToR2, generatePresignedUrl } from "@/core/lib/files";
import { NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 1MB." },
        { status: 400 }
      );
    }

    // Optimize image
    const optimizedBuffer = await sharp(await file.arrayBuffer())
      .resize(1000, 1000, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 100 })
      .toBuffer();

    // Create new File object with optimized image
    const optimizedFile = new File([optimizedBuffer], file.name, {
      type: "image/webp",
    });

    // Upload optimized image to bucket
    const fileKey = await uploadImageToR2(optimizedFile);
    const url = await generatePresignedUrl(fileKey);

    return NextResponse.json({ url, fileKey }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
