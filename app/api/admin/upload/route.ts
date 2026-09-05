import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../utils/supabase/server";

const MAX_FILE_SIZE = 25 * 1024 * 1024;

async function isAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const userEmail = data.user?.email?.toLowerCase();

  return userEmail && adminEmail && userEmail === adminEmail;
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "You are not authorized to upload files." },
      { status: 401 },
    );
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return NextResponse.json(
      { error: "Image uploads are not configured on the server." },
      { status: 503 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Choose an image to upload." },
      { status: 400 },
    );
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files can be uploaded." },
      { status: 400 },
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Images must be 25 MB or smaller." },
      { status: 400 },
    );
  }

  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("fileName", file.name);
  uploadData.append("folder", "/artwork");
  uploadData.append("useUniqueFileName", "true");

  const response = await fetch(
    "https://upload.imagekit.io/api/v1/files/upload",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`,
      },
      body: uploadData,
    },
  );

  const result = (await response.json()) as { url?: string; message?: string };
  if (!response.ok || !result.url) {
    return NextResponse.json(
      { error: result.message ?? "Image upload failed." },
      { status: 502 },
    );
  }

  const deliveryUrl = new URL(result.url);
  deliveryUrl.searchParams.set("tr", "f-auto,q-auto");

  return NextResponse.json({ url: deliveryUrl.toString() });
}
