import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

// Verifies the dashboard password (server-side) and sets an httpOnly session
// cookie. Password never reaches the client bundle.
export async function POST(req: NextRequest) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.DASHBOARD_PASSWORD || "bmi-admin";
  if (!password || password !== expected) {
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }
  const store = await cookies();
  store.set("scolrly_admin", process.env.DASHBOARD_COOKIE || "bmi-authenticated", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete("scolrly_admin");
  return Response.json({ ok: true });
}
