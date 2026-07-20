import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { saveSiteConfig, type SiteConfig } from "@/lib/config";

export async function PUT(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body: SiteConfig = await request.json();
  saveSiteConfig(body);
  return NextResponse.json({ ok: true });
}
