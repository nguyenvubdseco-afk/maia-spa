import fs from "fs";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";
import { isVercel, readJsonBlob, writeJsonBlob } from "./store";

const COOKIE_NAME = "admin_session";
const adminDataPath = path.join(process.cwd(), "data", "admin.json");
const sessionsPath = path.join(process.cwd(), "data", ".sessions.json");
const ADMIN_BLOB_PATH = "data/admin.json";
const SESSIONS_BLOB_PATH = "data/sessions.json";

interface AdminData {
  salt: string;
  hash: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function freshAdminData(): AdminData {
  const initialPassword = process.env.ADMIN_PASSWORD || "changeme123";
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(initialPassword, salt);
  return { salt, hash };
}

async function loadAdminData(): Promise<AdminData> {
  if (isVercel) {
    const data = await readJsonBlob<AdminData>(ADMIN_BLOB_PATH);
    if (data) return data;
    const fresh = freshAdminData();
    await writeJsonBlob(ADMIN_BLOB_PATH, fresh);
    return fresh;
  }
  if (!fs.existsSync(adminDataPath)) {
    const fresh = freshAdminData();
    fs.writeFileSync(adminDataPath, JSON.stringify(fresh, null, 2), "utf-8");
    return fresh;
  }
  return JSON.parse(fs.readFileSync(adminDataPath, "utf-8"));
}

async function saveAdminData(data: AdminData): Promise<void> {
  if (isVercel) {
    await writeJsonBlob(ADMIN_BLOB_PATH, data);
    return;
  }
  fs.writeFileSync(adminDataPath, JSON.stringify(data, null, 2), "utf-8");
}

export async function verifyPassword(password: string): Promise<boolean> {
  const { salt, hash } = await loadAdminData();
  const attempt = hashPassword(password, salt);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(attempt, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
  if (!(await verifyPassword(oldPassword))) return false;
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(newPassword, salt);
  await saveAdminData({ salt, hash });
  return true;
}

async function loadSessions(): Promise<string[]> {
  if (isVercel) {
    return (await readJsonBlob<string[]>(SESSIONS_BLOB_PATH)) ?? [];
  }
  if (!fs.existsSync(sessionsPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
  } catch {
    return [];
  }
}

async function saveSessions(tokens: string[]): Promise<void> {
  if (isVercel) {
    await writeJsonBlob(SESSIONS_BLOB_PATH, tokens);
    return;
  }
  fs.writeFileSync(sessionsPath, JSON.stringify(tokens), "utf-8");
}

export async function createSession(): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const sessions = await loadSessions();
  sessions.push(token);
  await saveSessions(sessions);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // Không đặt maxAge/expires => cookie phiên (session cookie): trình duyệt tự xoá
    // khi TOÀN BỘ cửa sổ trình duyệt đóng lại (đóng 1 tab, còn tab khác thì chưa mất).
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return (await loadSessions()).includes(token);
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    await saveSessions((await loadSessions()).filter((t) => t !== token));
  }
  store.delete(COOKIE_NAME);
}
