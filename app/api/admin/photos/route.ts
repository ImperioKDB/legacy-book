import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase-server";

async function checkAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;

  const token = authHeader.replace("Bearer ", "");
  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: userData, error } = await authClient.auth.getUser(token);
  if (error || !userData.user) return null;
  if (userData.user.email !== process.env.ADMIN_EMAIL) return null;

  return userData.user;
}

export async function POST(req: NextRequest) {
  const user = await checkAdmin(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const studentId = formData.get("student_id") as string | null;
  const caption = formData.get("caption") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileExt = file.name.split(".").pop();
  const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { error: uploadError } = await supabaseServer.storage
    .from("legacy-book-assets")
    .upload(filePath, buffer, {
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabaseServer.storage
    .from("legacy-book-assets")
    .getPublicUrl(filePath);

  const { data, error } = await supabaseServer
    .from("photos")
    .insert({
      student_id: studentId || null,
      image_url: urlData.publicUrl,
      caption: caption || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ photo: data }, { status: 201 });
}
