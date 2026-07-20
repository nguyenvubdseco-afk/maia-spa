import { NextRequest, NextResponse } from "next/server";
import { verifyPassword, createSession } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!(await verifyPassword(password))) {
    return NextResponse.json({ error: "Sai mật khẩu" }, { status: 401 });
  }

  await createSession();
  return NextResponse.json({ ok: true });
}
