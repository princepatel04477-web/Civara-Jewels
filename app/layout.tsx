import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "./context/CurrencyContext";
import { AnnouncementBar } from "./components/AnnouncementBar";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MobileBottomNav } from "./components/MobileBottomNav";

// Optimized font loading (P3-1 font waterfall diet)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-jost",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://civara-jewels.vercel.app"),
  title: {
    default: "Civara Jewels — Fine Jewellery Atelier",
    template: "%s | Civara Jewels",
  },
  description:
    "Heirlooms in hallmarked 18k recycled gold and certified diamonds. Made to order. Private viewings in Surat and virtual HD worldwide.",
  keywords: [
    "fine jewellery",
    "18k recycled gold",
    "diamond solitaire",
    "custom bespoke ring",
    "BIS 750 hallmark",
    "GIA certified diamonds",
    "Civara Jewels",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Civara Jewels — Fine Jewellery Atelier",
    description:
      "Heirlooms in hallmarked 18k recycled gold and certified diamonds. Made to order. Private viewings in Surat and virtual HD worldwide.",
    url: "https://civara-jewels.vercel.app",
    siteName: "Civara Jewels",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/home-cc/Rings-cc.png",
        width: 1200,
        height: 630,
        alt: "Civara Jewels Fine Jewellery Atelier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Civara Jewels — Fine Jewellery Atelier",
    description:
      "Heirlooms in hallmarked 18k recycled gold and certified diamonds. Made to order. Private viewings in Surat and virtual HD worldwide.",
    images: ["/images/home-cc/Rings-cc.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://civara-jewels.vercel.app/#organization",
        name: "Civara Jewels",
        url: "https://civara-jewels.vercel.app",
        logo: "https://civara-jewels.vercel.app/images/home-cc/Rings-cc.png",
        description:
          "Made-to-order fine jewellery atelier crafting bespoke heirlooms in hallmarked 18K recycled gold and certified diamonds.",
        knowsAbout: [
          "Fine Jewellery",
          "18K Gold",
          "Solitaire Diamonds",
          "BIS 750 Hallmark",
          "GIA & IGI Diamonds",
          "Bespoke Jewellery",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Surat",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://civara-jewels.vercel.app/#website",
        url: "https://civara-jewels.vercel.app",
        name: "Civara Jewels Atelier",
        publisher: {
          "@id": "https://civara-jewels.vercel.app/#organization",
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="bg-[#FAF7F0] text-[#211C15] font-sans antialiased min-h-screen flex flex-col selection:bg-[#9E7F3C] selection:text-[#FAF7F0]">
        <CurrencyProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-grow pb-16 lg:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
        </CurrencyProvider>
      </body>
    </html>
  );
}
