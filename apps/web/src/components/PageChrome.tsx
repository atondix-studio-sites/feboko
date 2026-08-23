import Link from "next/link";

export function ServiceHero({
  title,
  ctaHref,
  ctaLabel,
  containerClass = "container",
}: {
  title: string;
  ctaHref: string;
  ctaLabel: string;
  containerClass?: string;
}) {
  return (
    <section className={`service-hero ${containerClass}`}>
      <h1 className="page-title">{title}</h1>
      <Link className="btn-primary" href={ctaHref}>{ctaLabel}</Link>
    </section>
  );
}

type Crumb = { href?: string; label: string; current?: boolean };

export function Breadcrumbs({
  items,
  containerClass = "container",
}: {
  items: Crumb[];
  containerClass?: string;
}) {
  return (
    <section className={`${containerClass} breadcrumbs`}>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`}>
          {item.current || !item.href ? (
            <span className={item.current ? "current" : undefined}>{item.label}</span>
          ) : (
            <Link href={item.href}>{item.label}</Link>
          )}
          {i < items.length - 1 && <span> › </span>}
        </span>
      ))}
    </section>
  );
}
