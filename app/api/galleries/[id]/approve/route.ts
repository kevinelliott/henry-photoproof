import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: gallery, error } = await supabase
    .from("galleries")
    .select("*, photos(*)")
    .eq("id", id)
    .single();

  if (error || !gallery) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(gallery);
}

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("galleries")
    .update({ status: "client_approved", approved_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Gallery not found" }, { status: 404 });

  return NextResponse.json(data);
}
