import { promises as fs } from "node:fs";
import path from "node:path";

export type OrderStatus = "pending" | "paid" | "failed";

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  provider: string;
  providerRef: string | null;
  status: OrderStatus;
  amountTND: number;
  locale: string;
  packageId: string | null;
  packageName: string | null;
  name: string;
  email: string;
  phone: string;
  reference?: string;
  message?: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "orders.json");

async function readAll(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

async function writeAll(orders: Order[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(orders, null, 2), "utf8");
}

export async function saveOrder(order: Order) {
  const orders = await readAll();
  orders.unshift(order);
  await writeAll(orders.slice(0, 500));
}

export async function updateOrder(id: string, patch: Partial<Order>) {
  const orders = await readAll();
  const index = orders.findIndex((o) => o.id === id || o.providerRef === id);
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...patch, updatedAt: new Date().toISOString() };
  await writeAll(orders);
  return orders[index];
}

export async function getOrder(id: string) {
  const orders = await readAll();
  return orders.find((o) => o.id === id || o.providerRef === id) ?? null;
}

/** Enregistre un message de contact ou une demande de rendez-vous. */
export async function appendSubmission(kind: "contact" | "appointment", payload: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, `${kind}.json`);
  let list: unknown[] = [];
  try {
    list = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    list = [];
  }
  list.unshift({ receivedAt: new Date().toISOString(), ...(payload as object) });
  await fs.writeFile(file, JSON.stringify(list.slice(0, 500), null, 2), "utf8");
}
