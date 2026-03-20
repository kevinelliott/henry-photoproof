import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

const TOOLS = [
  {
    name: "list_galleries",
    description: "List all photo proof galleries",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "get_gallery",
    description: "Get a gallery by token",
    inputSchema: {
      type: "object",
      properties: { token: { type: "string" } },
      required: ["token"],
    },
  },
];

export async function POST(req: Request) {
  const body = await req.json();
  const { method, params, id } = body;

  if (method === "initialize") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "henry-photoproof", version: "1.0.0" },
      },
    });
  }

  if (method === "tools/list") {
    return NextResponse.json({ jsonrpc: "2.0", id, result: { tools: TOOLS } });
  }

  if (method === "tools/call") {
    const { name, arguments: args } = params;
    const supabase = createServiceClient();

    if (name === "list_galleries") {
      const { data } = await supabase
        .from("galleries")
        .select("id, title, client_name, status, token, created_at")
        .order("created_at", { ascending: false });
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] },
      });
    }

    if (name === "get_gallery") {
      const { data } = await supabase
        .from("galleries")
        .select("*, photos(*)")
        .eq("token", args.token)
        .single();
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] },
      });
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: "Tool not found" },
    });
  }

  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found" },
  });
}
