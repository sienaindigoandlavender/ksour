import type { Metadata } from "next";
import { Source_Serif_4, Inter, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ksour.org";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ksour — A synthesis archive of earthen architectural heritage",
    template: "%s · Ksour",
  },
  description:
    "A digital synthesis archive of earthen architectural heritage across the Saharan-Maghreb region: Morocco, Mauritania, Algeria, Libya, Tunisia, Mali, Niger.",
  openGraph: {
    type: "website",
    siteName: "Ksour",
    url: siteUrl,
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
