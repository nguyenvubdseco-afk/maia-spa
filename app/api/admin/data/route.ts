import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getSiteConfig } from "@/lib/config";
import { getServices } from "@/lib/services";
import { getPosts } from "@/lib/posts";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  const [site, services, posts] = await Promise.all([getSiteConfig(), getServices(), getPosts()]);
  return NextResponse.json({ site, services, posts });
}
