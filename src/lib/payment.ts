/**
 * Couche de paiement — Tunisie.
 *
 * Trois modes, choisis automatiquement selon les variables d'environnement :
 *  1. Konnect  (KONNECT_API_KEY + KONNECT_WALLET_ID)  — cartes bancaires TN, e-Dinar, wallets
 *  2. Paymee   (PAYMEE_API_KEY + PAYMEE_VENDOR)       — cartes bancaires TN et internationales
 *  3. Démo     (aucune clé configurée)                — simule le tunnel de paiement
 *
 * Aucune donnée de carte bancaire ne transite par ce serveur : le client est
 * redirigé vers la page sécurisée du prestataire.
 */

export type Provider = "konnect" | "paymee" | "demo";

export interface CreatePaymentInput {
  orderId: string;
  amountTND: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  description: string;
  locale: string;
  origin: string;
}

export interface CreatePaymentResult {
  provider: Provider;
  payUrl: string;
  providerRef: string | null;
}

export function getProvider(): Provider {
  if (process.env.KONNECT_API_KEY && process.env.KONNECT_WALLET_ID) return "konnect";
  if (process.env.PAYMEE_API_KEY) return "paymee";
  return "demo";
}

export function isDemo() {
  return getProvider() === "demo";
}

const KONNECT_URL = process.env.KONNECT_API_URL || "https://api.preprod.konnect.network/api/v2";
const PAYMEE_URL = process.env.PAYMEE_API_URL || "https://sandbox.paymee.tn/api/v2";

export async function createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
  const provider = getProvider();
  const successUrl = `${input.origin}/${input.locale}/paiement/confirmation?order=${input.orderId}&status=success`;
  const failUrl = `${input.origin}/${input.locale}/paiement/confirmation?order=${input.orderId}&status=failed`;
  const webhookUrl = `${input.origin}/api/payment/webhook?order=${input.orderId}`;

  if (provider === "konnect") {
    const response = await fetch(`${KONNECT_URL}/payments/init-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.KONNECT_API_KEY as string,
      },
      body: JSON.stringify({
        receiverWalletId: process.env.KONNECT_WALLET_ID,
        token: "TND",
        amount: Math.round(input.amountTND * 1000), // millimes
        type: "immediate",
        description: input.description,
        acceptedPaymentMethods: ["bank_card", "e-DINAR", "wallet"],
        lifespan: 30,
        checkoutForm: false,
        addPaymentFeesToAmount: false,
        firstName: input.firstName,
        lastName: input.lastName,
        phoneNumber: input.phone.replace(/\D/g, "").slice(-8),
        email: input.email,
        orderId: input.orderId,
        webhook: webhookUrl,
        silentWebhook: true,
        successUrl,
        failUrl,
        theme: "light",
      }),
    });
    if (!response.ok) {
      throw new Error(`Konnect error ${response.status}: ${await response.text()}`);
    }
    const data = (await response.json()) as { payUrl: string; paymentRef: string };
    return { provider, payUrl: data.payUrl, providerRef: data.paymentRef };
  }

  if (provider === "paymee") {
    const response = await fetch(`${PAYMEE_URL}/payments/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.PAYMEE_API_KEY}`,
      },
      body: JSON.stringify({
        vendor: process.env.PAYMEE_VENDOR ? Number(process.env.PAYMEE_VENDOR) : undefined,
        amount: Number(input.amountTND.toFixed(3)),
        note: `${input.description} — ${input.orderId}`,
        first_name: input.firstName,
        last_name: input.lastName,
        email: input.email,
        phone: input.phone,
        return_url: successUrl,
        cancel_url: failUrl,
        webhook_url: webhookUrl,
        order_id: input.orderId,
      }),
    });
    if (!response.ok) {
      throw new Error(`Paymee error ${response.status}: ${await response.text()}`);
    }
    const json = (await response.json()) as { data: { payment_url: string; token: string } };
    return { provider, payUrl: json.data.payment_url, providerRef: json.data.token };
  }

  // Mode démonstration : page de simulation interne
  return {
    provider: "demo",
    payUrl: `/${input.locale}/paiement/simulation?order=${input.orderId}`,
    providerRef: null,
  };
}

/** Vérifie l'état réel d'un paiement auprès du prestataire. */
export async function verifyPayment(providerRef: string): Promise<"paid" | "failed" | "pending"> {
  const provider = getProvider();
  try {
    if (provider === "konnect") {
      const res = await fetch(`${KONNECT_URL}/payments/${providerRef}`, {
        headers: { "x-api-key": process.env.KONNECT_API_KEY as string },
        cache: "no-store",
      });
      if (!res.ok) return "pending";
      const data = (await res.json()) as { payment?: { status?: string } };
      const status = data.payment?.status;
      if (status === "completed") return "paid";
      if (status === "failed" || status === "expired") return "failed";
      return "pending";
    }
    if (provider === "paymee") {
      const res = await fetch(`${PAYMEE_URL}/payments/${providerRef}/check`, {
        headers: { Authorization: `Token ${process.env.PAYMEE_API_KEY}` },
        cache: "no-store",
      });
      if (!res.ok) return "pending";
      const json = (await res.json()) as { data?: { payment_status?: boolean } };
      return json.data?.payment_status ? "paid" : "pending";
    }
  } catch {
    return "pending";
  }
  return "pending";
}
