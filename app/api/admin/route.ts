import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

function checkAuth(req: Request) {
  const key = req.headers.get("X-Admin-Key") || req.headers.get("x-admin-key");
  const expected = process.env.ADMIN_API_KEY || "";
  if (!expected) return true; // demo mode
  return key === expected;
}

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const [galleriesRes, photosRes] = await Promise.all([
    supabase.from("galleries").select("id, status, created_at"),
    supabase.from("photos").select("id", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    galleries: galleriesRes.data?.length ?? 0,
    photos: photosRes.count ?? 0,
    status: "ok",
  });
}
