import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://foliopage.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "foliopage",
    template: "%s | foliopage",
  },
  description:
    "Resume-first portfolio pages for students and early-career builders.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "foliopage",
    description:
      "Resume-first portfolio pages for students and early-career builders.",
    siteName: "foliopage",
  },
  twitter: {
    card: "summary_large_image",
    title: "foliopage",
    description:
      "Resume-first portfolio pages for students and early-career builders.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/logo.ico" sizes="any" />
      <body
        className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
