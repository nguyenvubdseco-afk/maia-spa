import { NextRequest, NextResponse } from "next/server";
import { addContact, type ContactType } from "@/lib/contacts";
import { notifyAdminViaZalo } from "@/lib/zaloOA";
import { getSiteConfig } from "@/lib/config";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const date = typeof body.date === "string" ? body.date.trim() : "";
  const time = typeof body.time === "string" ? body.time.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const type: ContactType = body.type === "job" ? "job" : "booking";

  if (!name || !phone) {
    return NextResponse.json({ error: "Vui lòng điền họ tên và số điện thoại" }, { status: 400 });
  }

  if (!/^[0-9]{10,11}$/.test(phone)) {
    return NextResponse.json({ error: "Số điện thoại phải gồm 10-11 chữ số" }, { status: 400 });
  }

  const submission = await addContact({ type, name, phone, date, time, message });

  const siteConfig = await getSiteConfig();
  const kind = type === "job" ? "ứng tuyển" : "đặt lịch";
  const zaloText = `[${siteConfig.name}] Khách hàng mới ${kind}:\nHọ tên: ${name}\nSĐT: ${phone}\nNgày hẹn: ${date || "(chưa chọn)"}\nGiờ hẹn: ${time || "(chưa chọn)"}\nLời nhắn: ${message || "(không có)"}`;
  const zaloResult = await notifyAdminViaZalo(zaloText);

  return NextResponse.json({ ok: true, id: submission.id, zaloSent: zaloResult.sent });
}
