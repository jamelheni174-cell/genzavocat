import Link from "next/link";
import type { ReactNode } from "react";
import { IconArrow } from "./Icons";

export function Kicker({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] ${
        light ? "text-gold-400" : "text-gold-600"
      }`}
    >
      <span className="h-px w-8 bg-current" />
      {children}
    </span>
  );
}

export function SectionHeading({
  kicker,
  title,
  text,
  light = false,
  center = false,
}: {
  kicker?: string;
  title: string;
  text?: string;
  light?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {kicker ? <Kicker light={light}>{kicker}</Kicker> : null}
      <h2
        className={`mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.6rem] ${
          light ? "text-cream-50" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {text ? (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-cream-100/75" : "text-ink-800/75"}`}>{text}</p>
      ) : null}
    </div>
  );
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "dark";
  className?: string;
}) {
  const styles = {
    primary: "bg-gold-500 text-ink-950 hover:bg-gold-400",
    dark: "bg-ink-900 text-cream-50 hover:bg-ink-800",
    outline: "border border-ink-900/25 text-ink-900 hover:border-gold-500 hover:text-gold-600",
    ghost: "border border-cream-100/35 text-cream-50 hover:border-gold-500 hover:text-gold-400",
  }[variant];

  const isExternal = href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
  const content = (
    <>
      {children}
      <IconArrow className="flip-rtl h-4 w-4" />
    </>
  );
  const cls = `inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-sm font-semibold transition ${styles} ${className}`;

  if (isExternal) {
    return (
      <a href={href} className={cls}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}

export function PageHero({
  kicker,
  title,
  text,
  breadcrumb,
}: {
  kicker?: string;
  title: string;
  text?: string;
  breadcrumb?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-20 text-cream-50 sm:py-24">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, #c8a24a 0, transparent 45%), radial-gradient(circle at 85% 80%, #c8a24a 0, transparent 40%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        {kicker ? <Kicker light>{kicker}</Kicker> : null}
        <h1 className="mt-5 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-5xl">{title}</h1>
        {text ? <p className="mt-5 max-w-2xl text-base leading-relaxed text-cream-100/75">{text}</p> : null}
        {breadcrumb ? <div className="mt-6 text-sm text-cream-100/55">{breadcrumb}</div> : null}
      </div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card-shadow rounded-md border border-cream-200 bg-white p-7 ${className}`}>{children}</div>
  );
}
