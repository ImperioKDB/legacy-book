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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { caption, student_id } = body;

  const { data, error } = await supabaseServer
    .from("photos")
    .update({ caption: caption ?? null, student_id: student_id || null })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ photo: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: photo } = await supabaseServer
    .from("photos")
    .select("image_url")
    .eq("id", params.id)
    .single();

  if (photo?.image_url) {
    const path = photo.image_url.split("/legacy-book-assets/")[1];
    if (path) {
      await supabaseServer.storage.from("legacy-book-assets").remove([path]);
    }
  }

  const { error } = await supabaseServer.from("photos").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
