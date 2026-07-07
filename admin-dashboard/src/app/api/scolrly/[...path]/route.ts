// Server-side proxy to the Scolrly API. The admin key stays in the Node
// environment and is never shipped to the browser bundle.
import type { NextRequest } from "next/server";

const API_URL = process.env.SCOLRLY_API_URL || "http://localhost:4000";
const ADMIN_KEY = process.env.SCOLRLY_ADMIN_KEY || "scolrly-admin-dev";

async function proxy(req: NextRequest, params: Promise<{ path: string[] }>) {
  const { path } = await params;
  const search = req.nextUrl.search || "";
  const target = `${API_URL}/api/${path.join("/")}${search}`;
  try {
    const res = await fetch(target, {
      method: req.method,
      headers: {
        "content-type": "application/json",
        "x-admin-key": ADMIN_KEY,
      },
      body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.text(),
      cache: "no-store",
    });
    const body = await res.text();
    return new Response(body, {
      status: res.status,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return Response.json(
      { error: "Scolrly API unreachable — is the server running on :4000?" },
      { status: 502 },
    );
  }
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params);
}
export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params);
}
export async function PUT(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params);
}
export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, ctx.params);
}
