import { NextResponse } from "next/server";
import { createPayment } from "@/lib/payment";
import { saveOrder, type Order } from "@/lib/orders";

export const runtime = "nodejs";

function newId() {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `LAB-${stamp}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, string | number | boolean>;

    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const amount = Number(body.amount);
    const locale = body.locale === "ar" ? "ar" : "fr";

    if (name.length < 3) return NextResponse.json({ error: "name" }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "email" }, { status: 400 });
    if (phone.replace(/\D/g, "").length < 8) return NextResponse.json({ error: "phone" }, { status: 400 });
    if (!Number.isFinite(amount) || amount < 20 || amount > 100000) {
      return NextResponse.json({ error: "amount" }, { status: 400 });
    }

    const orderId = newId();
    const [firstName, ...rest] = name.split(" ");
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const packageName = body.packageName ? String(body.packageName) : null;

    const result = await createPayment({
      orderId,
      amountTND: amount,
      firstName: firstName || name,
      lastName: rest.join(" ") || "-",
      email,
      phone,
      description: packageName || (locale === "ar" ? "خدمة قانونية" : "Prestation juridique"),
      locale,
      origin,
    });

    const order: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      provider: result.provider,
      providerRef: result.providerRef,
      status: "pending",
      amountTND: amount,
      locale,
      packageId: body.packageId ? String(body.packageId) : null,
      packageName,
      name,
      email,
      phone,
      reference: body.reference ? String(body.reference) : undefined,
      message: body.message ? String(body.message) : undefined,
    };
    await saveOrder(order);

    return NextResponse.json({ orderId, payUrl: result.payUrl, provider: result.provider });
  } catch (error) {
    console.error("[payment/create]", error);
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }
}
