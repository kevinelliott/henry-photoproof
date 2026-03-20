import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const body = await req.json();
  const { customer_id } = body;

  if (!customer_id) {
    return NextResponse.json({ error: "customer_id required" }, { status: 400 });
  }

  const stripe = getStripe();
  const origin = req.headers.get("origin") || "http://localhost:3000";

  const session = await stripe.billingPortal.sessions.create({
    customer: customer_id,
    return_url: `${origin}/dashboard`,
  });

  return NextResponse.json({ url: session.url });
}
