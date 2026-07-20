import fs from "fs";
import path from "path";

export interface Service {
  slug: string;
  name: string;
  duration: string;
  price?: string;
  image: string;
  summary: string;
  description: string;
}

const dataPath = path.join(process.cwd(), "data", "services.json");

export function getServices(): Service[] {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

export function saveServices(services: Service[]): void {
  fs.writeFileSync(dataPath, JSON.stringify(services, null, 2), "utf-8");
}

export function getServiceBySlug(slug: string): Service | undefined {
  return getServices().find((s) => s.slug === slug);
}
