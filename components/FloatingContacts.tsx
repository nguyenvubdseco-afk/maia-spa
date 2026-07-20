import type { SiteConfig } from "@/lib/config";
import { ensureAbsoluteUrl, getZaloUrl } from "@/lib/urls";
import { FacebookIcon, MapPinIcon, PhoneIcon } from "@/components/icons/SocialIcons";

export default function FloatingContacts({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <div className="fixed left-4 bottom-4 z-50 flex flex-col gap-2.5">
      <a
        href={ensureAbsoluteUrl(siteConfig.facebook)}
        target="_blank"
        rel="noopener noreferrer"
        title="Facebook"
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg bg-[#1877F2]"
      >
        <FacebookIcon className="w-6 h-6" />
      </a>
      <a
        href={ensureAbsoluteUrl(siteConfig.googleMaps)}
        target="_blank"
        rel="noopener noreferrer"
        title="Google Maps"
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg bg-[#34A853]"
      >
        <MapPinIcon className="w-6 h-6" />
      </a>
      <a
        href={getZaloUrl(siteConfig.zalo)}
        target="_blank"
        rel="noopener noreferrer"
        title="Zalo"
        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xs shadow-lg bg-[#0068FF]"
      >
        Zalo
      </a>
      <a
        href={`tel:${siteConfig.phone || "#"}`}
        title="Gọi điện"
        className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg bg-[#EA4335] animate-spa-pulse"
      >
        <PhoneIcon className="w-6 h-6" />
      </a>
    </div>
  );
}
