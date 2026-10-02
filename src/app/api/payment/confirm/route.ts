import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { getProvider, verifyPayment } from "@/lib/payment";

export const runtime = "nodejs";

/** Utilisé par la page de confirmation (et par la simulation en mode démo). */
export async function POST(request: Request) {
  const { orderId, simulate } = (await request.json()) as { orderId?: string; simulate?: "paid" | "failed" };
  if (!orderId) return NextResponse.json({ error: "orderId" }, { status: 400 });

  const order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: "notfound" }, { status: 404 });

  if (getProvider() === "demo" && simulate) {
    const updated = await updateOrder(order.id, { status: simulate });
    return NextResponse.json({ status: updated?.status ?? "pending" });
  }

  const status = order.providerRef ? await verifyPayment(order.providerRef) : order.status;
  if (status !== order.status) await updateOrder(order.id, { status });
  return NextResponse.json({ status });
}
