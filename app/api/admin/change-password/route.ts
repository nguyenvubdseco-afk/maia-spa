import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated, changePassword } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { oldPassword, newPassword } = await request.json();

  if (typeof newPassword !== "string" || newPassword.length < 6) {
    return NextResponse.json({ error: "Mật khẩu mới cần ít nhất 6 ký tự" }, { status: 400 });
  }

  const ok = await changePassword(oldPassword, newPassword);
  if (!ok) {
    return NextResponse.json({ error: "Mật khẩu hiện tại không đúng" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
