import fs from "fs";
import path from "path";
import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const adminDataPath = path.join(process.cwd(), "data", "admin.json");
const sessionsPath = path.join(process.cwd(), "data", ".sessions.json");

interface AdminData {
  salt: string;
  hash: string;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function loadAdminData(): AdminData {
  if (!fs.existsSync(adminDataPath)) {
    const initialPassword = process.env.ADMIN_PASSWORD || "changeme123";
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = hashPassword(initialPassword, salt);
    const data: AdminData = { salt, hash };
    fs.writeFileSync(adminDataPath, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
  return JSON.parse(fs.readFileSync(adminDataPath, "utf-8"));
}

function saveAdminData(data: AdminData): void {
  fs.writeFileSync(adminDataPath, JSON.stringify(data, null, 2), "utf-8");
}

export function verifyPassword(password: string): boolean {
  const { salt, hash } = loadAdminData();
  const attempt = hashPassword(password, salt);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(attempt, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function changePassword(oldPassword: string, newPassword: string): boolean {
  if (!verifyPassword(oldPassword)) return false;
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(newPassword, salt);
  saveAdminData({ salt, hash });
  return true;
}

function loadSessions(): string[] {
  if (!fs.existsSync(sessionsPath)) return [];
  try {
    return JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
  } catch {
    return [];
  }
}

function saveSessions(tokens: string[]): void {
  fs.writeFileSync(sessionsPath, JSON.stringify(tokens), "utf-8");
}

export async function createSession(): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const sessions = loadSessions();
  sessions.push(token);
  saveSessions(sessions);

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
  return loadSessions().includes(token);
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    saveSessions(loadSessions().filter((t) => t !== token));
  }
  store.delete(COOKIE_NAME);
}
