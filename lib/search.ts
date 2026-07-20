/**
 * Chuẩn hoá chuỗi tiếng Việt để so khớp tìm kiếm: gộp về NFC (tránh lỗi dấu tổ hợp
 * không khớp dấu dựng sẵn) và bỏ dấu để chấp nhận tìm kiếm không dấu.
 */
export function normalizeSearch(input: string): string {
  return input
    .normalize("NFC")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export function matchesQuery(text: string, query: string): boolean {
  return normalizeSearch(text).includes(normalizeSearch(query));
}
