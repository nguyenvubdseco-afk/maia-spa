import { get, put } from "@vercel/blob";

/**
 * Trên Vercel, ổ đĩa chỉ đọc (EROFS) nên không thể ghi file JSON như lúc chạy local.
 * Khi biến VERCEL tồn tại (luôn có sẵn trên mọi môi trường Vercel), dữ liệu được
 * đọc/ghi qua Vercel Blob (store riêng tư "maia-spa-data") thay vì fs.
 */
export const isVercel = !!process.env.VERCEL;

export async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  // useCache:false bắt buộc vì các thao tác admin (xoá, đánh dấu đã đọc...) đọc-sửa-ghi
  // ngay sau nhau — đọc từ cache CDN có thể trả dữ liệu cũ, làm mất thao tác vừa ghi.
  const result = await get(pathname, { access: "private", useCache: false });
  if (!result || result.stream === null) return null;
  const text = await new Response(result.stream).text();
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export async function writeJsonBlob<T>(pathname: string, data: T): Promise<void> {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
