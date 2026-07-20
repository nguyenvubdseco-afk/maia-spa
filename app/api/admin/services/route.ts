import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { saveServices, type Service } from "@/lib/services";

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body: Service[] = await request.json();

  for (const s of body) {
    if (!s.slug || !s.name) {
      return NextResponse.json({ error: "Mỗi dịch vụ cần có slug và tên" }, { status: 400 });
    }
  }

  saveServices(body);
  return NextResponse.json({ ok: true });
}
