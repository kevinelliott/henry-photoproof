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
    supabase.from("galleries").select("id, status"),
    supabase.from("photos").select("id", { count: "exact", head: true }),
  ]);

  const galleries = galleriesRes.data ?? [];
  const byStatus = galleries.reduce((acc: Record<string, number>, g) => {
    acc[g.status] = (acc[g.status] ?? 0) + 1;
    return acc;
  }, {});

  return NextResponse.json({
    total_galleries: galleries.length,
    total_photos: photosRes.count ?? 0,
    by_status: byStatus,
  });
}
