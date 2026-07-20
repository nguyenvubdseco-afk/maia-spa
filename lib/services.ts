import fs from "fs";
import path from "path";
import { isVercel, readJsonBlob, writeJsonBlob } from "./store";

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
const BLOB_PATH = "data/services.json";

function readLocalFile(): Service[] {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

export async function getServices(): Promise<Service[]> {
  if (isVercel) {
    const blobData = await readJsonBlob<Service[]>(BLOB_PATH);
    return blobData ?? readLocalFile();
  }
  return readLocalFile();
}

export async function saveServices(services: Service[]): Promise<void> {
  if (isVercel) {
    await writeJsonBlob(BLOB_PATH, services);
    return;
  }
  fs.writeFileSync(dataPath, JSON.stringify(services, null, 2), "utf-8");
}

export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  const services = await getServices();
  return services.find((s) => s.slug === slug);
}
