import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbProps) {
  const fullItems = [{ name: "Home", url: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: fullItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://civara-jewels.vercel.app${item.url}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-xs font-light text-[#6E6459] py-4">
        <ol className="flex flex-wrap items-center gap-2">
          {fullItems.map((item, idx) => {
            const isLast = idx === fullItems.length - 1;
            return (
              <li key={item.url} className="inline-flex items-center gap-2">
                {idx > 0 && <ChevronRight className="w-3 h-3 text-[#9E7F3C]" />}
                {isLast ? (
                  <span className="font-medium text-[#241F1B]">{item.name}</span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-[#9E7F3C] transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
