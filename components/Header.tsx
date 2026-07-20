"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SearchBox from "./SearchBox";
import NotificationBell from "./admin/NotificationBell";
import { navLinks } from "@/lib/site";
import type { SiteConfig } from "@/lib/config";
import { getZaloUrl } from "@/lib/urls";

export default function Header({
  siteConfig,
  isAdmin = false,
}: {
  siteConfig: SiteConfig;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-creamLight">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt={siteConfig.name}
            width={1419}
            height={704}
            priority
            className="h-11 sm:h-12 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-body text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="link-hover hover:text-primary transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <NotificationBell onClick={() => router.push("/admin?tab=contacts")} />
          )}
          <SearchBox />
          <Link
            href="/lien-he"
            className="hidden sm:inline-block bg-primary text-white font-body text-sm px-5 py-2.5 rounded-full hover:bg-secondary transition-colors"
          >
            Đặt Lịch
          </Link>
          <a
            href={getZaloUrl(siteConfig.zalo)}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block border-2 border-primary text-primary font-body text-sm px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            Liên hệ ngay
          </a>
          <button
            className="md:hidden text-heading"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden bg-white border-t border-creamLight px-4 py-3 flex flex-col gap-3 font-body text-sm">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="link-hover">
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2">
            <Link
              href="/lien-he"
              onClick={() => setOpen(false)}
              className="flex-1 bg-primary text-white text-center px-4 py-2.5 rounded-full"
            >
              Đặt Lịch
            </Link>
            <a
              href={getZaloUrl(siteConfig.zalo)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex-1 border-2 border-primary text-primary text-center px-4 py-2 rounded-full"
            >
              Liên hệ ngay
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
