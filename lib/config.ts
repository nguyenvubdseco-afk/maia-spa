import fs from "fs";
import path from "path";
import { isVercel, readJsonBlob, writeJsonBlob } from "./store";

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
const BLOB_PATH = "data/site.json";

function readLocalFile(): SiteConfig {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

export async function getSiteConfig(): Promise<SiteConfig> {
  // Chỗ dự phòng cho field mới thêm sau này (vd. googleMaps) nếu dữ liệu cũ chưa có.
  const data = isVercel
    ? (await readJsonBlob<Partial<SiteConfig>>(BLOB_PATH)) ?? readLocalFile()
    : readLocalFile();
  return { googleMaps: "", ...data } as SiteConfig;
}

export async function saveSiteConfig(config: SiteConfig): Promise<void> {
  if (isVercel) {
    await writeJsonBlob(BLOB_PATH, config);
    return;
  }
  fs.writeFileSync(dataPath, JSON.stringify(config, null, 2), "utf-8");
}
