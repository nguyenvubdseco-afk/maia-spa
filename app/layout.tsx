import type { Metadata } from "next";
import { Prata, Josefin_Sans, Alex_Brush } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingContacts from "@/components/FloatingContacts";
import { getSiteConfig } from "@/lib/config";
import { isAdminAuthenticated } from "@/lib/adminAuth";

// Prata & Josefin Sans có hỗ trợ subset "vietnamese" đầy đủ (Marcellus/Tenor Sans
// trước đây không có, khiến dấu tiếng Việt bị fallback sang font hệ thống).
const headingFont = Prata({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-heading",
});

const bodyFont = Josefin_Sans({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-body",
});

const alexBrush = Alex_Brush({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-alex-brush",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = getSiteConfig();
  return {
    title: `${siteConfig.name} – ${siteConfig.tagline}`,
    description: siteConfig.tagline,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = getSiteConfig();
  const isAdmin = await isAdminAuthenticated();

  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${headingFont.variable} ${bodyFont.variable} ${alexBrush.variable} font-body`}
      >
        <Header siteConfig={siteConfig} isAdmin={isAdmin} />
        {children}
        <FloatingContacts siteConfig={siteConfig} />
        <Footer siteConfig={siteConfig} />
      </body>
    </html>
  );
}
