import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { markContactRead } from "@/lib/contacts";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { id } = await params;
  const ok = markContactRead(id);

  if (!ok) {
    return NextResponse.json({ error: "Không tìm thấy liên hệ" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
