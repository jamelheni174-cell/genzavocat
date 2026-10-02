import Link from "next/link";

export default function NotFound() {
  return (
    <section className="grid min-h-[60vh] place-items-center px-6 py-24 text-center">
      <div>
        <p className="font-display text-7xl font-semibold text-gold-500">404</p>
        <p className="mt-4 text-lg text-ink-800/75">Page introuvable — الصفحة غير موجودة</p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/fr" className="rounded-sm bg-ink-900 px-6 py-3 text-sm font-semibold text-cream-50">
            Accueil
          </Link>
          <Link href="/ar" className="rounded-sm border border-ink-900/20 px-6 py-3 text-sm font-semibold text-ink-900">
            الرئيسية
          </Link>
        </div>
      </div>
    </section>
  );
}
