import Image from "next/image";
import type { SiteConfig } from "@/lib/config";
import { ensureAbsoluteUrl, getZaloUrl } from "@/lib/urls";
import { FacebookIcon, MapPinIcon, PhoneIcon } from "@/components/icons/SocialIcons";

export default function Footer({ siteConfig }: { siteConfig: SiteConfig }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-[#DFD7D4] px-6 py-12 text-center">
      <div className="flex flex-col items-center mb-4">
        <Image
          src="/images/logo.png"
          alt={siteConfig.name}
          width={1419}
          height={704}
          className="h-16 w-auto"
        />
      </div>

      <p className="font-script text-[#FEF1E5] text-[clamp(0.8rem,4vw,1.875rem)] max-w-xl mx-auto leading-relaxed">
        {siteConfig.footerQuoteLine1}
        <br />
        {siteConfig.footerQuoteLine2}
      </p>

      <div className="flex justify-center gap-3 my-6">
        <a
          href={ensureAbsoluteUrl(siteConfig.facebook)}
          target="_blank"
          rel="noopener noreferrer"
          title="Facebook"
          className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md bg-[#1877F2] hover:opacity-90 transition-opacity"
        >
          <FacebookIcon className="w-4 h-4" />
        </a>
        <a
          href={getZaloUrl(siteConfig.zalo)}
          target="_blank"
          rel="noopener noreferrer"
          title="Zalo"
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shadow-md bg-[#0068FF] hover:opacity-90 transition-opacity"
        >
          Zalo
        </a>
        <a
          href={ensureAbsoluteUrl(siteConfig.googleMaps)}
          target="_blank"
          rel="noopener noreferrer"
          title="Google Maps"
          className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md bg-[#34A853] hover:opacity-90 transition-opacity"
        >
          <MapPinIcon className="w-4 h-4" />
        </a>
        <a
          href={`tel:${siteConfig.phone || "#"}`}
          title="Gọi điện"
          className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md bg-[#EA4335] hover:opacity-90 transition-opacity"
        >
          <PhoneIcon className="w-4 h-4" />
        </a>
      </div>

      <hr className="border-white/15 max-w-xl mx-auto my-6" />

      <div className="max-w-xl mx-auto text-sm text-[#B0A9A6] space-y-1">
        <p>
          {siteConfig.name} trực thuộc <strong>{siteConfig.legalName}</strong>
        </p>
        <p>
          Địa chỉ: {siteConfig.address} &nbsp;|&nbsp; Điện thoại: {siteConfig.phone}
        </p>
        <p>
          &copy; {year} {siteConfig.name}. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
