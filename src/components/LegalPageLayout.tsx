import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFooter } from "@/components/SiteFooter";
import { JsonLd } from "@/components/JsonLd";
import { getSiteUrl, SITE_NAME } from "@/lib/regions";

type LegalPageLayoutProps = {
  title: string;
  description: string;
  path: string;
  breadcrumbLabel: string;
  children: ReactNode;
};

export function LegalPageLayout({
  title,
  description,
  path,
  breadcrumbLabel,
  children,
}: LegalPageLayoutProps) {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteUrl}${path}#webpage`,
    url: `${siteUrl}${path}`,
    name: title,
    description,
    inLanguage: "ko-KR",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-amber-50">
      <JsonLd data={jsonLd} />
      <header className="border-b border-rose-100 bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-3xl space-y-3 px-4 py-5 sm:px-6">
          <Breadcrumbs
            items={[
              { label: "홈", href: "/" },
              { label: breadcrumbLabel },
            ]}
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="prose-legal">{children}</div>
      </main>

      <SiteFooter />
    </div>
  );
}
