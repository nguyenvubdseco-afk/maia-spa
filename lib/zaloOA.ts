/**
 * Gửi thông báo tới Zalo của quản trị viên khi có form liên hệ mới, qua Zalo OA API.
 *
 * CẦN CẤU HÌNH (chưa có thì hàm này tự bỏ qua, không làm lỗi form):
 * - ZALO_OA_ACCESS_TOKEN: access token của Zalo Official Account (lấy từ Zalo for Developers,
 *   yêu cầu đã đăng ký OA + xác minh doanh nghiệp)
 * - ZALO_OA_ADMIN_USER_ID: user_id Zalo của quản trị viên (phải từng nhắn tin cho OA trước đó,
 *   theo chính sách của Zalo — OA chỉ được chủ động nhắn cho user đã từng tương tác trong 7 ngày gần nhất)
 *
 * Xem hướng dẫn lấy 2 giá trị trên trong CLAUDE.md.
 */
export async function notifyAdminViaZalo(text: string): Promise<{ sent: boolean; reason?: string }> {
  const accessToken = process.env.ZALO_OA_ACCESS_TOKEN;
  const adminUserId = process.env.ZALO_OA_ADMIN_USER_ID;

  if (!accessToken || !adminUserId) {
    return { sent: false, reason: "Chưa cấu hình ZALO_OA_ACCESS_TOKEN / ZALO_OA_ADMIN_USER_ID" };
  }

  try {
    const res = await fetch("https://openapi.zalo.me/v3.0/oa/message/cs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        access_token: accessToken,
      },
      body: JSON.stringify({
        recipient: { user_id: adminUserId },
        message: { text },
      }),
    });

    const data = await res.json();
    if (data.error) {
      return { sent: false, reason: `Zalo API error: ${data.error} - ${data.message ?? ""}` };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: err instanceof Error ? err.message : "Lỗi không xác định" };
  }
}
