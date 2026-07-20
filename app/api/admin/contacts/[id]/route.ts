import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { deleteContact } from "@/lib/contacts";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteContact(id);

  if (!deleted) {
    return NextResponse.json({ error: "Không tìm thấy liên hệ" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
