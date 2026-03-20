import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = await createServerSupabaseClient();
  const body = await req.json();
  const { selected_photo_ids } = body;

  const { data, error } = await supabase
    .from("sessions")
    .update({
      status: "approved",
      selected_photo_ids,
      approved_at: new Date().toISOString(),
    })
    .eq("token", token)
    .eq("status", "pending")
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Session not found or already approved" }, { status: 404 });

  return NextResponse.json(data);
}
