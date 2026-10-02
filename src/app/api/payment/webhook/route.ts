import { NextResponse } from "next/server";
import { updateOrder, getOrder } from "@/lib/orders";
import { verifyPayment } from "@/lib/payment";

export const runtime = "nodejs";

/** Konnect appelle le webhook en GET avec ?payment_ref=... */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const paymentRef = url.searchParams.get("payment_ref");
  const orderId = url.searchParams.get("order");
  const key = paymentRef || orderId;
  if (!key) return NextResponse.json({ ok: false }, { status: 400 });

  const order = await getOrder(key);
  const ref = order?.providerRef || paymentRef;
  const status = ref ? await verifyPayment(ref) : "pending";
  if (order) await updateOrder(order.id, { status: status === "paid" ? "paid" : order.status });
  return NextResponse.json({ ok: true, status });
}

/** Paymee envoie un POST JSON. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const token = String(body.token ?? body.payment_ref ?? "");
    const orderId = String(body.order_id ?? new URL(request.url).searchParams.get("order") ?? "");
    const paid = body.payment_status === true || body.check_sum !== undefined;
    const order = await getOrder(orderId || token);
    if (order) {
      const status = paid ? "paid" : await verifyPayment(order.providerRef || token);
      await updateOrder(order.id, { status: status === "paid" ? "paid" : "pending" });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
