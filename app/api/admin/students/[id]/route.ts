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
  const { full_name, department, favorite_scripture, testimony, approved } = body;

  const { data, error } = await supabaseServer
    .from("students")
    .update({ full_name, department, favorite_scripture, testimony, approved })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ student: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { count: letterCount } = await supabaseServer
    .from("letters")
    .select("id", { count: "exact", head: true })
    .eq("student_id", params.id);

  if (letterCount && letterCount > 0) {
    return NextResponse.json(
      { error: "This student has a letter on file. Hide their profile instead of deleting, to protect that letter." },
      { status: 409 }
    );
  }

  // Unlink (not delete) any photos tied to this student — they move
  // to the general gallery instead of being destroyed.
  await supabaseServer
    .from("photos")
    .update({ student_id: null })
    .eq("student_id", params.id);

  const { error } = await supabaseServer.from("students").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
