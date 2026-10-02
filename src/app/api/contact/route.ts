import { NextResponse } from "next/server";
import { appendSubmission } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string>;
    const kind = body.kind === "appointment" ? "appointment" : "contact";
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();

    if (name.length < 3) return NextResponse.json({ error: "name" }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "email" }, { status: 400 });

    await appendSubmission(kind, body);
    // TODO production : brancher ici l'envoi d'e-mail (SMTP / Resend / Sendgrid)
    console.log(`[${kind}]`, { name, email });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }
}
