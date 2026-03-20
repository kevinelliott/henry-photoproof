import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("galleries")
    .select("*, photos(count)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = createServiceClient();
  const body = await req.json();
  const { title, client_name, client_email, shoot_date } = body;

  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const { data, error } = await supabase
    .from("galleries")
    .insert({ title, client_name, client_email, shoot_date, user_id: null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
