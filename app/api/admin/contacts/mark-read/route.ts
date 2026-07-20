import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { markAllContactsRead, type ContactType } from "@/lib/contacts";

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const type: ContactType | undefined = body.type === "job" || body.type === "booking" ? body.type : undefined;

  await markAllContactsRead(type);
  return NextResponse.json({ ok: true });
}
