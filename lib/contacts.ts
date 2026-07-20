import fs from "fs";
import path from "path";
import { isVercel, readJsonBlob, writeJsonBlob } from "./store";

export type ContactType = "booking" | "job";

export interface ContactSubmission {
  id: string;
  type: ContactType;
  name: string;
  phone: string;
  date?: string;
  time?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const dataPath = path.join(process.cwd(), "data", "contacts.json");
const BLOB_PATH = "data/contacts.json";

/** Chuẩn hoá dữ liệu cũ (trước khi có field type/read) — coi như đã đọc rồi. */
function normalize(raw: unknown[]): ContactSubmission[] {
  return raw.map((item) => {
    const c = item as Partial<ContactSubmission>;
    return {
      id: c.id ?? "",
      type: c.type === "job" ? "job" : "booking",
      name: c.name ?? "",
      phone: c.phone ?? "",
      date: c.date,
      time: c.time,
      message: c.message ?? "",
      read: c.read ?? true,
      createdAt: c.createdAt ?? new Date().toISOString(),
    };
  });
}

async function readRaw(): Promise<unknown[]> {
  if (isVercel) {
    return (await readJsonBlob<unknown[]>(BLOB_PATH)) ?? [];
  }
  if (!fs.existsSync(dataPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  } catch {
    return [];
  }
}

async function writeRaw(contacts: ContactSubmission[]): Promise<void> {
  if (isVercel) {
    await writeJsonBlob(BLOB_PATH, contacts);
    return;
  }
  fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2), "utf-8");
}

export async function getContacts(): Promise<ContactSubmission[]> {
  return normalize(await readRaw());
}

export async function addContact(
  entry: Omit<ContactSubmission, "id" | "createdAt" | "read">
): Promise<ContactSubmission> {
  const submission: ContactSubmission = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const contacts = await getContacts();
  contacts.unshift(submission);
  await writeRaw(contacts);
  return submission;
}

export async function deleteContact(id: string): Promise<boolean> {
  const contacts = await getContacts();
  const next = contacts.filter((c) => c.id !== id);
  if (next.length === contacts.length) return false;
  await writeRaw(next);
  return true;
}

export async function markAllContactsRead(type?: ContactType): Promise<void> {
  const contacts = (await getContacts()).map((c) =>
    !type || c.type === type ? { ...c, read: true } : c
  );
  await writeRaw(contacts);
}

export async function markContactRead(id: string): Promise<boolean> {
  const contacts = await getContacts();
  const target = contacts.find((c) => c.id === id);
  if (!target) return false;
  target.read = true;
  await writeRaw(contacts);
  return true;
}

export async function getUnreadCounts(): Promise<{ booking: number; job: number; total: number }> {
  const contacts = await getContacts();
  const booking = contacts.filter((c) => !c.read && c.type === "booking").length;
  const job = contacts.filter((c) => !c.read && c.type === "job").length;
  return { booking, job, total: booking + job };
}
