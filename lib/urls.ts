/**
 * Hàm chuẩn hoá URL thuần (không đụng tới `fs`/`path`) — dùng được cả trong
 * Client Component lẫn Server Component. Tách riêng khỏi lib/config.ts vì
 * file đó dùng `fs` để đọc data/site.json, không thể import vào code chạy
 * trên trình duyệt (Next.js sẽ báo lỗi "Module not found: Can't resolve 'fs'").
 */

function isPlaceholder(value: string): boolean {
  return value.startsWith("[") || value.endsWith("]");
}

/**
 * Chuẩn hoá 1 link ngoài (admin có thể quên gõ "https://") thành URL tuyệt đối
 * luôn mở được, tránh trình duyệt hiểu nhầm thành đường dẫn nội bộ của site
 * (gây lỗi 404). Trả về "#" nếu rỗng hoặc còn là placeholder `[Điền ...]`.
 */
export function ensureAbsoluteUrl(value: string | undefined | null): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed || isPlaceholder(trimmed)) return "#";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/**
 * Như `ensureAbsoluteUrl`, nhưng dành riêng cho Zalo: nếu admin điền số điện
 * thoại thuần (không phải link) thì tự ghép thành đường dẫn zalo.me/<số>.
 */
export function getZaloUrl(zalo: string | undefined | null): string {
  const trimmed = (zalo ?? "").trim();
  if (!trimmed || isPlaceholder(trimmed)) return "#";
  if (/^[0-9+\s.-]+$/.test(trimmed)) {
    return `https://zalo.me/${trimmed.replace(/[^0-9]/g, "")}`;
  }
  return ensureAbsoluteUrl(trimmed);
}
