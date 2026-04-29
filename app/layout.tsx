import type { Metadata } from "next";
import Script from "next/script";
import { Source_Serif_4, Inter, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "mapbox-gl/dist/mapbox-gl.css";
import "./globals.css";

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksour.org";
const GA_ID = "G-DXLPXX7QH2";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Ksour — A synthesis archive of earthen architectural heritage",
    template: "%s — Ksour",
  },
  description:
    "A digital synthesis archive of earthen architectural heritage across the Saharan-Maghreb region: kasbahs, ksour, igherman, agadirs, tighremts, and ghorfas across Morocco, Mauritania, Algeria, Libya, Tunisia, Mali, and Niger.",
  applicationName: "Ksour",
  keywords: [
    "kasbah",
    "ksar",
    "ksour",
    "igherm",
    "agadir",
    "tighremt",
    "ghorfa",
    "earthen architecture",
    "pisé",
    "rammed earth",
    "adobe",
    "Saharan-Maghreb",
    "Morocco",
    "Mauritania",
    "Algeria",
    "Tunisia",
    "Libya",
    "Mali",
    "Niger",
    "vernacular architecture",
    "heritage conservation",
    "UNESCO World Heritage",
    "Drâa Valley",
    "CERKAS",
    "Getty Conservation Institute",
  ],
  authors: [{ name: "Ksour Archive" }],
  creator: "Ksour Archive",
  publisher: "Ksour Archive",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: SITE,
    siteName: "Ksour",
    title: "Ksour — A synthesis archive of earthen architectural heritage",
    description:
      "Synthesis archive of earthen architectural heritage across the Saharan-Maghreb region.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ksour",
    description:
      "Synthesis archive of earthen architectural heritage across the Saharan-Maghreb region.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  category: "architecture",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { anonymize_ip: true });
          `}
        </Script>
      </body>
    </html>
  );
}
