import fs from "fs";
import path from "path";

export interface SiteConfig {
  name: string;
  tagline: string;
  heroQuote: string;
  footerQuoteLine1: string;
  footerQuoteLine2: string;
  address: string;
  phone: string;
  zalo: string;
  facebook: string;
  googleMaps: string;
  openingHours: string;
  legalName: string;
  promoTitle: string;
  promoItems: string[];
  heroImage: string;
  voucherImage: string;
}

const dataPath = path.join(process.cwd(), "data", "site.json");

export function getSiteConfig(): SiteConfig {
  const raw = fs.readFileSync(dataPath, "utf-8");
  const parsed = JSON.parse(raw);
  // Chỗ dự phòng cho field mới thêm sau này (vd. googleMaps) nếu site.json cũ chưa có.
  return { googleMaps: "", ...parsed };
}

export function saveSiteConfig(config: SiteConfig): void {
  fs.writeFileSync(dataPath, JSON.stringify(config, null, 2), "utf-8");
}
