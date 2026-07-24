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

export async function GET(req: NextRequest) {
  const user = await checkAdmin(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseServer
    .from("letters")
    .select("id, unlock_date, created_at, contact_number, email, approved, students(full_name)")
    .eq("approved", false)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const pending = (data ?? []).map((l: any) => ({
    id: l.id,
    student_name: l.students?.full_name ?? "Unknown",
    unlock_date: l.unlock_date,
    created_at: l.created_at,
    contact_number: l.contact_number,
    email: l.email,
  }));

  return NextResponse.json({ letters: pending });
}
