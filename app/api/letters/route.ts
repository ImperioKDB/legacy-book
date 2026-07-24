import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { full_name, letter_text, unlock_date, contact_number, email } = body;

  if (!full_name || !letter_text || !unlock_date || !contact_number || !email) {
    return NextResponse.json(
      { error: "All fields are required, including contact number and email." },
      { status: 400 }
    );
  }

  function normalize(name: string) {
    return name.trim().toLowerCase().split(/\s+/).filter(Boolean).sort().join(" ");
  }

  const typedName = normalize(full_name);

  const { data: students } = await supabaseServer
    .from("students")
    .select("id, full_name")
    .eq("approved", true);

  const match = (students ?? []).find((s) => normalize(s.full_name) === typedName);

  if (!match) {
    return NextResponse.json(
      {
        error:
          "Only Final Year Brethren can submit a letter here. Please enter your full name exactly as it appears on your profile.",
      },
      { status: 403 }
    );
  }

  const { error } = await supabaseServer.from("letters").insert({
    student_id: match.id,
    letter_text,
    unlock_date,
    contact_number,
    email,
    approved: false,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
