import fs from "fs";
import path from "path";

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

export function getContacts(): ContactSubmission[] {
  if (!fs.existsSync(dataPath)) return [];
  const raw = fs.readFileSync(dataPath, "utf-8");
  try {
    return normalize(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function addContact(
  entry: Omit<ContactSubmission, "id" | "createdAt" | "read">
): ContactSubmission {
  const submission: ContactSubmission = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const contacts = getContacts();
  contacts.unshift(submission);
  fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2), "utf-8");
  return submission;
}

export function deleteContact(id: string): boolean {
  const contacts = getContacts();
  const next = contacts.filter((c) => c.id !== id);
  if (next.length === contacts.length) return false;
  fs.writeFileSync(dataPath, JSON.stringify(next, null, 2), "utf-8");
  return true;
}

export function markAllContactsRead(type?: ContactType): void {
  const contacts = getContacts().map((c) =>
    !type || c.type === type ? { ...c, read: true } : c
  );
  fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2), "utf-8");
}

export function markContactRead(id: string): boolean {
  const contacts = getContacts();
  const target = contacts.find((c) => c.id === id);
  if (!target) return false;
  target.read = true;
  fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2), "utf-8");
  return true;
}

export function getUnreadCounts(): { booking: number; job: number; total: number } {
  const contacts = getContacts();
  const booking = contacts.filter((c) => !c.read && c.type === "booking").length;
  const job = contacts.filter((c) => !c.read && c.type === "job").length;
  return { booking, job, total: booking + job };
}
