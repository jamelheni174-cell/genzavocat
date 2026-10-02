# Cabinet Me Abou Yahia Labbaoui — site bilingue FR / AR

Site vitrine d'avocat (Tunisie) inspiré de la structure de alhalees.sa, avec **paiement en ligne
pour les clients tunisiens** et interface **bilingue français / arabe (RTL)**.

Stack : **Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4**.

---

## Démarrage

```bash
npm install
npm run dev        # http://localhost:3000  (redirige vers /fr ou /ar)
npm run build && npm start
```

## Structure

```
src/
├─ app/
│  ├─ [locale]/                 # toutes les pages, fr | ar
│  │  ├─ page.tsx               # accueil
│  │  ├─ cabinet/               # le cabinet / عن المكتب
│  │  ├─ services/entreprises   # خدمات الشركات
│  │  ├─ services/particuliers  # خدمات الأفراد
│  │  ├─ honoraires/            # tarifs + moyens de paiement
│  │  ├─ paiement/              # formulaire de paiement
│  │  │  ├─ confirmation/       # retour du prestataire (succès / échec)
│  │  │  └─ simulation/         # tunnel simulé (mode démo uniquement)
│  │  ├─ rendez-vous/           # demande de rendez-vous
│  │  ├─ blog/[slug]/           # articles juridiques
│  │  ├─ contact/
│  │  └─ mentions-legales | confidentialite | conditions-generales
│  └─ api/
│     ├─ payment/create         # initialise la transaction
│     ├─ payment/webhook        # notification du prestataire
│     ├─ payment/confirm        # vérification de statut
│     └─ contact                # formulaires contact & rendez-vous
├─ components/                  # Header, Footer, formulaires, UI
├─ content/
│  ├─ site.ts                   # ☎️ coordonnées du cabinet (à personnaliser)
│  ├─ fr.ts                     # tous les textes français
│  └─ ar.ts                     # tous les textes arabes
└─ lib/
   ├─ i18n.ts                   # locales, routes
   ├─ payment.ts                # Konnect / Paymee / démo
   └─ orders.ts                 # persistance des commandes (.data/*.json)
```

## Bilinguisme

- URLs préfixées : `/fr/...` et `/ar/...`
- Le middleware redirige `/` vers la langue du navigateur (cookie `NEXT_LOCALE` prioritaire).
- La version arabe bascule automatiquement en `dir="rtl"` avec la police **Noto Kufi Arabic / Amiri**.
- **Tous les textes** sont dans `src/content/fr.ts` et `src/content/ar.ts` : les deux fichiers ont
  exactement la même structure (TypeScript le vérifie à la compilation).

## Paiement en ligne (Tunisie)

Trois modes, choisis automatiquement selon les variables d'environnement (voir `.env.example`) :

| Mode | Variables | Usage |
|---|---|---|
| **Konnect** | `KONNECT_API_KEY`, `KONNECT_WALLET_ID` | Cartes bancaires TN, e-Dinar, wallets (Flouci/D17) |
| **Paymee** | `PAYMEE_API_KEY`, `PAYMEE_VENDOR` | Cartes TN + Visa/Mastercard internationales |
| **Démo** | aucune clé | Tunnel simulé — aucun débit réel |

Parcours : formulaire → `POST /api/payment/create` → redirection vers la page sécurisée du
prestataire → retour sur `/[locale]/paiement/confirmation` → vérification serveur du statut
(+ webhook `/api/payment/webhook`).

Aucune donnée de carte bancaire ne transite par ce serveur.

### Passer en production

1. Ouvrir un compte marchand (Konnect ou Paymee) et récupérer les clés.
2. Copier `.env.example` vers `.env.local` et renseigner les clés + `NEXT_PUBLIC_SITE_URL`.
3. Basculer les URLs d'API sandbox → production.
4. Déclarer l'URL de webhook `https://votre-domaine.tn/api/payment/webhook` chez le prestataire.

## À personnaliser avant mise en ligne

- `src/content/site.ts` : téléphone, WhatsApp, e-mail, adresse, réseaux sociaux, lien Google Maps.
- `src/content/fr.ts` / `ar.ts` : biographie, parcours, tarifs, articles de blog, témoignages.
- `public/images/` : remplacer les visuels générés par les vraies photos du cabinet.
- `src/app/api/contact/route.ts` : brancher l'envoi d'e-mail (SMTP, Resend, Sendgrid…).
  Les messages sont pour l'instant enregistrés dans `.data/` (non versionné).

## Notes

- Les tarifs affichés (120 / 180 / 350 / 500 TND) sont des exemples à ajuster.
- SEO : métadonnées par page, `hreflang` fr/ar, `sitemap.xml`, `robots.txt`, JSON-LD `LegalService`.
