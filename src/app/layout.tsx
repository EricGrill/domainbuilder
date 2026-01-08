import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brandspark - Spark Your Startup | AI Domain Name Generator",
  description:
    "Find the perfect domain name for your startup with AI-powered suggestions, real-time availability checking, and visual brand previews. Better than BustaName.",
  keywords: [
    "domain name generator",
    "domain search",
    "startup naming",
    "AI domain names",
    "brand name generator",
    "available domains",
  ],
  authors: [{ name: "Brandspark" }],
  openGraph: {
    title: "Brandspark - Spark Your Startup",
    description:
      "AI-powered domain name discovery for founders. Find brandable domains in seconds.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brandspark - AI Domain Name Generator",
    description:
      "Find the perfect domain name for your startup with AI-powered suggestions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-[var(--background)]">
        {children}
      </body>
    </html>
  );
}
